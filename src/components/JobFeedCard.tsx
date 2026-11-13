"use client";

import React from "react";
import { JobMatchResult } from "@/types";
import { getJobExternalUrl } from "@/lib/jobLinks";
import {
  MapPin,
  Clock,
  Bookmark,
  CheckCircle2,
  Building2,
  Users,
  ExternalLink,
  Globe,
} from "lucide-react";

interface JobFeedCardProps {
  match: JobMatchResult;
  isSelected: boolean;
  isSaved: boolean;
  onSelect: () => void;
  onToggleSave: (e: React.MouseEvent) => void;
}

export default function JobFeedCard({
  match,
  isSelected,
  isSaved,
  onSelect,
  onToggleSave,
}: JobFeedCardProps) {
  const { job, totalScore, matchedRequiredSkills } = match;

  const getScoreStyle = (score: number) => {
    if (score >= 80) {
      return {
        bg: "bg-[#E8F5E9] dark:bg-[#057642]/20",
        text: "text-[#057642] dark:text-[#57C98E]",
        border: "border-[#057642]/30",
      };
    }
    if (score >= 60) {
      return {
        bg: "bg-[#EBF4FD] dark:bg-[#0A66C2]/20",
        text: "text-[#0A66C2] dark:text-[#70B5F9]",
        border: "border-[#0A66C2]/30",
      };
    }
    return {
      bg: "bg-[#FDF0ED] dark:bg-[#B24020]/20",
      text: "text-[#B24020] dark:text-[#F28B6E]",
      border: "border-[#B24020]/30",
    };
  };

  const badge = getScoreStyle(totalScore);

  return (
    <div
      onClick={onSelect}
      className={`cursor-pointer bg-white dark:bg-[#1B1F23] rounded-lg border transition-all p-4 relative ${
        isSelected
          ? "border-[#0A66C2] dark:border-[#70B5F9] ring-2 ring-[#0A66C2]/15 bg-[#F8FBFF] dark:bg-[#22282E]"
          : "border-[#E0DFDC] dark:border-[#38434F] hover:border-[#0A66C2]/60 dark:hover:border-[#70B5F9]/60 hover:shadow-md"
      }`}
    >
      {isSelected && (
        <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#0A66C2] dark:bg-[#70B5F9] rounded-l-lg" />
      )}

      <div className="flex items-start gap-3.5">
        {/* Company Square Avatar */}
        <div
          style={{ backgroundColor: job.companyColor }}
          className="w-12 h-12 rounded-md flex items-center justify-center text-white font-bold text-base shrink-0 shadow-sm"
        >
          {job.companyInitials}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div>
              <a
                href={getJobExternalUrl(job)}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => {
                  e.stopPropagation();
                  onSelect();
                }}
                title="Ouvrir l'annonce exacte dans un nouvel onglet"
                className="inline-flex items-center gap-1.5 font-semibold text-[15px] text-[#0A66C2] dark:text-[#70B5F9] hover:underline leading-snug group"
              >
                <span>{job.title}</span>
                <ExternalLink className="w-3.5 h-3.5 shrink-0 opacity-80 group-hover:opacity-100" />
              </a>
              <div className="flex items-center gap-1.5 text-xs text-[#191919] dark:text-[#E9E9E9] font-medium mt-0.5">
                <Building2 className="w-3.5 h-3.5 text-[#666666] dark:text-[#A8B2BD]" />
                <span>{job.company}</span>
                <span className="text-[#666666] dark:text-[#A8B2BD]">•</span>
                <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#0A66C2] dark:text-[#70B5F9]">
                  <Globe className="w-3 h-3" />
                  {job.source}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-1.5 shrink-0">
              <div
                className={`px-2.5 py-1 rounded-full border ${badge.bg} ${badge.text} ${badge.border} flex items-center gap-1 font-bold text-xs shadow-sm`}
              >
                <span>{totalScore}%</span>
                <span className="hidden sm:inline font-semibold text-[11px]">
                  Match
                </span>
              </div>

              <button
                onClick={onToggleSave}
                title={isSaved ? "Retirer des favoris" : "Sauvegarder l'offre"}
                className={`p-1.5 rounded-full transition-colors ${
                  isSaved
                    ? "text-[#0A66C2] dark:text-[#70B5F9] bg-[#EBF4FD] dark:bg-[#293138]"
                    : "text-[#666666] dark:text-[#A8B2BD] hover:bg-[#F4F2EE] dark:hover:bg-[#293138] hover:text-[#191919] dark:hover:text-white"
                }`}
              >
                <Bookmark
                  className={`w-4 h-4 ${isSaved ? "fill-[#0A66C2] dark:fill-[#70B5F9]" : ""}`}
                />
              </button>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 mt-2 text-xs text-[#666666] dark:text-[#A8B2BD]">
            <span className="inline-flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5" />
              {job.location}
            </span>
            <span>•</span>
            <span className="px-2 py-0.5 rounded bg-[#F4F2EE] dark:bg-[#293138] text-[#191919] dark:text-[#E9E9E9] font-medium text-[11px]">
              {job.workplaceType}
            </span>
            <span className="px-2 py-0.5 rounded bg-[#E8F5E9] dark:bg-[#057642]/20 text-[#057642] dark:text-[#57C98E] font-semibold text-[11px]">
              {job.salaryRange}
            </span>
          </div>

          <div className="mt-3 pt-2.5 border-t border-[#E0DFDC]/70 dark:border-[#38434F] flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-1.5 text-xs">
              <CheckCircle2 className="w-4 h-4 text-[#057642] dark:text-[#57C98E] shrink-0" />
              <span className="text-[#191919] dark:text-[#E9E9E9] font-medium">
                {matchedRequiredSkills.length}/{job.requiredSkills.length} compétences :
              </span>
              <div className="flex flex-wrap gap-1">
                {job.requiredSkills.slice(0, 4).map((skill) => {
                  const isMatched = matchedRequiredSkills.includes(skill);
                  return (
                    <span
                      key={skill}
                      className={`text-[10.5px] px-2 py-0.5 rounded-full font-medium ${
                        isMatched
                          ? "bg-[#E8F5E9] dark:bg-[#057642]/25 text-[#057642] dark:text-[#57C98E]"
                          : "bg-[#F4F2EE] dark:bg-[#293138] text-[#666666] dark:text-[#A8B2BD]"
                      }`}
                    >
                      {isMatched ? "✓ " : ""}
                      {skill}
                    </span>
                  );
                })}
                {job.requiredSkills.length > 4 && (
                  <span className="text-[10.5px] text-[#666666] dark:text-[#A8B2BD] px-1">
                    +{job.requiredSkills.length - 4}
                  </span>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2 text-[11px] text-[#666666] dark:text-[#A8B2BD]">
              <span className="inline-flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {job.postedAt}
              </span>
              <span className="hidden md:inline-flex items-center gap-1">
                <Users className="w-3 h-3" />
                {job.applicantsCount}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
