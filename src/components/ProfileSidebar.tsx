"use client";

import React, { useRef, useState } from "react";
import { CandidateProfile } from "@/types";
import { SAMPLE_PROFILES } from "@/data/mockData";
import {
  Upload,
  FileCheck2,
  MapPin,
  Award,
  Plus,
  X,
  Sparkles,
  FileText,
  UserCheck,
  Briefcase,
} from "lucide-react";

interface ProfileSidebarProps {
  profile: CandidateProfile;
  onSelectPreset: (profile: CandidateProfile) => void;
  onUploadFile: (file: File) => Promise<void>;
  onOpenPasteModal: () => void;
  onAddSkill: (skill: string) => void;
  onRemoveSkill: (skill: string) => void;
  isUploading: boolean;
  averageMatchScore: number;
}

export default function ProfileSidebar({
  profile,
  onSelectPreset,
  onUploadFile,
  onOpenPasteModal,
  onAddSkill,
  onRemoveSkill,
  isUploading,
  averageMatchScore,
}: ProfileSidebarProps) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [newSkill, setNewSkill] = useState("");
  const [isDragging, setIsDragging] = useState(false);

  const initials = profile.fullName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      await onUploadFile(file);
      e.target.value = "";
    }
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      await onUploadFile(file);
    }
  };

  const handleAddSkillSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newSkill.trim()) {
      onAddSkill(newSkill.trim());
      setNewSkill("");
    }
  };

  return (
    <aside className="space-y-3">
      {/* 1. LinkedIn Candidate Profile Card */}
      <div className="bg-white dark:bg-[#1B1F23] rounded-lg border border-[#E0DFDC] dark:border-[#38434F] overflow-hidden shadow-sm transition-colors">
        <div className="h-16 bg-gradient-to-r from-[#0A66C2] via-[#004182] to-[#002952] relative">
          <div className="absolute right-2.5 top-2 bg-white/15 backdrop-blur-sm text-white text-[10px] font-semibold px-2 py-0.5 rounded-full flex items-center gap-1">
            <Sparkles className="w-3 h-3" />
            <span>Profil IA Actif</span>
          </div>
        </div>

        <div className="px-4 pb-4 relative">
          <div className="-mt-9 mb-2.5 flex items-end justify-between">
            <div className="relative">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#0A66C2] to-[#004182] border-[3px] border-white dark:border-[#1B1F23] shadow-md flex items-center justify-center text-white text-xl font-bold">
                {initials}
              </div>
              <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 bg-[#057642] text-white text-[8.5px] font-bold px-1.5 py-0.2 rounded-full whitespace-nowrap shadow-sm border border-white dark:border-[#1B1F23]">
                #OPENTOWORK
              </span>
            </div>

            <div className="text-right">
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold bg-[#EBF4FD] dark:bg-[#293138] text-[#0A66C2] dark:text-[#70B5F9] px-2.5 py-0.5 rounded-full">
                <Award className="w-3 h-3" />
                {profile.seniority} ({profile.yearsOfExperience} ans)
              </span>
            </div>
          </div>

          <h2 className="font-bold text-[16px] text-[#191919] dark:text-[#E9E9E9] leading-snug">
            {profile.fullName}
          </h2>
          <p className="text-xs text-[#666666] dark:text-[#A8B2BD] mt-0.5 line-clamp-2 leading-relaxed">
            {profile.headline}
          </p>

          <div className="flex items-center gap-1.5 text-[11.5px] text-[#666666] dark:text-[#A8B2BD] mt-2">
            <MapPin className="w-3.5 h-3.5 text-[#0A66C2] dark:text-[#70B5F9] shrink-0" />
            <span className="truncate">{profile.location}</span>
          </div>

          <div className="mt-3 pt-3 border-t border-[#E0DFDC] dark:border-[#38434F] flex items-center justify-between text-xs">
            <span className="text-[#666666] dark:text-[#A8B2BD] font-medium">
              Indice d&apos;affinité marché
            </span>
            <span className="font-bold text-[#057642] dark:text-[#57C98E] bg-[#E8F5E9] dark:bg-[#057642]/20 px-2 py-0.5 rounded-full">
              {averageMatchScore}% Top Match
            </span>
          </div>
        </div>
      </div>

      {/* 2. CV Upload & Quick Persona Switcher Card */}
      <div className="bg-white dark:bg-[#1B1F23] rounded-lg border border-[#E0DFDC] dark:border-[#38434F] p-4 shadow-sm transition-colors">
        <div className="flex items-center justify-between mb-2.5">
          <h3 className="font-semibold text-[13.5px] text-[#191919] dark:text-[#E9E9E9] flex items-center gap-1.5">
            <FileCheck2 className="w-4 h-4 text-[#0A66C2] dark:text-[#70B5F9]" />
            <span>Source du CV</span>
          </h3>
          {profile.fileName && (
            <span className="text-[11px] text-[#057642] dark:text-[#57C98E] font-medium truncate max-w-[140px]">
              ✓ {profile.fileName}
            </span>
          )}
        </div>

        {/* Drag & Drop Zone */}
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`cursor-pointer border-2 border-dashed rounded-lg p-3.5 text-center transition-all ${
            isDragging
              ? "border-[#0A66C2] bg-[#EBF4FD] dark:bg-[#293138]"
              : "border-[#0A66C2]/40 dark:border-[#70B5F9]/40 hover:border-[#0A66C2] bg-[#F8FAFC] dark:bg-[#293138]/60 hover:bg-[#EBF4FD]/50 dark:hover:bg-[#293138]"
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,.doc,.docx,.txt,.md"
            onChange={handleFileChange}
            className="hidden"
          />
          <Upload className="w-6 h-6 text-[#0A66C2] dark:text-[#70B5F9] mx-auto mb-1.5" />
          <p className="text-xs font-semibold text-[#0A66C2] dark:text-[#70B5F9]">
            {isUploading ? "Analyse & Scan en cours..." : "Importer mon CV (PDF, DOCX, TXT)"}
          </p>
          <p className="text-[11px] text-[#666666] dark:text-[#A8B2BD] mt-0.5">
            Déclenche le scan live des plateformes
          </p>
        </div>

        {/* Paste CV Text Button */}
        <button
          onClick={onOpenPasteModal}
          className="mt-2 w-full py-1.5 px-3 rounded-full border border-[#0A66C2] dark:border-[#70B5F9] text-[#0A66C2] dark:text-[#70B5F9] hover:bg-[#EBF4FD] dark:hover:bg-[#293138] text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
        >
          <FileText className="w-3.5 h-3.5" />
          <span>Coller ou éditer le texte de mon CV</span>
        </button>

        {/* Quick Persona Presets */}
        <div className="mt-3.5 pt-3 border-t border-[#E0DFDC] dark:border-[#38434F]">
          <p className="text-[11px] font-semibold text-[#666666] dark:text-[#A8B2BD] uppercase tracking-wider mb-2 flex items-center gap-1">
            <UserCheck className="w-3.5 h-3.5 text-[#0A66C2] dark:text-[#70B5F9]" />
            <span>Ou tester avec un CV Démo :</span>
          </p>
          <div className="space-y-1.5">
            {SAMPLE_PROFILES.map((sample) => {
              const isSelected = sample.id === profile.id;
              return (
                <button
                  key={sample.id}
                  onClick={() => onSelectPreset(sample)}
                  className={`w-full text-left px-2.5 py-1.5 rounded-md text-xs transition-all flex items-center justify-between border ${
                    isSelected
                      ? "bg-[#EBF4FD] dark:bg-[#293138] border-[#0A66C2] dark:border-[#70B5F9] text-[#0A66C2] dark:text-[#70B5F9] font-semibold"
                      : "bg-[#F4F2EE]/70 dark:bg-[#293138]/40 border-transparent text-[#191919] dark:text-[#E9E9E9] hover:bg-[#EBEBEB] dark:hover:bg-[#293138]"
                  }`}
                >
                  <div className="truncate pr-2">
                    <div className="truncate">{sample.fullName}</div>
                    <div className="text-[10.5px] text-[#666666] dark:text-[#A8B2BD] truncate">
                      {sample.headline.split("|")[0]}
                    </div>
                  </div>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-white dark:bg-[#1B1F23] border border-[#E0DFDC] dark:border-[#38434F] text-[#666666] dark:text-[#A8B2BD] shrink-0">
                    {sample.yearsOfExperience} ans
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* 3. Extracted Skills & Live Editor Card */}
      <div className="bg-white dark:bg-[#1B1F23] rounded-lg border border-[#E0DFDC] dark:border-[#38434F] p-4 shadow-sm transition-colors">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-semibold text-[13.5px] text-[#191919] dark:text-[#E9E9E9] flex items-center gap-1.5">
            <Briefcase className="w-4 h-4 text-[#0A66C2] dark:text-[#70B5F9]" />
            <span>Compétences extraites ({profile.skills.length})</span>
          </h3>
        </div>
        <p className="text-[11px] text-[#666666] dark:text-[#A8B2BD] mb-2.5">
          Ajoutez ou retirez une compétence pour recalculer les scores en direct :
        </p>

        <form onSubmit={handleAddSkillSubmit} className="flex gap-1.5 mb-3">
          <input
            type="text"
            value={newSkill}
            onChange={(e) => setNewSkill(e.target.value)}
            placeholder="Ex: Kubernetes, Power BI, Java..."
            className="flex-1 text-xs px-2.5 py-1.5 rounded border border-[#E0DFDC] dark:border-[#38434F] bg-white dark:bg-[#293138] text-[#191919] dark:text-[#E9E9E9] focus:border-[#0A66C2] dark:focus:border-[#70B5F9] focus:outline-none"
          />
          <button
            type="submit"
            className="px-2.5 py-1.5 bg-[#0A66C2] hover:bg-[#004182] text-white rounded text-xs font-semibold flex items-center gap-1 shrink-0 transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Ajouter</span>
          </button>
        </form>

        <div className="flex flex-wrap gap-1.5 max-h-52 overflow-y-auto pr-1">
          {profile.skills.map((skill) => (
            <span
              key={skill}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11.5px] font-medium bg-[#EBF4FD] dark:bg-[#293138] text-[#0A66C2] dark:text-[#70B5F9] border border-[#0A66C2]/20 dark:border-[#70B5F9]/20"
            >
              <span>{skill}</span>
              <button
                onClick={() => onRemoveSkill(skill)}
                title="Retirer cette compétence"
                className="text-[#0A66C2]/60 dark:text-[#70B5F9]/60 hover:text-[#B24020] transition-colors"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}
        </div>
      </div>
    </aside>
  );
}
