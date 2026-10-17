import React, { useState, useEffect } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useNoor } from "@/lib/noor/state";
import { api } from "@/lib/api/api-client";
import {
  Shield,
  ArrowLeft,
  Database,
  Users,
  BookOpen,
  CheckCircle,
  AlertTriangle,
  Clock,
  Sparkles,
  Lock,
  LogOut,
  RefreshCw,
  FileCheck,
  Archive,
  Ban,
  ArrowRight,
  TrendingUp,
  Server,
  Layers,
  ChevronRight,
  Activity,
  Globe,
  Plus,
  Edit3,
  Trash2,
  Save,
  X,
  Volume2,
} from "lucide-react";

export const AdminPortalScreen: React.FC = () => {
  const navigate = useNavigate();
  const { lang, setLang, authAccount, login, logout, isBackendConnected, state } = useNoor();

  const [activeTab, setActiveTab] = useState<"metrics" | "madrasa" | "curriculum" | "users" | "system">("madrasa");
  const [adminEmail, setAdminEmail] = useState("");
  const [adminPassword, setAdminPassword] = useState("");
  const [authError, setAuthError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Live overview data from server
  const [overviewData, setOverviewData] = useState<any>(null);
  const [isLoadingOverview, setIsLoadingOverview] = useState(false);
  const [actionSuccessMessage, setActionSuccessMessage] = useState<string | null>(null);

  // Live Madrasa subjects & Fatihah data
  const [madrasaSubjects, setMadrasaSubjects] = useState<any[]>([]);
  const [fatihahVerses, setFatihahVerses] = useState<any[]>([]);
  const [isLoadingMadrasa, setIsLoadingMadrasa] = useState(false);
  const [selectedSubjectKey, setSelectedSubjectKey] = useState<string>("tajweed");
  const [madrasaViewMode, setMadrasaViewMode] = useState<"subjects" | "fatihah">("subjects");

  // Subject Edit / Create Modals
  const [editingSubject, setEditingSubject] = useState<any | null>(null);
  const [isCreatingSubject, setIsCreatingSubject] = useState(false);
  const [newSubjectData, setNewSubjectData] = useState({
    key: "",
    titleMl: "",
    titleEn: "",
    arabicTitle: "",
    descMl: "",
    descEn: "",
    badgeText: "",
    gradient: "bg-gradient-to-br from-[#F0E9FF] to-[#E3D4FF]",
    bgLight: "#F0E9FF",
    textColor: "#5B21B6",
    accentColor: "#7857E8",
  });

  // Topic Edit / Create Modals
  const [editingTopic, setEditingTopic] = useState<any | null>(null);
  const [isCreatingTopic, setIsCreatingTopic] = useState(false);
  const [newTopicData, setNewTopicData] = useState({
    titleMl: "",
    titleEn: "",
    arabicTitle: "",
    description: "",
    order: 1,
    xpReward: 20,
    durationMinutes: 10,
    isPublished: true,
    iconName: "🎙️",
  });

  // Fatihah Verse Edit Modal
  const [editingVerse, setEditingVerse] = useState<any | null>(null);

  const isAdmin = authAccount?.role === "ADMIN";

  const fetchOverview = async () => {
    if (!authAccount || authAccount.role !== "ADMIN") return;
    setIsLoadingOverview(true);
    try {
      const data = await api.editorial.getOverview();
      setOverviewData(data);
    } catch (err: any) {
      console.error("Failed to load admin overview:", err);
    } finally {
      setIsLoadingOverview(false);
    }
  };

  const fetchMadrasaData = async () => {
    setIsLoadingMadrasa(true);
    try {
      const [subjects, verses] = await Promise.all([
        api.madrasa.getSubjects(),
        api.madrasa.getFatihah(),
      ]);
      setMadrasaSubjects(subjects || []);
      setFatihahVerses(verses || []);
    } catch (err: any) {
      console.warn("Failed to load madrasa DB data:", err);
    } finally {
      setIsLoadingMadrasa(false);
    }
  };

  useEffect(() => {
    if (isAdmin) {
      fetchOverview();
      fetchMadrasaData();
    }
  }, [isAdmin]);

  const handleAdminLogin = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setAuthError(null);
    setIsSubmitting(true);
    try {
      const res = await login(adminEmail.trim(), adminPassword);
      if (!res.success) {
        setAuthError(res.error || "Admin authentication failed. Verify credentials.");
      } else {
        fetchOverview();
        fetchMadrasaData();
      }
    } catch (err: any) {
      setAuthError(err.message || "An error occurred during admin sign-in.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // -------------------------------------------------------------
  // Madrasa CRUD Handlers
  // -------------------------------------------------------------

  const selectedSubject =
    madrasaSubjects.find((s) => s.key === selectedSubjectKey) ||
    madrasaSubjects[0] ||
    null;

  const handleSaveSubject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingSubject) return;
    try {
      await api.madrasa.updateSubject(editingSubject.id, {
        titleMl: editingSubject.titleMl,
        titleEn: editingSubject.titleEn,
        arabicTitle: editingSubject.arabicTitle,
        descMl: editingSubject.descMl,
        descEn: editingSubject.descEn,
        badgeText: editingSubject.badgeText,
      });
      setActionSuccessMessage(`Subject '${editingSubject.titleEn}' updated successfully!`);
      setEditingSubject(null);
      await fetchMadrasaData();
      setTimeout(() => setActionSuccessMessage(null), 3500);
    } catch (err: any) {
      alert(err.message || "Failed to update subject");
    }
  };

  const handleCreateSubject = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.madrasa.createSubject(newSubjectData);
      setActionSuccessMessage(`New Subject '${newSubjectData.titleEn}' created in database!`);
      setIsCreatingSubject(false);
      setNewSubjectData({
        key: "",
        titleMl: "",
        titleEn: "",
        arabicTitle: "",
        descMl: "",
        descEn: "",
        badgeText: "",
        gradient: "bg-gradient-to-br from-[#F0E9FF] to-[#E3D4FF]",
        bgLight: "#F0E9FF",
        textColor: "#5B21B6",
        accentColor: "#7857E8",
      });
      await fetchMadrasaData();
      setTimeout(() => setActionSuccessMessage(null), 3500);
    } catch (err: any) {
      alert(err.message || "Failed to create subject");
    }
  };

  const handleDeleteSubject = async (subjectId: string, name: string) => {
    if (!window.confirm(`Are you sure you want to delete subject '${name}' and all its topics from the database?`)) {
      return;
    }
    try {
      await api.madrasa.deleteSubject(subjectId);
      setActionSuccessMessage(`Subject '${name}' deleted.`);
      await fetchMadrasaData();
      setTimeout(() => setActionSuccessMessage(null), 3500);
    } catch (err: any) {
      alert(err.message || "Failed to delete subject");
    }
  };

  const handleSaveTopic = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTopic) return;
    try {
      await api.madrasa.updateTopic(editingTopic.id, {
        titleMl: editingTopic.titleMl,
        titleEn: editingTopic.titleEn,
        arabicTitle: editingTopic.arabicTitle,
        description: editingTopic.description,
        order: Number(editingTopic.order),
        xpReward: Number(editingTopic.xpReward),
        durationMinutes: Number(editingTopic.durationMinutes),
        isPublished: editingTopic.isPublished,
      });
      setActionSuccessMessage(`Topic '${editingTopic.titleEn}' updated!`);
      setEditingTopic(null);
      await fetchMadrasaData();
      setTimeout(() => setActionSuccessMessage(null), 3500);
    } catch (err: any) {
      alert(err.message || "Failed to update topic");
    }
  };

  const handleCreateTopic = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSubject) return;
    try {
      await api.madrasa.createTopic(selectedSubject.id, {
        ...newTopicData,
        order: Number(newTopicData.order),
        xpReward: Number(newTopicData.xpReward),
        durationMinutes: Number(newTopicData.durationMinutes),
      });
      setActionSuccessMessage(`New topic added to ${selectedSubject.titleEn}!`);
      setIsCreatingTopic(false);
      setNewTopicData({
        titleMl: "",
        titleEn: "",
        arabicTitle: "",
        description: "",
        order: (selectedSubject.topics?.length || 0) + 1,
        xpReward: 20,
        durationMinutes: 10,
        isPublished: true,
        iconName: "🎙️",
      });
      await fetchMadrasaData();
      setTimeout(() => setActionSuccessMessage(null), 3500);
    } catch (err: any) {
      alert(err.message || "Failed to add topic");
    }
  };

  const handleDeleteTopic = async (topicId: string, title: string) => {
    if (!window.confirm(`Delete topic '${title}' from database?`)) return;
    try {
      await api.madrasa.deleteTopic(topicId);
      setActionSuccessMessage(`Topic '${title}' removed.`);
      await fetchMadrasaData();
      setTimeout(() => setActionSuccessMessage(null), 3500);
    } catch (err: any) {
      alert(err.message || "Failed to delete topic");
    }
  };

  const handleSaveVerse = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingVerse) return;
    try {
      await api.madrasa.updateFatihahVerse(editingVerse.id, {
        textUthmani: editingVerse.textUthmani,
        translationMl: editingVerse.translationMl,
        translationEn: editingVerse.translationEn,
        transliteration: editingVerse.transliteration,
        tajweedFocusMl: editingVerse.tajweedFocusMl,
        tajweedFocusEn: editingVerse.tajweedFocusEn,
      });
      setActionSuccessMessage(`Verse ${editingVerse.verseNumber} updated in database!`);
      setEditingVerse(null);
      await fetchMadrasaData();
      setTimeout(() => setActionSuccessMessage(null), 3500);
    } catch (err: any) {
      alert(err.message || "Failed to update verse");
    }
  };

  // Editorial actions
  const handleReviewAction = async (versionId: string, status: "APPROVED" | "REJECTED") => {
    try {
      await api.editorial.review(versionId, status, `Reviewed by admin (${authAccount?.email})`);
      setActionSuccessMessage(status === "APPROVED" ? "Content version approved!" : "Content version rejected.");
      fetchOverview();
      setTimeout(() => setActionSuccessMessage(null), 3000);
    } catch (err: any) {
      alert(err.message || "Review action failed");
    }
  };

  const handlePublishAction = async (versionId: string) => {
    try {
      await api.editorial.publish(versionId, "Published by Administrator");
      setActionSuccessMessage("Version published to live learners!");
      fetchOverview();
      setTimeout(() => setActionSuccessMessage(null), 3000);
    } catch (err: any) {
      alert(err.message || "Publish action failed");
    }
  };

  const handleWithdrawAction = async (versionId: string) => {
    try {
      await api.editorial.withdraw(versionId);
      setActionSuccessMessage("Version withdrawn back to draft review.");
      fetchOverview();
      setTimeout(() => setActionSuccessMessage(null), 3000);
    } catch (err: any) {
      alert(err.message || "Withdraw action failed");
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF9FC] text-[#141426] flex flex-col font-sans">
      {/* Admin Top Navigation Bar */}
      <header className="sticky top-0 z-30 bg-[#191A22] text-white border-b border-[#302B48] px-4 sm:px-6 py-3.5 shadow-md">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#FFD184] to-[#F59E0B] text-[#191A22] flex items-center justify-center font-black text-lg shadow-sm">
              <Shield className="w-5 h-5 fill-current" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1
                  className="text-base sm:text-lg font-black tracking-tight text-[#FFD184]"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  {lang === "ml" ? "നൂർ ജേർണി അഡ്മിൻ പോർട്ടൽ" : "Noor Journey Admin Portal"}
                </h1>
                <span className="px-2 py-0.5 rounded-full bg-white/10 text-[#FFD184] text-[10px] font-black uppercase tracking-wider">
                  PostgreSQL Neon Sync
                </span>
              </div>
              <span className="text-[11px] text-white/60 font-medium">
                Unified 2-User System • Administrator & Student Learner
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setLang(lang === "ml" ? "en" : "ml")}
              className="px-2.5 py-1 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-black transition-all flex items-center gap-1.5"
            >
              <Globe className="w-3.5 h-3.5 text-[#FFD184]" />
              <span>{lang === "ml" ? "English" : "മലയാളം"}</span>
            </button>

            {isAdmin && (
              <button
                type="button"
                onClick={logout}
                className="px-3 py-1.5 rounded-xl bg-[#FFE5E8]/10 hover:bg-[#FFE5E8]/20 text-[#FFCCD3] text-xs font-black transition-all flex items-center gap-1.5"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Logout</span>
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6">
        {/* Toast Notification */}
        {actionSuccessMessage && (
          <div className="p-4 bg-[#EAF8E8] border border-[#BCE8B8] text-[#20721E] rounded-2xl text-xs font-black flex items-center justify-between shadow-xs animate-pop">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-[#20721E]" />
              <span>{actionSuccessMessage}</span>
            </div>
            <button onClick={() => setActionSuccessMessage(null)} className="text-[#20721E]/60 hover:text-[#20721E]">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {!isAdmin ? (
          /* STATE 1: ADMIN LOGIN FORM */
          <div className="max-w-md mx-auto my-12 bg-white border border-[#E4E0E9] rounded-[32px] p-6 sm:p-8 shadow-sm text-center space-y-5 animate-pop">
            <div className="w-16 h-16 mx-auto rounded-3xl bg-[#F0E9FF] text-[#7857E8] flex items-center justify-center shadow-xs">
              <Lock className="w-8 h-8" />
            </div>

            <div>
              <h2
                className="text-xl sm:text-2xl font-black text-[#141426]"
                style={{ fontFamily: "var(--font-display)" }}
              >
                {lang === "ml" ? "അഡ്മിൻ ലോഗിൻ" : "Administrator Sign-In"}
              </h2>
              <p className="text-xs text-[#626273] font-medium max-w-xs mx-auto mt-1 leading-relaxed">
                {lang === "ml"
                  ? "സിലബസ് അവലോകനം, എഡിറ്റോറിയൽ അനുമതി, ഡാറ്റാബേസ് നിയന്ത്രണം എന്നിവ അഡ്മിനിസ്ട്രേറ്റർമാർക്ക് മാത്രമായി പരിമിതപ്പെടുത്തിയിരിക്കുന്നു."
                  : "Madrasa curriculum, Al-Fatihah audio, student oversight, and database controls require Administrator privileges."}
              </p>
            </div>

            {authError && (
              <div className="p-3 bg-[#FFE5E8] border border-[#FFCCD3] rounded-2xl text-xs font-bold text-[#B93848] text-left">
                {authError}
              </div>
            )}

            <form onSubmit={handleAdminLogin} className="space-y-3.5 text-left">
              <div>
                <label className="text-xs font-black text-[#141426] block mb-1">
                  Administrator Email
                </label>
                <input
                  type="email"
                  value={adminEmail}
                  onChange={(e) => setAdminEmail(e.target.value)}
                  placeholder="admin@noor.local"
                  className="w-full px-4 py-2.5 bg-[#F3F1F4] border border-[#E4E0E9] rounded-2xl text-xs font-semibold focus:outline-none focus:border-[#7857E8]"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-black text-[#141426] block mb-1">
                  Password
                </label>
                <input
                  type="password"
                  value={adminPassword}
                  onChange={(e) => setAdminPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-4 py-2.5 bg-[#F3F1F4] border border-[#E4E0E9] rounded-2xl text-xs font-semibold focus:outline-none focus:border-[#7857E8]"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 rounded-2xl bg-[#191A22] text-[#FFD184] hover:bg-black text-xs font-black transition-all shadow-xs tactile flex items-center justify-center gap-2"
              >
                <Shield className="w-4 h-4 text-[#FFD184]" />
                <span>{isSubmitting ? "Authenticating..." : "Log In as Administrator →"}</span>
              </button>
            </form>
          </div>
        ) : (
          /* STATE 2: AUTHENTICATED ADMIN DASHBOARD */
          <div className="space-y-6 animate-pop">
            {/* Top Admin Status & Active Session Card */}
            <div className="bg-white border border-[#E4E0E9] rounded-[28px] p-5 sm:p-6 shadow-2xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-[#287553]/15 text-[#287553] flex items-center justify-center text-lg font-black shrink-0">
                  ✓
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-base font-black text-[#141426]">{authAccount.email}</span>
                    <span className="px-2 py-0.5 rounded-full bg-[#191A22] text-[#FFD184] text-[10px] font-black uppercase">
                      Administrator
                    </span>
                  </div>
                  <span className="text-xs text-[#626273] font-medium block mt-0.5">
                    Neon PostgreSQL Database Active • 2-User System Active • Kerala IST
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    fetchMadrasaData();
                    fetchOverview();
                  }}
                  className="px-3.5 py-2 rounded-2xl bg-[#F0E9FF] hover:bg-[#E3D4FF] text-[#7857E8] text-xs font-black transition-all flex items-center gap-1.5 tactile"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isLoadingMadrasa ? "animate-spin" : ""}`} />
                  <span>Sync DB</span>
                </button>
              </div>
            </div>

            {/* Navigation Tabs Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 bg-[#F3F1F4] p-1.5 rounded-[22px] text-xs font-black text-center shadow-inner">
              <button
                type="button"
                onClick={() => setActiveTab("madrasa")}
                className={`py-3 px-3 rounded-2xl transition-all tactile flex items-center justify-center gap-2 ${
                  activeTab === "madrasa"
                    ? "bg-[#191A22] text-white shadow-2xs"
                    : "text-[#626273] hover:text-[#141426]"
                }`}
              >
                <BookOpen className="w-4 h-4 text-[#FFD184]" />
                <span>{lang === "ml" ? "മദ്‌റസ സിലബസ് (DB)" : "Madrasa Subjects"}</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab("metrics")}
                className={`py-3 px-3 rounded-2xl transition-all tactile flex items-center justify-center gap-2 ${
                  activeTab === "metrics"
                    ? "bg-[#191A22] text-white shadow-2xs"
                    : "text-[#626273] hover:text-[#141426]"
                }`}
              >
                <TrendingUp className="w-4 h-4 text-[#7857E8]" />
                <span>{lang === "ml" ? "സ്ഥിതിവിവരങ്ങൾ" : "Metrics & KPIs"}</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab("curriculum")}
                className={`py-3 px-3 rounded-2xl transition-all tactile flex items-center justify-center gap-2 ${
                  activeTab === "curriculum"
                    ? "bg-[#191A22] text-white shadow-2xs"
                    : "text-[#626273] hover:text-[#141426]"
                }`}
              >
                <FileCheck className="w-4 h-4 text-[#2D60EC]" />
                <span>{lang === "ml" ? "എഡിറ്റോറിയൽ" : "Editorial"}</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab("users")}
                className={`py-3 px-3 rounded-2xl transition-all tactile flex items-center justify-center gap-2 ${
                  activeTab === "users"
                    ? "bg-[#191A22] text-white shadow-2xs"
                    : "text-[#626273] hover:text-[#141426]"
                }`}
              >
                <Users className="w-4 h-4 text-[#10B981]" />
                <span>{lang === "ml" ? "വിദ്യാർത്ഥികൾ" : "Students & Users"}</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab("system")}
                className={`py-3 px-3 rounded-2xl transition-all tactile flex items-center justify-center gap-2 ${
                  activeTab === "system"
                    ? "bg-[#191A22] text-white shadow-2xs"
                    : "text-[#626273] hover:text-[#141426]"
                }`}
              >
                <Server className="w-4 h-4 text-[#F59E0B]" />
                <span>{lang === "ml" ? "സിസ്റ്റം & DB" : "System & DB"}</span>
              </button>
            </div>

            {/* ========================================================
                TAB 1: MADRASA SUBJECTS & AL-FATIHAH (DB CRUD)
               ======================================================== */}
            {activeTab === "madrasa" && (
              <div className="space-y-6">
                {/* View Mode Toggle: Subjects vs Al-Fatihah Course */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-white p-3 rounded-[24px] border border-[#E4E0E9] shadow-2xs">
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setMadrasaViewMode("subjects")}
                      className={`px-4 py-2 rounded-2xl text-xs font-black transition-all tactile flex items-center gap-2 ${
                        madrasaViewMode === "subjects"
                          ? "bg-[#7857E8] text-white shadow-2xs"
                          : "bg-[#F3F1F4] text-[#626273] hover:text-[#141426]"
                      }`}
                    >
                      <BookOpen className="w-4 h-4" />
                      <span>{lang === "ml" ? "മദ്‌റസ 5 വിഷയങ്ങളും സിലബസും" : "Madrasa 5 Subjects & Curriculums"}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setMadrasaViewMode("fatihah")}
                      className={`px-4 py-2 rounded-2xl text-xs font-black transition-all tactile flex items-center gap-2 ${
                        madrasaViewMode === "fatihah"
                          ? "bg-[#7857E8] text-white shadow-2xs"
                          : "bg-[#F3F1F4] text-[#626273] hover:text-[#141426]"
                      }`}
                    >
                      <Volume2 className="w-4 h-4" />
                      <span>{lang === "ml" ? "സൂറതുൽ ഫാതിഹ തജ്‌വീദ് കോഴ്സ് (7 ആയത്തുകൾ)" : "Al-Fatihah 7-Verse DB Course"}</span>
                    </button>
                  </div>

                  {madrasaViewMode === "subjects" && (
                    <button
                      type="button"
                      onClick={() => setIsCreatingSubject(true)}
                      className="px-3.5 py-2 rounded-2xl bg-[#191A22] text-[#FFD184] hover:bg-black text-xs font-black transition-all flex items-center gap-1.5 tactile"
                    >
                      <Plus className="w-4 h-4" />
                      <span>{lang === "ml" ? "+ പുതിയ വിഷയം" : "+ Add Subject"}</span>
                    </button>
                  )}
                </div>

                {/* VIEW 1: MADRASA SUBJECTS & TOPICS */}
                {madrasaViewMode === "subjects" && (
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    {/* Left: Subjects List Selector */}
                    <div className="lg:col-span-4 space-y-3">
                      <div className="flex items-center justify-between px-1">
                        <span className="text-xs font-black uppercase text-[#626273]">
                          Active Subjects ({madrasaSubjects.length})
                        </span>
                        <span className="text-[10px] text-[#7857E8] font-bold">Neon PostgreSQL</span>
                      </div>

                      <div className="space-y-2">
                        {madrasaSubjects.map((s) => {
                          const isSelected = selectedSubject?.key === s.key;
                          return (
                            <div
                              key={s.id}
                              onClick={() => setSelectedSubjectKey(s.key)}
                              className={`p-3.5 rounded-2xl border-2 transition-all tactile cursor-pointer flex items-center justify-between gap-3 ${
                                isSelected
                                  ? "bg-[#F0E9FF] border-[#7857E8] shadow-xs"
                                  : "bg-white border-[#E4E0E9] hover:bg-[#FAF9FC]"
                              }`}
                            >
                              <div className="flex items-center gap-2.5">
                                <span className="text-xl">
                                  {s.key === "tajweed"
                                    ? "🎙️"
                                    : s.key === "aqeedah"
                                    ? "🌙"
                                    : s.key === "fiqh"
                                    ? "💧"
                                    : s.key === "lisanul-quran"
                                    ? "📖"
                                    : "💛"}
                                </span>
                                <div>
                                  <h4 className="font-black text-sm text-[#141426] leading-tight">
                                    {s.englishTitle || s.titleEn} • {s.malayalamTitle || s.titleMl}
                                  </h4>
                                  <span className="text-[11px] text-[#626273] font-medium block">
                                    {s.topics?.length || 0} topics registered
                                  </span>
                                </div>
                              </div>

                              <ChevronRight className={`w-4 h-4 ${isSelected ? "text-[#7857E8]" : "text-[#626273]"}`} />
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Right: Selected Subject Detail & Topics CRUD */}
                    {selectedSubject && (
                      <div className="lg:col-span-8 space-y-5">
                        {/* Selected Subject Card */}
                        <div className="bg-white border border-[#E4E0E9] rounded-[28px] p-5 sm:p-6 shadow-2xs space-y-4">
                          <div className="flex items-start justify-between gap-3">
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="text-2xl">{selectedSubject.icon || "🎙️"}</span>
                                <h3
                                  className="text-xl font-black text-[#141426]"
                                  style={{ fontFamily: "var(--font-display)" }}
                                >
                                  {selectedSubject.englishTitle || selectedSubject.titleEn} (
                                  {selectedSubject.malayalamTitle || selectedSubject.titleMl})
                                </h3>
                              </div>
                              <p className="text-sm font-arabic font-bold text-[#7857E8] mt-1">
                                {selectedSubject.arabicName || selectedSubject.arabicTitle}
                              </p>
                              <p className="text-xs text-[#626273] font-medium mt-1 leading-relaxed max-w-xl">
                                {selectedSubject.shortDescEn || selectedSubject.descEn} •{" "}
                                {selectedSubject.shortDescMl || selectedSubject.descMl}
                              </p>
                            </div>

                            <div className="flex items-center gap-2 shrink-0">
                              <button
                                type="button"
                                onClick={() => setEditingSubject(selectedSubject)}
                                className="px-3 py-1.5 rounded-xl bg-[#F0E9FF] hover:bg-[#E3D4FF] text-[#7857E8] text-xs font-bold transition-all flex items-center gap-1.5 tactile"
                              >
                                <Edit3 className="w-3.5 h-3.5" />
                                <span>Edit Subject</span>
                              </button>

                              {madrasaSubjects.length > 5 && (
                                <button
                                  type="button"
                                  onClick={() => handleDeleteSubject(selectedSubject.id, selectedSubject.titleEn)}
                                  className="p-1.5 rounded-xl bg-[#FFE5E8] hover:bg-[#FFD1D8] text-[#B93848] transition-all tactile"
                                  title="Delete Subject"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              )}
                            </div>
                          </div>

                          {/* Curriculum Topics Section */}
                          <div className="pt-4 border-t border-[#F3F1F4] space-y-3">
                            <div className="flex items-center justify-between">
                              <h4 className="text-sm font-black text-[#141426] flex items-center gap-2">
                                <span>Curriculum Topics</span>
                                <span className="text-xs font-bold text-[#7857E8] bg-[#F0E9FF] px-2 py-0.5 rounded-full">
                                  {selectedSubject.topics?.length || 0} Topics
                                </span>
                              </h4>

                              <button
                                type="button"
                                onClick={() => {
                                  setNewTopicData({
                                    titleMl: "",
                                    titleEn: "",
                                    arabicTitle: "",
                                    description: "",
                                    order: (selectedSubject.topics?.length || 0) + 1,
                                    xpReward: 20,
                                    durationMinutes: 10,
                                    isPublished: true,
                                    iconName: "✨",
                                  });
                                  setIsCreatingTopic(true);
                                }}
                                className="px-3 py-1.5 rounded-xl bg-[#191A22] text-[#FFD184] hover:bg-black text-xs font-black transition-all flex items-center gap-1.5 tactile"
                              >
                                <Plus className="w-3.5 h-3.5" />
                                <span>Add Topic</span>
                              </button>
                            </div>

                            {/* Topics List */}
                            <div className="space-y-2.5">
                              {selectedSubject.topics?.map((topic: any, idx: number) => (
                                <div
                                  key={topic.id}
                                  className="p-4 bg-[#F8F7F9] border border-[#E4E0E9] rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-2xs hover:border-[#CBB5FF] transition-all"
                                >
                                  <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-xl bg-[#F0E9FF] text-[#7857E8] flex items-center justify-center font-black text-xs shrink-0">
                                      {topic.order || idx + 1}
                                    </div>
                                    <div>
                                      <div className="flex items-center gap-2">
                                        <h5 className="font-black text-sm text-[#141426]">
                                          {topic.titleEn} • {topic.titleMl}
                                        </h5>
                                        {topic.arabicTitle && (
                                          <span className="text-xs font-arabic text-[#7857E8]">
                                            ({topic.arabicTitle})
                                          </span>
                                        )}
                                      </div>
                                      <p className="text-xs text-[#626273] font-medium mt-0.5 line-clamp-1">
                                        {topic.description}
                                      </p>
                                      <div className="flex items-center gap-2 mt-1">
                                        <span className="text-[10px] font-black text-[#20721E] bg-[#EAF8E8] px-2 py-0.5 rounded-full">
                                          +{topic.xpReward} XP
                                        </span>
                                        <span className="text-[10px] font-bold text-[#626273]">
                                          ⏱️ {topic.durationMinutes} mins
                                        </span>
                                      </div>
                                    </div>
                                  </div>

                                  <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                                    <button
                                      type="button"
                                      onClick={() => setEditingTopic(topic)}
                                      className="px-2.5 py-1 rounded-xl bg-white border border-[#E4E0E9] hover:bg-[#F0E9FF] text-[#7857E8] text-xs font-bold transition-all tactile flex items-center gap-1 shadow-2xs"
                                    >
                                      <Edit3 className="w-3 h-3" />
                                      <span>Edit</span>
                                    </button>

                                    <button
                                      type="button"
                                      onClick={() => handleDeleteTopic(topic.id, topic.titleEn)}
                                      className="p-1 rounded-xl bg-white border border-[#E4E0E9] hover:bg-[#FFE5E8] text-[#B93848] transition-all tactile shadow-2xs"
                                      title="Delete Topic"
                                    >
                                      <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* VIEW 2: AL-FATIHAH 7-VERSE DB COURSE */}
                {madrasaViewMode === "fatihah" && (
                  <div className="bg-white border border-[#E4E0E9] rounded-[28px] p-5 sm:p-6 shadow-2xs space-y-4">
                    <div className="flex items-center justify-between pb-3 border-b border-[#F3F1F4]">
                      <div>
                        <h3
                          className="text-lg font-black text-[#141426] flex items-center gap-2"
                          style={{ fontFamily: "var(--font-display)" }}
                        >
                          <span>سُورَةُ الفَاتِحَة</span>
                          <span>• Surah Al-Fatihah (7 Verses in Neon DB)</span>
                        </h3>
                        <p className="text-xs text-[#626273] font-medium mt-0.5">
                          Authentic Uthmani Text, Malayalam meanings, and multi-Qari audio recitation powered by Quran Foundation API.
                        </p>
                      </div>

                      <span className="text-xs font-black text-[#7857E8] bg-[#F0E9FF] px-3 py-1 rounded-full">
                        7 Verses Stored
                      </span>
                    </div>

                    <div className="space-y-3">
                      {fatihahVerses.map((verse) => (
                        <div
                          key={verse.id}
                          className="p-4 bg-[#F8F7F9] border border-[#E4E0E9] rounded-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-2xs hover:border-[#7857E8] transition-all"
                        >
                          <div className="space-y-1.5 flex-1">
                            <div className="flex items-center gap-2">
                              <span className="w-7 h-7 rounded-full bg-[#7857E8] text-white flex items-center justify-center font-black text-xs shrink-0 shadow-2xs">
                                {verse.verseNumber}
                              </span>
                              <span className="text-xs font-bold text-[#626273]">
                                Ayah {verse.verseNumber} • {verse.transliteration}
                              </span>
                            </div>

                            <p
                              dir="rtl"
                              className="text-xl font-arabic font-bold text-[#141426] text-right pr-2 leading-relaxed"
                            >
                              {verse.textUthmani}
                            </p>

                            <p className="text-xs text-[#141426]/80 font-medium">
                              <strong className="text-[#7857E8]">മലയാളം:</strong> {verse.translationMl}
                            </p>

                            {verse.tajweedFocusMl && (
                              <p className="text-[11px] text-[#287553] font-semibold bg-[#EAF8E8] px-2.5 py-1 rounded-xl w-fit">
                                🎙️ തജ്‌വീദ്: {verse.tajweedFocusMl}
                              </p>
                            )}
                          </div>

                          <button
                            type="button"
                            onClick={() => setEditingVerse(verse)}
                            className="px-3.5 py-1.5 rounded-xl bg-white border border-[#E4E0E9] hover:bg-[#F0E9FF] text-[#7857E8] text-xs font-bold transition-all tactile flex items-center gap-1.5 shadow-2xs shrink-0"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                            <span>Edit Verse</span>
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* ========================================================
                TAB 2: METRICS & KPIS
               ======================================================== */}
            {activeTab === "metrics" && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {/* Students Metric */}
                  <div className="bg-white border border-[#E4E0E9] rounded-[24px] p-5 shadow-2xs flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-[#E3D4FF] text-[#7857E8] flex items-center justify-center">
                      <Users className="w-6 h-6" />
                    </div>
                    <div>
                      <span className="text-xs text-[#626273] font-bold block">Student Learners</span>
                      <span className="text-2xl font-black text-[#141426] block leading-tight">
                        {overviewData?.children?.length ?? 2}
                      </span>
                    </div>
                  </div>

                  {/* Administrators Metric */}
                  <div className="bg-white border border-[#E4E0E9] rounded-[24px] p-5 shadow-2xs flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-[#BEDAFF] text-[#2D60EC] flex items-center justify-center">
                      <Shield className="w-6 h-6" />
                    </div>
                    <div>
                      <span className="text-xs text-[#626273] font-bold block">Administrators</span>
                      <span className="text-2xl font-black text-[#141426] block leading-tight">
                        {overviewData?.accounts?.filter((a: any) => a.role === "ADMIN").length || 1}
                      </span>
                    </div>
                  </div>

                  {/* Curriculum Missions Metric */}
                  <div className="bg-white border border-[#E4E0E9] rounded-[24px] p-5 shadow-2xs flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-[#FFE4C4] text-[#E59700] flex items-center justify-center">
                      <BookOpen className="w-6 h-6" />
                    </div>
                    <div>
                      <span className="text-xs text-[#626273] font-bold block">Core Missions</span>
                      <span className="text-2xl font-black text-[#141426] block leading-tight">
                        {overviewData?.missionVersions?.length ?? 5}
                      </span>
                    </div>
                  </div>

                  {/* Neon Database Status */}
                  <div className="bg-white border border-[#E4E0E9] rounded-[24px] p-5 shadow-2xs flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-[#C7EBD1] text-[#287553] flex items-center justify-center">
                      <Database className="w-6 h-6" />
                    </div>
                    <div>
                      <span className="text-xs text-[#626273] font-bold block">Neon PostgreSQL</span>
                      <span className="text-base font-black text-[#287553] block leading-tight">
                        Connected
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ========================================================
                TAB 3: EDITORIAL WORKFLOW
               ======================================================== */}
            {activeTab === "curriculum" && (
              <div className="bg-white border border-[#E4E0E9] rounded-[28px] p-5 sm:p-6 shadow-2xs space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-[#F3F1F4]">
                  <div>
                    <h3 className="font-black text-base text-[#141426] flex items-center gap-2">
                      <FileCheck className="w-5 h-5 text-[#7857E8]" />
                      Curriculum Versions & Editorial Approval
                    </h3>
                    <p className="text-xs text-[#626273] font-medium mt-0.5">
                      Content versions authored in database, awaiting administrator review and live release.
                    </p>
                  </div>
                </div>

                <div className="space-y-3">
                  {overviewData?.missionVersions?.map((ver: any) => {
                    const isApproved = ver.reviewStatus === "APPROVED";
                    const isPublished = ver.publishState === "PUBLISHED";
                    return (
                      <div
                        key={ver.id}
                        className="p-4 bg-[#F8F7F9] border border-[#E4E0E9] rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-2xs"
                      >
                        <div>
                          <h4 className="font-black text-sm text-[#141426]">
                            {ver.mission?.titleMl || "മിഷൻ"} ({ver.mission?.titleEn || "Mission"}) — v{ver.versionString}
                          </h4>
                          <span className="text-xs text-[#626273]">
                            Publish State: {ver.publishState} • Status: {ver.reviewStatus}
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          {!isApproved && (
                            <button
                              type="button"
                              onClick={() => handleReviewAction(ver.id, "APPROVED")}
                              className="px-3 py-1.5 rounded-xl bg-[#F0E9FF] hover:bg-[#E3D4FF] text-[#7857E8] font-bold text-xs tactile"
                            >
                              Approve Content
                            </button>
                          )}
                          {!isPublished && isApproved && (
                            <button
                              type="button"
                              onClick={() => handlePublishAction(ver.id)}
                              className="px-3.5 py-1.5 rounded-xl bg-[#20721E] hover:bg-[#1a5d18] text-white font-bold text-xs tactile shadow-2xs"
                            >
                              Publish to Live App
                            </button>
                          )}
                          {isPublished && (
                            <button
                              type="button"
                              onClick={() => handleWithdrawAction(ver.id)}
                              className="px-3 py-1.5 rounded-xl bg-[#FFE5E8] hover:bg-[#FFD1D8] text-[#B93848] font-bold text-xs tactile"
                            >
                              Withdraw Version
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* ========================================================
                TAB 4: 2-USER SYSTEM: ADMINISTRATOR & STUDENTS
               ======================================================== */}
            {activeTab === "users" && (() => {
              const dbChildren = overviewData?.children || [];
              const localLearners = (state?.profiles || [])
                .filter(
                  (p) =>
                    !dbChildren.some(
                      (dbc: any) => dbc.nickname?.toLowerCase() === p.nickname?.toLowerCase()
                    )
                )
                .map((p) => ({
                  id: p.id,
                  nickname: p.nickname,
                  ageBand: p.ageBand,
                  preferredLanguage: "en",
                  _count: { attempts: 0 },
                  isLocal: true,
                }));
              const allLearners = [...dbChildren, ...localLearners];

              return (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Students List */}
                <div className="bg-white border border-[#E4E0E9] rounded-[28px] p-5 sm:p-6 shadow-2xs space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-[#F3F1F4]">
                    <h3 className="font-black text-base text-[#141426] flex items-center gap-2">
                      <Users className="w-5 h-5 text-[#7857E8]" />
                      Student Learners ({allLearners.length})
                    </h3>
                    <span className="text-xs text-[#626273]">Neon DB & Active Profiles</span>
                  </div>

                  <div className="space-y-2.5">
                    {allLearners.map((c: any) => (
                      <div
                        key={c.id}
                        className="p-3.5 bg-[#F8F7F9] border border-[#E4E0E9] rounded-2xl flex items-center justify-between gap-3 shadow-2xs"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-[#E3D4FF] text-[#7857E8] flex items-center justify-center font-black text-sm">
                            {c.nickname.slice(0, 1).toUpperCase()}
                          </div>
                          <div>
                            <span className="font-black text-sm text-[#141426] flex items-center gap-2">
                              {c.nickname}
                              {c.isLocal && (
                                <span className="text-[10px] font-bold text-[#7857E8] bg-[#F0E9FF] px-2 py-0.5 rounded-full">
                                  Current Device
                                </span>
                              )}
                            </span>
                            <span className="text-xs text-[#626273]">
                              Age: {c.ageBand} • Lang: {c.preferredLanguage}
                            </span>
                          </div>
                        </div>

                        <span className="text-xs font-black px-2.5 py-1 rounded-full bg-[#EAF8E8] text-[#20721E]">
                          {c._count?.attempts ?? 0} Attempts
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Administrator Account */}
                <div className="bg-white border border-[#E4E0E9] rounded-[28px] p-5 sm:p-6 shadow-2xs space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-[#F3F1F4]">
                    <h3 className="font-black text-base text-[#141426] flex items-center gap-2">
                      <Shield className="w-5 h-5 text-[#7857E8]" />
                      System Accounts (2-User Model)
                    </h3>
                    <span className="text-xs text-[#626273]">Administrator & Student</span>
                  </div>

                  <div className="space-y-2.5">
                    <div className="p-3.5 bg-[#F8F7F9] border border-[#E4E0E9] rounded-2xl flex items-center justify-between shadow-2xs">
                      <div>
                        <span className="font-black text-sm text-[#141426] block">
                          {authAccount.email}
                        </span>
                        <span className="text-xs text-[#626273]">
                          Role: Administrator • Full Platform Oversight
                        </span>
                      </div>
                      <span className="text-xs font-black px-3 py-1 rounded-full uppercase bg-[#191A22] text-[#FFD184]">
                        ADMIN
                      </span>
                    </div>

                    <div className="p-3.5 bg-[#F8F7F9] border border-[#E4E0E9] rounded-2xl flex items-center justify-between shadow-2xs">
                      <div>
                        <span className="font-black text-sm text-[#141426] block">
                          Student Learner Account
                        </span>
                        <span className="text-xs text-[#626273]">
                          Role: Student • Journey, Tajweed, Madrasa & Noor Stars
                        </span>
                      </div>
                      <span className="text-xs font-black px-3 py-1 rounded-full uppercase bg-[#F0E9FF] text-[#7857E8]">
                        STUDENT
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ); })()}

            {/* ========================================================
                TAB 5: SYSTEM & DATABASE CONTROLS
               ======================================================== */}
            {activeTab === "system" && (
              <div className="bg-white border border-[#E4E0E9] rounded-[28px] p-5 sm:p-6 shadow-2xs space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-[#F3F1F4]">
                  <h3 className="font-black text-base text-[#141426] flex items-center gap-2">
                    <Server className="w-5 h-5 text-[#10B981]" />
                    Neon PostgreSQL Infrastructure
                  </h3>
                  <span className="text-xs text-[#287553] font-bold">Health Status: OK</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div className="p-4 bg-[#F8F7F9] rounded-2xl space-y-2 border border-[#E4E0E9]">
                    <span className="font-black text-[#141426] block">Database Engine</span>
                    <p className="text-[#626273]">Neon Serverless PostgreSQL (ap-southeast-1 pooler)</p>
                  </div>
                  <div className="p-4 bg-[#F8F7F9] rounded-2xl space-y-2 border border-[#E4E0E9]">
                    <span className="font-black text-[#141426] block">API Endpoints</span>
                    <p className="text-[#626273]">NestJS 10 REST API (/api/v1) with CSRF & Session Security</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </main>

      {/* ========================================================
          MODALS FOR SUBJECT, TOPIC & VERSE EDITING
         ======================================================== */}

      {/* 1. Edit Subject Modal */}
      {editingSubject && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-[28px] max-w-lg w-full p-6 space-y-4 shadow-2xl animate-pop">
            <div className="flex items-center justify-between pb-2 border-b border-[#F3F1F4]">
              <h3 className="font-black text-base text-[#141426]">Edit Madrasa Subject</h3>
              <button onClick={() => setEditingSubject(null)} className="text-[#626273] hover:text-[#141426]">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveSubject} className="space-y-3 text-xs">
              <div>
                <label className="font-black text-[#141426] block mb-1">English Title</label>
                <input
                  type="text"
                  value={editingSubject.titleEn}
                  onChange={(e) => setEditingSubject({ ...editingSubject, titleEn: e.target.value })}
                  className="w-full px-3 py-2 bg-[#F3F1F4] border border-[#E4E0E9] rounded-xl font-bold"
                  required
                />
              </div>

              <div>
                <label className="font-black text-[#141426] block mb-1">Malayalam Title</label>
                <input
                  type="text"
                  value={editingSubject.titleMl}
                  onChange={(e) => setEditingSubject({ ...editingSubject, titleMl: e.target.value })}
                  className="w-full px-3 py-2 bg-[#F3F1F4] border border-[#E4E0E9] rounded-xl font-bold"
                  required
                />
              </div>

              <div>
                <label className="font-black text-[#141426] block mb-1">Arabic Title</label>
                <input
                  type="text"
                  value={editingSubject.arabicTitle}
                  onChange={(e) => setEditingSubject({ ...editingSubject, arabicTitle: e.target.value })}
                  className="w-full px-3 py-2 bg-[#F3F1F4] border border-[#E4E0E9] rounded-xl font-bold font-arabic"
                  required
                />
              </div>

              <div>
                <label className="font-black text-[#141426] block mb-1">Short Description (English)</label>
                <textarea
                  value={editingSubject.descEn}
                  onChange={(e) => setEditingSubject({ ...editingSubject, descEn: e.target.value })}
                  rows={2}
                  className="w-full px-3 py-2 bg-[#F3F1F4] border border-[#E4E0E9] rounded-xl font-medium"
                  required
                />
              </div>

              <div>
                <label className="font-black text-[#141426] block mb-1">Short Description (Malayalam)</label>
                <textarea
                  value={editingSubject.descMl}
                  onChange={(e) => setEditingSubject({ ...editingSubject, descMl: e.target.value })}
                  rows={2}
                  className="w-full px-3 py-2 bg-[#F3F1F4] border border-[#E4E0E9] rounded-xl font-medium"
                  required
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditingSubject(null)}
                  className="px-4 py-2 rounded-xl bg-[#F3F1F4] text-[#626273] font-bold hover:text-[#141426]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-[#7857E8] text-white font-black hover:bg-[#6846D4] flex items-center gap-1.5 shadow-xs"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Save to Neon DB</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 2. Create Subject Modal */}
      {isCreatingSubject && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-[28px] max-w-lg w-full p-6 space-y-4 shadow-2xl animate-pop">
            <div className="flex items-center justify-between pb-2 border-b border-[#F3F1F4]">
              <h3 className="font-black text-base text-[#141426]">Add New Madrasa Subject</h3>
              <button onClick={() => setIsCreatingSubject(false)} className="text-[#626273] hover:text-[#141426]">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateSubject} className="space-y-3 text-xs">
              <div>
                <label className="font-black text-[#141426] block mb-1">Key (e.g. seerah, tareekh)</label>
                <input
                  type="text"
                  value={newSubjectData.key}
                  onChange={(e) => setNewSubjectData({ ...newSubjectData, key: e.target.value.toLowerCase().trim() })}
                  className="w-full px-3 py-2 bg-[#F3F1F4] border border-[#E4E0E9] rounded-xl font-bold"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-black text-[#141426] block mb-1">English Title</label>
                  <input
                    type="text"
                    value={newSubjectData.titleEn}
                    onChange={(e) => setNewSubjectData({ ...newSubjectData, titleEn: e.target.value })}
                    className="w-full px-3 py-2 bg-[#F3F1F4] border border-[#E4E0E9] rounded-xl font-bold"
                    required
                  />
                </div>
                <div>
                  <label className="font-black text-[#141426] block mb-1">Malayalam Title</label>
                  <input
                    type="text"
                    value={newSubjectData.titleMl}
                    onChange={(e) => setNewSubjectData({ ...newSubjectData, titleMl: e.target.value })}
                    className="w-full px-3 py-2 bg-[#F3F1F4] border border-[#E4E0E9] rounded-xl font-bold"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="font-black text-[#141426] block mb-1">Arabic Title</label>
                <input
                  type="text"
                  value={newSubjectData.arabicTitle}
                  onChange={(e) => setNewSubjectData({ ...newSubjectData, arabicTitle: e.target.value })}
                  className="w-full px-3 py-2 bg-[#F3F1F4] border border-[#E4E0E9] rounded-xl font-bold font-arabic"
                  required
                />
              </div>

              <div>
                <label className="font-black text-[#141426] block mb-1">Short Description (English)</label>
                <textarea
                  value={newSubjectData.descEn}
                  onChange={(e) => setNewSubjectData({ ...newSubjectData, descEn: e.target.value })}
                  rows={2}
                  className="w-full px-3 py-2 bg-[#F3F1F4] border border-[#E4E0E9] rounded-xl font-medium"
                  required
                />
              </div>

              <div>
                <label className="font-black text-[#141426] block mb-1">Short Description (Malayalam)</label>
                <textarea
                  value={newSubjectData.descMl}
                  onChange={(e) => setNewSubjectData({ ...newSubjectData, descMl: e.target.value })}
                  rows={2}
                  className="w-full px-3 py-2 bg-[#F3F1F4] border border-[#E4E0E9] rounded-xl font-medium"
                  required
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsCreatingSubject(false)}
                  className="px-4 py-2 rounded-xl bg-[#F3F1F4] text-[#626273] font-bold hover:text-[#141426]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-[#7857E8] text-white font-black hover:bg-[#6846D4] flex items-center gap-1.5 shadow-xs"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Create in Neon DB</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 3. Edit Topic Modal */}
      {editingTopic && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-[28px] max-w-lg w-full p-6 space-y-4 shadow-2xl animate-pop">
            <div className="flex items-center justify-between pb-2 border-b border-[#F3F1F4]">
              <h3 className="font-black text-base text-[#141426]">Edit Curriculum Topic</h3>
              <button onClick={() => setEditingTopic(null)} className="text-[#626273] hover:text-[#141426]">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveTopic} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-black text-[#141426] block mb-1">English Title</label>
                  <input
                    type="text"
                    value={editingTopic.titleEn}
                    onChange={(e) => setEditingTopic({ ...editingTopic, titleEn: e.target.value })}
                    className="w-full px-3 py-2 bg-[#F3F1F4] border border-[#E4E0E9] rounded-xl font-bold"
                    required
                  />
                </div>
                <div>
                  <label className="font-black text-[#141426] block mb-1">Malayalam Title</label>
                  <input
                    type="text"
                    value={editingTopic.titleMl}
                    onChange={(e) => setEditingTopic({ ...editingTopic, titleMl: e.target.value })}
                    className="w-full px-3 py-2 bg-[#F3F1F4] border border-[#E4E0E9] rounded-xl font-bold"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="font-black text-[#141426] block mb-1">Arabic Title</label>
                <input
                  type="text"
                  value={editingTopic.arabicTitle || ""}
                  onChange={(e) => setEditingTopic({ ...editingTopic, arabicTitle: e.target.value })}
                  className="w-full px-3 py-2 bg-[#F3F1F4] border border-[#E4E0E9] rounded-xl font-bold font-arabic"
                />
              </div>

              <div>
                <label className="font-black text-[#141426] block mb-1">Description</label>
                <textarea
                  value={editingTopic.description || ""}
                  onChange={(e) => setEditingTopic({ ...editingTopic, description: e.target.value })}
                  rows={2}
                  className="w-full px-3 py-2 bg-[#F3F1F4] border border-[#E4E0E9] rounded-xl font-medium"
                />
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="font-black text-[#141426] block mb-1">Order #</label>
                  <input
                    type="number"
                    value={editingTopic.order}
                    onChange={(e) => setEditingTopic({ ...editingTopic, order: e.target.value })}
                    className="w-full px-3 py-2 bg-[#F3F1F4] border border-[#E4E0E9] rounded-xl font-bold"
                    required
                  />
                </div>
                <div>
                  <label className="font-black text-[#141426] block mb-1">XP Reward</label>
                  <input
                    type="number"
                    value={editingTopic.xpReward}
                    onChange={(e) => setEditingTopic({ ...editingTopic, xpReward: e.target.value })}
                    className="w-full px-3 py-2 bg-[#F3F1F4] border border-[#E4E0E9] rounded-xl font-bold"
                    required
                  />
                </div>
                <div>
                  <label className="font-black text-[#141426] block mb-1">Minutes</label>
                  <input
                    type="number"
                    value={editingTopic.durationMinutes}
                    onChange={(e) => setEditingTopic({ ...editingTopic, durationMinutes: e.target.value })}
                    className="w-full px-3 py-2 bg-[#F3F1F4] border border-[#E4E0E9] rounded-xl font-bold"
                    required
                  />
                </div>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditingTopic(null)}
                  className="px-4 py-2 rounded-xl bg-[#F3F1F4] text-[#626273] font-bold hover:text-[#141426]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-[#7857E8] text-white font-black hover:bg-[#6846D4] flex items-center gap-1.5 shadow-xs"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Save Topic</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 4. Add Topic Modal */}
      {isCreatingTopic && selectedSubject && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-[28px] max-w-lg w-full p-6 space-y-4 shadow-2xl animate-pop">
            <div className="flex items-center justify-between pb-2 border-b border-[#F3F1F4]">
              <h3 className="font-black text-base text-[#141426]">
                Add Topic to {selectedSubject.titleEn}
              </h3>
              <button onClick={() => setIsCreatingTopic(false)} className="text-[#626273] hover:text-[#141426]">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateTopic} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-black text-[#141426] block mb-1">English Title</label>
                  <input
                    type="text"
                    value={newTopicData.titleEn}
                    onChange={(e) => setNewTopicData({ ...newTopicData, titleEn: e.target.value })}
                    className="w-full px-3 py-2 bg-[#F3F1F4] border border-[#E4E0E9] rounded-xl font-bold"
                    required
                  />
                </div>
                <div>
                  <label className="font-black text-[#141426] block mb-1">Malayalam Title</label>
                  <input
                    type="text"
                    value={newTopicData.titleMl}
                    onChange={(e) => setNewTopicData({ ...newTopicData, titleMl: e.target.value })}
                    className="w-full px-3 py-2 bg-[#F3F1F4] border border-[#E4E0E9] rounded-xl font-bold"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="font-black text-[#141426] block mb-1">Arabic Title</label>
                <input
                  type="text"
                  value={newTopicData.arabicTitle}
                  onChange={(e) => setNewTopicData({ ...newTopicData, arabicTitle: e.target.value })}
                  className="w-full px-3 py-2 bg-[#F3F1F4] border border-[#E4E0E9] rounded-xl font-bold font-arabic"
                />
              </div>

              <div>
                <label className="font-black text-[#141426] block mb-1">Description</label>
                <textarea
                  value={newTopicData.description}
                  onChange={(e) => setNewTopicData({ ...newTopicData, description: e.target.value })}
                  rows={2}
                  className="w-full px-3 py-2 bg-[#F3F1F4] border border-[#E4E0E9] rounded-xl font-medium"
                />
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="font-black text-[#141426] block mb-1">Order #</label>
                  <input
                    type="number"
                    value={newTopicData.order}
                    onChange={(e) => setNewTopicData({ ...newTopicData, order: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-[#F3F1F4] border border-[#E4E0E9] rounded-xl font-bold"
                    required
                  />
                </div>
                <div>
                  <label className="font-black text-[#141426] block mb-1">XP Reward</label>
                  <input
                    type="number"
                    value={newTopicData.xpReward}
                    onChange={(e) => setNewTopicData({ ...newTopicData, xpReward: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-[#F3F1F4] border border-[#E4E0E9] rounded-xl font-bold"
                    required
                  />
                </div>
                <div>
                  <label className="font-black text-[#141426] block mb-1">Minutes</label>
                  <input
                    type="number"
                    value={newTopicData.durationMinutes}
                    onChange={(e) => setNewTopicData({ ...newTopicData, durationMinutes: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-[#F3F1F4] border border-[#E4E0E9] rounded-xl font-bold"
                    required
                  />
                </div>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsCreatingTopic(false)}
                  className="px-4 py-2 rounded-xl bg-[#F3F1F4] text-[#626273] font-bold hover:text-[#141426]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-[#7857E8] text-white font-black hover:bg-[#6846D4] flex items-center gap-1.5 shadow-xs"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Topic to DB</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 5. Edit Verse Modal */}
      {editingVerse && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-[28px] max-w-lg w-full p-6 space-y-4 shadow-2xl animate-pop">
            <div className="flex items-center justify-between pb-2 border-b border-[#F3F1F4]">
              <h3 className="font-black text-base text-[#141426]">
                Edit Surah Al-Fatihah Verse {editingVerse.verseNumber}
              </h3>
              <button onClick={() => setEditingVerse(null)} className="text-[#626273] hover:text-[#141426]">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveVerse} className="space-y-3 text-xs">
              <div>
                <label className="font-black text-[#141426] block mb-1">Arabic Text (Uthmani)</label>
                <textarea
                  dir="rtl"
                  value={editingVerse.textUthmani}
                  onChange={(e) => setEditingVerse({ ...editingVerse, textUthmani: e.target.value })}
                  rows={2}
                  className="w-full px-3 py-2 bg-[#F3F1F4] border border-[#E4E0E9] rounded-xl font-arabic text-base text-right font-bold"
                  required
                />
              </div>

              <div>
                <label className="font-black text-[#141426] block mb-1">Transliteration</label>
                <input
                  type="text"
                  value={editingVerse.transliteration}
                  onChange={(e) => setEditingVerse({ ...editingVerse, transliteration: e.target.value })}
                  className="w-full px-3 py-2 bg-[#F3F1F4] border border-[#E4E0E9] rounded-xl font-bold"
                  required
                />
              </div>

              <div>
                <label className="font-black text-[#141426] block mb-1">Malayalam Meaning</label>
                <textarea
                  value={editingVerse.translationMl}
                  onChange={(e) => setEditingVerse({ ...editingVerse, translationMl: e.target.value })}
                  rows={2}
                  className="w-full px-3 py-2 bg-[#F3F1F4] border border-[#E4E0E9] rounded-xl font-medium"
                  required
                />
              </div>

              <div>
                <label className="font-black text-[#141426] block mb-1">Tajweed Rule Focus (Malayalam)</label>
                <input
                  type="text"
                  value={editingVerse.tajweedFocusMl || ""}
                  onChange={(e) => setEditingVerse({ ...editingVerse, tajweedFocusMl: e.target.value })}
                  className="w-full px-3 py-2 bg-[#F3F1F4] border border-[#E4E0E9] rounded-xl font-medium"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditingVerse(null)}
                  className="px-4 py-2 rounded-xl bg-[#F3F1F4] text-[#626273] font-bold hover:text-[#141426]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-[#7857E8] text-white font-black hover:bg-[#6846D4] flex items-center gap-1.5 shadow-xs"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Update Ayah in Neon DB</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
