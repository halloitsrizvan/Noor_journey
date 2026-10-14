import React, { useState } from "react";
import type { AgeBand, PriorStandard } from "@/lib/noor/types";
import { useNoor } from "@/lib/noor/state";
import { translations } from "@/lib/noor/i18n";
import { avatarOptions } from "@/content/worlds-data";
import { LanternMascot } from "../mascot/LanternMascot";
import { Check, Sparkles, X } from "lucide-react";

interface OnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const OnboardingModal: React.FC<OnboardingModalProps> = ({ isOpen, onClose }) => {
  const { lang, createProfile } = useNoor();
  const t = translations[lang];

  const [step, setStep] = useState<1 | 2>(1);
  const [nickname, setNickname] = useState("");
  const [ageBand, setAgeBand] = useState<AgeBand>("10-11");
  const [priorStandard, setPriorStandard] = useState<PriorStandard>("3");
  const [avatarId, setAvatarId] = useState(avatarOptions[0].id);
  const [weeklyGoal, setWeeklyGoal] = useState<2 | 3 | 5>(3);

  if (!isOpen) return null;

  const handleFinish = () => {
    createProfile({
      nickname: nickname.trim() || (lang === "ml" ? "കുട്ടി" : "Learner"),
      ageBand,
      priorStandard,
      avatarId,
      weeklyGoal,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/65 backdrop-blur-xs animate-pop">
      <div className="w-full max-w-sm max-h-[90vh] bg-card border-2 border-border rounded-3xl p-5 shadow-2xl flex flex-col relative overflow-hidden">
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-muted flex items-center justify-center text-muted-foreground hover:text-foreground tactile"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Step 1: Child Identity & Madrasa Standard */}
        {step === 1 && (
          <div className="space-y-4">
            <div className="text-center pt-2">
              <LanternMascot mood="happy" size="md" className="mx-auto mb-2" />
              <h3 className="text-base font-black text-foreground">
                {t.welcomeTitle}
              </h3>
              <p className="text-xs text-muted-foreground mt-0.5">
                {t.welcomeSubtitle}
              </p>
            </div>

            {/* Child Nickname */}
            <div>
              <label className="text-xs font-bold text-foreground block mb-1">
                {t.enterChildName}
              </label>
              <input
                type="text"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                placeholder={lang === "ml" ? "ഉദാ: സയാൻ" : "e.g. Zayan"}
                className="w-full px-3.5 py-2.5 rounded-2xl border-2 border-input bg-background font-bold text-sm focus:border-primary focus:outline-hidden"
              />
            </div>

            {/* Age Band */}
            <div>
              <label className="text-xs font-bold text-foreground block mb-1">
                {t.selectAgeBand}
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(["8-9", "10-11", "12-13"] as AgeBand[]).map((band) => (
                  <button
                    key={band}
                    type="button"
                    onClick={() => setAgeBand(band)}
                    className={`py-2 rounded-xl text-xs font-bold border-2 tactile ${
                      ageBand === band
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-border bg-card text-muted-foreground"
                    }`}
                  >
                    {band} {lang === "ml" ? "വയസ്സ്" : "yrs"}
                  </button>
                ))}
              </div>
            </div>

            {/* Madrasa Standard */}
            <div>
              <label className="text-xs font-bold text-foreground block mb-1">
                {t.selectMadrasaStandard}
              </label>
              <div className="grid grid-cols-4 gap-1.5">
                {[
                  { id: "1", label: "Std 1" },
                  { id: "2", label: "Std 2" },
                  { id: "3", label: "Std 3" },
                  { id: "4", label: "Std 4" },
                  { id: "5", label: "Std 5" },
                  { id: "none", label: lang === "ml" ? "ഇല്ല" : "None" },
                  { id: "not-sure", label: lang === "ml" ? "അറിയില്ല" : "Not sure" },
                ].map((std) => (
                  <button
                    key={std.id}
                    type="button"
                    onClick={() => setPriorStandard(std.id as PriorStandard)}
                    className={`py-1.5 px-1 rounded-xl text-xs font-bold border-2 truncate tactile ${
                      priorStandard === std.id
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-border bg-card text-muted-foreground"
                    }`}
                  >
                    {std.label}
                  </button>
                ))}
              </div>
            </div>

            <button
              type="button"
              onClick={() => setStep(2)}
              className="w-full py-3 rounded-2xl bg-primary hover:bg-primary-deep text-white font-extrabold text-sm tactile shadow-md"
            >
              {t.next}
            </button>
          </div>
        )}

        {/* Step 2: Avatar & Weekly Goal */}
        {step === 2 && (
          <div className="space-y-4">
            <div>
              <span className="text-[10px] font-bold text-primary uppercase tracking-wider block mb-1">
                {lang === "ml" ? "ഘട്ടം 2 / 2" : "Step 2 of 2"}
              </span>
              <h3 className="text-base font-black text-foreground">
                {t.selectAvatar}
              </h3>
            </div>

            {/* Avatar Grid */}
            <div className="grid grid-cols-3 gap-2">
              {avatarOptions.map((av) => {
                const isSelected = avatarId === av.id;
                return (
                  <button
                    key={av.id}
                    type="button"
                    onClick={() => setAvatarId(av.id)}
                    className={`p-2.5 rounded-2xl border-2 flex flex-col items-center text-center tactile ${
                      isSelected
                        ? "border-primary bg-primary/10 ring-2 ring-primary/20"
                        : "border-border bg-card"
                    }`}
                  >
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center text-white text-base font-black mb-1 shadow-2xs"
                      style={{ backgroundColor: av.color }}
                    >
                      {av.name[lang].slice(0, 1)}
                    </div>
                    <span className="text-[11px] font-bold text-foreground leading-tight truncate w-full">
                      {av.name[lang]}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Weekly Goal */}
            <div>
              <label className="text-xs font-bold text-foreground block mb-1">
                {t.weeklySessionsGoal}
              </label>
              <div className="grid grid-cols-3 gap-2">
                {([2, 3, 5] as (2 | 3 | 5)[]).map((goal) => (
                  <button
                    key={goal}
                    type="button"
                    onClick={() => setWeeklyGoal(goal)}
                    className={`py-2 rounded-xl text-xs font-bold border-2 tactile ${
                      weeklyGoal === goal
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-border bg-card text-muted-foreground"
                    }`}
                  >
                    {goal} {lang === "ml" ? "ദിവസം" : "days"}
                  </button>
                ))}
              </div>
            </div>

            {/* Demo Notice */}
            <div className="p-2.5 rounded-xl bg-sand/60 text-[10px] text-muted-foreground leading-snug">
              {t.demoModeNotice}
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="py-3 px-4 rounded-2xl border-2 border-border font-bold text-xs text-muted-foreground tactile"
              >
                {t.back}
              </button>
              <button
                type="button"
                onClick={handleFinish}
                className="flex-1 py-3 rounded-2xl bg-primary hover:bg-primary-deep text-white font-extrabold text-sm tactile shadow-md"
              >
                {t.beginAdventure}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
