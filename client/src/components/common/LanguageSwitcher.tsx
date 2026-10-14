import React from "react";
import { useNoor } from "@/lib/noor/state";
import { Globe, ChevronDown } from "lucide-react";

interface LanguageSwitcherProps {
  className?: string;
}

export const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({ className = "" }) => {
  const { lang, setLang } = useNoor();

  return (
    <button
      type="button"
      onClick={() => setLang(lang === "ml" ? "en" : "ml")}
      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-muted/80 hover:bg-muted text-foreground text-xs font-bold tactile border border-border/60 ${className}`}
      aria-label="Change language"
      title={lang === "ml" ? "Switch to English" : "മലയാളത്തിലേക്ക് മാറ്റുക"}
    >
      <Globe className="w-3.5 h-3.5 text-muted-foreground" />
      <span className="uppercase">{lang === "ml" ? "മല" : "EN"}</span>
      <ChevronDown className="w-3 h-3 text-muted-foreground" />
    </button>
  );
};
