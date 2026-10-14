import React, { useState, useId } from "react";
import { useNoor } from "@/lib/noor/state";
import { translations } from "@/lib/noor/i18n";
import { Shield, X } from "lucide-react";

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
      <div className="w-full max-w-sm bg-card border-2 border-border rounded-3xl p-5 shadow-2xl relative">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-muted flex items-center justify-center text-muted-foreground hover:text-foreground tactile"
          aria-label="Close"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-2 mb-2">
          <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center">
            <Shield className="w-4 h-4" />
          </div>
          <h3 className="text-base font-black text-foreground">
            {t.parentGateTitle}
          </h3>
        </div>

        <p className="text-xs text-muted-foreground mb-4 leading-relaxed">
          {t.parentGateDesc}
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="bg-sand/40 border border-border/80 rounded-2xl p-4 text-center">
            <span className="text-lg font-black text-foreground block tracking-wider">
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
              className="w-full text-center text-base font-bold px-4 py-2.5 rounded-2xl border-2 border-input bg-background focus:border-primary focus:outline-hidden"
              autoFocus
            />
            {error && (
              <span className="text-[11px] font-bold text-destructive block text-center mt-1.5">
                {lang === "ml" ? "തെറ്റായ ഉത്തരം, ദയവായി വീണ്ടും ശ്രമിക്കുക" : "Incorrect answer, please try again"}
              </span>
            )}
          </div>

          <div className="text-[10px] text-muted-foreground text-center bg-muted/60 p-2 rounded-xl">
            {lang === "ml"
              ? "ശ്രദ്ധിക്കുക: ഇതൊരു ഡെമോ വെരിഫിക്കേഷനാണ്. പ്രൊഡക്ഷൻ സിസ്റ്റത്തിൽ പാസ്‌വേർഡ് / ഒടിപി ഉപയോഗിക്കും."
              : "Notice: This demo gate demonstrates adult oversight; full authentication is handled on the backend."}
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-2xl bg-primary hover:bg-primary-deep text-white font-extrabold text-sm tactile shadow-md"
          >
            {t.continue}
          </button>
        </form>
      </div>
    </div>
  );
};
