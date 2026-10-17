import React, { useState, useRef } from "react";
import { useNoor } from "@/lib/noor/state";
import { translations } from "@/lib/noor/i18n";
import { akhlaqChapter } from "@/content/worlds-data";
import { uploadProfileImageToCloudinary } from "@/lib/cloudinary";
import { calculateStreak, calculateCompletedMissions } from "@/lib/noor/stats";
import {
  User,
  Star,
  Flame,
  Award,
  Sparkles,
  BookOpen,
  LogOut,
  Shield,
  Volume2,
  VolumeX,
  Languages,
  Check,
  ChevronRight,
  Camera,
  UploadCloud,
  Loader2,
  Trash2,
  Lock,
  Mail,
} from "lucide-react";
import { getActiveStudentEmail } from "@/lib/noor/session";
import { Illustration } from "@/components/common/Illustration";

interface ProfileScreenProps {
  onSwitchStudent: () => void;
}

export const ProfileScreen: React.FC<ProfileScreenProps> = ({
  onSwitchStudent,
}) => {
  const {
    lang,
    setLanguage,
    activeProfile,
    activeProgress,
    effectiveNow,
    getTotalXp,
    updateProfileImage,
  } = useNoor();
  const t = translations[lang];

  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadSuccess, setUploadSuccess] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Compute real-time profile statistics
  const starsCount = getTotalXp();
  const streakDays = calculateStreak(activeProgress?.sessions || [], effectiveNow);
  const { totalCompleted, akhlaqCompleted, tajweedCompleted } = calculateCompletedMissions(
    activeProgress,
    activeProfile?.id
  );
  const unlockedBadgesCount = activeProgress?.badges?.length || 0;

  const studentEmail =
    activeProfile?.email ||
    getActiveStudentEmail() ||
    `${(activeProfile?.nickname || "student").toLowerCase().replace(/\s+/g, "")}@student.noorjourney.com`;

  const handleImageFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setUploadError(null);
    setUploadSuccess(null);

    try {
      const res = await uploadProfileImageToCloudinary(file);
      updateProfileImage(res.secureUrl);
      setUploadSuccess(
        lang === "ml"
          ? "പ്രൊഫൈൽ ചിത്രം വിജയകരമായി അപ്‌ലോഡ് ചെയ്തു!"
          : "Profile photo uploaded successfully to Cloudinary!"
      );
      setTimeout(() => setUploadSuccess(null), 4000);
    } catch (err: any) {
      console.error(err);
      setUploadError(err.message || "Failed to upload image. Please try again.");
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleRemovePhoto = () => {
    updateProfileImage(null);
    setUploadSuccess(
      lang === "ml"
        ? "പ്രൊഫൈൽ ചിത്രം നീക്കം ചെയ്തു."
        : "Profile photo removed."
    );
    setTimeout(() => setUploadSuccess(null), 3000);
  };

  return (
    <div className="flex flex-col w-full space-y-5 animate-pop pb-6">
      {/* Hidden File Input for Cloudinary Upload */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleImageFileChange}
        accept="image/png,image/jpeg,image/webp,image/gif"
        className="hidden"
        aria-label="Upload profile image"
      />

      {/* Upload Feedback Toasts */}
      {uploadError && (
        <div className="bg-[#FFE5E8] border border-[#FFCCD3] text-[#B93848] text-xs font-bold px-4 py-2.5 rounded-2xl flex items-center justify-between shadow-2xs animate-fade-in">
          <span>{uploadError}</span>
          <button
            type="button"
            onClick={() => setUploadError(null)}
            className="text-xs hover:underline ml-2"
          >
            ✕
          </button>
        </div>
      )}

      {uploadSuccess && (
        <div className="bg-[#EAF8E8] border border-[#C5EEC2] text-[#20721E] text-xs font-bold px-4 py-2.5 rounded-2xl flex items-center justify-between shadow-2xs animate-fade-in">
          <span>{uploadSuccess}</span>
          <button
            type="button"
            onClick={() => setUploadSuccess(null)}
            className="text-xs hover:underline ml-2"
          >
            ✕
          </button>
        </div>
      )}

      {/* 1. Header Card: Student Avatar & Quick Details */}
      <div className="bg-[#BEDAFF] rounded-[30px] p-5 shadow-2xs relative overflow-hidden flex flex-col sm:flex-row items-center gap-4">
        {/* Soft Decorative Glow */}
        <div className="absolute -top-10 -right-10 w-36 h-36 bg-white/30 rounded-full blur-2xl pointer-events-none" />

        {/* Avatar Display with Cloudinary Upload Option */}
        <div className="relative shrink-0 group">
          <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-white border-4 border-[#7857E8]/30 flex items-center justify-center text-4xl shadow-sm overflow-hidden relative">
            {activeProfile?.avatarUrl ? (
              <img
                src={activeProfile.avatarUrl}
                alt={activeProfile.nickname}
                className="w-full h-full object-cover"
              />
            ) : (
              <Illustration
                role="avatar-amina"
                className="w-full h-full object-cover"
                alt="Student profile"
              />
            )}

            {/* Uploading Overlay */}
            {isUploading && (
              <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center text-white text-[10px] font-bold gap-1">
                <Loader2 className="w-6 h-6 animate-spin text-[#FFD184]" />
                <span>{lang === "ml" ? "അപ്‌ലോഡ്..." : "Uploading..."}</span>
              </div>
            )}
          </div>

          {/* Quick Action Badges */}
          <div className="absolute -bottom-1 -right-1 flex items-center">
            {/* Upload Image Button */}
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
              className="bg-[#191A22] text-[#FFD184] hover:bg-[#7857E8] hover:text-white p-2 rounded-full shadow-sm hover:scale-110 tactile transition-all"
              title={lang === "ml" ? "ഫോട്ടോ മാറ്റുക (ക്ലൗഡിനറി)" : "Upload Photo (Cloudinary)"}
              aria-label="Upload photo"
            >
              <Camera className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Student Name & Info */}
        <div className="flex-1 text-center sm:text-left">
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-1.5 mb-1">
            <span className="text-[10px] font-black uppercase tracking-wider text-[#141426]/70 bg-white/60 px-2.5 py-0.5 rounded-full">
              {lang === "ml" ? "വിദ്യാർത്ഥി പ്രൊഫൈൽ" : "Student Profile"}
            </span>
            <span className="text-[10px] font-black uppercase tracking-wider text-[#7857E8] bg-[#F0E9FF] px-2.5 py-0.5 rounded-full">
              {lang === "ml"
                ? `ക്ലാസ് ${activeProfile?.priorStandard || "4"}`
                : `Class ${activeProfile?.priorStandard || "4"}`}
            </span>
            {activeProfile?.avatarUrl && (
              <span className="text-[10px] font-bold text-[#10B981] bg-white/80 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                <Check className="w-2.5 h-2.5 stroke-[3]" />
                <span>{lang === "ml" ? "ഫോട്ടോ നൽകി" : "Custom Photo"}</span>
              </span>
            )}
          </div>

          <h1
            className="text-2xl sm:text-3xl font-black text-[#141426] leading-tight"
            style={{ fontFamily: "var(--font-display)" }}
          >
            {activeProfile?.nickname || (lang === "ml" ? "അമീന" : "Amina")}
          </h1>

          {/* Student Email Badge */}
          <div className="inline-flex items-center gap-1.5 bg-white/75 backdrop-blur-xs px-2.5 py-0.5 rounded-full text-xs font-bold text-[#141426] mt-1 shadow-2xs">
            <Mail className="w-3.5 h-3.5 text-[#7857E8]" />
            <span className="font-semibold text-[11px] text-[#141426]/90">{studentEmail}</span>
          </div>

          <p className="text-xs text-[#141426]/75 font-medium mt-1">
            {lang === "ml"
              ? `പ്രായം: ${activeProfile?.ageBand === "8-9" ? "9" : activeProfile?.ageBand === "10-11" ? "10" : "12"} വയസ്സ് • വാർഷിക ലക്ഷ്യം: ${activeProfile?.weeklyGoal || 3} ദിനം/ആഴ്ച`
              : `Age: ${activeProfile?.ageBand || "10-11"} years old • Goal: ${activeProfile?.weeklyGoal || 3} days/week`}
          </p>

          {/* Photo Management Actions */}
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mt-2.5">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
              className="text-xs font-bold bg-white/80 hover:bg-white text-[#141426] px-3 py-1.5 rounded-xl shadow-2xs tactile flex items-center gap-1.5 transition-all"
            >
              <UploadCloud className="w-3.5 h-3.5 text-[#7857E8]" />
              <span>{lang === "ml" ? "ഫോട്ടോ അപ്‌ലോഡ്" : "Upload Photo"}</span>
            </button>

            {activeProfile?.avatarUrl && (
              <button
                type="button"
                onClick={handleRemovePhoto}
                className="text-xs font-bold bg-white/60 hover:bg-[#FFE5E8] text-[#B93848] px-2.5 py-1.5 rounded-xl shadow-2xs tactile flex items-center gap-1 transition-all"
                title="Remove custom photo"
              >
                <Trash2 className="w-3 h-3" />
                <span>{lang === "ml" ? "ഫോട്ടോ മാറ്റുക" : "Remove Photo"}</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* 2. Key Stats Showcase (4 Real-time Responsive Tiles) */}
      <div>
        <div className="flex items-center justify-between mb-2 px-1">
          <h2
            className="text-sm font-black text-[#141426]"
            style={{ fontFamily: "var(--font-display)" }}
          >
            {lang === "ml" ? "പഠന പുരോഗതി (തത്സമയം)" : "Real-time Learning Statistics"}
          </h2>
          <span className="text-[11px] font-bold text-[#7857E8] bg-[#F0E9FF] px-2.5 py-0.5 rounded-full">
            {lang === "ml" ? "തത്സമയ വിവരങ്ങൾ" : "Live Synchronized"}
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          {/* Tile 1: Real-time Noor Stars / XP */}
          <div className="bg-white rounded-[22px] p-3.5 border border-[#E4E0E9] flex flex-col items-center text-center shadow-2xs hover:border-[#FFD184] transition-all">
            <div className="w-10 h-10 rounded-full bg-[#FFF0D6] flex items-center justify-center text-[#E59700] mb-1.5 shadow-2xs">
              <Star className="w-5 h-5 fill-current" />
            </div>
            <span className="text-2xl font-black text-[#141426] leading-none">
              {starsCount}
            </span>
            <span className="text-[11px] font-bold text-[#141426] mt-1">
              {lang === "ml" ? "നൂർ നക്ഷത്രങ്ങൾ" : "Noor Stars"}
            </span>
            <span className="text-[10px] text-[#626273] font-medium mt-0.5">
              {starsCount > 0
                ? lang === "ml"
                  ? `${starsCount} XP നേടി`
                  : `${starsCount} XP earned`
                : lang === "ml"
                ? "പഠനം തുടങ്ങൂ"
                : "Start learning"}
            </span>
          </div>

          {/* Tile 2: Real-time Day Streak */}
          <div className="bg-white rounded-[22px] p-3.5 border border-[#E4E0E9] flex flex-col items-center text-center shadow-2xs hover:border-[#FFE5E8] transition-all">
            <div className="w-10 h-10 rounded-full bg-[#FFE5E8] flex items-center justify-center text-[#B93848] mb-1.5 shadow-2xs">
              <Flame className="w-5 h-5 fill-current" />
            </div>
            <span className="text-2xl font-black text-[#141426] leading-none">
              {streakDays}
            </span>
            <span className="text-[11px] font-bold text-[#141426] mt-1">
              {lang === "ml" ? "ദിവസ സ്ട്രീക്ക്" : "Day Streak"}
            </span>
            <span className="text-[10px] text-[#626273] font-medium mt-0.5">
              {streakDays > 0
                ? lang === "ml"
                  ? "തുടർച്ചയായ ദിവസങ്ങൾ"
                  : "consecutive days"
                : lang === "ml"
                ? "ഇന്നത്തെ പഠനം ബാക്കി"
                : "Active today"}
            </span>
          </div>

          {/* Tile 3: Real-time Missions Completed */}
          <div className="bg-white rounded-[22px] p-3.5 border border-[#E4E0E9] flex flex-col items-center text-center shadow-2xs hover:border-[#BEDAFF] transition-all">
            <div className="w-10 h-10 rounded-full bg-[#EBF3FF] flex items-center justify-center text-[#2D60EC] mb-1.5 shadow-2xs">
              <BookOpen className="w-5 h-5" />
            </div>
            <span className="text-2xl font-black text-[#141426] leading-none">
              {totalCompleted}
            </span>
            <span className="text-[11px] font-bold text-[#141426] mt-1">
              {lang === "ml" ? "പൂർത്തിയായ മിഷനുകൾ" : "Completed Missions"}
            </span>
            <span className="text-[10px] text-[#626273] font-medium mt-0.5">
              {totalCompleted > 0
                ? lang === "ml"
                  ? `${akhlaqCompleted} അഖ്ലാഖ് • ${tajweedCompleted} തജ്‌വീദ്`
                  : `${akhlaqCompleted} lessons • ${tajweedCompleted} tajweed`
                : lang === "ml"
                ? "0 മിഷനുകൾ"
                : "No missions yet"}
            </span>
          </div>

          {/* Tile 4: Real-time Badges Earned */}
          <div className="bg-white rounded-[22px] p-3.5 border border-[#E4E0E9] flex flex-col items-center text-center shadow-2xs hover:border-[#E3D4FF] transition-all">
            <div className="w-10 h-10 rounded-full bg-[#F0E9FF] flex items-center justify-center text-[#7857E8] mb-1.5 shadow-2xs">
              <Award className="w-5 h-5" />
            </div>
            <span className="text-2xl font-black text-[#141426] leading-none">
              {unlockedBadgesCount}
            </span>
            <span className="text-[11px] font-bold text-[#141426] mt-1">
              {lang === "ml" ? "ബാഡ്ജുകൾ" : "Milestone Badges"}
            </span>
            <span className="text-[10px] text-[#626273] font-medium mt-0.5">
              {unlockedBadgesCount > 0
                ? lang === "ml"
                  ? "നേടിയ നേട്ടങ്ങൾ"
                  : "Earned honors"
                : lang === "ml"
                ? "അധ്യായം 1 പൂർത്തിയാക്കൂ"
                : "Finish Ch 1 to earn"}
            </span>
          </div>
        </div>
      </div>

      {/* 3. Settings & Preferences */}
      <div className="bg-white rounded-[26px] p-4 sm:p-5 border border-[#E4E0E9] shadow-2xs space-y-4">
        <h2
          className="text-sm font-black text-[#141426]"
          style={{ fontFamily: "var(--font-display)" }}
        >
          {lang === "ml" ? "ക്രമീകരണങ്ങൾ" : "Settings & Language"}
        </h2>

        {/* Language Selection */}
        <div className="flex items-center justify-between pb-3 border-b border-[#F3F1F4]">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-[#F0E9FF] flex items-center justify-center text-[#7857E8]">
              <Languages className="w-4 h-4" />
            </div>
            <div>
              <span className="text-xs font-black text-[#141426] block">
                {lang === "ml" ? "ഭാഷ" : "Language"}
              </span>
              <span className="text-[11px] text-[#626273]">
                {lang === "ml" ? "മലയാളം തിരഞ്ഞെടുത്തിരിക്കുന്നു" : "English is active"}
              </span>
            </div>
          </div>

          <div className="flex bg-[#F3F1F4] p-1 rounded-2xl">
            <button
              type="button"
              onClick={() => setLanguage("ml")}
              className={`px-3 py-1 rounded-xl text-xs font-black transition-all ${
                lang === "ml"
                  ? "bg-[#191A22] text-white shadow-2xs"
                  : "text-[#626273] hover:text-[#141426]"
              }`}
            >
              മലയാളം
            </button>
            <button
              type="button"
              onClick={() => setLanguage("en")}
              className={`px-3 py-1 rounded-xl text-xs font-black transition-all ${
                lang === "en"
                  ? "bg-[#191A22] text-white shadow-2xs"
                  : "text-[#626273] hover:text-[#141426]"
              }`}
            >
              English
            </button>
          </div>
        </div>

        {/* Logout */}
        <div className="flex items-center justify-between pt-1">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-[#FFE5E8] flex items-center justify-center text-[#B93848]">
              <LogOut className="w-4 h-4" />
            </div>
            <div>
              <span className="text-xs font-black text-[#141426] block">
                {lang === "ml" ? "ലോഗൗട്ട്" : "Logout"}
              </span>
              <span className="text-[11px] text-[#626273]">
                {lang === "ml" ? "അക്കൗണ്ടിൽ നിന്ന് പുറത്തുകടക്കുക" : "Sign out of your account"}
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={onSwitchStudent}
            className="px-3.5 py-2 rounded-2xl bg-[#FFE5E8] hover:bg-[#FCDADF] text-[#B93848] font-bold text-xs tactile transition-all"
          >
            {lang === "ml" ? "ലോഗൗട്ട്" : "Logout"}
          </button>
        </div>
      </div>
    </div>
  );
};
