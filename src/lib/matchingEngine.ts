import { CandidateProfile, JobMatchResult, JobOffer, SeniorityLevel } from "@/types";

const SENIORITY_RANK: Record<SeniorityLevel, number> = {
  Junior: 1,
  Intermédiaire: 2,
  Senior: 3,
  "Lead / Expert": 4,
};

function normalizeSkill(skill: string): string {
  return skill.toLowerCase().replace(/[^a-z0-9à-ÿ+#]/g, "");
}

function skillsMatch(candidateSkill: string, jobSkill: string): boolean {
  const a = normalizeSkill(candidateSkill);
  const b = normalizeSkill(jobSkill);
  if (!a || !b) return false;
  if (a === b) return true;
  if (a.length >= 3 && b.length >= 3 && (a.includes(b) || b.includes(a))) return true;

  // Common equivalents within the same specialty
  const groups = [
    ["react", "reactjs", "nextjs"],
    ["typescript", "javascript"],
    ["python", "fastapi", "django", "flask"],
    ["java", "springboot", "j2ee", "jee"],
    ["c#", "dotnet", "aspnet"],
    ["php", "laravel", "symfony"],
    ["llmiagenerative", "langchain", "openai", "gemini", "rag", "nlp"],
    ["postgresql", "sql", "mysql", "oracle"],
    ["machinelearning", "scikitlearn", "deeplearning"],
    ["agilescrum", "jira", "productdiscovery", "roadmap"],
    ["docker", "kubernetes", "cicd"],
    ["aws", "azure", "gcp"],
    ["analysefinanciere", "controledegestion", "comptabilite", "auditinterneexterne"],
    ["risquedecredit", "ifrs9baleiii", "fintechpaiements"],
    ["supplychain", "logistiquetransport", "achatssourcing"],
    ["marketingdigital", "seosea", "googleanalytics"],
  ];

  return groups.some(
    (g) => g.some((item) => a.includes(item)) && g.some((item) => b.includes(item))
  );
}

export function evaluateJobMatch(profile: CandidateProfile, job: JobOffer): JobMatchResult {
  // 1. Skills Score (40% weight)
  const matchedRequiredSkills: string[] = [];
  const missingRequiredSkills: string[] = [];

  for (const reqSkill of job.requiredSkills) {
    const isMatched = profile.skills.some((candSkill) => skillsMatch(candSkill, reqSkill));
    if (isMatched) {
      matchedRequiredSkills.push(reqSkill);
    } else {
      missingRequiredSkills.push(reqSkill);
    }
  }

  const matchedNiceToHaveSkills: string[] = [];
  const missingNiceToHaveSkills: string[] = [];

  for (const niceSkill of job.niceToHaveSkills) {
    const isMatched = profile.skills.some((candSkill) => skillsMatch(candSkill, niceSkill));
    if (isMatched) {
      matchedNiceToHaveSkills.push(niceSkill);
    } else {
      missingNiceToHaveSkills.push(niceSkill);
    }
  }

  const requiredRatio =
    job.requiredSkills.length > 0
      ? matchedRequiredSkills.length / job.requiredSkills.length
      : 0;

  const niceRatio =
    job.niceToHaveSkills.length > 0
      ? matchedNiceToHaveSkills.length / job.niceToHaveSkills.length
      : 0;

  const skillsScore = Math.round(Math.min(100, requiredRatio * 85 + niceRatio * 15));

  // 2. Semantic & Role Alignment Score (40% weight)
  const profileTokens = `${profile.headline} ${profile.summary} ${profile.preferredRoles.join(" ")} ${profile.skills.join(" ")} ${profile.rawText?.slice(0, 2000) || ""}`
    .toLowerCase()
    .split(/[^a-z0-9à-ÿ+#]+/)
    .filter((w) => w.length > 2);

  const jobTokens = `${job.title} ${job.domain} ${job.description} ${job.requiredSkills.join(" ")}`
    .toLowerCase()
    .split(/[^a-z0-9à-ÿ+#]+/)
    .filter((w) => w.length > 2);

  const profileSet = new Set(profileTokens);
  const uniqueJobTokens = Array.from(new Set(jobTokens));
  const overlapCount = uniqueJobTokens.filter((token) => profileSet.has(token)).length;

  const lexicalOverlap = uniqueJobTokens.length > 0 ? overlapCount / uniqueJobTokens.length : 0;

  // No artificial 35% floor when skills and domain don't match
  const semanticScore = Math.round(
    Math.min(98, requiredRatio * 58 + Math.min(1, lexicalOverlap * 2.5) * 42)
  );

  // 3. Seniority & Experience Score (20% weight)
  const candidateRank = SENIORITY_RANK[profile.seniority] || 2;
  const requiredRank = SENIORITY_RANK[job.seniorityRequired] || 2;
  const rankDiff = candidateRank - requiredRank;
  const expDiff = profile.yearsOfExperience - job.minYearsExperience;

  let seniorityScore = 88;
  if (rankDiff === 0 && expDiff >= 0) {
    seniorityScore = 98;
  } else if (rankDiff > 0 && expDiff >= 0) {
    seniorityScore = 92;
  } else if (expDiff === -1 || rankDiff === -1) {
    seniorityScore = 76;
  } else if (expDiff < -1) {
    seniorityScore = Math.max(40, 75 + expDiff * 10);
  }

  // 4. Composite Score = (Semantic * 0.40) + (Skills * 0.40) + (Seniority * 0.20)
  let totalScore = Math.round(
    semanticScore * 0.4 + skillsScore * 0.4 + seniorityScore * 0.2
  );

  // Gate irrelevant jobs: if 0 required skills and 0 nice-to-have skills match,
  // seniority alone must not push an unrelated job into a "good" score.
  if (matchedRequiredSkills.length === 0 && matchedNiceToHaveSkills.length === 0) {
    totalScore = Math.min(totalScore, 24);
  } else if (matchedRequiredSkills.length === 1 && requiredRatio < 0.2) {
    totalScore = Math.min(totalScore, 42);
  }

  // 5. Explanation & AI Pitch Generation
  const topMatched = matchedRequiredSkills.slice(0, 4).join(", ");
  const matchReason =
    matchedRequiredSkills.length >= Math.ceil(job.requiredSkills.length * 0.65)
      ? `Excellente adéquation : vous maîtrisez ${matchedRequiredSkills.length}/${job.requiredSkills.length} compétences indispensables (${topMatched}) et votre niveau d'expérience (${profile.yearsOfExperience} ans) répond parfaitement aux attentes de ${job.company}.`
      : matchedRequiredSkills.length > 0
      ? `Profil pertinent sur ${matchedRequiredSkills.length}/${job.requiredSkills.length} prérequis (${topMatched}). Mettre en avant vos réalisations liées à ${missingRequiredSkills.slice(0, 2).join(" et ")} renforcera votre candidature.`
      : `Hors cœur de profil : aucune des compétences clés exigées (${job.requiredSkills.slice(0, 3).join(", ")}) n'a été détectée dans votre CV.`;

  const aiPitch = `Bonjour à l'équipe recrutement de ${job.company},\n\nVotre offre de « ${job.title} » a retenu toute mon attention. Fort(e) de ${profile.yearsOfExperience} ans d'expérience (${profile.headline.split("|")[0].trim()}), j'ai développé une expertise solide sur ${
    matchedRequiredSkills.slice(0, 3).join(", ") || profile.skills.slice(0, 3).join(", ")
  }.\n\nJe serais ravi(e) d'échanger sur la manière dont je peux contribuer aux objectifs de votre équipe dès mon intégration.\n\nCordialement,\n${profile.fullName}`;

  const atsTips: string[] = [
    missingRequiredSkills.length > 0
      ? `Ajoutez explicitement les mots-clés « ${missingRequiredSkills.slice(0, 2).join(" », « ")} » dans la section Compétences ou Expériences de votre CV si vous les maîtrisez.`
      : `Votre CV couvre 100% des mots-clés techniques principaux recherchés par le filtre ATS de ${job.company}.`,
    `Reprenez l'intitulé exact « ${job.title} » dans le titre d'accroche de votre CV pour maximiser le score de tri automatique.`,
    `Chiffrez vos réalisations liées à ${matchedRequiredSkills[0] || job.requiredSkills[0]} (ex: impact chiffré, volume traité, délais réduits).`,
  ];

  return {
    job,
    totalScore,
    skillsScore,
    semanticScore,
    seniorityScore,
    matchedRequiredSkills,
    missingRequiredSkills,
    matchedNiceToHaveSkills,
    missingNiceToHaveSkills,
    matchReason,
    aiPitch,
    atsTips,
  };
}

export function rankJobsForProfile(profile: CandidateProfile, jobs: JobOffer[]): JobMatchResult[] {
  return jobs
    .map((job) => evaluateJobMatch(profile, job))
    .sort((a, b) => b.totalScore - a.totalScore);
}
