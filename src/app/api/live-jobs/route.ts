import { NextResponse } from "next/server";
import { JobOffer } from "@/types";
import { SKILL_DICTIONARY } from "@/lib/cvParser";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get("category") || "software-dev";

  try {
    const response = await fetch(
      `https://remotive.com/api/remote-jobs?category=${encodeURIComponent(category)}&limit=8`,
      { next: { revalidate: 3600 } }
    );

    if (!response.ok) {
      throw new Error(`Remotive API error: ${response.status}`);
    }

    const data = await response.json();
    const rawJobs = Array.isArray(data.jobs) ? data.jobs.slice(0, 8) : [];

    const colors = ["#0A66C2", "#057642", "#5E35B1", "#00796B", "#C62828", "#0277BD"];

    const formattedJobs: JobOffer[] = rawJobs.map((item: any, idx: number) => {
      const plainDesc = String(item.description || "")
        .replace(/<[^>]+>/g, " ")
        .replace(/\s+/g, " ")
        .trim();

      const detectedSkills: string[] = [];
      for (const entry of SKILL_DICTIONARY) {
        if (entry.patterns.some((r) => r.test(`${item.title} ${(item.tags || []).join(" ")} ${plainDesc}`))) {
          detectedSkills.push(entry.canonical);
        }
      }

      const requiredSkills =
        detectedSkills.length >= 3
          ? detectedSkills.slice(0, 6)
          : ["TypeScript", "React", "Python", "Git", "REST API"];

      const niceToHaveSkills =
        detectedSkills.length > 6 ? detectedSkills.slice(6, 9) : ["Docker", "AWS"];

      const companyName = String(item.company_name || "Global Tech");
      const initials = companyName
        .split(/\s+/)
        .map((w) => w[0])
        .join("")
        .toUpperCase()
        .slice(0, 2) || "GT";

      return {
        id: `live-${item.id || idx}`,
        title: String(item.title || "Software Engineer"),
        company: companyName,
        companyInitials: initials,
        companyColor: colors[idx % colors.length],
        location: String(item.candidate_required_location || "Télétravail International"),
        workplaceType: "Télétravail",
        contractType: "CDI",
        salaryRange: item.salary ? String(item.salary) : "60 000 € - 85 000 € / an (Estimé)",
        postedAt: "Offre en direct (Web)",
        applicantsCount: 15 + ((idx * 13) % 45),
        seniorityRequired: /senior|lead|staff|principal/i.test(String(item.title))
          ? "Senior"
          : "Intermédiaire",
        minYearsExperience: /senior|lead/i.test(String(item.title)) ? 4 : 2,
        requiredSkills,
        niceToHaveSkills,
        description:
          plainDesc.slice(0, 360) + (plainDesc.length > 360 ? "..." : ""),
        responsibilities: [
          "Collaborer avec une équipe distribuée à l'international en méthodologie Agile.",
          `Développer et maintenir les composants clés autour de ${requiredSkills.slice(0, 3).join(", ")}.`,
          "Participer aux revues d'architecture, tests automatisés et déploiements continus.",
        ],
        benefits: [
          "100% Télétravail international",
          "Horaires flexibles & culture asynchrone",
          "Budget équipement et formation continue",
        ],
        domain: String(item.category || "Tech & Digital"),
        isEasyApply: false,
        applyUrl: String(item.url || "https://remotive.com"),
        source: "Live Remote API",
      };
    });

    return NextResponse.json({ jobs: formattedJobs });
  } catch (error) {
    return NextResponse.json(
      { jobs: [], message: "Mode catalogue local actif" },
      { status: 200 }
    );
  }
}
