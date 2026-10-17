import React, { useState } from "react";
import { createPortal } from "react-dom";
import { useNoor } from "@/lib/noor/state";
import { translations } from "@/lib/noor/i18n";
import { akhlaqMissions } from "@/content/chapter-akhlaq";
import {
  Shield,
  X,
  Calendar,
  CheckCircle,
  Clock,
  FileText,
  Sparkles,
} from "lucide-react";

interface ParentDashboardModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenOnboarding: () => void;
  onOpenWelcomeScreen?: () => void;
  onOpenAdminDashboard?: () => void;
}

export const ParentDashboardModal: React.FC<ParentDashboardModalProps> = ({
  isOpen,
  onClose,
  onOpenOnboarding,
  onOpenWelcomeScreen,
  onOpenAdminDashboard,
}) => {
  const {
    lang,
    state,
    activeProfile,
    activeProgress,
    effectiveNow,
    getWeeklyProgressCount,
    isBackendConnected,
  } = useNoor();

  const t = translations[lang];
  const [activeTab, setActiveTab] = useState<"summary" | "reflections">("summary");

  if (!isOpen) return null;
  if (typeof document === "undefined") return null;

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

  return createPortal(
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-4 bg-black/65 backdrop-blur-xs animate-fade-in"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="w-full max-w-md max-h-[90vh] bg-[#FFFCF8] border border-[#E4E0E9] rounded-[28px] p-5 shadow-2xl flex flex-col relative text-[#141426] animate-pop">
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
                  {isBackendConnected ? "● Server API" : "○ Local Mode"}
                </span>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[#F3F1F4] hover:bg-[#E4E0E9] flex items-center justify-center text-[#626273] hover:text-[#141426] tactile transition-all"
            aria-label="Close parent dashboard"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Current Student Profile Only */}
        <div className="mb-3.5 p-3.5 bg-[#F0E9FF] border border-[#E3D4FF] rounded-2xl shadow-2xs">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-full bg-[#7857E8] text-white flex items-center justify-center font-bold text-base shadow-xs">
                {activeProfile?.nickname?.slice(0, 1) || "A"}
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-black text-sm text-[#141426]">
                    {activeProfile?.nickname}
                  </span>
                  <span className="text-[9px] font-black uppercase tracking-wider text-[#7857E8] bg-white px-2 py-0.5 rounded-full border border-[#E3D4FF]">
                    {lang === "ml" ? "നിലവിലെ വിദ്യാർത്ഥി" : "Current Student"}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-[11px] text-[#626273] font-medium mt-0.5">
                  <span>
                    {activeProfile?.priorStandard
                      ? lang === "ml"
                        ? `ക്ലാസ് ${activeProfile.priorStandard}`
                        : `Class ${activeProfile.priorStandard}`
                      : "Class 4"}
                  </span>
                  <span>•</span>
                  <span>
                    {activeProfile?.ageBand ? `Age ${activeProfile.ageBand}` : "Age 10-11"}
                  </span>
                </div>
              </div>
            </div>

            <div className="text-right">
              <div className="text-xs font-black text-[#7857E8]">
                {activeProgress?.xp?.reduce((sum, tx) => sum + tx.amount, 0) || 0} XP
              </div>
              <div className="text-[10px] text-[#626273] font-bold">
                {Object.values(activeProgress?.missions || {}).filter((m) => m.passedAt).length}{" "}
                {lang === "ml" ? "പാസായി" : "passed"}
              </div>
            </div>
          </div>
        </div>

        {/* Sub-tabs: Only Summary & Reflections */}
        <div className="grid grid-cols-2 gap-1.5 bg-[#F3F1F4] p-1 rounded-2xl mb-3 text-xs font-bold text-center">
          <button
            type="button"
            onClick={() => setActiveTab("summary")}
            className={`py-1.5 rounded-xl transition-all tactile ${
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
            className={`py-1.5 rounded-xl transition-all tactile ${
              activeTab === "reflections"
                ? "bg-[#191A22] text-white shadow-2xs font-extrabold"
                : "text-[#626273] hover:text-[#141426]"
            }`}
          >
            {lang === "ml" ? "കുടുംബം" : "Reflections"}
          </button>
        </div>

        {/* Tab Content */}
        <div className="flex-1 overflow-y-auto space-y-3 pr-1 text-xs">
          {activeTab === "summary" && (
            <>
              {/* Weekly Goal Progress */}
              <div className="bg-white border border-[#E4E0E9] rounded-2xl p-3 shadow-2xs">
                <span className="text-[10px] font-bold text-[#626273] uppercase tracking-wider block mb-1">
                  {t.parentWeeklyProgress}
                </span>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-extrabold text-[#141426]">
                    {weeklySessions} / {activeProfile?.weeklyGoal ?? 3}{" "}
                    {lang === "ml" ? "പഠന സെഷനുകൾ" : "sessions"}
                  </span>
                  <span className="text-[11px] font-bold text-[#287553] bg-[#287553]/15 px-2 py-0.5 rounded-full">
                    {lang === "ml" ? "തുടർച്ചയായ പുരോഗതി" : "Active progress"}
                  </span>
                </div>
              </div>

              {/* Mastered Concepts */}
              <div className="bg-white border border-[#E4E0E9] rounded-2xl p-3 shadow-2xs">
                <span className="text-[10px] font-bold text-[#7857E8] uppercase tracking-wider block mb-2">
                  {t.parentCompletedConcepts} ({completedMissions.length})
                </span>
                {completedMissions.length === 0 ? (
                  <p className="text-[#626273] italic">
                    {lang === "ml"
                      ? "ഇതുവരെ മിഷനുകൾ പൂർത്തിയാക്കിയിട്ടില്ല. കുട്ടി ആദ്യ മിഷൻ ആരംഭിക്കട്ടെ!"
                      : "No missions completed yet. Let the child begin their first mission!"}
                  </p>
                ) : (
                  <ul className="space-y-1.5">
                    {completedMissions.map((m) => (
                      <li key={m.id} className="flex items-center gap-2 text-[#141426] font-medium">
                        <CheckCircle className="w-3.5 h-3.5 text-[#287553] shrink-0" />
                        <span>{m.title[lang]}</span>
                        <span className="text-[10px] text-[#626273] ml-auto">
                          {m.concept[lang]}
                        </span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              {/* Concepts Needing Practice / Pending */}
              <div className="bg-white border border-[#E4E0E9] rounded-2xl p-3 shadow-2xs">
                <span className="text-[10px] font-bold text-[#B93848] uppercase tracking-wider block mb-2">
                  {t.parentRevisionNeeds} ({pendingMissions.length})
                </span>
                <ul className="space-y-1.5">
                  {pendingMissions.map((m) => (
                    <li key={m.id} className="flex items-center gap-2 text-[#626273]">
                      <Clock className="w-3.5 h-3.5 text-[#626273] shrink-0" />
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
              <span className="text-[10px] font-bold text-[#626273] uppercase tracking-wider block mb-1">
                {t.parentFamilyReflections}
              </span>
              {(activeProgress?.reflections?.length ?? 0) === 0 ? (
                <div className="p-4 bg-[#F3F1F4]/60 rounded-2xl text-center text-[#626273]">
                  <FileText className="w-6 h-6 mx-auto mb-1 text-[#626273]/60" />
                  <p>
                    {lang === "ml"
                      ? "കുടുംബ ചർച്ചാ കുറിപ്പുകൾ ലഭ്യമല്ല. മിഷൻ പൂർത്തിയാക്കുമ്പോൾ കുടുംബത്തോടൊപ്പം ചിന്തിച്ച് കുറിപ്പുകൾ ചേർക്കാം."
                      : "No family discussion notes yet. Complete a mission and record reflections together."}
                  </p>
                </div>
              ) : (
                activeProgress?.reflections?.map((r, i) => (
                  <div key={i} className="p-3 bg-white border border-[#E4E0E9] rounded-2xl shadow-2xs">
                    <span className="text-[10px] text-[#7857E8] font-bold block mb-1">
                      {new Date(r.at).toLocaleDateString()}
                    </span>
                    <p className="text-xs text-[#141426] font-medium leading-relaxed">
                      "{r.note}"
                    </p>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>,
    document.body
  );
};
