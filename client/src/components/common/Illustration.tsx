import React from "react";

export type IllustrationRole =
  | "login"
  | "mission-reading"
  | "journey"
  | "practice"
  | "collection"
  | "celebration"
  | "avatar-amina";

interface IllustrationProps {
  role: IllustrationRole;
  className?: string;
  alt?: string;
  isDecorative?: boolean;
}

const illustrationMap: Record<IllustrationRole, { src: string; defaultAlt: string }> = {
  login: {
    src: "/assets/illustrations/login-lantern-book.jpg",
    defaultAlt: "Noor the golden lantern floating above an open lavender book",
  },
  "mission-reading": {
    src: "/assets/illustrations/mission-reading-lantern.jpg",
    defaultAlt: "Noor the golden lantern reading an open lavender book",
  },
  journey: {
    src: "/assets/illustrations/journey-path-mountain.jpg",
    defaultAlt: "A winding miniature path leading to a hilltop with a purple flag",
  },
  practice: {
    src: "/assets/illustrations/practice-pencil-curve.jpg",
    defaultAlt: "A bright yellow pencil drawing a smooth curved path",
  },
  collection: {
    src: "/assets/illustrations/collection-badge-star.jpg",
    defaultAlt: "A golden honor star badge with lavender ribbons",
  },
  celebration: {
    src: "/assets/illustrations/celebrating-lantern.jpg",
    defaultAlt: "Noor the lantern celebrating mission accomplishment",
  },
  "avatar-amina": {
    src: "/assets/illustrations/amina-avatar.jpg",
    defaultAlt: "Amina, a friendly young girl avatar in a soft lavender hijab",
  },
};

export const Illustration: React.FC<IllustrationProps> = ({
  role,
  className = "",
  alt,
  isDecorative = false,
}) => {
  const item = illustrationMap[role];
  if (!item) return null;

  return (
    <img
      src={item.src}
      alt={isDecorative ? "" : alt || item.defaultAlt}
      loading="lazy"
      className={`object-contain select-none pointer-events-none ${className}`}
      onError={(e) => {
        // Fallback to avoid broken image display
        const target = e.currentTarget;
        target.style.opacity = "0";
      }}
    />
  );
};
