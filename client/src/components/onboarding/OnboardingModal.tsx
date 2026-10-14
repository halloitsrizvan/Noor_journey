import React, { useState } from "react";
import type { AgeBand, PriorStandard } from "@/lib/noor/types";
import { useNoor } from "@/lib/noor/state";
import { translations } from "@/lib/noor/i18n";
import { avatarOptions } from "@/content/worlds-data";
import { Illustration } from "@/components/common/Illustration";
import { Check, X, ArrowRight } from "lucide-react";

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
      nickname: nickname.trim() || (lang === "ml" ? "സയാൻ" : "Amina"),
      ageBand,
      priorStandard,
      avatarId,
      weeklyGoal,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/65 backdrop-blur-xs animate-pop">
      <div className="w-full max-w-sm max-h-[90vh] bg-[#FFFCF8] border border-[#E4E0E9] rounded-[28px] p-5 shadow-2xl flex flex-col relative overflow-hidden text-[#141426]">
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-[#F3F1F4] flex items-center justify-center text-[#626273] hover:text-[#141426] tactile"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Step 1: Child Identity & Madrasa Standard */}
        {step === 1 && (
          <div className="space-y-4">
            <div className="text-center pt-2">
              <div className="w-20 h-20 mx-auto mb-1 pointer-events-none">
                <Illustration
                  role="mission-reading"
                  className="w-full h-full object-contain"
                  alt="Noor welcoming child"
                />
              </div>
              <h3
                className="text-lg font-black text-[#141426]"
                style={{ fontFamily: "var(--font-display)" }}
              >
                {t.welcomeTitle}
              </h3>
              <p className="text-xs text-[#626273] mt-0.5 leading-relaxed">
                {t.welcomeSubtitle}
              </p>
            </div>

            {/* Child Nickname */}
            <div>
              <label className="text-xs font-bold text-[#141426] block mb-1">
                {t.enterChildName}
              </label>
              <input
                type="text"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                placeholder={lang === "ml" ? "ഉദാ: സയാൻ" : "e.g. Amina"}
                className="w-full px-3.5 py-2.5 rounded-[18px] border border-[#E4E0E9] bg-[#F3F1F4] font-bold text-sm focus:bg-white focus:border-[#7857E8] outline-none transition-all"
              />
            </div>

            {/* Age Band */}
            <div>
              <label className="text-xs font-bold text-[#141426] block mb-1">
                {t.selectAgeBand}
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(["8-9", "10-11", "12-13"] as AgeBand[]).map((band) => (
                  <button
                    key={band}
                    type="button"
                    onClick={() => setAgeBand(band)}
                    className={`py-2 rounded-xl text-xs font-bold border tactile transition-all ${
                      ageBand === band
                        ? "border-[#7857E8] bg-[#F0E9FF] text-[#7857E8]"
                        : "border-[#E4E0E9] bg-white text-[#626273]"
                    }`}
                  >
                    {band} {lang === "ml" ? "വയസ്സ്" : "yrs"}
                  </button>
                ))}
              </div>
            </div>

            {/* Madrasa Standard */}
            <div>
              <label className="text-xs font-bold text-[#141426] block mb-1">
                {t.selectMadrasaStandard}
              </label>
              <div className="grid grid-cols-4 gap-1.5">
                {(["none", "1", "2", "3", "4", "5"] as PriorStandard[]).map((std) => (
                  <button
                    key={std}
                    type="button"
                    onClick={() => setPriorStandard(std)}
                    className={`py-1.5 rounded-xl text-xs font-bold border tactile transition-all ${
                      priorStandard === std
                        ? "border-[#7857E8] bg-[#F0E9FF] text-[#7857E8]"
                        : "border-[#E4E0E9] bg-white text-[#626273]"
                    }`}
                  >
                    {std === "none"
                      ? lang === "ml"
                        ? "തുടക്കം"
                        : "None"
                      : `${std} ${lang === "ml" ? "ക്ലാസ്" : "Std"}`}
                  </button>
                ))}
              </div>
            </div>

            {/* Next Button */}
            <button
              type="button"
              onClick={() => setStep(2)}
              className="w-full h-12 bg-[#191A22] hover:bg-black text-white rounded-full font-bold text-sm tactile flex items-center justify-center gap-2 shadow-xs transition-all mt-2"
            >
              <span>{t.next}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Step 2: Avatar & Weekly Sessions Goal */}
        {step === 2 && (
          <div className="space-y-4">
            <div className="text-center pt-2">
              <h3
                className="text-lg font-black text-[#141426]"
                style={{ fontFamily: "var(--font-display)" }}
              >
                {t.selectAvatar}
              </h3>
              <p className="text-xs text-[#626273] mt-0.5">
                {lang === "ml"
                  ? "പഠനയാത്രയിൽ ഒപ്പം കൂടാൻ ഒരു സുഹൃത്തിനെ തിരഞ്ഞെടുക്കൂ"
                  : "Choose a friendly companion avatar for your journey"}
              </p>
            </div>

            {/* Avatar Selection */}
            <div className="grid grid-cols-2 gap-2">
              {avatarOptions.map((av) => (
                <button
                  key={av.id}
                  type="button"
                  onClick={() => setAvatarId(av.id)}
                  className={`p-2.5 rounded-[20px] border flex items-center gap-2 text-left tactile transition-all ${
                    avatarId === av.id
                      ? "border-[#7857E8] bg-[#F0E9FF] shadow-xs"
                      : "border-[#E4E0E9] bg-white hover:border-[#7857E8]/40"
                  }`}
                >
                  <div
                    className="w-9 h-9 rounded-full flex items-center justify-center text-white font-black text-xs shrink-0 overflow-hidden"
                    style={{ backgroundColor: av.color }}
                  >
                    {av.id === "lantern-noor" ? (
                      <Illustration
                        role="avatar-amina"
                        className="w-full h-full object-cover"
                        alt="Amina avatar"
                      />
                    ) : (
                      av.name[lang].slice(0, 1)
                    )}
                  </div>
                  <span className="text-xs font-bold text-[#141426] truncate">
                    {av.name[lang]}
                  </span>
                </button>
              ))}
            </div>

            {/* Weekly Goal */}
            <div>
              <label className="text-xs font-bold text-[#141426] block mb-1">
                {t.weeklySessionsGoal}
              </label>
              <div className="grid grid-cols-3 gap-2">
                {([2, 3, 5] as const).map((count) => (
                  <button
                    key={count}
                    type="button"
                    onClick={() => setWeeklyGoal(count)}
                    className={`py-2 rounded-xl text-xs font-bold border tactile transition-all ${
                      weeklyGoal === count
                        ? "border-[#7857E8] bg-[#F0E9FF] text-[#7857E8]"
                        : "border-[#E4E0E9] bg-white text-[#626273]"
                    }`}
                  >
                    {count} {lang === "ml" ? "സെഷൻ" : "sessions"}
                  </button>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2 pt-2">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="w-1/3 h-12 bg-[#F3F1F4] hover:bg-[#E4E0E9] text-[#141426] rounded-full font-bold text-xs tactile"
              >
                {t.back}
              </button>
              <button
                type="button"
                onClick={handleFinish}
                className="flex-1 h-12 bg-[#191A22] hover:bg-black text-white rounded-full font-bold text-xs tactile flex items-center justify-center gap-1.5 shadow-xs"
              >
                <Check className="w-4 h-4 stroke-[3]" />
                <span>{t.beginAdventure}</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
