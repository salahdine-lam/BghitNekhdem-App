import { NextResponse } from "next/server";
import * as cheerio from "cheerio";
import { JobOffer, PlatformScanStatus } from "@/types";
import { SKILL_DICTIONARY } from "@/lib/cvParser";

const BROWSER_HEADERS = {
  "User-Agent":
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
  "Accept-Language": "fr-FR,fr;q=0.9,en;q=0.8",
  Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
};

function detectSkillsFromText(text: string, fallbackSkills: string[]): string[] {
  const found: string[] = [];
  for (const entry of SKILL_DICTIONARY) {
    if (entry.patterns.some((r) => r.test(text))) {
      found.push(entry.canonical);
    }
  }
  return found.length > 0 ? found.slice(0, 8) : fallbackSkills.slice(0, 4);
}

function makeInitials(name: string): string {
  return (
    name
      .split(/\s+/)
      .filter(Boolean)
      .map((w) => w[0])
      .join("")
      .toUpperCase()
      .slice(0, 2) || "JB"
  );
}

async function fetchWithTimeout(url: string, timeoutMs = 7000): Promise<Response> {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await fetch(url, { headers: BROWSER_HEADERS, signal: controller.signal });
  } finally {
    clearTimeout(id);
  }
}

async function scanLinkedIn(
  keywords: string,
  location: string,
  fallbackSkills: string[]
): Promise<{ jobs: JobOffer[]; status: PlatformScanStatus }> {
  try {
    const loc = /maroc|casablanca|rabat/i.test(location) ? "Morocco" : location || "Morocco";
    const url = `https://www.linkedin.com/jobs-guest/jobs/api/seeMoreJobPostings/search?keywords=${encodeURIComponent(
      keywords
    )}&location=${encodeURIComponent(loc)}&start=0`;

    const res = await fetchWithTimeout(url);
    if (!res.ok) {
      return {
        jobs: [],
        status: { platform: "LinkedIn", status: res.status === 403 || res.status === 429 ? "blocked" : "error", count: 0, note: `HTTP ${res.status}` },
      };
    }

    const html = await res.text();
    const $ = cheerio.load(html);
    const jobs: JobOffer[] = [];

    $("li").each((idx, el) => {
      if (jobs.length >= 10) return;
      const title = $(el).find("h3.base-search-card__title").text().trim();
      const company = $(el).find("h4.base-search-card__subtitle").text().trim() || "Entreprise LinkedIn";
      const jobLoc = $(el).find("span.job-search-card__location").text().trim() || loc;
      const rawHref = $(el).find("a.base-card__full-link").attr("href") || "";
      const applyUrl = rawHref.split("?")[0];
      const timeText = $(el).find("time").text().trim() || "Récent";

      if (title && applyUrl.startsWith("http")) {
        const skills = detectSkillsFromText(`${title} ${company}`, fallbackSkills);
        jobs.push({
          id: `li-${idx}-${Date.now()}`,
          title,
          company,
          companyInitials: makeInitials(company),
          companyColor: "#0A66C2",
          location: jobLoc,
          workplaceType: /remote|télétravail/i.test(`${title} ${jobLoc}`) ? "Télétravail" : "Hybride",
          contractType: "CDI",
          salaryRange: "Selon profil",
          postedAt: timeText,
          applicantsCount: 15 + ((idx * 7) % 35),
          seniorityRequired: /senior|lead|chef|responsable|directeur/i.test(title) ? "Senior" : "Intermédiaire",
          minYearsExperience: /senior|lead/i.test(title) ? 4 : 2,
          requiredSkills: skills,
          niceToHaveSkills: [],
          description: `Offre publiée en direct sur LinkedIn par ${company} (${jobLoc}). Cliquez sur le titre ou le bouton pour consulter l'annonce complète et postuler directement sur LinkedIn.`,
          responsibilities: [
            `Poste de ${title} au sein de ${company}.`,
            "Consultez la fiche complète sur LinkedIn pour les détails de mission.",
          ],
          benefits: ["Offre vérifiée en temps réel sur LinkedIn"],
          domain: "LinkedIn Live",
          isEasyApply: false,
          applyUrl,
          source: "LinkedIn",
        });
      }
    });

    return {
      jobs,
      status: { platform: "LinkedIn", status: jobs.length > 0 ? "ok" : "empty", count: jobs.length },
    };
  } catch (err: any) {
    return {
      jobs: [],
      status: { platform: "LinkedIn", status: "error", count: 0, note: err?.message || "Timeout" },
    };
  }
}

async function scanRekrute(
  keywords: string,
  fallbackSkills: string[]
): Promise<{ jobs: JobOffer[]; status: PlatformScanStatus }> {
  try {
    const url = `https://www.rekrute.com/offres.html?s=1&p=1&o=1&keyword=${encodeURIComponent(
      keywords
    )}`;
    const res = await fetchWithTimeout(url);
    if (!res.ok) {
      return {
        jobs: [],
        status: { platform: "Rekrute.com", status: res.status === 403 ? "blocked" : "error", count: 0, note: `HTTP ${res.status}` },
      };
    }

    const html = await res.text();
    const $ = cheerio.load(html);
    const jobs: JobOffer[] = [];

    $("li.post-id").each((idx, el) => {
      if (jobs.length >= 10) return;
      const linkEl = $(el).find("a.titreJob");
      const title = linkEl.text().trim().replace(/\s+/g, " ");
      const href = linkEl.attr("href") || "";
      const applyUrl = href.startsWith("http") ? href : `https://www.rekrute.com${href}`;
      const company =
        $(el).find("img.photo").attr("alt")?.trim() ||
        $(el).find(".holder .info span").first().text().trim() ||
        "Entreprise Rekrute";
      const infoText = $(el).find("div.info").text().replace(/\s+/g, " ").trim();
      const locMatch = title.match(/\(([^)]+)\)$/);
      const jobLoc = locMatch ? locMatch[1] : "Maroc";

      if (title && href) {
        const skills = detectSkillsFromText(`${title} ${infoText}`, fallbackSkills);
        jobs.push({
          id: `rek-${idx}-${Date.now()}`,
          title: title.replace(/\([^)]+\)$/, "").trim(),
          company,
          companyInitials: makeInitials(company),
          companyColor: "#E65100",
          location: jobLoc,
          workplaceType: /télétravail|remote|hybride/i.test(infoText) ? "Hybride" : "Sur site",
          contractType: "CDI",
          salaryRange: "Selon profil",
          postedAt: "Rekrute Live",
          applicantsCount: 12 + ((idx * 5) % 30),
          seniorityRequired: /senior|confirmé|responsable|chef/i.test(`${title} ${infoText}`) ? "Senior" : "Intermédiaire",
          minYearsExperience: /senior|5 ans/i.test(infoText) ? 4 : 2,
          requiredSkills: skills,
          niceToHaveSkills: [],
          description: infoText.slice(0, 320) || `Offre d'emploi publiée sur Rekrute.com par ${company}.`,
          responsibilities: [
            `Consultez l'offre complète directement sur Rekrute.com.`,
          ],
          benefits: ["Annonce directe Rekrute.com"],
          domain: "Rekrute.com",
          isEasyApply: false,
          applyUrl,
          source: "Rekrute.com",
        });
      }
    });

    return {
      jobs,
      status: { platform: "Rekrute.com", status: jobs.length > 0 ? "ok" : "empty", count: jobs.length },
    };
  } catch (err: any) {
    return {
      jobs: [],
      status: { platform: "Rekrute.com", status: "error", count: 0, note: err?.message || "Timeout" },
    };
  }
}

async function scanEmploiMa(
  keywords: string,
  fallbackSkills: string[]
): Promise<{ jobs: JobOffer[]; status: PlatformScanStatus }> {
  try {
    const slug = keywords.trim().split(/\s+/).slice(0, 2).join("-");
    const url = `https://www.emploi.ma/recherche-jobs-maroc/${encodeURIComponent(slug)}`;
    const res = await fetchWithTimeout(url);
    if (!res.ok) {
      return {
        jobs: [],
        status: { platform: "Emploi.ma", status: res.status === 403 ? "blocked" : "error", count: 0, note: `HTTP ${res.status}` },
      };
    }

    const html = await res.text();
    const $ = cheerio.load(html);
    const jobs: JobOffer[] = [];

    $(".card-job").each((idx, el) => {
      if (jobs.length >= 10) return;
      const linkEl = $(el).find("h3 a");
      const title = linkEl.text().trim();
      const href = linkEl.attr("href") || "";
      const applyUrl = href.startsWith("http") ? href : `https://www.emploi.ma${href}`;
      const company = $(el).find(".card-job-company").text().trim() || "Entreprise Maroc";
      const desc = $(el).find(".card-job-description").text().replace(/\s+/g, " ").trim();
      const city = $(el).find(".card-job-detail li").first().text().trim() || "Maroc";

      if (title && href) {
        const skills = detectSkillsFromText(`${title} ${desc}`, fallbackSkills);
        jobs.push({
          id: `emp-${idx}-${Date.now()}`,
          title,
          company,
          companyInitials: makeInitials(company),
          companyColor: "#00796B",
          location: city,
          workplaceType: /télétravail|remote/i.test(desc) ? "Télétravail" : "Sur site",
          contractType: "CDI",
          salaryRange: "Selon profil",
          postedAt: "Emploi.ma Live",
          applicantsCount: 10 + ((idx * 6) % 25),
          seniorityRequired: /senior|expérimenté|responsable/i.test(`${title} ${desc}`) ? "Senior" : "Intermédiaire",
          minYearsExperience: /senior/i.test(title) ? 4 : 2,
          requiredSkills: skills,
          niceToHaveSkills: [],
          description: desc.slice(0, 320) || `Offre publiée sur Emploi.ma par ${company}.`,
          responsibilities: ["Consultez les détails et postulez directement sur Emploi.ma."],
          benefits: ["Annonce directe Emploi.ma"],
          domain: "Emploi.ma",
          isEasyApply: false,
          applyUrl,
          source: "Emploi.ma",
        });
      }
    });

    return {
      jobs,
      status: { platform: "Emploi.ma", status: jobs.length > 0 ? "ok" : "empty", count: jobs.length },
    };
  } catch (err: any) {
    return {
      jobs: [],
      status: { platform: "Emploi.ma", status: "error", count: 0, note: err?.message || "Timeout" },
    };
  }
}

async function scanEmploiPublic(
  fallbackSkills: string[]
): Promise<{ jobs: JobOffer[]; status: PlatformScanStatus }> {
  try {
    const res = await fetchWithTimeout("https://www.emploi-public.ma/fr/");
    if (!res.ok) {
      return {
        jobs: [],
        status: { platform: "Emploi-Public.ma", status: "error", count: 0, note: `HTTP ${res.status}` },
      };
    }
    const html = await res.text();
    const $ = cheerio.load(html);
    const jobs: JobOffer[] = [];
    const seen = new Set<string>();

    $("a[href*='concours'], a[href*='detail'], a[href*='offre']").each((idx, el) => {
      if (jobs.length >= 6) return;
      const title = $(el).text().replace(/\s+/g, " ").trim();
      const href = $(el).attr("href") || "";
      const applyUrl = href.startsWith("http") ? href : `https://www.emploi-public.ma${href.startsWith("/") ? "" : "/"}${href}`;

      if (title.length > 18 && !seen.has(applyUrl) && !/voir plus|tous les/i.test(title)) {
        seen.add(applyUrl);
        const skills = detectSkillsFromText(title, fallbackSkills);
        jobs.push({
          id: `ep-${idx}-${Date.now()}`,
          title: title.slice(0, 110),
          company: "Administration / Secteur Public Maroc",
          companyInitials: "EP",
          companyColor: "#B24020",
          location: "Maroc (National)",
          workplaceType: "Sur site",
          contractType: "CDI",
          salaryRange: "Grille Secteur Public",
          postedAt: "Emploi-Public.ma",
          applicantsCount: 40,
          seniorityRequired: "Intermédiaire",
          minYearsExperience: 1,
          requiredSkills: skills,
          niceToHaveSkills: [],
          description: `Avis de recrutement / concours publié sur le portail officiel Emploi-Public.ma : ${title}`,
          responsibilities: ["Consulter l'avis officiel et le dossier de candidature sur Emploi-Public.ma."],
          benefits: ["Portail officiel Emploi-Public.ma"],
          domain: "Secteur Public",
          isEasyApply: false,
          applyUrl,
          source: "Emploi-Public.ma",
        });
      }
    });

    return {
      jobs,
      status: { platform: "Emploi-Public.ma", status: jobs.length > 0 ? "ok" : "empty", count: jobs.length },
    };
  } catch (err: any) {
    return {
      jobs: [],
      status: { platform: "Emploi-Public.ma", status: "error", count: 0, note: err?.message || "Timeout" },
    };
  }
}

async function probeProtectedPortal(
  platform: string,
  url: string
): Promise<{ jobs: JobOffer[]; status: PlatformScanStatus }> {
  try {
    const res = await fetchWithTimeout(url, 4500);
    if (res.status === 403 || res.status === 429 || res.status === 503) {
      return {
        jobs: [],
        status: {
          platform,
          status: "blocked",
          count: 0,
          note: `Protection anti-bot (HTTP ${res.status})`,
        },
      };
    }
    return {
      jobs: [],
      status: { platform, status: "empty", count: 0, note: "Rendu dynamique requis" },
    };
  } catch {
    return {
      jobs: [],
      status: { platform, status: "blocked", count: 0, note: "Accès bloqué / Timeout" },
    };
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const keywords = String(body.keywords || "developpeur").trim();
    const location = String(body.location || "Maroc").trim();
    const skills: string[] = Array.isArray(body.skills) ? body.skills : [];

    const results = await Promise.all([
      scanLinkedIn(keywords, location, skills),
      scanRekrute(keywords, skills),
      scanEmploiMa(keywords, skills),
      scanEmploiPublic(skills),
      probeProtectedPortal("Indeed Maroc", `https://ma.indeed.com/jobs?q=${encodeURIComponent(keywords)}&l=Maroc`),
      probeProtectedPortal("Dreamjob.ma", "https://www.dreamjob.ma/offres-demploi/"),
      probeProtectedPortal("Google Jobs", `https://www.google.com/search?q=${encodeURIComponent(keywords + " emploi maroc")}&ibp=htl;jobs`),
    ]);

    const allJobs: JobOffer[] = [];
    const seenUrls = new Set<string>();
    const platformStatuses: PlatformScanStatus[] = [];

    for (const r of results) {
      platformStatuses.push(r.status);
      for (const job of r.jobs) {
        if (job.applyUrl && !seenUrls.has(job.applyUrl)) {
          seenUrls.add(job.applyUrl);
          allJobs.push(job);
        }
      }
    }

    return NextResponse.json({
      jobs: allJobs,
      platformStatuses,
      totalScanned: allJobs.length,
    });
  } catch (error) {
    console.error("Scan error:", error);
    return NextResponse.json(
      { error: "Erreur lors du scan des plateformes d'emploi." },
      { status: 500 }
    );
  }
}
