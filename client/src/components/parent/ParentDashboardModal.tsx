import React, { useState } from "react";
import { useNoor } from "@/lib/noor/state";
import { translations } from "@/lib/noor/i18n";
import { akhlaqMissions, nonPublishedMissions } from "@/content/chapter-akhlaq";
import {
  Shield,
  X,
  Calendar,
  CheckCircle,
  AlertCircle,
  Clock,
  RotateCcw,
  Sparkles,
  FileText,
  Sliders,
  User,
  LogIn,
  LogOut,
  UserPlus,
  Loader2,
} from "lucide-react";

interface ParentDashboardModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenOnboarding: () => void;
  onOpenWelcomeScreen?: () => void;
}

export const ParentDashboardModal: React.FC<ParentDashboardModalProps> = ({
  isOpen,
  onClose,
  onOpenOnboarding,
  onOpenWelcomeScreen,
}) => {
  const {
    lang,
    state,
    activeProfile,
    activeProgress,
    effectiveNow,
    advanceDayOffset,
    setDayOffset,
    toggleSimulateFailure,
    resetDemo,
    setActiveProfileId,
    getWeeklyProgressCount,
    isBackendConnected,
    authAccount,
    login,
    register,
    logout,
  } = useNoor();

  const t = translations[lang];
  const [activeTab, setActiveTab] = useState<"summary" | "reflections" | "demo" | "account">("summary");
  const [authEmail, setAuthEmail] = useState("");
  const [authPassword, setAuthPassword] = useState("");
  const [authMode, setAuthMode] = useState<"login" | "register">("login");
  const [authStatus, setAuthStatus] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!authEmail.trim() || !authPassword.trim()) {
      setAuthStatus(
        lang === "ml"
          ? "ദയവായി ഇമെയിലും പാസ്‌വേഡും നൽകുക"
          : "Please provide both email and password."
      );
      return;
    }
    setIsSubmitting(true);
    setAuthStatus(null);
    try {
      const res =
        authMode === "login"
          ? await login(authEmail.trim(), authPassword)
          : await register(authEmail.trim(), authPassword);
      if (!res.success) {
        setAuthStatus(res.error || (lang === "ml" ? "പരാജയപ്പെട്ടു" : "Authentication failed"));
      } else {
        setAuthStatus(
          lang === "ml"
            ? authMode === "login"
              ? "ലോഗിൻ വിജയകരം!"
              : "രജിസ്ട്രേഷൻ വിജയകരം!"
            : authMode === "login"
            ? "Logged in successfully!"
            : "Registered successfully!"
        );
        setAuthPassword("");
      }
    } catch (err: any) {
      setAuthStatus(err.message || (lang === "ml" ? "തകരാർ സംഭവിച്ചു" : "An error occurred"));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLogout = async () => {
    setIsSubmitting(true);
    try {
      await logout();
      setAuthStatus(null);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  const weeklySessions = getWeeklyProgressCount();
  const completedMissions = akhlaqMissions.filter(
    (m) => activeProgress?.missions[m.id]?.passedAt
  );
  const pendingMissions = akhlaqMissions.filter(
    (m) => !activeProgress?.missions[m.id]?.passedAt
  );

  const formattedDate = new Date(effectiveNow).toLocaleDateString(
    lang === "ml" ? "ml-IN" : "en-US",
    { weekday: "short", day: "numeric", month: "short", year: "numeric" }
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/65 backdrop-blur-xs animate-pop">
      <div className="w-full max-w-md max-h-[90vh] bg-[#FFFCF8] border border-[#E4E0E9] rounded-[28px] p-5 shadow-2xl flex flex-col relative text-[#141426]">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#E4E0E9] mb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-[#E3D4FF] text-[#7857E8] flex items-center justify-center">
              <Shield className="w-4 h-4" />
            </div>
            <div>
              <h3
                className="text-sm font-black text-[#141426]"
                style={{ fontFamily: "var(--font-display)" }}
              >
                {t.parentAreaTitle}
              </h3>
              <div className="flex items-center gap-2">
                <span className="text-[10px] text-[#626273] flex items-center gap-1 font-medium">
                  <Calendar className="w-3 h-3 text-[#7857E8]" />
                  {formattedDate} {state.dayOffset > 0 && `(+${state.dayOffset}d)`}
                </span>
                <span
                  className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${
                    isBackendConnected
                      ? "bg-[#287553]/15 text-[#287553]"
                      : "bg-[#F3F1F4] text-[#626273]"
                  }`}
                >
                  {isBackendConnected ? "● Server API" : "○ Demo Mode"}
                </span>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[#F3F1F4] flex items-center justify-center text-[#626273] hover:text-[#141426] tactile"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Profile Switcher & Add Child */}
        <div className="flex items-center justify-between bg-[#F3F1F4]/70 border border-[#E4E0E9] rounded-[20px] p-2.5 mb-3">
          <div className="flex items-center gap-1.5 overflow-x-auto">
            {state.profiles.map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => setActiveProfileId(p.id)}
                className={`px-3 py-1 rounded-full text-xs font-bold transition-all tactile ${
                  p.id === activeProfile?.id
                    ? "bg-[#191A22] text-white shadow-xs"
                    : "bg-white text-[#626273] border border-[#E4E0E9]"
                }`}
              >
                {p.nickname}
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={() => {
              onClose();
              onOpenOnboarding();
            }}
            className="text-[11px] font-bold text-[#7857E8] hover:underline shrink-0 pl-2"
          >
            + {lang === "ml" ? "കുട്ടിയെ ചേർക്കുക" : "Add child"}
          </button>
        </div>

        {/* Sub-tabs */}
        <div className="grid grid-cols-4 gap-1 bg-[#F3F1F4] p-1 rounded-2xl mb-3 text-xs font-bold text-center">
          <button
            type="button"
            onClick={() => setActiveTab("summary")}
            className={`py-1.5 rounded-xl transition-all ${
              activeTab === "summary"
                ? "bg-[#191A22] text-white shadow-2xs font-extrabold"
                : "text-[#626273] hover:text-[#141426]"
            }`}
          >
            {lang === "ml" ? "പഠനവിവരം" : "Summary"}
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("reflections")}
            className={`py-1.5 rounded-xl transition-all ${
              activeTab === "reflections"
                ? "bg-[#191A22] text-white shadow-2xs font-extrabold"
                : "text-[#626273] hover:text-[#141426]"
            }`}
          >
            {lang === "ml" ? "കുടുംബം" : "Reflections"}
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("account")}
            className={`py-1.5 rounded-xl transition-all ${
              activeTab === "account"
                ? "bg-[#191A22] text-white shadow-2xs font-extrabold"
                : "text-[#626273] hover:text-[#141426]"
            }`}
          >
            {lang === "ml" ? "അക്കൗണ്ട്" : "Account"}
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("demo")}
            className={`py-1.5 rounded-xl transition-all ${
              activeTab === "demo"
                ? "bg-[#191A22] text-white shadow-2xs font-extrabold"
                : "text-[#626273] hover:text-[#141426]"
            }`}
          >
            {t.parentDemoSettings}
          </button>
        </div>

        {/* Tab Content */}
        <div className="flex-1 overflow-y-auto space-y-3 pr-1 text-xs">
          {activeTab === "summary" && (
            <>
              {/* Weekly Goal Progress */}
              <div className="bg-card border border-border/80 rounded-2xl p-3 shadow-2xs">
                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block mb-1">
                  {t.parentWeeklyProgress}
                </span>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-extrabold text-foreground">
                    {weeklySessions} / {activeProfile?.weeklyGoal ?? 3}{" "}
                    {lang === "ml" ? "പഠന സെഷനുകൾ" : "sessions"}
                  </span>
                  <span className="text-[11px] font-bold text-leaf-deep bg-leaf-soft px-2 py-0.5 rounded-full">
                    {lang === "ml" ? "തുടർച്ചയായ പുരോഗതി" : "Active progress"}
                  </span>
                </div>
              </div>

              {/* Mastered Concepts */}
              <div className="bg-card border border-border/80 rounded-2xl p-3 shadow-2xs">
                <span className="text-[10px] font-bold text-primary-deep uppercase tracking-wider block mb-2">
                  {t.parentCompletedConcepts} ({completedMissions.length})
                </span>
                {completedMissions.length === 0 ? (
                  <p className="text-muted-foreground italic">
                    {lang === "ml"
                      ? "ഇതുവരെ മിഷനുകൾ പൂർത്തിയാക്കിയിട്ടില്ല. കുട്ടി ആദ്യ മിഷൻ ആരംഭിക്കട്ടെ!"
                      : "No missions completed yet. Let the child begin their first mission!"}
                  </p>
                ) : (
                  <ul className="space-y-1.5">
                    {completedMissions.map((m) => (
                      <li key={m.id} className="flex items-center gap-2 text-foreground font-medium">
                        <CheckCircle className="w-3.5 h-3.5 text-leaf shrink-0" />
                        <span>{m.title[lang]}</span>
                        <span className="text-[10px] text-muted-foreground ml-auto">
                          {m.concept[lang]}
                        </span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              {/* Concepts Needing Practice / Pending */}
              <div className="bg-card border border-border/80 rounded-2xl p-3 shadow-2xs">
                <span className="text-[10px] font-bold text-coral-deep uppercase tracking-wider block mb-2">
                  {t.parentRevisionNeeds} ({pendingMissions.length})
                </span>
                <ul className="space-y-1.5">
                  {pendingMissions.map((m) => (
                    <li key={m.id} className="flex items-center gap-2 text-muted-foreground">
                      <Clock className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                      <span>{m.title[lang]}</span>
                      <span className="text-[10px] ml-auto">#{m.order}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </>
          )}

          {activeTab === "reflections" && (
            <div className="space-y-2">
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block mb-1">
                {t.parentFamilyReflections}
              </span>
              {(activeProgress?.reflections?.length ?? 0) === 0 ? (
                <div className="p-4 bg-muted/40 rounded-2xl text-center text-muted-foreground">
                  <FileText className="w-6 h-6 mx-auto mb-1 text-muted-foreground/60" />
                  <p>
                    {lang === "ml"
                      ? "കുടുംബ ചർച്ചാ കുറിപ്പുകൾ ലഭ്യമല്ല. മിഷൻ പൂർത്തിയാക്കുമ്പോൾ കുടുംബത്തോടൊപ്പം ചിന്തിച്ച് കുറിപ്പുകൾ ചേർക്കാം."
                      : "No family discussion notes yet. Complete a mission and record reflections together."}
                  </p>
                </div>
              ) : (
                activeProgress?.reflections?.map((r, i) => (
                  <div key={i} className="p-3 bg-card border border-border/80 rounded-2xl shadow-2xs">
                    <span className="text-[10px] text-primary font-bold block mb-1">
                      {new Date(r.at).toLocaleDateString()}
                    </span>
                    <p className="text-xs text-foreground font-medium leading-relaxed">
                      "{r.note}"
                    </p>
                  </div>
                ))
              )}
            </div>
          )}

          {activeTab === "account" && (
            <div className="space-y-3">
              {/* Server Connection Indicator */}
              <div
                className={`p-3 rounded-2xl border flex items-center justify-between ${
                  isBackendConnected
                    ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-950 dark:text-emerald-100"
                    : "bg-amber-500/10 border-amber-500/30 text-amber-950 dark:text-amber-100"
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <span
                    className={`w-2.5 h-2.5 rounded-full ${
                      isBackendConnected ? "bg-emerald-500 animate-pulse" : "bg-amber-500"
                    }`}
                  />
                  <div>
                    <span className="font-extrabold text-[11px] block">
                      {isBackendConnected
                        ? lang === "ml"
                          ? "നൂർ സെർവറുമായി ബന്ധിപ്പിച്ചു"
                          : "Connected to Noor API (/api/v1)"
                        : lang === "ml"
                          ? "ഓഫ്‌ലൈൻ / ഡെമോ മോഡ്"
                          : "Offline / Demo Fallback Mode"}
                    </span>
                    <span className="text-[10px] text-muted-foreground block">
                      {isBackendConnected
                        ? lang === "ml"
                          ? "വിവരങ്ങൾ സെർവറിലേക്ക് തത്സമയം സമന്വയിപ്പിക്കപ്പെടുന്നു."
                          : "Missions, XP, and reviews sync with backend."
                        : lang === "ml"
                          ? "സെർവർ കണ്ടെത്തിയില്ല. ലോക്കൽ സ്റ്റോറേജിൽ പ്രവർത്തിക്കുന്നു."
                          : "Local storage only. Launch backend to enable cloud sync."}
                    </span>
                  </div>
                </div>
              </div>

              {/* Authenticated Guardian State */}
              {authAccount ? (
                <div className="space-y-3">
                  <div className="p-3.5 bg-card border border-border/80 rounded-2xl shadow-2xs space-y-2">
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold">
                        <User className="w-5 h-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">
                          {lang === "ml" ? "രക്ഷിതാവിന്റെ അക്കൗണ്ട്" : "Guardian Account"}
                        </span>
                        <p className="text-xs font-extrabold text-foreground truncate">
                          {authAccount.email}
                        </p>
                      </div>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-primary/15 text-primary border border-primary/20">
                        {authAccount.role}
                      </span>
                    </div>

                    <div className="pt-2 border-t border-border/60 flex items-center justify-between text-[11px] text-muted-foreground">
                      <span>
                        {lang === "ml"
                          ? `കുട്ടികളുടെ പ്രൊഫൈലുകൾ (${state.profiles.length})`
                          : `Child Profiles (${state.profiles.length})`}
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          onClose();
                          onOpenOnboarding();
                        }}
                        className="text-primary font-bold hover:underline flex items-center gap-1"
                      >
                        <UserPlus className="w-3 h-3" />
                        {lang === "ml" ? "പുതിയ കുട്ടി" : "Add child"}
                      </button>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleLogout}
                    disabled={isSubmitting}
                    className="w-full py-2.5 rounded-xl border border-destructive/40 text-destructive hover:bg-destructive/10 font-bold text-xs tactile flex items-center justify-center gap-1.5 transition-all"
                  >
                    {isSubmitting ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <LogOut className="w-3.5 h-3.5" />
                    )}
                    {lang === "ml" ? "ലോഗ് ഔട്ട് ചെയ്യുക" : "Sign Out"}
                  </button>
                </div>
              ) : (
                /* Unauthenticated Login / Register Form */
                <div className="bg-card border border-border/80 rounded-2xl p-3.5 shadow-2xs space-y-3">
                  <div className="flex rounded-xl bg-muted/60 p-1 text-center font-bold text-xs">
                    <button
                      type="button"
                      onClick={() => {
                        setAuthMode("login");
                        setAuthStatus(null);
                      }}
                      className={`flex-1 py-1 rounded-lg transition-all ${
                        authMode === "login"
                          ? "bg-card text-foreground shadow-2xs"
                          : "text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      {lang === "ml" ? "ലോഗിൻ" : "Log In"}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setAuthMode("register");
                        setAuthStatus(null);
                      }}
                      className={`flex-1 py-1 rounded-lg transition-all ${
                        authMode === "register"
                          ? "bg-card text-foreground shadow-2xs"
                          : "text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      {lang === "ml" ? "രജിസ്റ്റർ" : "Register"}
                    </button>
                  </div>

                  <form onSubmit={handleAuth} className="space-y-2.5">
                    <div>
                      <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block mb-1">
                        {lang === "ml" ? "രക്ഷിതാവിന്റെ ഇമെയിൽ" : "Guardian Email"}
                      </label>
                      <input
                        type="email"
                        required
                        value={authEmail}
                        onChange={(e) => setAuthEmail(e.target.value)}
                        placeholder="parent@example.com"
                        className="w-full px-3 py-2 rounded-xl bg-background border border-border text-foreground text-xs focus:outline-hidden focus:ring-2 focus:ring-primary"
                      />
                    </div>

                    <div>
                      <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block mb-1">
                        {lang === "ml" ? "പാസ്‌വേഡ്" : "Password"}
                      </label>
                      <input
                        type="password"
                        required
                        value={authPassword}
                        onChange={(e) => setAuthPassword(e.target.value)}
                        placeholder="••••••••"
                        minLength={6}
                        className="w-full px-3 py-2 rounded-xl bg-background border border-border text-foreground text-xs focus:outline-hidden focus:ring-2 focus:ring-primary"
                      />
                    </div>

                    {authMode === "register" && (
                      <p className="text-[10px] text-muted-foreground leading-relaxed">
                        {lang === "ml"
                          ? "കുട്ടികളുടെ പഠന പുരോഗതി ക്ലൗഡിൽ സൂക്ഷിക്കാനും രക്ഷിതാവിന്റെ നിയന്ത്രണങ്ങൾക്കുമായി അക്കൗണ്ട് സഹായിക്കും."
                          : "Creates a guardian account to save child progress, manage profiles, and track revision schedules."}
                      </p>
                    )}

                    {authStatus && (
                      <div className="p-2 rounded-xl bg-primary/10 border border-primary/20 text-primary text-[11px] font-medium flex items-center gap-1.5">
                        <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                        <span>{authStatus}</span>
                      </div>
                    )}

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full py-2.5 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-xs tactile flex items-center justify-center gap-1.5 transition-all shadow-xs disabled:opacity-50"
                    >
                      {isSubmitting ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      ) : authMode === "login" ? (
                        <LogIn className="w-3.5 h-3.5" />
                      ) : (
                        <UserPlus className="w-3.5 h-3.5" />
                      )}
                      {authMode === "login"
                        ? lang === "ml"
                          ? "ലോഗിൻ ചെയ്യുക"
                          : "Log In to Account"
                        : lang === "ml"
                          ? "രജിസ്റ്റർ ചെയ്യുക"
                          : "Create Guardian Account"}
                    </button>
                  </form>
                </div>
              )}

              {/* Quick Jump to Full Parent Welcome & Sign-In Screen */}
              {onOpenWelcomeScreen && (
                <div className="pt-2 border-t border-border/70">
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      onOpenWelcomeScreen();
                    }}
                    className="w-full py-2.5 px-4 rounded-xl bg-[#F0E9FF] hover:bg-[#E3D4FF] border border-[#E3D4FF] text-[#7857E8] font-black text-xs tactile flex items-center justify-center gap-2 transition-all shadow-2xs"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-[#7857E8]" />
                    <span>
                      {lang === "ml"
                        ? "രക്ഷിതാവിന്റെ സൈൻ-ഇൻ സ്ക്രീൻ കാണുക (റെഫറൻസ്)"
                        : "View Parent Sign-in Screen (Visual Reference)"}
                    </span>
                  </button>
                </div>
              )}
            </div>
          )}

          {activeTab === "demo" && (
            <div className="space-y-3">
              {/* Spaced Date Simulator */}
              <div className="bg-sand/40 border border-border rounded-2xl p-3">
                <span className="text-[11px] font-extrabold text-foreground block mb-1">
                  {t.parentAdvanceDay} (സ്പേസ്ഡ് റിവിഷൻ ടെസ്റ്റ്)
                </span>
                <p className="text-[11px] text-muted-foreground mb-2.5">
                  {lang === "ml"
                    ? "തീയതി മുന്നോട്ട് മാറ്റി 1, 3, 7 ദിവസങ്ങളിലെ റിവിഷൻ ഷെഡ്യൂളുകൾ ടെസ്റ്റ് ചെയ്യാം."
                    : "Advance simulated time to test 1-day, 3-day, and 7-day spaced review schedules."}
                </p>
                <div className="grid grid-cols-4 gap-1.5">
                  <button
                    type="button"
                    onClick={() => advanceDayOffset(1)}
                    className="py-1.5 px-2 bg-card border border-primary/30 rounded-xl font-bold text-primary tactile"
                  >
                    +1 {lang === "ml" ? "ദി" : "day"}
                  </button>
                  <button
                    type="button"
                    onClick={() => advanceDayOffset(3)}
                    className="py-1.5 px-2 bg-card border border-primary/30 rounded-xl font-bold text-primary tactile"
                  >
                    +3 {lang === "ml" ? "ദി" : "days"}
                  </button>
                  <button
                    type="button"
                    onClick={() => advanceDayOffset(7)}
                    className="py-1.5 px-2 bg-card border border-primary/30 rounded-xl font-bold text-primary tactile"
                  >
                    +7 {lang === "ml" ? "ദി" : "days"}
                  </button>
                  <button
                    type="button"
                    onClick={() => setDayOffset(0)}
                    className="py-1.5 px-2 bg-muted border border-border rounded-xl font-bold text-muted-foreground tactile"
                  >
                    {lang === "ml" ? "ഇന്ന്" : "Today"}
                  </button>
                </div>
              </div>

              {/* Network failure simulator */}
              <div className="bg-card border border-border rounded-2xl p-3 flex items-center justify-between">
                <div>
                  <span className="font-bold text-foreground block">
                    {lang === "ml" ? "നെറ്റ്വർക്ക് തടസ്സം സിമുലേഷൻ" : "Simulate Network Failure"}
                  </span>
                  <span className="text-[10px] text-muted-foreground">
                    {lang === "ml" ? "സേവ് പരാജയം ടെസ്റ്റ് ചെയ്യാൻ" : "Test error state on save"}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={toggleSimulateFailure}
                  className={`px-3 py-1 rounded-full text-xs font-bold tactile ${
                    state.simulateFailure
                      ? "bg-destructive text-white"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  {state.simulateFailure ? "Active" : "Off"}
                </button>
              </div>

              {/* Editorial preview demo */}
              <div className="bg-card border border-border rounded-2xl p-3">
                <span className="font-bold text-foreground block mb-1">
                  {lang === "ml" ? "പബ്ലിഷിംഗ് സ്റ്റാറ്റസ് പ്രിവ്യൂ" : "Editorial Publishing States"}
                </span>
                <p className="text-[10px] text-muted-foreground mb-2">
                  {lang === "ml"
                    ? "PRD പ്രകാരം ഡ്രാഫ്റ്റും ആർക്കൈവ് ചെയ്തതുമായ ഉള്ളടക്കങ്ങൾ കുട്ടികൾക്ക് കാണിക്കില്ല."
                    : "Demonstrates that draft and archived missions are inaccessible to children."}
                </p>
                <div className="space-y-1.5">
                  {nonPublishedMissions.map((nm) => (
                    <div
                      key={nm.id}
                      className="p-2 bg-muted/60 rounded-xl flex items-center justify-between text-[11px]"
                    >
                      <span className="font-medium text-foreground">{nm.title[lang]}</span>
                      <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-800 font-bold text-[9px] uppercase">
                        {nm.publish}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Reset demo data */}
              <button
                type="button"
                onClick={() => {
                  if (confirm(lang === "ml" ? "ഡെമോ വിവരങ്ങൾ റീസെറ്റ് ചെയ്യണോ?" : "Reset all demo data?")) {
                    resetDemo();
                    onClose();
                  }
                }}
                className="w-full py-2.5 rounded-xl border border-destructive/40 text-destructive hover:bg-destructive/10 font-bold text-xs tactile flex items-center justify-center gap-1.5"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                {t.parentResetDemo}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
