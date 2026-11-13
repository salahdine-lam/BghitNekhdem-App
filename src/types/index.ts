export type SeniorityLevel = "Junior" | "Intermédiaire" | "Senior" | "Lead / Expert";

export type WorkplaceType = "Télétravail" | "Hybride" | "Sur site";

export type ContractType = "CDI" | "Freelance" | "CDD" | "Stage / Alternance";

export interface CandidateProfile {
  id: string;
  fullName: string;
  headline: string;
  location: string;
  yearsOfExperience: number;
  seniority: SeniorityLevel;
  summary: string;
  skills: string[];
  softSkills: string[];
  languages: string[];
  education: string;
  preferredRoles: string[];
  fileName?: string;
  rawText?: string;
}

export interface JobOffer {
  id: string;
  title: string;
  company: string;
  companyInitials: string;
  companyColor: string;
  location: string;
  workplaceType: WorkplaceType;
  contractType: ContractType;
  salaryRange: string;
  postedAt: string;
  applicantsCount: number;
  seniorityRequired: SeniorityLevel;
  minYearsExperience: number;
  requiredSkills: string[];
  niceToHaveSkills: string[];
  description: string;
  responsibilities: string[];
  benefits: string[];
  domain: string;
  isEasyApply: boolean;
  isPromoted?: boolean;
  applyUrl?: string;
  source: string;
}

export interface PlatformScanStatus {
  platform: string;
  status: "ok" | "blocked" | "empty" | "error";
  count: number;
  note?: string;
}

export interface JobMatchResult {
  job: JobOffer;
  totalScore: number;
  skillsScore: number;
  semanticScore: number;
  seniorityScore: number;
  matchedRequiredSkills: string[];
  missingRequiredSkills: string[];
  matchedNiceToHaveSkills: string[];
  missingNiceToHaveSkills: string[];
  matchReason: string;
  aiPitch: string;
  atsTips: string[];
}
