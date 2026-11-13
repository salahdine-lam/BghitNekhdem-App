import { NextResponse } from "next/server";
import { parseCVTextToProfile } from "@/lib/cvParser";

async function extractTextServerSide(buffer: Buffer, fileName: string): Promise<string> {
  const lower = fileName.toLowerCase();

  if (lower.endsWith(".pdf")) {
    const { PDFParse } = await import("pdf-parse");
    const parser = new PDFParse({ data: buffer });
    try {
      const result = await parser.getText();
      return (result?.text || "").trim();
    } finally {
      await parser.destroy();
    }
  }

  if (lower.endsWith(".docx") || lower.endsWith(".doc")) {
    const mammoth = await import("mammoth");
    const result = await mammoth.extractRawText({ buffer });
    return (result?.value || "").trim();
  }

  return buffer.toString("utf-8").trim();
}

export async function POST(request: Request) {
  try {
    let rawText = "";
    let fileName = "CV.pdf";
    let apiKey = "";

    const contentType = request.headers.get("content-type") || "";

    if (contentType.includes("multipart/form-data")) {
      const formData = await request.formData();
      const file = formData.get("file") as File | null;
      apiKey = String(formData.get("apiKey") || "");

      if (!file) {
        return NextResponse.json({ error: "Aucun fichier reçu." }, { status: 400 });
      }

      fileName = file.name;
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      rawText = await extractTextServerSide(buffer, fileName);
    } else {
      const body = await request.json();
      rawText = String(body.rawText || "");
      fileName = String(body.fileName || "CV.pdf");
      apiKey = String(body.apiKey || "");
    }

    if (!rawText || rawText.trim().length < 30) {
      return NextResponse.json(
        {
          extractionFailed: true,
          error:
            "Impossible d'extraire le texte de ce fichier (il s'agit peut-être d'un PDF scanné en image). Veuillez copier-coller le texte de votre CV ou importer un PDF texte / DOCX.",
        },
        { status: 422 }
      );
    }

    const effectiveKey = apiKey || process.env.GEMINI_API_KEY || "";

    // Optional Gemini Structured Output when API Key is provided
    if (effectiveKey) {
      try {
        const prompt = `Analyse ce CV et renvoie UNIQUEMENT un objet JSON valide respectant strictement cette structure :
{
  "fullName": "Nom Prénom du candidat",
  "headline": "Titre professionnel accrocheur style LinkedIn",
  "location": "Ville / Pays",
  "yearsOfExperience": 4,
  "seniority": "Junior" | "Intermédiaire" | "Senior" | "Lead / Expert",
  "summary": "Résumé professionnel en 2 phrases",
  "skills": ["Compétence 1", "Compétence 2"],
  "softSkills": ["Soft skill 1", "Soft skill 2"],
  "languages": ["Français", "Anglais"],
  "education": "Diplôme principal",
  "preferredRoles": ["Rôle 1", "Rôle 2"]
}

Texte du CV :
${rawText.slice(0, 10000)}`;

        const geminiRes = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${encodeURIComponent(
            effectiveKey
          )}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              contents: [{ parts: [{ text: prompt }] }],
              generationConfig: {
                responseMimeType: "application/json",
                temperature: 0.1,
              },
            }),
          }
        );

        if (geminiRes.ok) {
          const geminiData = await geminiRes.json();
          const textOut = geminiData?.candidates?.[0]?.content?.parts?.[0]?.text;
          if (textOut) {
            const parsed = JSON.parse(textOut);
            return NextResponse.json({
              profile: {
                id: `gemini-${Date.now()}`,
                fullName: parsed.fullName || "Candidat",
                headline: parsed.headline || "Professionnel",
                location: parsed.location || "Maroc / France",
                yearsOfExperience: Number(parsed.yearsOfExperience) || 3,
                seniority: parsed.seniority || "Intermédiaire",
                summary: parsed.summary || "",
                skills: Array.isArray(parsed.skills) ? parsed.skills : [],
                softSkills: Array.isArray(parsed.softSkills) ? parsed.softSkills : [],
                languages: Array.isArray(parsed.languages) ? parsed.languages : ["Français"],
                education: parsed.education || "Formation Supérieure",
                preferredRoles: Array.isArray(parsed.preferredRoles) ? parsed.preferredRoles : [],
                fileName,
                rawText,
              },
              engine: "gemini",
            });
          }
        }
      } catch {
        // Fall through to deterministic NLP parser if Gemini fails
      }
    }

    const profile = parseCVTextToProfile(rawText, fileName);
    return NextResponse.json({ profile, engine: "local-nlp" });
  } catch (error) {
    console.error("CV parse error:", error);
    return NextResponse.json(
      { error: "Erreur lors de la lecture ou de l'analyse du CV." },
      { status: 500 }
    );
  }
}
