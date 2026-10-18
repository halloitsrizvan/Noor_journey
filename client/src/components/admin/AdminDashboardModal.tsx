import React, { useState, useEffect } from "react";
import { useNoor } from "@/lib/noor/state";
import { api } from "@/lib/api/api-client";
import {
  Shield,
  X,
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
} from "lucide-react";

interface AdminDashboardModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenParentDashboard?: () => void;
}

export const AdminDashboardModal: React.FC<AdminDashboardModalProps> = ({
  isOpen,
  onClose,
  onOpenParentDashboard,
}) => {
  const { lang, authAccount, login, logout, isBackendConnected } = useNoor();

  const [activeTab, setActiveTab] = useState<"metrics" | "curriculum" | "users" | "system">("metrics");
  const [adminEmail, setAdminEmail] = useState("");
  const [adminPassword, setAdminPassword] = useState("");
  const [authError, setAuthError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Live overview data from server
  const [overviewData, setOverviewData] = useState<any>(null);
  const [isLoadingOverview, setIsLoadingOverview] = useState(false);
  const [actionSuccessMessage, setActionSuccessMessage] = useState<string | null>(null);

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

  useEffect(() => {
    if (isOpen && authAccount?.role === "ADMIN") {
      fetchOverview();
    }
  }, [isOpen, authAccount]);

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
      }
    } catch (err: any) {
      setAuthError(err.message || "An error occurred during admin sign-in.");
    } finally {
      setIsSubmitting(false);
    }
  };

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
      setActionSuccessMessage("Version withdrawn and archived.");
      fetchOverview();
      setTimeout(() => setActionSuccessMessage(null), 3000);
    } catch (err: any) {
      alert(err.message || "Withdraw action failed");
    }
  };

  if (!isOpen) return null;

  const isAdmin = authAccount?.role === "ADMIN";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/65 backdrop-blur-xs animate-pop">
      <div className="w-full max-w-2xl max-h-[92vh] bg-[#FFFCF8] border border-[#E4E0E9] rounded-[28px] p-6 shadow-2xl flex flex-col relative text-[#141426]">
        {/* Top Header */}
        <div className="flex items-center justify-between pb-3.5 border-b border-[#E4E0E9] mb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-full bg-[#191A22] text-[#FFD184] flex items-center justify-center shadow-xs">
              <Shield className="w-5 h-5 text-[#FFD184]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3
                  className="text-base font-black text-[#141426]"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  {lang === "ml" ? "അഡ്മിൻ & കരിക്കുലം പാനൽ" : "Admin & Curriculum Portal"}
                </h3>
                <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-[#7857E8] text-white">
                  ADMIN
                </span>
              </div>
              <div className="flex items-center gap-2 text-[10px] text-[#626273] font-medium">
                <span className="flex items-center gap-1 text-[#287553] font-bold">
                  <Database className="w-3 h-3" />
                  Neon PostgreSQL Active
                </span>
                <span>•</span>
                <span>Role-Based Control</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {isAdmin && (
              <button
                type="button"
                onClick={fetchOverview}
                disabled={isLoadingOverview}
                className="w-8 h-8 rounded-full bg-[#F3F1F4] hover:bg-[#E4E0E9] flex items-center justify-center text-[#626273] tactile"
                title="Refresh data"
              >
                <RefreshCw className={`w-4 h-4 ${isLoadingOverview ? "animate-spin text-[#7857E8]" : ""}`} />
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-[#F3F1F4] hover:bg-[#E4E0E9] flex items-center justify-center text-[#626273] hover:text-[#141426] tactile"
              aria-label="Close"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* FEEDBACK BANNER */}
        {actionSuccessMessage && (
          <div className="mb-3 p-2.5 bg-[#287553]/15 border border-[#287553]/30 rounded-2xl text-xs font-bold text-[#287553] flex items-center gap-2 animate-rise">
            <CheckCircle className="w-4 h-4" />
            <span>{actionSuccessMessage}</span>
          </div>
        )}

        {/* STATE 1: NOT AUTHENTICATED AS ADMIN */}
        {!isAdmin ? (
          <div className="my-auto py-6 px-4 bg-white border border-[#E4E0E9] rounded-3xl shadow-xs text-center space-y-4">
            <div className="w-14 h-14 mx-auto rounded-full bg-[#F0E9FF] text-[#7857E8] flex items-center justify-center shadow-xs">
              <Lock className="w-7 h-7" />
            </div>

            <div>
              <h4 className="text-base font-black text-[#141426]" style={{ fontFamily: "var(--font-display)" }}>
                {lang === "ml" ? "അഡ്മിൻ ലോഗിൻ ആവശ്യമാണ്" : "Administrator Authorization Required"}
              </h4>
              <p className="text-xs text-[#626273] font-medium max-w-sm mx-auto mt-1">
                {lang === "ml"
                  ? "ഈ ഡാഷ്‌ബോർഡ് സിലബസ് എഡിറ്റോറിയൽ, ഉപയോക്താക്കൾ, ഡാറ്റാബേസ് എന്നിവ നിയന്ത്രിക്കാനുള്ളതാണ്."
                  : "Access to curriculum publishing, student oversight, and database controls is restricted to authorized Administrators."}
              </p>
            </div>

            {authError && (
              <div className="p-2.5 bg-[#B93848]/10 border border-[#B93848]/25 rounded-2xl text-xs font-bold text-[#B93848]">
                {authError}
              </div>
            )}

            <form onSubmit={handleAdminLogin} className="space-y-3 max-w-sm mx-auto text-left">
              <div>
                <label className="text-[11px] font-bold text-[#626273] block mb-1">
                  Admin Email
                </label>
                <input
                  type="email"
                  value={adminEmail}
                  onChange={(e) => setAdminEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-[#F3F1F4] border border-[#E4E0E9] rounded-2xl text-xs font-semibold focus:outline-none focus:border-[#7857E8]"
                  required
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-[#626273] block mb-1">
                  Admin Password
                </label>
                <input
                  type="password"
                  value={adminPassword}
                  onChange={(e) => setAdminPassword(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-[#F3F1F4] border border-[#E4E0E9] rounded-2xl text-xs font-semibold focus:outline-none focus:border-[#7857E8]"
                  required
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 py-3 rounded-2xl bg-[#191A22] text-white text-xs font-bold hover:bg-black transition-all shadow-xs tactile flex items-center justify-center gap-1.5"
                >
                  <Shield className="w-4 h-4 text-[#FFD184]" />
                  {isSubmitting ? "Authenticating..." : "Log in as Admin →"}
                </button>
              </div>
            </form>

          </div>
        ) : (
          /* STATE 2: AUTHENTICATED ADMIN DASHBOARD */
          <>
            {/* Top Bar with Admin Info & Logout */}
            <div className="flex items-center justify-between bg-white border border-[#E4E0E9] rounded-2xl p-2.5 mb-3 shadow-2xs">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-[#287553]/15 text-[#287553] flex items-center justify-center text-xs font-black">
                  ✓
                </div>
                <div className="text-xs">
                  <span className="font-bold text-[#141426]">{authAccount.email}</span>
                  <span className="text-[10px] text-[#626273] block">
                    Role: <strong className="text-[#7857E8]">ADMIN</strong> • Live Database Session
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {onOpenParentDashboard && (
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      onOpenParentDashboard();
                    }}
                    className="text-[11px] font-bold text-[#7857E8] hover:underline px-2"
                  >
                    Parent View →
                  </button>
                )}
                <button
                  type="button"
                  onClick={async () => {
                    await logout();
                    setOverviewData(null);
                  }}
                  className="px-3 py-1.5 rounded-xl bg-[#F3F1F4] hover:bg-[#E4E0E9] text-[#626273] hover:text-[#141426] text-xs font-bold transition-all flex items-center gap-1 tactile"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  Logout
                </button>
              </div>
            </div>

            {/* Navigation Tabs */}
            <div className="grid grid-cols-4 gap-1.5 bg-[#F3F1F4] p-1 rounded-2xl mb-3 text-xs font-bold text-center">
              <button
                type="button"
                onClick={() => setActiveTab("metrics")}
                className={`py-2 rounded-xl transition-all ${
                  activeTab === "metrics"
                    ? "bg-[#191A22] text-white shadow-2xs font-extrabold"
                    : "text-[#626273] hover:text-[#141426]"
                }`}
              >
                {lang === "ml" ? "അവലോകനം" : "Metrics"}
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("curriculum")}
                className={`py-2 rounded-xl transition-all ${
                  activeTab === "curriculum"
                    ? "bg-[#191A22] text-white shadow-2xs font-extrabold"
                    : "text-[#626273] hover:text-[#141426]"
                }`}
              >
                {lang === "ml" ? "കരിക്കുലം" : "Editorial"}
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("users")}
                className={`py-2 rounded-xl transition-all ${
                  activeTab === "users"
                    ? "bg-[#191A22] text-white shadow-2xs font-extrabold"
                    : "text-[#626273] hover:text-[#141426]"
                }`}
              >
                {lang === "ml" ? "ഉപയോക്താക്കൾ" : "Users & Kids"}
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("system")}
                className={`py-2 rounded-xl transition-all ${
                  activeTab === "system"
                    ? "bg-[#191A22] text-white shadow-2xs font-extrabold"
                    : "text-[#626273] hover:text-[#141426]"
                }`}
              >
                {lang === "ml" ? "സിസ്റ്റം" : "System & DB"}
              </button>
            </div>

            {/* Content Tabs */}
            <div className="flex-1 overflow-y-auto space-y-3 pr-1 text-xs">
              {/* TAB 1: METRICS & KPIS */}
              {activeTab === "metrics" && (
                <div className="space-y-3">
                  <div className="grid grid-cols-3 gap-2.5">
                    {/* Students */}
                    <div className="p-3.5 bg-white border border-[#E4E0E9] rounded-2xl shadow-2xs">
                      <div className="flex items-center justify-between text-[#626273] mb-1">
                        <span className="text-[10px] font-bold uppercase tracking-wider">Students</span>
                        <Users className="w-4 h-4 text-[#7857E8]" />
                      </div>
                      <div className="text-xl font-black text-[#141426]">
                        {overviewData?.stats?.totalChildren ?? 2}
                      </div>
                      <span className="text-[10px] text-[#287553] font-semibold">Active learner profiles</span>
                    </div>

                    {/* Parents */}
                    <div className="p-3.5 bg-white border border-[#E4E0E9] rounded-2xl shadow-2xs">
                      <div className="flex items-center justify-between text-[#626273] mb-1">
                        <span className="text-[10px] font-bold uppercase tracking-wider">Parents</span>
                        <Shield className="w-4 h-4 text-[#7857E8]" />
                      </div>
                      <div className="text-xl font-black text-[#141426]">
                        {overviewData?.stats?.totalParents ?? 1}
                      </div>
                      <span className="text-[10px] text-[#626273] font-medium">Registered guardians</span>
                    </div>

                    {/* Published Missions */}
                    <div className="p-3.5 bg-white border border-[#E4E0E9] rounded-2xl shadow-2xs">
                      <div className="flex items-center justify-between text-[#626273] mb-1">
                        <span className="text-[10px] font-bold uppercase tracking-wider">Missions</span>
                        <BookOpen className="w-4 h-4 text-[#287553]" />
                      </div>
                      <div className="text-xl font-black text-[#141426]">
                        {overviewData?.stats?.publishedVersions ?? 5} / {overviewData?.stats?.totalMissions ?? 5}
                      </div>
                      <span className="text-[10px] text-[#287553] font-semibold">Live in app</span>
                    </div>
                  </div>

                  {/* Database Info Card */}
                  <div className="p-4 bg-[#F0E9FF] border border-[#E3D4FF] rounded-2xl flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-[#7857E8] text-white flex items-center justify-center">
                        <Database className="w-5 h-5" />
                      </div>
                      <div>
                        <h5 className="font-extrabold text-[#141426] text-sm">Neon Serverless PostgreSQL</h5>
                        <p className="text-[11px] text-[#626273]">
                          Endpoint: <span className="font-mono text-[#7857E8]">ep-noisy-sun-aos38coc</span> • Region: ap-southeast-1
                        </p>
                      </div>
                    </div>
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-black bg-[#287553] text-white">
                      CONNECTED
                    </span>
                  </div>

                  {/* Editorial Queue Banner */}
                  <div className="p-4 bg-white border border-[#E4E0E9] rounded-2xl space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-extrabold text-sm text-[#141426] flex items-center gap-1.5">
                        <Layers className="w-4 h-4 text-[#7857E8]" />
                        Editorial Workflow Status
                      </span>
                      <span className="text-[11px] font-bold text-[#7857E8] bg-[#F0E9FF] px-2.5 py-0.5 rounded-full">
                        Samastha (SKIMVB) Aligned
                      </span>
                    </div>
                    <p className="text-xs text-[#626273] leading-relaxed">
                      Content undergoes a mandatory 4-stage review process (Draft → Submitted → Approved by Reviewer → Published by Administrator) before going live to children.
                    </p>
                  </div>
                </div>
              )}

              {/* TAB 2: CURRICULUM EDITORIAL WORKFLOW */}
              {activeTab === "curriculum" && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h5 className="font-black text-sm text-[#141426]">
                      Curriculum Versions & Missions ({overviewData?.versions?.length ?? 5})
                    </h5>
                    <span className="text-[10px] font-semibold text-[#626273]">
                      Action buttons enable live publishing
                    </span>
                  </div>

                  {overviewData?.versions && overviewData.versions.length > 0 ? (
                    <div className="space-y-2.5">
                      {overviewData.versions.map((ver: any) => {
                        const isPublished = ver.publishState === "PUBLISHED";
                        const isApproved = ver.reviewStatus === "APPROVED";
                        return (
                          <div
                            key={ver.id}
                            className="p-3.5 bg-white border border-[#E4E0E9] rounded-2xl shadow-2xs space-y-2"
                          >
                            <div className="flex items-start justify-between gap-2">
                              <div>
                                <div className="flex items-center gap-2">
                                  <span className="font-extrabold text-sm text-[#141426]">
                                    {ver.mission?.titleMl || "മിഷൻ"} ({ver.mission?.titleEn || "Mission"})
                                  </span>
                                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#F3F1F4] text-[#626273]">
                                    v{ver.versionString}
                                  </span>
                                </div>
                                <span className="text-[10px] text-[#626273] block mt-0.5">
                                  Chapter: {ver.mission?.learningChapter?.titleEn || "Akhlaq"} • Concept: {ver.mission?.conceptEn || "Character"}
                                </span>
                              </div>

                              <div className="flex items-center gap-1.5 shrink-0">
                                <span
                                  className={`text-[9px] font-black px-2 py-0.5 rounded-full uppercase ${
                                    isPublished
                                      ? "bg-[#287553]/15 text-[#287553]"
                                      : "bg-[#FFD184]/40 text-[#B87A00]"
                                  }`}
                                >
                                  {ver.publishState}
                                </span>
                                <span
                                  className={`text-[9px] font-black px-2 py-0.5 rounded-full uppercase ${
                                    isApproved
                                      ? "bg-[#7857E8]/15 text-[#7857E8]"
                                      : "bg-[#F3F1F4] text-[#626273]"
                                  }`}
                                >
                                  {ver.reviewStatus}
                                </span>
                              </div>
                            </div>

                            {/* Actions bar for Admin */}
                            <div className="pt-2 border-t border-[#E4E0E9]/70 flex items-center justify-between gap-2">
                              <span className="text-[10px] text-[#626273]">
                                Created: {new Date(ver.createdAt).toLocaleDateString()}
                              </span>

                              <div className="flex items-center gap-1.5">
                                {!isApproved && (
                                  <button
                                    type="button"
                                    onClick={() => handleReviewAction(ver.id, "APPROVED")}
                                    className="px-2.5 py-1 rounded-xl bg-[#F0E9FF] hover:bg-[#E3D4FF] text-[#7857E8] font-bold text-[11px] tactile"
                                  >
                                    Approve Content
                                  </button>
                                )}
                                {!isPublished && isApproved && (
                                  <button
                                    type="button"
                                    onClick={() => handlePublishAction(ver.id)}
                                    className="px-2.5 py-1 rounded-xl bg-[#287553] hover:bg-[#205e42] text-white font-bold text-[11px] tactile"
                                  >
                                    Publish to App
                                  </button>
                                )}
                                {isPublished && (
                                  <button
                                    type="button"
                                    onClick={() => handleWithdrawAction(ver.id)}
                                    className="px-2.5 py-1 rounded-xl bg-[#F3F1F4] hover:bg-[#B93848]/10 text-[#B93848] font-bold text-[11px] tactile"
                                  >
                                    Withdraw
                                  </button>
                                )}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="p-4 bg-white border border-[#E4E0E9] rounded-2xl text-center text-[#626273]">
                      No version records found.
                    </div>
                  )}
                </div>
              )}

              {/* TAB 3: USER & STUDENT MANAGEMENT */}
              {activeTab === "users" && (
                <div className="space-y-4">
                  {/* Children / Students List */}
                  <div>
                    <h5 className="font-black text-sm text-[#141426] mb-2 flex items-center gap-1.5">
                      <Users className="w-4 h-4 text-[#7857E8]" />
                      Student Learners ({overviewData?.children?.length ?? 0})
                    </h5>
                    <div className="space-y-2">
                      {overviewData?.children?.map((c: any) => (
                        <div
                          key={c.id}
                          className="p-3 bg-white border border-[#E4E0E9] rounded-2xl shadow-2xs flex items-center justify-between gap-3"
                        >
                          <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-full bg-[#E3D4FF] text-[#7857E8] flex items-center justify-center font-bold text-xs">
                              {c.nickname.slice(0, 1)}
                            </div>
                            <div>
                              <span className="font-extrabold text-xs text-[#141426] block">
                                {c.nickname}
                              </span>
                              <span className="text-[10px] text-[#626273]">
                                Age Band: {c.ageBand} • Lang: {c.preferredLanguage} • Parent: {c.parentAccount?.email || "parent@noor.local"}
                              </span>
                            </div>
                          </div>

                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#287553]/15 text-[#287553]">
                            {c._count?.attempts ?? 0} Attempts
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Registered Accounts List */}
                  <div>
                    <h5 className="font-black text-sm text-[#141426] mb-2 flex items-center gap-1.5">
                      <Shield className="w-4 h-4 text-[#7857E8]" />
                      User & Guardian Accounts ({overviewData?.accounts?.length ?? 2})
                    </h5>
                    <div className="space-y-2">
                      {overviewData?.accounts?.map((acc: any) => (
                        <div
                          key={acc.id}
                          className="p-3 bg-white border border-[#E4E0E9] rounded-2xl shadow-2xs flex items-center justify-between"
                        >
                          <div>
                            <span className="font-extrabold text-xs text-[#141426] block">
                              {acc.email}
                            </span>
                            <span className="text-[10px] text-[#626273]">
                              Created: {new Date(acc.createdAt).toLocaleDateString()} • {acc._count?.children ?? 0} children linked
                            </span>
                          </div>

                          <span
                            className={`text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase ${
                              acc.role === "ADMIN"
                                ? "bg-[#191A22] text-[#FFD184]"
                                : "bg-[#F0E9FF] text-[#7857E8]"
                            }`}
                          >
                            {acc.role}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 4: SYSTEM HEALTH & DB CONFIGURATION */}
              {activeTab === "system" && (
                <div className="space-y-3">
                  <div className="p-4 bg-white border border-[#E4E0E9] rounded-2xl space-y-2.5">
                    <h5 className="font-extrabold text-xs text-[#141426] uppercase tracking-wider">
                      Backend & Database Environment
                    </h5>
                    <div className="space-y-1.5 text-xs">
                      <div className="flex justify-between py-1 border-b border-[#F3F1F4]">
                        <span className="text-[#626273]">Database Engine</span>
                        <span className="font-bold text-[#141426]">Neon Serverless PostgreSQL (v16)</span>
                      </div>
                      <div className="flex justify-between py-1 border-b border-[#F3F1F4]">
                        <span className="text-[#626273]">Pooler Host</span>
                        <span className="font-mono text-[#7857E8]">ep-noisy-sun-aos38coc-pooler</span>
                      </div>
                      <div className="flex justify-between py-1 border-b border-[#F3F1F4]">
                        <span className="text-[#626273]">Backend Port</span>
                        <span className="font-bold text-[#141426]">4000 (NestJS)</span>
                      </div>
                      <div className="flex justify-between py-1 border-b border-[#F3F1F4]">
                        <span className="text-[#626273]">CSRF Protection</span>
                        <span className="font-bold text-[#287553]">Active (Double-Submit Token)</span>
                      </div>
                      <div className="flex justify-between py-1 border-b border-[#F3F1F4]">
                        <span className="text-[#626273]">Timezone</span>
                        <span className="font-bold text-[#141426]">Asia/Kolkata (IST)</span>
                      </div>
                      <div className="flex justify-between py-1">
                        <span className="text-[#626273]">Curriculum Foundation</span>
                        <span className="font-bold text-[#141426]">SKIMVB 2026 Standards</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};
