"use client";

import React from "react";
import {
  Briefcase,
  FileText,
  Bookmark,
  Search,
  Radar,
  Sparkles,
  KeyRound,
  Sun,
  Moon,
} from "lucide-react";

interface NavbarProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  activeTab: "feed" | "saved" | "cv-studio";
  onTabChange: (tab: "feed" | "saved" | "cv-studio") => void;
  savedCount: number;
  totalMatchesCount: number;
  onScanPlatforms: () => void;
  isScanning: boolean;
  hasScannedLive: boolean;
  onOpenApiModal: () => void;
  hasApiKey: boolean;
  candidateName: string;
  theme: "light" | "dark";
  onToggleTheme: () => void;
}

export default function Navbar({
  searchQuery,
  onSearchChange,
  activeTab,
  onTabChange,
  savedCount,
  totalMatchesCount,
  onScanPlatforms,
  isScanning,
  hasScannedLive,
  onOpenApiModal,
  hasApiKey,
  candidateName,
  theme,
  onToggleTheme,
}: NavbarProps) {
  const initials = candidateName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <header className="sticky top-0 z-40 bg-white dark:bg-[#1B1F23] border-b border-[#E0DFDC] dark:border-[#38434F] shadow-sm transition-colors">
      <div className="max-w-[1400px] mx-auto px-4 h-14 flex items-center justify-between gap-3">
        {/* Left: Bghit nekhdem Brand + Search */}
        <div className="flex items-center gap-3 flex-1 max-w-xl">
          <button
            onClick={() => onTabChange("feed")}
            className="flex items-center gap-2 group focus:outline-none shrink-0"
          >
            <div className="w-9 h-9 rounded bg-[#0A66C2] flex items-center justify-center text-white font-extrabold text-base tracking-tight shadow-sm group-hover:bg-[#004182] transition-colors">
              Bn
            </div>
            <div className="hidden sm:flex flex-col text-left">
              <span className="font-bold text-[15px] leading-tight text-[#191919] dark:text-[#E9E9E9] tracking-tight">
                Bghit <span className="text-[#0A66C2] dark:text-[#70B5F9]">nekhdem</span>
              </span>
              <span className="text-[10px] font-medium text-[#666666] dark:text-[#A8B2BD] uppercase tracking-wider">
                Scanner Emploi IA ≥ 60%
              </span>
            </div>
          </button>

          {/* LinkedIn Search Bar */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-[#666666] dark:text-[#A8B2BD] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Filtrer par poste, compétence, plateforme..."
              className="w-full pl-9 pr-4 py-1.5 bg-[#EDF3F8] dark:bg-[#293138] hover:bg-[#E2ECF5] dark:hover:bg-[#323C45] focus:bg-white dark:focus:bg-[#1B1F23] text-[13.5px] text-[#191919] dark:text-[#E9E9E9] placeholder-[#666666] dark:placeholder-[#A8B2BD] rounded-md border border-transparent focus:border-[#0A66C2] dark:focus:border-[#70B5F9] focus:outline-none transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => onSearchChange("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-[#666666] dark:text-[#A8B2BD] hover:text-[#191919] dark:hover:text-white"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* Center/Right: Navigation Tabs + Scanner + Theme Toggle */}
        <nav className="flex items-center h-full gap-1 sm:gap-2">
          <button
            onClick={() => onTabChange("feed")}
            className={`relative h-full px-3 flex flex-col items-center justify-center gap-0.5 text-xs font-medium transition-colors ${
              activeTab === "feed"
                ? "text-[#191919] dark:text-white font-semibold"
                : "text-[#666666] dark:text-[#A8B2BD] hover:text-[#191919] dark:hover:text-white"
            }`}
          >
            <div className="relative">
              <Briefcase className="w-5 h-5" />
              <span className="absolute -top-1.5 -right-3 bg-[#0A66C2] text-white text-[10px] font-bold px-1.5 rounded-full">
                {totalMatchesCount}
              </span>
            </div>
            <span className="hidden md:inline">Offres ≥ 60%</span>
            {activeTab === "feed" && (
              <span className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-[#191919] dark:bg-white rounded-t" />
            )}
          </button>

          <button
            onClick={() => onTabChange("cv-studio")}
            className={`relative h-full px-3 flex flex-col items-center justify-center gap-0.5 text-xs font-medium transition-colors ${
              activeTab === "cv-studio"
                ? "text-[#191919] dark:text-white font-semibold"
                : "text-[#666666] dark:text-[#A8B2BD] hover:text-[#191919] dark:hover:text-white"
            }`}
          >
            <FileText className="w-5 h-5" />
            <span className="hidden md:inline">Mon CV</span>
            {activeTab === "cv-studio" && (
              <span className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-[#191919] dark:bg-white rounded-t" />
            )}
          </button>

          <button
            onClick={() => onTabChange("saved")}
            className={`relative h-full px-3 flex flex-col items-center justify-center gap-0.5 text-xs font-medium transition-colors ${
              activeTab === "saved"
                ? "text-[#191919] dark:text-white font-semibold"
                : "text-[#666666] dark:text-[#A8B2BD] hover:text-[#191919] dark:hover:text-white"
            }`}
          >
            <div className="relative">
              <Bookmark className="w-5 h-5" />
              {savedCount > 0 && (
                <span className="absolute -top-1.5 -right-2.5 bg-[#057642] text-white text-[10px] font-bold px-1.5 rounded-full">
                  {savedCount}
                </span>
              )}
            </div>
            <span className="hidden md:inline">Sauvegardées</span>
            {activeTab === "saved" && (
              <span className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-[#191919] dark:bg-white rounded-t" />
            )}
          </button>

          <div className="h-7 w-[1px] bg-[#E0DFDC] dark:bg-[#38434F] mx-1 hidden sm:block" />

          {/* Real-time Multi-Platform Scanner Button */}
          <button
            onClick={onScanPlatforms}
            disabled={isScanning}
            title="Scanner en temps réel LinkedIn, Rekrute, Emploi.ma, Emploi-Public..."
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${
              isScanning
                ? "bg-[#EBF4FD] dark:bg-[#293138] text-[#0A66C2] dark:text-[#70B5F9] border-[#0A66C2]/40 animate-pulse"
                : hasScannedLive
                ? "bg-[#E8F5E9] dark:bg-[#057642]/20 text-[#057642] dark:text-[#57C98E] border-[#057642]/30 hover:bg-[#057642] hover:text-white"
                : "bg-[#0A66C2] text-white border-[#0A66C2] hover:bg-[#004182]"
            }`}
          >
            <Radar className={`w-3.5 h-3.5 ${isScanning ? "animate-spin" : ""}`} />
            <span className="hidden lg:inline">
              {isScanning ? "Scan en cours..." : hasScannedLive ? "Re-scanner Live" : "Scanner les plateformes"}
            </span>
          </button>

          {/* Theme Switcher (Light / Dark) */}
          <button
            onClick={onToggleTheme}
            title={theme === "dark" ? "Passer au thème clair" : "Passer au thème sombre"}
            className="p-2 rounded-full border border-[#E0DFDC] dark:border-[#38434F] bg-[#F4F2EE] dark:bg-[#293138] text-[#191919] dark:text-[#E9E9E9] hover:bg-[#EBEBEB] dark:hover:bg-[#38434F] transition-colors"
          >
            {theme === "dark" ? (
              <Sun className="w-4 h-4 text-amber-400" />
            ) : (
              <Moon className="w-4 h-4 text-[#0A66C2]" />
            )}
          </button>

          {/* Gemini AI Key Config Button */}
          <button
            onClick={onOpenApiModal}
            title="Configurer la clé API Gemini (Optionnel)"
            className={`hidden sm:flex items-center gap-1 px-2.5 py-1.5 rounded-full text-xs font-semibold border transition-colors ${
              hasApiKey
                ? "bg-[#E8F5E9] dark:bg-[#057642]/20 text-[#057642] dark:text-[#57C98E] border-[#057642]/30"
                : "bg-[#F4F2EE] dark:bg-[#293138] text-[#191919] dark:text-[#E9E9E9] border-[#E0DFDC] dark:border-[#38434F] hover:bg-[#EBEBEB] dark:hover:bg-[#38434F]"
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-[#0A66C2] dark:text-[#70B5F9]" />
            <KeyRound className="w-3 h-3 text-[#666666] dark:text-[#A8B2BD]" />
          </button>

          {/* Candidate Mini Avatar */}
          <div className="hidden sm:flex items-center pl-0.5">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#0A66C2] to-[#004182] text-white font-bold text-xs flex items-center justify-center ring-2 ring-[#EBF4FD] dark:ring-[#38434F]">
              {initials}
            </div>
          </div>
        </nav>
      </div>
    </header>
  );
}
