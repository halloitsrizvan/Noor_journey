import React, { useState, useId } from "react";
import { useNoor } from "@/lib/noor/state";
import { translations } from "@/lib/noor/i18n";
import { Shield, X, ArrowRight } from "lucide-react";

interface ParentGateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const ParentGateModal: React.FC<ParentGateModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const { lang } = useNoor();
  const t = translations[lang];
  const inputId = useId();

  // Simple math challenge
  const [num1] = useState(() => Math.floor(Math.random() * 8) + 4);
  const [num2] = useState(() => Math.floor(Math.random() * 5) + 3);
  const [userAnswer, setUserAnswer] = useState("");
  const [error, setError] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (parseInt(userAnswer.trim(), 10) === num1 + num2) {
      setError(false);
      setUserAnswer("");
      onClose();
      onSuccess();
    } else {
      setError(true);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-pop">
      <div className="w-full max-w-sm bg-white border border-[#E4E0E9] rounded-[28px] p-6 shadow-2xl relative">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-5 right-5 w-8 h-8 rounded-full bg-[#F3F1F4] flex items-center justify-center text-[#626273] hover:text-[#141426] tactile"
          aria-label="Close"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-2.5 mb-2">
          <div className="w-9 h-9 rounded-full bg-[#E3D4FF] text-[#7857E8] flex items-center justify-center">
            <Shield className="w-5 h-5" />
          </div>
          <h3
            className="text-lg font-black text-[#141426]"
            style={{ fontFamily: "var(--font-display)" }}
          >
            {t.parentGateTitle}
          </h3>
        </div>

        <p className="text-xs text-[#626273] mb-4 leading-relaxed font-medium">
          {t.parentGateDesc}
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="bg-[#F0E9FF] border border-[#E3D4FF] rounded-[20px] p-4 text-center">
            <span
              className="text-2xl font-black text-[#141426] block tracking-wider"
              style={{ fontFamily: "var(--font-display)" }}
            >
              {num1} + {num2} = ?
            </span>
          </div>

          <div>
            <label htmlFor={inputId} className="sr-only">
              {t.parentGateAnswer}
            </label>
            <input
              id={inputId}
              type="number"
              inputMode="numeric"
              value={userAnswer}
              onChange={(e) => {
                setUserAnswer(e.target.value);
                setError(false);
              }}
              placeholder={t.parentGateAnswer}
              className="w-full h-12 text-center text-lg font-bold px-4 rounded-[18px] border border-[#E4E0E9] bg-[#F3F1F4] focus:bg-white focus:border-[#7857E8] outline-none transition-all"
              autoFocus
            />
            {error && (
              <span className="text-[11px] font-bold text-[#B93848] block text-center mt-1.5">
                {lang === "ml"
                  ? "തെറ്റായ ഉത്തരം, ദയവായി വീണ്ടും ശ്രമിക്കുക"
                  : "Incorrect answer, please try again"}
              </span>
            )}
          </div>

          <button
            type="submit"
            className="w-full h-12 bg-[#191A22] hover:bg-black text-white rounded-full font-bold text-sm tactile flex items-center justify-center gap-2 shadow-xs transition-all"
          >
            <span>{lang === "ml" ? "സ്ഥിരീകരിക്കുക" : "Continue"}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
