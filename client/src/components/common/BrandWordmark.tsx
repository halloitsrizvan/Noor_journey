import React from "react";

interface BrandWordmarkProps {
  className?: string;
  size?: "sm" | "md" | "lg";
}

export const BrandWordmark: React.FC<BrandWordmarkProps> = ({
  className = "",
  size = "md",
}) => {
  const sizeClasses = {
    sm: "text-xl",
    md: "text-2xl",
    lg: "text-3xl",
  };

  const subSizeClasses = {
    sm: "text-[9px] tracking-[0.25em]",
    md: "text-[10px] tracking-[0.3em]",
    lg: "text-xs tracking-[0.35em]",
  };

  return (
    <div className={`inline-flex flex-col items-start leading-none select-none ${className}`}>
      <span
        className={`font-black text-foreground lowercase ${sizeClasses[size]}`}
        style={{ fontFamily: "var(--font-display)" }}
      >
        noor
      </span>
      <span
        className={`font-extrabold text-foreground uppercase ${subSizeClasses[size]} -mt-1`}
      >
        JOURNEY
      </span>
    </div>
  );
};
