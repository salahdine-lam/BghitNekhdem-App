"use client";

import React, { useState } from "react";
import { CandidateProfile, JobMatchResult } from "@/types";
import { getJobExternalUrl } from "@/lib/jobLinks";
import {
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Copy,
  Check,
  ExternalLink,
  Bookmark,
  MapPin,
  Briefcase,
  Building2,
  ShieldCheck,
  Plus,
  Lightbulb,
} from "lucide-react";

interface JobDetailInspectorProps {
  match: JobMatchResult | null;
  profile: CandidateProfile;
  isSaved: boolean;
  onToggleSave: () => void;
  onAddSkillToProfile: (skill: string) => void;
  onApplyJob: (jobId: string) => void;
  hasApplied: boolean;
}

export default function JobDetailInspector({
  match,
  profile,
  isSaved,
  onToggleSave,
  onAddSkillToProfile,
  onApplyJob,
  hasApplied,
}: JobDetailInspectorProps) {
  const [copiedPitch, setCopiedPitch] = useState(false);

  if (!match) {
    return (
      <div className="bg-white dark:bg-[#1B1F23] rounded-lg border border-[#E0DFDC] dark:border-[#38434F] p-6 text-center text-[#666666] dark:text-[#A8B2BD] text-xs">
        Aucune offre ≥ 60% sélectionnée. Importez votre CV ou lancez un scan des plateformes.
      </div>
    );
  }

  const {
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
  } = match;

  const handleCopyPitch = () => {
    navigator.clipboard.writeText(aiPitch);
    setCopiedPitch(true);
    setTimeout(() => setCopiedPitch(false), 2000);
  };

  return (
    <div className="bg-white dark:bg-[#1B1F23] rounded-lg border border-[#E0DFDC] dark:border-[#38434F] shadow-sm overflow-hidden flex flex-col max-h-[calc(100vh-4.75rem)] sticky top-[4.25rem] transition-colors">
      {/* Top Header */}
      <div className="p-4 border-b border-[#E0DFDC] dark:border-[#38434F] bg-white dark:bg-[#1B1F23]">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div
              style={{ backgroundColor: job.companyColor }}
              className="w-11 h-11 rounded-md flex items-center justify-center text-white font-bold text-sm shrink-0 shadow-sm"
            >
              {job.companyInitials}
            </div>
            <div>
              <h2 className="font-bold text-[16px] text-[#191919] dark:text-[#E9E9E9] leading-snug">
                {job.title}
              </h2>
              <p className="text-xs text-[#666666] dark:text-[#A8B2BD] flex items-center gap-1.5 mt-0.5 flex-wrap">
                <Building2 className="w-3.5 h-3.5" />
                <span className="font-medium text-[#191919] dark:text-[#E9E9E9]">
                  {job.company}
                </span>
                <span>•</span>
                <MapPin className="w-3.5 h-3.5" />
                <span>{job.location}</span>
              </p>
            </div>
          </div>

          <div
            className={`px-3 py-1.5 rounded-lg text-center shrink-0 border ${
              totalScore >= 80
                ? "bg-[#E8F5E9] dark:bg-[#057642]/20 text-[#057642] dark:text-[#57C98E] border-[#057642]/30"
                : totalScore >= 60
                ? "bg-[#EBF4FD] dark:bg-[#0A66C2]/20 text-[#0A66C2] dark:text-[#70B5F9] border-[#0A66C2]/30"
                : "bg-[#FDF0ED] dark:bg-[#B24020]/20 text-[#B24020] dark:text-[#F28B6E] border-[#B24020]/30"
            }`}
          >
            <div className="text-lg font-extrabold leading-none">{totalScore}%</div>
            <div className="text-[10px] font-semibold uppercase tracking-wider mt-0.5">
              Score IA
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-1.5 mt-3 text-[11.5px]">
          <span className="px-2.5 py-0.5 rounded-full bg-[#E8F5E9] dark:bg-[#057642]/20 text-[#057642] dark:text-[#57C98E] font-semibold">
            {job.salaryRange}
          </span>
          <span className="px-2.5 py-0.5 rounded-full bg-[#F4F2EE] dark:bg-[#293138] text-[#191919] dark:text-[#E9E9E9] font-medium">
            {job.workplaceType}
          </span>
          <span className="px-2.5 py-0.5 rounded-full bg-[#EBF4FD] dark:bg-[#293138] text-[#0A66C2] dark:text-[#70B5F9] font-semibold">
            Source : {job.source}
          </span>
        </div>

        <div className="flex items-center gap-2 mt-3.5">
          <a
            href={getJobExternalUrl(job)}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => onApplyJob(job.id)}
            className="flex-1 py-2 px-4 rounded-full bg-[#0A66C2] hover:bg-[#004182] text-white font-semibold text-xs flex items-center justify-center gap-1.5 shadow-sm transition-colors"
          >
            <span>Postuler sur {job.source}</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>

          {hasApplied && (
            <span className="py-2 px-3 rounded-full bg-[#E8F5E9] dark:bg-[#057642]/20 text-[#057642] dark:text-[#57C98E] font-semibold text-xs flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Consultée</span>
            </span>
          )}

          <button
            onClick={onToggleSave}
            className={`py-2 px-4 rounded-full border font-semibold text-xs flex items-center gap-1.5 transition-colors ${
              isSaved
                ? "border-[#0A66C2] dark:border-[#70B5F9] bg-[#EBF4FD] dark:bg-[#293138] text-[#0A66C2] dark:text-[#70B5F9]"
                : "border-[#0A66C2] dark:border-[#70B5F9] text-[#0A66C2] dark:text-[#70B5F9] hover:bg-[#EBF4FD]/60 dark:hover:bg-[#293138]"
            }`}
          >
            <Bookmark
              className={`w-3.5 h-3.5 ${
                isSaved ? "fill-[#0A66C2] dark:fill-[#70B5F9]" : ""
              }`}
            />
            <span>{isSaved ? "Enregistrée" : "Enregistrer"}</span>
          </button>
        </div>
      </div>

      {/* Scrollable Body */}
      <div className="p-4 overflow-y-auto space-y-4 text-xs leading-relaxed">
        {/* Tripartite AI Match Breakdown */}
        <div className="bg-[#F8FAFC] dark:bg-[#293138]/60 rounded-lg p-3.5 border border-[#E0DFDC] dark:border-[#38434F]">
          <div className="flex items-center gap-1.5 font-bold text-[#191919] dark:text-[#E9E9E9] text-[13px] mb-2">
            <Sparkles className="w-4 h-4 text-[#0A66C2] dark:text-[#70B5F9]" />
            <span>
              Diagnostic IA avec le CV de {profile.fullName.split(" ")[0]}
            </span>
          </div>

          <p className="text-[#191919] dark:text-[#E9E9E9] text-xs mb-3 bg-white dark:bg-[#1B1F23] p-2.5 rounded border border-[#E0DFDC]/80 dark:border-[#38434F]">
            {matchReason}
          </p>

          <div className="space-y-2">
            <div>
              <div className="flex justify-between text-[11px] font-medium mb-1">
                <span className="text-[#666666] dark:text-[#A8B2BD]">
                  Couverture des Compétences (40%)
                </span>
                <span className="font-bold text-[#191919] dark:text-[#E9E9E9]">
                  {skillsScore}%
                </span>
              </div>
              <div className="w-full h-2 bg-[#E0DFDC] dark:bg-[#38434F] rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#0A66C2] dark:bg-[#70B5F9] rounded-full transition-all duration-500"
                  style={{ width: `${skillsScore}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-[11px] font-medium mb-1">
                <span className="text-[#666666] dark:text-[#A8B2BD]">
                  Alignement Sémantique & Métier (40%)
                </span>
                <span className="font-bold text-[#191919] dark:text-[#E9E9E9]">
                  {semanticScore}%
                </span>
              </div>
              <div className="w-full h-2 bg-[#E0DFDC] dark:bg-[#38434F] rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#057642] dark:bg-[#57C98E] rounded-full transition-all duration-500"
                  style={{ width: `${semanticScore}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-[11px] font-medium mb-1">
                <span className="text-[#666666] dark:text-[#A8B2BD]">
                  Séniorité & Expérience (20%)
                </span>
                <span className="font-bold text-[#191919] dark:text-[#E9E9E9]">
                  {seniorityScore}%
                </span>
              </div>
              <div className="w-full h-2 bg-[#E0DFDC] dark:bg-[#38434F] rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#0A66C2] dark:bg-[#70B5F9] rounded-full transition-all duration-500"
                  style={{ width: `${seniorityScore}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Skill Gap Analysis */}
        <div className="space-y-3">
          <h3 className="font-bold text-[13.5px] text-[#191919] dark:text-[#E9E9E9] flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-[#057642] dark:text-[#57C98E]" />
            <span>Analyse des Compétences (Skill Gap Analysis)</span>
          </h3>

          <div className="p-3 rounded-lg bg-[#E8F5E9]/50 dark:bg-[#057642]/15 border border-[#057642]/20">
            <div className="text-[11.5px] font-semibold text-[#057642] dark:text-[#57C98E] mb-2 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4" />
              <span>
                Compétences présentes dans votre CV (
                {matchedRequiredSkills.length + matchedNiceToHaveSkills.length})
              </span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {matchedRequiredSkills.map((skill) => (
                <span
                  key={skill}
                  className="px-2.5 py-1 rounded-full bg-[#E8F5E9] dark:bg-[#057642]/25 text-[#057642] dark:text-[#57C98E] font-semibold text-[11px] border border-[#057642]/30"
                >
                  ✓ {skill}
                </span>
              ))}
              {matchedNiceToHaveSkills.map((skill) => (
                <span
                  key={skill}
                  className="px-2.5 py-1 rounded-full bg-white dark:bg-[#1B1F23] text-[#057642] dark:text-[#57C98E] font-medium text-[11px] border border-[#057642]/30"
                >
                  + {skill} (Bonus)
                </span>
              ))}
            </div>
          </div>

          {(missingRequiredSkills.length > 0 || missingNiceToHaveSkills.length > 0) && (
            <div className="p-3 rounded-lg bg-[#FDF0ED]/60 dark:bg-[#B24020]/15 border border-[#B24020]/20">
              <div className="text-[11.5px] font-semibold text-[#B24020] dark:text-[#F28B6E] mb-1.5 flex items-center gap-1.5">
                <AlertCircle className="w-4 h-4" />
                <span>
                  Compétences manquantes ({missingRequiredSkills.length} requises)
                </span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {missingRequiredSkills.map((skill) => (
                  <button
                    key={skill}
                    onClick={() => onAddSkillToProfile(skill)}
                    className="px-2.5 py-1 rounded-full bg-white dark:bg-[#1B1F23] hover:bg-[#EBF4FD] text-[#B24020] dark:text-[#F28B6E] hover:text-[#0A66C2] font-semibold text-[11px] border border-[#B24020]/40 flex items-center gap-1 transition-all"
                  >
                    <Plus className="w-3 h-3" />
                    <span>{skill}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* ATS Optimization Tips */}
        <div className="p-3.5 rounded-lg bg-[#EBF4FD]/50 dark:bg-[#293138]/60 border border-[#0A66C2]/20 dark:border-[#38434F] space-y-2">
          <div className="font-bold text-[12.5px] text-[#0A66C2] dark:text-[#70B5F9] flex items-center gap-1.5">
            <Lightbulb className="w-4 h-4" />
            <span>Recommandations ATS pour cette offre</span>
          </div>
          <ul className="space-y-1.5 text-[11.5px] text-[#191919] dark:text-[#E9E9E9]">
            {atsTips.map((tip, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="text-[#0A66C2] dark:text-[#70B5F9] font-bold">•</span>
                <span>{tip}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* AI Pitch Generator */}
        <div className="p-3.5 rounded-lg bg-white dark:bg-[#293138]/40 border border-[#E0DFDC] dark:border-[#38434F] space-y-2">
          <div className="flex items-center justify-between">
            <span className="font-bold text-[12.5px] text-[#191919] dark:text-[#E9E9E9] flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-[#0A66C2] dark:text-[#70B5F9]" />
              <span>Message d&apos;accroche personnalisé</span>
            </span>
            <button
              onClick={handleCopyPitch}
              className="px-2.5 py-1 rounded-full bg-[#EBF4FD] dark:bg-[#293138] hover:bg-[#0A66C2] text-[#0A66C2] dark:text-[#70B5F9] hover:text-white font-semibold text-[11px] flex items-center gap-1 transition-colors"
            >
              {copiedPitch ? (
                <>
                  <Check className="w-3 h-3" />
                  <span>Copié !</span>
                </>
              ) : (
                <>
                  <Copy className="w-3 h-3" />
                  <span>Copier</span>
                </>
              )}
            </button>
          </div>
          <pre className="whitespace-pre-wrap font-sans text-[11.5px] text-[#191919] dark:text-[#E9E9E9] bg-[#F4F2EE]/70 dark:bg-[#1B1F23] p-3 rounded border border-[#E0DFDC] dark:border-[#38434F]">
            {aiPitch}
          </pre>
        </div>

        {/* Job Description */}
        <div className="space-y-2.5 pt-2 border-t border-[#E0DFDC] dark:border-[#38434F]">
          <h3 className="font-bold text-[13.5px] text-[#191919] dark:text-[#E9E9E9] flex items-center gap-1.5">
            <Briefcase className="w-4 h-4 text-[#0A66C2] dark:text-[#70B5F9]" />
            <span>À propos de l&apos;offre</span>
          </h3>
          <p className="text-[#191919] dark:text-[#E9E9E9] text-xs leading-relaxed">
            {job.description}
          </p>
        </div>
      </div>
    </div>
  );
}
