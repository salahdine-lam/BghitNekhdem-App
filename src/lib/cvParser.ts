import { CandidateProfile, SeniorityLevel } from "@/types";

export interface SkillSynonym {
  canonical: string;
  category:
    | "dev"
    | "cloud"
    | "data"
    | "finance"
    | "product"
    | "marketing"
    | "supply"
    | "hr";
  patterns: RegExp[];
}

export const SKILL_DICTIONARY: SkillSynonym[] = [
  // Software & Web Development
  { canonical: "TypeScript", category: "dev", patterns: [/\btypescript\b/i] },
  { canonical: "JavaScript", category: "dev", patterns: [/\bjavascript\b/i, /\bes6\b/i] },
  { canonical: "React", category: "dev", patterns: [/\breact(?:\.js|js)?\b/i] },
  { canonical: "Next.js", category: "dev", patterns: [/\bnext(?:\.js|js)?\b/i] },
  { canonical: "Angular", category: "dev", patterns: [/\bangular\b/i] },
  { canonical: "Vue.js", category: "dev", patterns: [/\bvue(?:\.js|js)?\b/i, /\bnuxt\b/i] },
  { canonical: "Node.js", category: "dev", patterns: [/\bnode(?:\.js|js)?\b/i, /\bexpress(?:\.js)?\b/i, /\bnestjs\b/i] },
  { canonical: "Python", category: "dev", patterns: [/\bpython\b/i] },
  { canonical: "FastAPI", category: "dev", patterns: [/\bfastapi\b/i, /\bflask\b/i, /\bdjango\b/i] },
  { canonical: "Java", category: "dev", patterns: [/\bjava\b(?!script)/i, /\bj2ee\b/i, /\bjee\b/i] },
  { canonical: "Spring Boot", category: "dev", patterns: [/\bspring\s*boot\b/i, /\bspring\b/i, /\bhibernate\b/i] },
  { canonical: "C# / .NET", category: "dev", patterns: [/\bc#\b/i, /\.net\b/i, /\basp\.net\b/i] },
  { canonical: "PHP / Laravel", category: "dev", patterns: [/\bphp\b/i, /\blaravel\b/i, /\bsymfony\b/i] },
  { canonical: "Flutter / Mobile", category: "dev", patterns: [/\bflutter\b/i, /\breact\s*native\b/i, /\bandroid\b/i, /\bios\b/i, /\bswift\b/i, /\bkotlin\b/i] },
  { canonical: "Tailwind CSS", category: "dev", patterns: [/\btailwind(?:css)?\b/i] },
  { canonical: "HTML / CSS", category: "dev", patterns: [/\bhtml5?\b/i, /\bcss3?\b/i, /\bsass\b/i] },
  { canonical: "REST API", category: "dev", patterns: [/\brest(?:ful)?\s*api\b/i, /\bapi\s*rest\b/i, /\bgraphql\b/i, /\bmicroservices\b/i] },
  { canonical: "Git", category: "dev", patterns: [/\bgit\b/i, /\bgithub\b/i, /\bgitlab\b/i, /\bbitbucket\b/i] },

  // Cloud, DevOps & Cybersecurity
  { canonical: "Docker", category: "cloud", patterns: [/\bdocker\b/i, /\bconteneur/i] },
  { canonical: "Kubernetes", category: "cloud", patterns: [/\bkubernetes\b/i, /\bk8s\b/i, /\bopenshift\b/i] },
  { canonical: "AWS", category: "cloud", patterns: [/\baws\b/i, /\bamazon web services\b/i] },
  { canonical: "Azure", category: "cloud", patterns: [/\bazure\b/i, /\bmicrosoft azure\b/i] },
  { canonical: "GCP", category: "cloud", patterns: [/\bgcp\b/i, /\bgoogle cloud\b/i] },
  { canonical: "Terraform / IaC", category: "cloud", patterns: [/\bterraform\b/i, /\bansible\b/i, /\binfrastructure as code\b/i] },
  { canonical: "CI/CD", category: "cloud", patterns: [/\bci\/cd\b/i, /\bjenkins\b/i, /\bgithub actions\b/i, /\bdevops\b/i] },
  { canonical: "Linux", category: "cloud", patterns: [/\blinux\b/i, /\bubuntu\b/i, /\bbash\b/i] },
  { canonical: "Cybersécurité", category: "cloud", patterns: [/\bcybers[eé]curit[eé]\b/i, /\bcybersecurity\b/i, /\bpentest/i, /\bsoc\b/i, /\bsiem\b/i, /\biso\s*27001\b/i] },

  // Data, BI & AI
  { canonical: "SQL", category: "data", patterns: [/\bsql\b/i, /\bt-sql\b/i, /\bpl\/sql\b/i] },
  { canonical: "PostgreSQL", category: "data", patterns: [/\bpostgres(?:ql)?\b/i, /\bmysql\b/i, /\boracle\b/i] },
  { canonical: "MongoDB", category: "data", patterns: [/\bmongodb\b/i, /\bnosql\b/i, /\bredis\b/i] },
  { canonical: "Power BI", category: "data", patterns: [/\bpower\s*bi\b/i, /\bdax\b/i] },
  { canonical: "Tableau", category: "data", patterns: [/\btableau\b/i, /\blooker\b/i] },
  { canonical: "Excel / VBA", category: "data", patterns: [/\bexcel\b/i, /\bvba\b/i, /\btableaux crois[eé]s\b/i] },
  { canonical: "LangChain", category: "data", patterns: [/\blangchain\b/i, /\blanggraph\b/i, /\bllamaindex\b/i] },
  {
    canonical: "LLM / IA Générative",
    category: "data",
    patterns: [/\bllm\b/i, /\bia\s*g[eé]n[eé]rative\b/i, /\bgenerative\s*ai\b/i, /\bgpt\b/i, /\bgemini\b/i, /\brag\b/i],
  },
  { canonical: "Machine Learning", category: "data", patterns: [/\bmachine\s*learning\b/i, /\bxgboost\b/i, /\bdata\s*science\b/i] },
  { canonical: "Deep Learning", category: "data", patterns: [/\bdeep\s*learning\b/i, /\bpytorch\b/i, /\btensorflow\b/i, /\bnlp\b/i] },
  { canonical: "Scikit-Learn", category: "data", patterns: [/\bscikit[\s-]*learn\b/i, /\bsklearn\b/i] },
  { canonical: "Pandas", category: "data", patterns: [/\bpandas\b/i, /\bnumpy\b/i] },
  { canonical: "Apache Spark", category: "data", patterns: [/\bspark\b/i, /\bpyspark\b/i, /\bhadoop\b/i, /\bdatabricks\b/i] },
  { canonical: "Statistiques", category: "data", patterns: [/\bstatistique/i, /\bstatistics\b/i, /\bprobabilit/i, /\b[eé]conom[eé]trie/i] },

  // Finance, Banking, Audit & Accounting
  { canonical: "Analyse Financière", category: "finance", patterns: [/\banalyse\s*financi[eè]re\b/i, /\bfinancial\s*analysis\b/i, /\bcorporate\s*finance\b/i, /\bvalorisation\b/i] },
  { canonical: "Contrôle de Gestion", category: "finance", patterns: [/\bcontr[oô]le\s*de\s*gestion\b/i, /\bbudget/i, /\breporting\s*financier\b/i, /\bp&l\b/i] },
  { canonical: "Comptabilité", category: "finance", patterns: [/\bcomptabilit[eé]\b/i, /\baccounting\b/i, /\bbilan\b/i, /\bcl[oô]ture\b/i, /\bliasse\s*fiscale\b/i] },
  { canonical: "Audit Interne / Externe", category: "finance", patterns: [/\baudit\b/i, /\bcommissariat\s*aux\s*comptes\b/i, /\bcontr[oô]le\s*interne\b/i, /\bconformit[eé]\b/i, /\bcompliance\b/i] },
  { canonical: "Risque de Crédit", category: "finance", patterns: [/\brisque[s]?\s*(?:de\s*)?cr[eé]dit\b/i, /\bcredit\s*risk\b/i, /\bscoring\b/i, /\bgestion\s*des\s*risques\b/i, /\brisk\s*management\b/i] },
  { canonical: "IFRS 9 / Bâle III", category: "finance", patterns: [/\bifrs\b/i, /\bb[aâ]le\b/i, /\bbasel\b/i, /\bsolvabilit[eé]\b/i] },
  { canonical: "Trésorerie", category: "finance", patterns: [/\btr[eé]sorerie\b/i, /\btreasury\b/i, /\bcash\s*flow\b/i, /\bliquidit[eé]\b/i] },
  { canonical: "SAP FI/CO", category: "finance", patterns: [/\bsap\b/i, /\berp\b/i, /\bsage\b/i, /\bbloomberg\b/i] },
  { canonical: "FinTech & Paiements", category: "finance", patterns: [/\bfintech\b/i, /\bpaiement/i, /\bpayment/i, /\bbancaire/i, /\bbanking\b/i, /\bcr[eé]dit\b/i] },

  // Product & Project Management
  { canonical: "Product Strategy", category: "product", patterns: [/\bproduct\s*strategy\b/i, /\bstrat[eé]gie\s*produit\b/i, /\bproduct\s*manager\b/i, /\bproduct\s*owner\b/i] },
  { canonical: "Agile / Scrum", category: "product", patterns: [/\bagile\b/i, /\bscrum\b/i, /\bkanban\b/i] },
  { canonical: "Jira", category: "product", patterns: [/\bjira\b/i, /\bconfluence\b/i, /\btrello\b/i] },
  { canonical: "UX Research", category: "product", patterns: [/\bux\b/i, /\bui\/ux\b/i, /\buser\s*research\b/i, /\bdesign\s*thinking\b/i] },
  { canonical: "Product Discovery", category: "product", patterns: [/\bdiscovery\b/i, /\buser\s*stories\b/i, /\bbacklog\b/i] },
  { canonical: "Roadmap", category: "product", patterns: [/\broadmap\b/i, /\bfeuille\s*de\s*route\b/i] },
  { canonical: "KPI & OKR", category: "product", patterns: [/\bkpi\b/i, /\bokr\b/i, /\btableaux\s*de\s*bord\b/i] },
  { canonical: "Gestion de Projet", category: "product", patterns: [/\bgestion\s*de\s*projet\b/i, /\bproject\s*management\b/i, /\bchefferie\s*de\s*projet\b/i, /\bpmp\b/i, /\bprince2\b/i] },
  { canonical: "API Management", category: "product", patterns: [/\bapi\s*management\b/i, /\bopen\s*banking\b/i, /\bswagger\b/i, /\bpostman\b/i] },
  { canonical: "Figma", category: "product", patterns: [/\bfigma\b/i, /\bwireframe/i, /\bprototyp/i, /\badobe\s*xd\b/i] },

  // Marketing & Sales
  { canonical: "Marketing Digital", category: "marketing", patterns: [/\bmarketing\s*digital\b/i, /\bdigital\s*marketing\b/i, /\bgrowth\b/i, /\bsocial\s*media\b/i] },
  { canonical: "SEO / SEA", category: "marketing", patterns: [/\bseo\b/i, /\bsea\b/i, /\bgoogle\s*ads\b/i, /\bmeta\s*ads\b/i, /\br[eé]f[eé]rencement\b/i] },
  { canonical: "Google Analytics", category: "marketing", patterns: [/\bgoogle\s*analytics\b/i, /\bga4\b/i, /\ba\/b\s*test/i] },
  { canonical: "CRM / Salesforce", category: "marketing", patterns: [/\bcrm\b/i, /\bsalesforce\b/i, /\bhubspot\b/i] },
  { canonical: "Business Development", category: "marketing", patterns: [/\bbusiness\s*develop/i, /\bprospection\b/i, /\bn[eé]gociation\b/i, /\bvente\s*b2b\b/i, /\baccount\s*manager\b/i] },

  // Supply Chain & Operations
  { canonical: "Supply Chain", category: "supply", patterns: [/\bsupply\s*chain\b/i, /\bcha[iî]ne\s*logistique\b/i, /\bapprovisionnement\b/i] },
  { canonical: "Logistique & Transport", category: "supply", patterns: [/\blogistique\b/i, /\btransport\b/i, /\bimport[\s-]*export\b/i, /\bwms\b/i] },
  { canonical: "Achats & Sourcing", category: "supply", patterns: [/\bachats\b/i, /\bprocurement\b/i, /\bsourcing\b/i, /\bfournisseurs\b/i] },
  { canonical: "Lean / Six Sigma", category: "supply", patterns: [/\blean\b/i, /\bsix\s*sigma\b/i, /\bam[eé]lioration\s*continue\b/i, /\bqualit[eé]\b/i] },

  // Human Resources
  { canonical: "Recrutement / Talent Acquisition", category: "hr", patterns: [/\brecrutement\b/i, /\btalent\s*acquisition\b/i, /\bsourcing\s*candidats\b/i, /\bentretien/i] },
  { canonical: "Gestion RH & SIRH", category: "hr", patterns: [/\bressources\s*humaines\b/i, /\bsirh\b/i, /\bpaie\b/i, /\bdroit\s*du\s*travail\b/i, /\bgpec\b/i] },
];

export async function extractTextFromFile(file: File): Promise<string> {
  const name = file.name.toLowerCase();
  if (name.endsWith(".txt") || name.endsWith(".md") || name.endsWith(".csv") || name.endsWith(".json")) {
    return await file.text();
  }
  // PDF and DOCX are extracted on the server via /api/parse-cv (pdf-parse & mammoth)
  return "";
}

export function parseCVTextToProfile(rawText: string, fileName?: string): CandidateProfile {
  const cleanText = rawText.replace(/\r\n/g, "\n").trim();

  // 1. Detect skills from expanded dictionary
  const detectedSkills: string[] = [];
  const categoryCounts: Record<string, number> = {};

  for (const item of SKILL_DICTIONARY) {
    if (item.patterns.some((regex) => regex.test(cleanText))) {
      detectedSkills.push(item.canonical);
      categoryCounts[item.category] = (categoryCounts[item.category] || 0) + 1;
    }
  }

  // 2. If few skills matched, also extract explicit tokens from a "Compétences / Skills" line
  if (detectedSkills.length < 3) {
    const skillsSectionMatch = cleanText.match(
      /(?:comp[eé]tences|skills|expertises|outils|technologies)\s*[:\-]?\s*([^\n]{5,220})/i
    );
    if (skillsSectionMatch) {
      const tokens = skillsSectionMatch[1]
        .split(/[,;|•\/]+/)
        .map((t) => t.trim())
        .filter((t) => t.length >= 2 && t.length <= 32 && !detectedSkills.includes(t));
      detectedSkills.push(...tokens.slice(0, 8));
    }
  }

  // 3. Detect years of experience
  let years = 3;
  const expMatch =
    cleanText.match(/(\d{1,2})\s*\+?\s*(?:ans|années|years)\s*(?:d['’]exp[eé]rience|of\s*experience|en\s+)/i) ||
    cleanText.match(/exp[eé]rience\s*[:\-]?\s*(\d{1,2})\s*(?:ans|années)/i);
  if (expMatch) {
    years = Math.min(Math.max(parseInt(expMatch[1], 10), 1), 25);
  } else {
    // Estimate from date ranges like 2019 - 2026
    const yearMatches = cleanText.match(/\b(200\d|201\d|202\d)\b/g);
    if (yearMatches && yearMatches.length >= 2) {
      const nums = yearMatches.map((y) => parseInt(y, 10));
      const span = Math.max(...nums) - Math.min(...nums);
      if (span >= 1 && span <= 20) {
        years = span;
      }
    }
  }

  // 4. Determine Seniority
  let seniority: SeniorityLevel = "Intermédiaire";
  if (years <= 2 || /\bjunior\b|\bstage\b|\balternance\b|\b[eé]tudiant/i.test(cleanText)) {
    seniority = "Junior";
  } else if (years >= 7 || /\b(?:lead|principal|staff|head|directeur|architecte|responsable)\b/i.test(cleanText)) {
    seniority = "Lead / Expert";
  } else if (years >= 5 || /\bsenior\b|\bs[eé]nior\b|\bconfirm[eé]\b/i.test(cleanText)) {
    seniority = "Senior";
  }

  // 5. Candidate Name
  const lines = cleanText
    .split("\n")
    .map((l) => l.trim())
    .filter((l) => l.length > 2);

  const firstNameLine = lines.find(
    (l) =>
      l.length >= 4 &&
      l.length <= 45 &&
      !/curriculum|cv|resume|profil|email|t[eé]l|phone|http|@/i.test(l) &&
      /^[A-ZÀ-Ÿa-zà-ÿ\s\-'.]+$/.test(l)
  );

  let candidateName = "Candidat (CV Analysé)";
  if (firstNameLine) {
    candidateName = firstNameLine;
  } else if (fileName) {
    const cleanedFile = fileName
      .replace(/\.(pdf|docx|doc|txt|md)$/i, "")
      .replace(/^(cv|resume)[_\-\s]*/i, "")
      .replace(/[_-]+/g, " ")
      .trim();
    if (cleanedFile.length > 2) {
      candidateName = cleanedFile;
    }
  }

  // 6. Infer Dominant Domain & Headline accurately
  const sortedCategories = Object.entries(categoryCounts).sort((a, b) => b[1] - a[1]);
  const topCategory = sortedCategories[0]?.[0] || "general";
  const topSkillsPreview = detectedSkills.slice(0, 4).join(", ");

  let headline = topSkillsPreview
    ? `Profil Professionnel | ${topSkillsPreview}`
    : "Profil Professionnel";
  let preferredRoles = ["Postes adaptés à votre parcours"];

  switch (topCategory) {
    case "finance":
      headline = `Finance, Banque & Audit | ${topSkillsPreview}`;
      preferredRoles = [
        "Analyste Financier",
        "Contrôleur de Gestion",
        "Auditeur / Risk Manager",
        "Consultant FinTech",
      ];
      break;
    case "data":
      headline = `Data Science, BI & IA | ${topSkillsPreview}`;
      preferredRoles = [
        "Data Scientist",
        "Data Analyst / BI",
        "Machine Learning Engineer",
      ];
      break;
    case "cloud":
      headline = `Cloud, DevOps & Cybersécurité | ${topSkillsPreview}`;
      preferredRoles = [
        "Ingénieur DevOps / Cloud",
        "Site Reliability Engineer",
        "Consultant Cybersécurité",
      ];
      break;
    case "dev":
      headline = `Ingénieur Logiciel / Développement | ${topSkillsPreview}`;
      preferredRoles = [
        "Full-Stack Developer",
        "Backend Engineer",
        "Frontend Engineer",
      ];
      break;
    case "product":
      headline = `Product & Gestion de Projet | ${topSkillsPreview}`;
      preferredRoles = ["Product Manager", "Product Owner", "Chef de Projet Digital"];
      break;
    case "marketing":
      headline = `Marketing Digital & Business Development | ${topSkillsPreview}`;
      preferredRoles = [
        "Growth / Marketing Manager",
        "Business Developer B2B",
        "Account Manager",
      ];
      break;
    case "supply":
      headline = `Supply Chain, Achats & Logistique | ${topSkillsPreview}`;
      preferredRoles = [
        "Supply Chain Manager",
        "Responsable Logistique",
        "Acheteur / Lean Manager",
      ];
      break;
    case "hr":
      headline = `Ressources Humaines & Talent Acquisition | ${topSkillsPreview}`;
      preferredRoles = [
        "Talent Acquisition Specialist",
        "Responsable RH",
        "Chargé de Recrutement IT",
      ];
      break;
  }

  // 7. Location detection
  let location = "Maroc / France / Télétravail";
  if (/\bcasablanca\b/i.test(cleanText)) {
    location = "Casablanca, Maroc";
  } else if (/\brabat\b/i.test(cleanText)) {
    location = "Rabat, Maroc";
  } else if (/\btanger\b|\bmarrakech\b|\bmaroc\b/i.test(cleanText)) {
    location = "Maroc";
  } else if (/\bparis\b|\blyon\b|\bfrance\b/i.test(cleanText)) {
    location = "Paris / France";
  }

  // 8. Education detection
  let education = "Formation Supérieure";
  if (/\bdoctorat\b|\bphd\b/i.test(cleanText)) {
    education = "Doctorat / PhD";
  } else if (/\bing[eé]nieur\b|\bmaster\b|\bmba\b|\bbac\s*\+?\s*5\b|\bgrande\s*[eé]cole/i.test(cleanText)) {
    education = "Bac+5 (Master / Diplôme d'Ingénieur / Grande École)";
  } else if (/\blicence\b|\bbachelor\b|\bbac\s*\+?\s*3\b/i.test(cleanText)) {
    education = "Bac+3 (Licence / Bachelor)";
  }

  return {
    id: `custom-${Date.now()}`,
    fullName: candidateName,
    headline,
    location,
    yearsOfExperience: years,
    seniority,
    summary:
      detectedSkills.length > 0
        ? `Profil extrait automatiquement à partir de votre CV (${detectedSkills.length} compétences clés détectées, ~${years} ans d'expérience). Domaine principal identifié : ${headline.split("|")[0].trim()}.`
        : "Texte du CV importé avec peu de mots-clés standard détectés. Ajoutez vos compétences clés dans la barre latérale pour affiner le matching.",
    skills: detectedSkills,
    softSkills: ["Résolution de problèmes", "Esprit d'équipe", "Adaptabilité", "Communication"],
    languages: [
      /\bfran[çc]ais\b|\bfrench\b/i.test(cleanText) ? "Français" : "Français",
      /\banglais\b|\benglish\b/i.test(cleanText) ? "Anglais" : "Anglais (Pro)",
    ],
    education,
    preferredRoles,
    fileName: fileName || "CV_Importe.pdf",
    rawText: cleanText,
  };
}
