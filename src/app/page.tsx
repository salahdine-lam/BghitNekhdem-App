"use client";

import React, { useState, useMemo, useEffect, useCallback } from "react";
import Navbar from "@/components/Navbar";
import ProfileSidebar from "@/components/ProfileSidebar";
import JobFeedCard from "@/components/JobFeedCard";
import JobDetailInspector from "@/components/JobDetailInspector";
import { SAMPLE_PROFILES, INITIAL_JOBS } from "@/data/mockData";
import { CandidateProfile, JobOffer, PlatformScanStatus, WorkplaceType } from "@/types";
import { extractTextFromFile, parseCVTextToProfile } from "@/lib/cvParser";
import { rankJobsForProfile } from "@/lib/matchingEngine";
import {
  Filter,
  Sparkles,
  SlidersHorizontal,
  FileText,
  X,
  KeyRound,
  CheckCircle2,
  Briefcase,
  Award,
  MapPin,
  GraduationCap,
  Languages,
  Radar,
} from "lucide-react";

export default function HomePage() {
  // Theme State (Light / Dark)
  const [theme, setTheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    const savedTheme = localStorage.getItem("bghit-nekhdem-theme") as "light" | "dark" | null;
    if (savedTheme === "dark") {
      setTheme("dark");
      document.documentElement.classList.add("dark");
    }
  }, []);

  const handleToggleTheme = () => {
    const next = theme === "light" ? "dark" : "light";
    setTheme(next);
    localStorage.setItem("bghit-nekhdem-theme", next);
    document.documentElement.classList.toggle("dark", next === "dark");
  };

  // Active Candidate Profile & Jobs
  const [profile, setProfile] = useState<CandidateProfile>(SAMPLE_PROFILES[0]);
  const [jobs, setJobs] = useState<JobOffer[]>(INITIAL_JOBS);

  // Navigation & Filters (Strict >= 60% by default)
  const [activeTab, setActiveTab] = useState<"feed" | "saved" | "cv-studio">("feed");
  const [searchQuery, setSearchQuery] = useState("");
  const [workplaceFilter, setWorkplaceFilter] = useState<"Tous" | WorkplaceType>("Tous");
  const [minScoreFilter, setMinScoreFilter] = useState<number>(60);
  const [locationFilter, setLocationFilter] = useState<string>("Toutes");

  // Selection, Saved & Applied States
  const [selectedJobId, setSelectedJobId] = useState<string>(INITIAL_JOBS[0].id);
  const [savedJobIds, setSavedJobIds] = useState<string[]>([]);
  const [appliedJobIds, setAppliedJobIds] = useState<string[]>([]);

  // Upload, Live Scanner & Modals
  const [isUploading, setIsUploading] = useState(false);
  const [isPasteModalOpen, setIsPasteModalOpen] = useState(false);
  const [pastedCVText, setPastedCVText] = useState(SAMPLE_PROFILES[0].rawText || "");
  const [isApiModalOpen, setIsApiModalOpen] = useState(false);
  const [geminiApiKey, setGeminiApiKey] = useState("");
  const [isScanning, setIsScanning] = useState(false);
  const [hasScannedLive, setHasScannedLive] = useState(false);
  const [platformStatuses, setPlatformStatuses] = useState<PlatformScanStatus[]>([]);
  const [notification, setNotification] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 4500);
  };

  // Real-time Multi-Platform Scanner
  const scanPlatformsForProfile = useCallback(
    async (targetProfile: CandidateProfile) => {
      setIsScanning(true);
      try {
        const keywordQuery =
          targetProfile.preferredRoles[0] ||
          targetProfile.skills.slice(0, 2).join(" ") ||
          "developpeur";

        const res = await fetch("/api/scan-jobs", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            keywords: keywordQuery,
            location: targetProfile.location,
            skills: targetProfile.skills,
          }),
        });

        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data.platformStatuses)) {
            setPlatformStatuses(data.platformStatuses);
          }
          if (Array.isArray(data.jobs) && data.jobs.length > 0) {
            setJobs((prev) => {
              const liveIds = new Set(data.jobs.map((j: JobOffer) => j.id));
              // Keep initial catalog as secondary fallback, prioritize live scanned offers
              const remaining = prev.filter((j) => !liveIds.has(j.id) && j.id.startsWith("job-"));
              return [...data.jobs, ...remaining];
            });
            setHasScannedLive(true);
            showToast(
              `Scan terminé : ${data.jobs.length} offres réelles extraites en direct !`
            );
          } else {
            setHasScannedLive(true);
            showToast("Scan terminé sur les plateformes actives.");
          }
        }
      } catch {
        showToast("Erreur réseau pendant le scan des plateformes.");
      } finally {
        setIsScanning(false);
      }
    },
    []
  );

  // Compute Ranked Matches whenever profile or jobs change
  const rankedMatches = useMemo(() => {
    return rankJobsForProfile(profile, jobs);
  }, [profile, jobs]);

  // Filter Matches (strictly >= 60% by default)
  const filteredMatches = useMemo(() => {
    return rankedMatches.filter((item) => {
      if (activeTab === "saved" && !savedJobIds.includes(item.job.id)) {
        return false;
      }
      if (workplaceFilter !== "Tous" && item.job.workplaceType !== workplaceFilter) {
        return false;
      }
      if (minScoreFilter > 0 && item.totalScore < minScoreFilter) {
        return false;
      }
      if (
        locationFilter !== "Toutes" &&
        !item.job.location.toLowerCase().includes(locationFilter.toLowerCase())
      ) {
        return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const hay = `${item.job.title} ${item.job.company} ${item.job.location} ${item.job.source} ${item.job.requiredSkills.join(
          " "
        )}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
  }, [
    rankedMatches,
    activeTab,
    savedJobIds,
    workplaceFilter,
    minScoreFilter,
    locationFilter,
    searchQuery,
  ]);

  const matchesOver60Count = useMemo(
    () => rankedMatches.filter((m) => m.totalScore >= 60).length,
    [rankedMatches]
  );

  const averageTopScore = useMemo(() => {
    const top3 = rankedMatches.slice(0, 3);
    if (top3.length === 0) return 0;
    return Math.round(top3.reduce((acc, m) => acc + m.totalScore, 0) / top3.length);
  }, [rankedMatches]);

  const selectedMatch = useMemo(() => {
    return (
      filteredMatches.find((m) => m.job.id === selectedJobId) ||
      filteredMatches[0] ||
      null
    );
  }, [filteredMatches, selectedJobId]);

  // Handlers
  const handleSelectPreset = (newProfile: CandidateProfile) => {
    setProfile(newProfile);
    setPastedCVText(newProfile.rawText || "");
    const reRanked = rankJobsForProfile(newProfile, jobs);
    if (reRanked.length > 0) setSelectedJobId(reRanked[0].job.id);
    scanPlatformsForProfile(newProfile);
  };

  const handleUploadFile = async (file: File) => {
    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      if (geminiApiKey) formData.append("apiKey", geminiApiKey);

      const res = await fetch("/api/parse-cv", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok || data.extractionFailed) {
        showToast(
          data.error ||
            "Impossible de lire le texte de ce PDF (image scannée ?). Collez le texte de votre CV."
        );
        setIsPasteModalOpen(true);
        return;
      }

      if (data.profile) {
        setProfile(data.profile);
        setPastedCVText(data.profile.rawText || "");
        showToast(
          `CV "${file.name}" analysé (${data.profile.skills.length} compétences). Lancement du scan live...`
        );
        await scanPlatformsForProfile(data.profile);
        return;
      }

      const extractedText = await extractTextFromFile(file);
      if (extractedText.length > 30) {
        const localProfile = parseCVTextToProfile(extractedText, file.name);
        setProfile(localProfile);
        setPastedCVText(extractedText);
        await scanPlatformsForProfile(localProfile);
      }
    } catch {
      showToast("Erreur lors de l'importation du fichier. Essayez de coller le texte du CV.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleAnalyzePastedText = async () => {
    if (!pastedCVText.trim()) return;
    setIsUploading(true);
    try {
      const res = await fetch("/api/parse-cv", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          rawText: pastedCVText,
          fileName: "CV_Texte_Personnalise.pdf",
          apiKey: geminiApiKey,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.profile) {
          setProfile(data.profile);
          setIsPasteModalOpen(false);
          showToast(
            `Analyse terminée (${data.profile.skills.length} compétences). Scan des plateformes en cours...`
          );
          await scanPlatformsForProfile(data.profile);
          return;
        }
      }
      const fallback = parseCVTextToProfile(pastedCVText, "CV_Personnalise.pdf");
      setProfile(fallback);
      setIsPasteModalOpen(false);
      await scanPlatformsForProfile(fallback);
    } finally {
      setIsUploading(false);
    }
  };

  const handleAddSkill = (skill: string) => {
    if (profile.skills.some((s) => s.toLowerCase() === skill.toLowerCase())) {
      showToast(`La compétence "${skill}" figure déjà dans votre CV.`);
      return;
    }
    setProfile({ ...profile, skills: [...profile.skills, skill] });
    showToast(`Compétence "${skill}" ajoutée — Scores mis à jour !`);
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setProfile({
      ...profile,
      skills: profile.skills.filter((s) => s !== skillToRemove),
    });
  };

  const handleToggleSave = (jobId: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setSavedJobIds((prev) =>
      prev.includes(jobId) ? prev.filter((id) => id !== jobId) : [...prev, jobId]
    );
  };

  const handleApplyJob = (jobId: string) => {
    if (!appliedJobIds.includes(jobId)) {
      setAppliedJobIds((prev) => [...prev, jobId]);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F4F2EE] dark:bg-[#000000] transition-colors">
      {/* Top Navbar */}
      <Navbar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        savedCount={savedJobIds.length}
        totalMatchesCount={matchesOver60Count}
        onScanPlatforms={() => scanPlatformsForProfile(profile)}
        isScanning={isScanning}
        hasScannedLive={hasScannedLive}
        onOpenApiModal={() => setIsApiModalOpen(true)}
        hasApiKey={Boolean(geminiApiKey.trim())}
        candidateName={profile.fullName}
        theme={theme}
        onToggleTheme={handleToggleTheme}
      />

      {/* Toast Notification */}
      {notification && (
        <div className="fixed bottom-5 right-5 z-50 bg-[#191919] dark:bg-[#293138] text-white px-4 py-3 rounded-lg shadow-xl border border-[#0A66C2] flex items-center gap-2.5 text-xs font-medium">
          <CheckCircle2 className="w-4 h-4 text-[#057642] dark:text-[#57C98E] shrink-0" />
          <span>{notification}</span>
        </div>
      )}

      {/* Main Content */}
      <main className="max-w-[1400px] w-full mx-auto px-4 py-5 flex-1">
        {activeTab === "cv-studio" ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
            <div className="lg:col-span-4">
              <ProfileSidebar
                profile={profile}
                onSelectPreset={handleSelectPreset}
                onUploadFile={handleUploadFile}
                onOpenPasteModal={() => setIsPasteModalOpen(true)}
                onAddSkill={handleAddSkill}
                onRemoveSkill={handleRemoveSkill}
                isUploading={isUploading}
                averageMatchScore={averageTopScore}
              />
            </div>

            <div className="lg:col-span-8 space-y-4">
              <div className="bg-white dark:bg-[#1B1F23] rounded-lg border border-[#E0DFDC] dark:border-[#38434F] p-6 shadow-sm">
                <div className="flex items-center justify-between pb-4 border-b border-[#E0DFDC] dark:border-[#38434F]">
                  <div>
                    <h1 className="text-lg font-bold text-[#191919] dark:text-[#E9E9E9] flex items-center gap-2">
                      <Sparkles className="w-5 h-5 text-[#0A66C2] dark:text-[#70B5F9]" />
                      <span>Synthèse Structurée de votre CV — Bghit nekhdem</span>
                    </h1>
                    <p className="text-xs text-[#666666] dark:text-[#A8B2BD] mt-0.5">
                      Profil utilisé pour le scan en temps réel des plateformes d&apos;emploi.
                    </p>
                  </div>
                  <button
                    onClick={() => setActiveTab("feed")}
                    className="px-4 py-2 rounded-full bg-[#0A66C2] hover:bg-[#004182] text-white text-xs font-semibold transition-colors"
                  >
                    Voir les {matchesOver60Count} offres ≥ 60% →
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 my-4">
                  <div className="p-3.5 rounded-lg bg-[#F8FAFC] dark:bg-[#293138] border border-[#E0DFDC] dark:border-[#38434F]">
                    <div className="text-[11px] text-[#666666] dark:text-[#A8B2BD] flex items-center gap-1">
                      <Award className="w-3.5 h-3.5 text-[#0A66C2] dark:text-[#70B5F9]" />
                      <span>Séniorité détectée</span>
                    </div>
                    <div className="font-bold text-sm text-[#191919] dark:text-[#E9E9E9] mt-1">
                      {profile.seniority} ({profile.yearsOfExperience} ans d&apos;exp.)
                    </div>
                  </div>

                  <div className="p-3.5 rounded-lg bg-[#F8FAFC] dark:bg-[#293138] border border-[#E0DFDC] dark:border-[#38434F]">
                    <div className="text-[11px] text-[#666666] dark:text-[#A8B2BD] flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-[#0A66C2] dark:text-[#70B5F9]" />
                      <span>Localisation</span>
                    </div>
                    <div className="font-bold text-sm text-[#191919] dark:text-[#E9E9E9] mt-1 truncate">
                      {profile.location}
                    </div>
                  </div>

                  <div className="p-3.5 rounded-lg bg-[#F8FAFC] dark:bg-[#293138] border border-[#E0DFDC] dark:border-[#38434F]">
                    <div className="text-[11px] text-[#666666] dark:text-[#A8B2BD] flex items-center gap-1">
                      <GraduationCap className="w-3.5 h-3.5 text-[#0A66C2] dark:text-[#70B5F9]" />
                      <span>Formation</span>
                    </div>
                    <div className="font-bold text-xs text-[#191919] dark:text-[#E9E9E9] mt-1 line-clamp-2">
                      {profile.education}
                    </div>
                  </div>
                </div>

                <div className="mb-4">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-[#666666] dark:text-[#A8B2BD] mb-1.5">
                    Résumé Extrait
                  </h3>
                  <p className="text-xs text-[#191919] dark:text-[#E9E9E9] bg-[#F4F2EE]/60 dark:bg-[#293138] p-3.5 rounded-lg border border-[#E0DFDC] dark:border-[#38434F] leading-relaxed">
                    {profile.summary}
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-wider text-[#666666] dark:text-[#A8B2BD] mb-2 flex items-center gap-1.5">
                      <Briefcase className="w-3.5 h-3.5 text-[#0A66C2] dark:text-[#70B5F9]" />
                      <span>Postes Cibles</span>
                    </h3>
                    <div className="flex flex-wrap gap-1.5">
                      {profile.preferredRoles.map((role) => (
                        <span
                          key={role}
                          className="px-3 py-1 rounded-full bg-[#E8F5E9] dark:bg-[#057642]/20 text-[#057642] dark:text-[#57C98E] text-xs font-semibold"
                        >
                          ✓ {role}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-wider text-[#666666] dark:text-[#A8B2BD] mb-2 flex items-center gap-1.5">
                      <Languages className="w-3.5 h-3.5 text-[#0A66C2] dark:text-[#70B5F9]" />
                      <span>Langues & Soft Skills</span>
                    </h3>
                    <div className="flex flex-wrap gap-1.5">
                      {profile.languages.map((lang) => (
                        <span
                          key={lang}
                          className="px-2.5 py-1 rounded-full bg-[#EBF4FD] dark:bg-[#293138] text-[#0A66C2] dark:text-[#70B5F9] text-xs font-medium"
                        >
                          {lang}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* 3-Column Bghit nekhdem Layout */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
            {/* Left Column */}
            <div className="lg:col-span-3">
              <ProfileSidebar
                profile={profile}
                onSelectPreset={handleSelectPreset}
                onUploadFile={handleUploadFile}
                onOpenPasteModal={() => setIsPasteModalOpen(true)}
                onAddSkill={handleAddSkill}
                onRemoveSkill={handleRemoveSkill}
                isUploading={isUploading}
                averageMatchScore={averageTopScore}
              />
            </div>

            {/* Center Column */}
            <div className="lg:col-span-5 space-y-3">
              {/* Feed Control, Live Platform Telemetry & Filter Bar */}
              <div className="bg-white dark:bg-[#1B1F23] rounded-lg border border-[#E0DFDC] dark:border-[#38434F] p-3.5 shadow-sm space-y-2.5 transition-colors">
                <div className="flex items-center justify-between gap-2">
                  <div>
                    <h1 className="font-bold text-[15px] text-[#191919] dark:text-[#E9E9E9] flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-[#0A66C2] dark:text-[#70B5F9]" />
                      <span>
                        {activeTab === "saved"
                          ? "Vos offres sauvegardées"
                          : "Offres adaptées à votre CV (Score ≥ 60%)"}
                      </span>
                    </h1>
                    <p className="text-[11.5px] text-[#666666] dark:text-[#A8B2BD]">
                      {filteredMatches.length} offre(s) retenue(s) sur {rankedMatches.length} analysées
                    </p>
                  </div>

                  <button
                    onClick={() => scanPlatformsForProfile(profile)}
                    disabled={isScanning}
                    className="lg:hidden px-3 py-1.5 rounded-full bg-[#0A66C2] text-white text-xs font-semibold flex items-center gap-1"
                  >
                    <Radar className={`w-3.5 h-3.5 ${isScanning ? "animate-spin" : ""}`} />
                    <span>{isScanning ? "Scan..." : "Scanner"}</span>
                  </button>
                </div>

                {/* Live Platform Status Pills */}
                {platformStatuses.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 pt-2 border-t border-[#E0DFDC] dark:border-[#38434F]">
                    {platformStatuses.map((st) => (
                      <span
                        key={st.platform}
                        title={st.note || st.status}
                        className={`text-[10.5px] px-2 py-0.5 rounded-full font-medium border ${
                          st.status === "ok"
                            ? "bg-[#E8F5E9] dark:bg-[#057642]/20 text-[#057642] dark:text-[#57C98E] border-[#057642]/30"
                            : st.status === "blocked"
                            ? "bg-[#FDF0ED] dark:bg-[#B24020]/20 text-[#B24020] dark:text-[#F28B6E] border-[#B24020]/30"
                            : "bg-[#F4F2EE] dark:bg-[#293138] text-[#666666] dark:text-[#A8B2BD] border-[#E0DFDC] dark:border-[#38434F]"
                        }`}
                      >
                        {st.platform}:{" "}
                        {st.status === "ok"
                          ? `${st.count} offres`
                          : st.status === "blocked"
                          ? "Anti-bot"
                          : "0"}
                      </span>
                    ))}
                  </div>
                )}

                {/* Filter Pills Row */}
                <div className="flex flex-wrap items-center gap-1.5 pt-2 border-t border-[#E0DFDC] dark:border-[#38434F]">
                  <span className="text-[11px] text-[#666666] dark:text-[#A8B2BD] font-medium flex items-center gap-1 mr-1">
                    <Filter className="w-3 h-3 text-[#0A66C2] dark:text-[#70B5F9]" />
                    Filtres :
                  </span>

                  {(["Tous", "Télétravail", "Hybride"] as const).map((mode) => (
                    <button
                      key={mode}
                      onClick={() => setWorkplaceFilter(mode)}
                      className={`px-2.5 py-1 rounded-full text-[11px] font-semibold border transition-colors ${
                        workplaceFilter === mode
                          ? "bg-[#057642] text-white border-[#057642]"
                          : "bg-white dark:bg-[#293138] text-[#666666] dark:text-[#A8B2BD] border-[#E0DFDC] dark:border-[#38434F] hover:border-[#191919] dark:hover:border-white"
                      }`}
                    >
                      {mode}
                    </button>
                  ))}

                  <select
                    value={locationFilter}
                    onChange={(e) => setLocationFilter(e.target.value)}
                    className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-white dark:bg-[#293138] text-[#191919] dark:text-[#E9E9E9] border border-[#E0DFDC] dark:border-[#38434F] focus:outline-none focus:border-[#0A66C2]"
                  >
                    <option value="Toutes">🌍 Toutes les villes</option>
                    <option value="Casablanca">🇲🇦 Casablanca</option>
                    <option value="Rabat">🇲🇦 Rabat</option>
                    <option value="Maroc">🇲🇦 Tout le Maroc</option>
                    <option value="Paris">🇫🇷 Paris</option>
                  </select>

                  <select
                    value={minScoreFilter}
                    onChange={(e) => setMinScoreFilter(Number(e.target.value))}
                    className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-white dark:bg-[#293138] text-[#191919] dark:text-[#E9E9E9] border border-[#E0DFDC] dark:border-[#38434F] focus:outline-none focus:border-[#0A66C2]"
                  >
                    <option value={60}>Score ≥ 60% (Recommandé)</option>
                    <option value={75}>Score ≥ 75% (Très fort)</option>
                    <option value={85}>Score ≥ 85% (Top Match)</option>
                  </select>
                </div>
              </div>

              {/* Ranked Job Cards */}
              {filteredMatches.length === 0 ? (
                <div className="bg-white dark:bg-[#1B1F23] rounded-lg border border-[#E0DFDC] dark:border-[#38434F] p-8 text-center space-y-2.5">
                  <SlidersHorizontal className="w-8 h-8 text-[#666666] dark:text-[#A8B2BD] mx-auto" />
                  <h3 className="font-bold text-sm text-[#191919] dark:text-[#E9E9E9]">
                    Aucune offre ≥ {minScoreFilter}% trouvée pour ces critères
                  </h3>
                  <p className="text-xs text-[#666666] dark:text-[#A8B2BD]">
                    Lancez un scan en temps réel des plateformes ou ajoutez des compétences clés à votre CV dans la colonne de gauche.
                  </p>
                  <div className="flex items-center justify-center gap-2 pt-1">
                    <button
                      onClick={() => scanPlatformsForProfile(profile)}
                      className="px-4 py-1.5 rounded-full bg-[#0A66C2] text-white text-xs font-semibold flex items-center gap-1.5"
                    >
                      <Radar className="w-3.5 h-3.5" />
                      <span>Scanner les plateformes</span>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-2.5">
                  {filteredMatches.map((match) => (
                    <JobFeedCard
                      key={match.job.id}
                      match={match}
                      isSelected={selectedMatch?.job.id === match.job.id}
                      isSaved={savedJobIds.includes(match.job.id)}
                      onSelect={() => setSelectedJobId(match.job.id)}
                      onToggleSave={(e) => handleToggleSave(match.job.id, e)}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Right Column */}
            <div className="lg:col-span-4">
              <JobDetailInspector
                match={selectedMatch}
                profile={profile}
                isSaved={
                  selectedMatch ? savedJobIds.includes(selectedMatch.job.id) : false
                }
                onToggleSave={() =>
                  selectedMatch && handleToggleSave(selectedMatch.job.id)
                }
                onAddSkillToProfile={handleAddSkill}
                onApplyJob={handleApplyJob}
                hasApplied={
                  selectedMatch ? appliedJobIds.includes(selectedMatch.job.id) : false
                }
              />
            </div>
          </div>
        )}
      </main>

      {/* Modal 1: Paste CV Text */}
      {isPasteModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#1B1F23] rounded-xl border border-[#E0DFDC] dark:border-[#38434F] max-w-2xl w-full p-5 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#E0DFDC] dark:border-[#38434F]">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-[#0A66C2] dark:text-[#70B5F9]" />
                <h2 className="font-bold text-base text-[#191919] dark:text-[#E9E9E9]">
                  Coller ou modifier le texte de votre CV
                </h2>
              </div>
              <button
                onClick={() => setIsPasteModalOpen(false)}
                className="p-1 rounded-full hover:bg-[#F4F2EE] dark:hover:bg-[#293138] text-[#666666] dark:text-[#A8B2BD]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <textarea
              rows={10}
              value={pastedCVText}
              onChange={(e) => setPastedCVText(e.target.value)}
              placeholder="Collez ici le texte complet de votre CV..."
              className="w-full p-3 rounded-lg border border-[#E0DFDC] dark:border-[#38434F] bg-white dark:bg-[#293138] focus:border-[#0A66C2] focus:outline-none text-xs text-[#191919] dark:text-[#E9E9E9] font-mono leading-relaxed"
            />

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setIsPasteModalOpen(false)}
                className="px-4 py-2 rounded-full border border-[#E0DFDC] dark:border-[#38434F] text-xs font-semibold text-[#666666] dark:text-[#A8B2BD] hover:bg-[#F4F2EE] dark:hover:bg-[#293138]"
              >
                Annuler
              </button>
              <button
                onClick={handleAnalyzePastedText}
                disabled={isUploading}
                className="px-5 py-2 rounded-full bg-[#0A66C2] hover:bg-[#004182] text-white text-xs font-semibold flex items-center gap-1.5"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>
                  {isUploading ? "Analyse & Scan..." : "Analyser & Scanner les offres"}
                </span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal 2: Gemini API Key */}
      {isApiModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#1B1F23] rounded-xl border border-[#E0DFDC] dark:border-[#38434F] max-w-md w-full p-5 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#E0DFDC] dark:border-[#38434F]">
              <div className="flex items-center gap-2">
                <KeyRound className="w-5 h-5 text-[#0A66C2] dark:text-[#70B5F9]" />
                <h2 className="font-bold text-base text-[#191919] dark:text-[#E9E9E9]">
                  Configuration Moteur IA (Gemini)
                </h2>
              </div>
              <button
                onClick={() => setIsApiModalOpen(false)}
                className="p-1 rounded-full hover:bg-[#F4F2EE] dark:hover:bg-[#293138] text-[#666666] dark:text-[#A8B2BD]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-[#666666] dark:text-[#A8B2BD] leading-relaxed">
              Clé API Gemini optionnelle pour enrichir l&apos;extraction structurée de votre CV :
            </p>

            <input
              type="password"
              value={geminiApiKey}
              onChange={(e) => setGeminiApiKey(e.target.value)}
              placeholder="AIzaSy..."
              className="w-full px-3 py-2 rounded-lg border border-[#E0DFDC] dark:border-[#38434F] bg-white dark:bg-[#293138] text-[#191919] dark:text-[#E9E9E9] focus:border-[#0A66C2] focus:outline-none text-xs"
            />

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setIsApiModalOpen(false)}
                className="px-4 py-2 rounded-full bg-[#0A66C2] hover:bg-[#004182] text-white text-xs font-semibold"
              >
                Enregistrer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
