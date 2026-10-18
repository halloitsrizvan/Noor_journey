import React, { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { useNoor } from "@/lib/noor/state";
import { type AgeBand, type PriorStandard } from "@/lib/noor/types";
import { avatarOptions } from "@/content/worlds-data";
import { Illustration } from "@/components/common/Illustration";
import { uploadProfileImageToCloudinary } from "@/lib/cloudinary";
import {
  Sparkles,
  CheckCircle2,
  Camera,
  ArrowRight,
  ArrowLeft,
  Check,
  Upload,
  Trash2,
  Loader2,
} from "lucide-react";

interface StudentDetailsPopupProps {
  isOpen: boolean;
  onClose: () => void;
}

const CLASS_OPTIONS: { id: PriorStandard; label: string; icon: string; ml: string }[] = [
  { id: "none", label: "Pre-Madrasa", icon: "🐣", ml: "പ്രാരംഭം" },
  { id: "1", label: "Class 1", icon: "🌱", ml: "ക്ലാസ് 1" },
  { id: "2", label: "Class 2", icon: "🌿", ml: "ക്ലാസ് 2" },
  { id: "3", label: "Class 3", icon: "⭐", ml: "ക്ലാസ് 3" },
  { id: "4", label: "Class 4", icon: "🚀", ml: "ക്ലാസ് 4" },
  { id: "5", label: "Class 5", icon: "🌙", ml: "ക്ലാസ് 5" },
  { id: "6", label: "Class 6", icon: "💎", ml: "ക്ലാസ് 6" },
  { id: "7", label: "Class 7+", icon: "👑", ml: "ക്ലാസ് 7+" },
];

const AGE_OPTIONS = [5, 6, 7, 8, 9, 10, 11, 12, 13];

// Starter avatars available immediately for children
const STARTER_AVATARS = avatarOptions.slice(0, 6);

export const StudentDetailsPopup: React.FC<StudentDetailsPopupProps> = ({
  isOpen,
  onClose,
}) => {
  const { lang, activeProfile, updateStudentDetails } = useNoor();

  // Multi-step: Step 1 = Class & Age; Step 2 = Avatar & Profile Photo
  const [step, setStep] = useState<1 | 2>(1);

  // Form State
  const [selectedStandard, setSelectedStandard] = useState<PriorStandard>("3");
  const [selectedAge, setSelectedAge] = useState<number>(9);
  const [selectedAvatarId, setSelectedAvatarId] = useState<string>("lantern-noor");
  const [selectedAvatarUrl, setSelectedAvatarUrl] = useState<string | null>(null);

  // Photo Upload State
  const [isUploadingPhoto, setIsUploadingPhoto] = useState<boolean>(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Animation & Close State
  const [isSaved, setIsSaved] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  useEffect(() => {
    if (activeProfile) {
      if (activeProfile.priorStandard && activeProfile.priorStandard !== "not-sure") {
        setSelectedStandard(activeProfile.priorStandard);
      }
      if (activeProfile.ageBand === "8-9") setSelectedAge(9);
      else if (activeProfile.ageBand === "10-11") setSelectedAge(11);
      else if (activeProfile.ageBand === "12-13") setSelectedAge(13);

      if (activeProfile.avatarId) {
        setSelectedAvatarId(activeProfile.avatarId);
      }
      if (activeProfile.avatarUrl) {
        setSelectedAvatarUrl(activeProfile.avatarUrl);
      }
    }
  }, [activeProfile]);

  if (!isOpen && !isClosing) return null;

  // Handle Local + Cloudinary Image File Upload
  const handlePhotoSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadError(null);
    setIsUploadingPhoto(true);

    // 1. Instant local base64 preview so child sees image immediately
    const reader = new FileReader();
    reader.onload = (uploadEvent) => {
      if (uploadEvent.target?.result) {
        setSelectedAvatarUrl(uploadEvent.target.result as string);
      }
    };
    reader.readAsDataURL(file);

    // 2. Upload to Cloudinary for permanent storage
    try {
      const res = await uploadProfileImageToCloudinary(file);
      if (res?.secureUrl) {
        setSelectedAvatarUrl(res.secureUrl);
      }
    } catch {
      // If Cloudinary fails or offline, local base64 preview stays safely in place
    } finally {
      setIsUploadingPhoto(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleRemovePhoto = () => {
    setSelectedAvatarUrl(null);
  };

  const handleSave = () => {
    const ageBand: AgeBand =
      selectedAge <= 9 ? "8-9" : selectedAge <= 11 ? "10-11" : "12-13";

    updateStudentDetails({
      ageBand,
      priorStandard: selectedStandard,
      avatarId: selectedAvatarId,
      avatarUrl: selectedAvatarUrl,
    });

    try {
      sessionStorage.removeItem("noor_show_child_onboarding_popup");
    } catch {}

    setIsSaved(true);
    setTimeout(() => {
      setIsClosing(true);
      setTimeout(() => {
        setIsSaved(false);
        setIsClosing(false);
        setStep(1);
        onClose();
      }, 300);
    }, 700);
  };

  const studentName = activeProfile?.nickname || (lang === "ml" ? "കൂട്ടുകാരൻ" : "Explorer");
  const selectedStandardLabel = CLASS_OPTIONS.find((c) => c.id === selectedStandard)?.label || "Class 3";
  const activeAvatarObj = avatarOptions.find((a) => a.id === selectedAvatarId) || avatarOptions[0];

  if (typeof document === "undefined") return null;

  return createPortal(
    <div
      className={`fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm transition-opacity duration-300 ${
        isClosing ? "opacity-0 pointer-events-none" : "opacity-100"
      }`}
      role="dialog"
      aria-modal="true"
    >
      {/* Sliding Dialog Container */}
      <div
        className={`w-full max-w-md max-h-[92vh] overflow-y-auto bg-white border-2 border-[#E4E0E9] rounded-[36px] shadow-2xl p-5 sm:p-7 text-center relative transition-all duration-500 ease-out custom-scrollbar ${
          isClosing ? "translate-y-24 opacity-0 scale-95" : ""
        }`}
        style={{
          animation: isClosing
            ? undefined
            : "popupFromBottomToCenter 550ms cubic-bezier(0.16, 1, 0.3, 1) forwards",
        }}
      >
        {/* Hidden File Input for Avatar Photo */}
        <input
          type="file"
          ref={fileInputRef}
          onChange={handlePhotoSelect}
          accept="image/png,image/jpeg,image/webp,image/gif"
          className="hidden"
          aria-label="Upload profile image"
        />

        {/* Ambient Top Glow */}
        <div className="absolute -top-16 left-1/2 -translate-x-1/2 w-48 h-48 bg-gradient-to-b from-[#E3D4FF]/60 to-transparent rounded-full blur-2xl pointer-events-none" />

        {isSaved ? (
          /* Celebratory Success State */
          <div className="py-12 space-y-4 animate-pop">
            <div className="w-20 h-20 mx-auto rounded-full bg-[#EAF8E8] text-[#287553] flex items-center justify-center shadow-lg animate-bounce">
              <CheckCircle2 className="w-12 h-12" />
            </div>
            <h2
              className="text-2xl font-black text-[#141426]"
              style={{ fontFamily: "var(--font-display)" }}
            >
              {lang === "ml" ? "അടിപൊളി! തയ്യാറായി 🚀" : "Awesome! You're All Set! 🚀"}
            </h2>
            <p className="text-xs text-[#626273] font-bold">
              {lang === "ml"
                ? "നിങ്ങളുടെ പാഠങ്ങളും അവതാറും സജ്ജമാക്കിയിരിക്കുന്നു..."
                : "Personalizing your Noor journey adventure..."}
            </p>
          </div>
        ) : (
          <div className="space-y-5 relative z-10">
            {/* Step 1 of 2: Class & Age */}
            {step === 1 && (
              <div className="space-y-5 animate-fade-in">
                {/* Header Mascot & Greeting */}
                <div>
                  <div className="inline-flex items-center justify-center w-13 h-13 rounded-3xl bg-gradient-to-tr from-[#7857E8] to-[#9B7DFF] text-white shadow-lg shadow-[#7857E8]/25 mb-2.5 animate-float">
                    <Sparkles className="w-6 h-6" />
                  </div>
                  <div className="flex items-center justify-center gap-1.5 mb-1">
                    <span className="text-[10px] font-black uppercase tracking-wider text-[#7857E8] bg-[#F0E9FF] px-2.5 py-0.5 rounded-full">
                      {lang === "ml" ? "ഘട്ടം 1 / 2" : "Step 1 of 2"}
                    </span>
                  </div>
                  <h2
                    className="text-xl sm:text-2xl font-black text-[#141426]"
                    style={{ fontFamily: "var(--font-display)" }}
                  >
                    {lang === "ml" ? `സ്വാഗതം, ${studentName}! 🎉` : `Welcome, ${studentName}! 🎉`}
                  </h2>
                  <p className="text-xs text-[#626273] font-semibold mt-1">
                    {lang === "ml"
                      ? "മികച്ച പാഠങ്ങൾ നൽകാൻ നിങ്ങളുടെ ക്ലാസും പ്രായവും പറയൂ!"
                      : "Tell us your class & age so we can tailor the fun missions for you!"}
                  </p>
                </div>

                {/* Input 1: Class (Standard) */}
                <div className="text-left space-y-2">
                  <label className="text-xs font-black text-[#141426] flex items-center gap-1.5">
                    <span>🎒</span>
                    <span>{lang === "ml" ? "ഏത് ക്ലാസിലാണ് പഠിക്കുന്നത്?" : "Which Class / Standard are you in?"}</span>
                  </label>

                  {/* 4x2 Visual Button Grid */}
                  <div className="grid grid-cols-4 gap-2">
                    {CLASS_OPTIONS.map((item) => {
                      const isSelected = selectedStandard === item.id;
                      return (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => setSelectedStandard(item.id)}
                          className={`py-2 px-1 rounded-2xl flex flex-col items-center justify-center gap-1 transition-all tactile text-center ${
                            isSelected
                              ? "bg-[#7857E8] text-white shadow-md shadow-[#7857E8]/30 scale-105 border-2 border-[#5C3FD1]"
                              : "bg-[#F4F2F7] text-[#141426] hover:bg-[#EBE7F2] border border-[#E4E0E9]"
                          }`}
                        >
                          <span className="text-lg leading-none">{item.icon}</span>
                          <span className="text-[11px] font-black leading-tight">
                            {lang === "ml" ? item.ml : item.label}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Input 2: Age */}
                <div className="text-left space-y-2">
                  <label className="text-xs font-black text-[#141426] flex items-center gap-1.5">
                    <span>🎂</span>
                    <span>{lang === "ml" ? "എത്ര വയസ്സായി?" : "How old are you?"}</span>
                  </label>

                  {/* Age Badges */}
                  <div className="flex flex-wrap items-center justify-between gap-1.5">
                    {AGE_OPTIONS.map((ageVal) => {
                      const isSelected = selectedAge === ageVal;
                      return (
                        <button
                          key={ageVal}
                          type="button"
                          onClick={() => setSelectedAge(ageVal)}
                          className={`w-9 h-9 sm:w-10 sm:h-10 rounded-2xl font-black text-xs sm:text-sm flex items-center justify-center transition-all tactile ${
                            isSelected
                              ? "bg-[#FFD184] text-[#141426] border-2 border-[#191A22] shadow-sm scale-110"
                              : "bg-[#F4F2F7] text-[#626273] hover:text-[#141426] hover:bg-[#EBE7F2] border border-[#E4E0E9]"
                          }`}
                        >
                          {ageVal}{ageVal === 13 ? "+" : ""}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Next Step Button */}
                <div className="pt-2">
                  <button
                    type="button"
                    onClick={() => setStep(2)}
                    className="w-full h-13 sm:h-14 bg-[#191A22] hover:bg-black text-[#FFD184] hover:text-white rounded-full font-black text-sm sm:text-base flex items-center justify-center gap-2 shadow-lg tactile transition-all"
                  >
                    <span>{lang === "ml" ? "അടുത്തത്: അവതാർ & ഫോട്ടോ →" : "Next: Choose Avatar & Photo →"}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* Step 2 of 2: Avatar & Profile Photo */}
            {step === 2 && (
              <div className="space-y-4 animate-fade-in text-left">
                {/* Header */}
                <div className="text-center">
                  <div className="flex items-center justify-center gap-1.5 mb-1">
                    <span className="text-[10px] font-black uppercase tracking-wider text-[#7857E8] bg-[#F0E9FF] px-2.5 py-0.5 rounded-full">
                      {lang === "ml" ? "ഘട്ടം 2 / 2" : "Step 2 of 2"}
                    </span>
                  </div>
                  <h2
                    className="text-xl sm:text-2xl font-black text-[#141426]"
                    style={{ fontFamily: "var(--font-display)" }}
                  >
                    {lang === "ml" ? "അവതാർ അല്ലെങ്കിൽ ഫോട്ടോ തിരഞ്ഞെടുക്കൂ 🎨" : "Choose Your Avatar or Photo 🎨"}
                  </h2>
                  <p className="text-xs text-[#626273] font-semibold mt-1">
                    {lang === "ml"
                      ? "നിങ്ങളുടെ പ്രൊഫൈലിനായി സുന്ദരമായ ഒരു അവതാറോ സ്വന്തം ഫോട്ടോയോ നൽകാം"
                      : "Pick your companion character or upload your own real photo!"}
                  </p>
                </div>

                {/* Live Avatar Preview Card */}
                <div className="bg-[#F8F7FA] border border-[#E4E0E9] rounded-3xl p-3.5 flex items-center gap-3.5 shadow-2xs">
                  <div className="relative">
                    <div
                      className="w-16 h-16 rounded-full flex items-center justify-center text-white font-black text-2xl shrink-0 shadow-sm overflow-hidden border-2 border-white"
                      style={{ backgroundColor: activeAvatarObj.color }}
                    >
                      {selectedAvatarUrl ? (
                        <img
                          src={selectedAvatarUrl}
                          alt="Custom profile"
                          className="w-full h-full object-cover"
                        />
                      ) : selectedAvatarId === "lantern-noor" ? (
                        <Illustration
                          role="avatar-amina"
                          className="w-full h-full object-cover"
                          alt="Amina"
                        />
                      ) : (
                        <span>{activeAvatarObj.emoji}</span>
                      )}
                    </div>

                    {/* Camera Badge to Upload */}
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-[#191A22] text-[#FFD184] hover:bg-black hover:text-white flex items-center justify-center shadow-md tactile"
                      title="Upload Photo"
                    >
                      <Camera className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="text-sm font-black text-[#141426] truncate">
                        {studentName}
                      </span>
                      <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-[#FFD184] text-[#141426]">
                        {selectedStandardLabel}
                      </span>
                    </div>
                    <span className="text-xs text-[#626273] font-semibold block mt-0.5 truncate">
                      {selectedAvatarUrl
                        ? lang === "ml"
                          ? "സ്വന്തം ഫോട്ടോ സജീവം"
                          : "Custom photo equipped"
                        : activeAvatarObj.name[lang]}
                    </span>
                  </div>

                  {selectedAvatarUrl && (
                    <button
                      type="button"
                      onClick={handleRemovePhoto}
                      className="text-xs text-[#B93848] hover:bg-[#FFE5E8] p-2 rounded-xl transition-all tactile"
                      title="Remove photo"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>

                {/* Upload Photo Button Banner */}
                <div>
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isUploadingPhoto}
                    className="w-full py-2.5 px-3.5 rounded-2xl bg-[#F0E9FF] hover:bg-[#E3D4FF] border border-[#D5C2FF] text-[#5C3FD1] font-black text-xs flex items-center justify-center gap-2 tactile transition-all"
                  >
                    {isUploadingPhoto ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>{lang === "ml" ? "ഫോട്ടോ ലോഡ് ചെയ്യുന്നു..." : "Uploading photo..."}</span>
                      </>
                    ) : (
                      <>
                        <Upload className="w-4 h-4" />
                        <span>{lang === "ml" ? "📷 സ്വന്തം ഫോട്ടോ അപ്‌ലോഡ് ചെയ്യുക" : "📷 Upload Your Profile Photo"}</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Avatar Selection Grid */}
                <div className="space-y-1.5">
                  <label className="text-xs font-black text-[#141426] block">
                    {lang === "ml" ? "അല്ലെങ്കിൽ ഒരു അവതാർ തിരഞ്ഞെടുക്കുക:" : "Or pick a companion avatar:"}
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {STARTER_AVATARS.map((av) => {
                      const isSelected = selectedAvatarId === av.id && !selectedAvatarUrl;
                      return (
                        <button
                          key={av.id}
                          type="button"
                          onClick={() => {
                            setSelectedAvatarId(av.id);
                            setSelectedAvatarUrl(null);
                          }}
                          className={`p-2 rounded-2xl border flex flex-col items-center justify-center gap-1 transition-all tactile ${
                            isSelected
                              ? "bg-[#F0E9FF] border-[#7857E8] ring-2 ring-[#7857E8]/20 shadow-xs scale-102"
                              : "bg-[#F8F7FA] border-[#E4E0E9] hover:border-[#7857E8]/50"
                          }`}
                        >
                          <div
                            className="w-9 h-9 rounded-full flex items-center justify-center text-white text-lg shrink-0 shadow-2xs overflow-hidden"
                            style={{ backgroundColor: av.color }}
                          >
                            {av.id === "lantern-noor" ? (
                              <Illustration
                                role="avatar-amina"
                                className="w-full h-full object-cover"
                                alt="Amina"
                              />
                            ) : (
                              <span>{av.emoji}</span>
                            )}
                          </div>
                          <span className="text-[11px] font-black text-[#141426] truncate w-full text-center">
                            {av.name[lang]}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Navigation Buttons: Back & Complete */}
                <div className="flex items-center gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="h-13 px-4 rounded-full bg-[#F3F1F4] hover:bg-[#E4E0E9] text-[#141426] font-black text-xs flex items-center justify-center gap-1 tactile transition-all"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>{lang === "ml" ? "പിന്നിലേക്ക്" : "Back"}</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleSave}
                    className="flex-1 h-13 bg-[#191A22] hover:bg-black text-[#FFD184] hover:text-white rounded-full font-black text-sm sm:text-base flex items-center justify-center gap-2 shadow-lg tactile transition-all"
                  >
                    <Sparkles className="w-4 h-4 text-[#FFD184]" />
                    <span>{lang === "ml" ? "തുടങ്ങാം! യാത്ര ആരംഭിക്കൂ 🚀" : "Let's Go! Start Adventure 🚀"}</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      <style>{`
        @keyframes popupFromBottomToCenter {
          0% {
            transform: translateY(100vh) scale(0.9);
            opacity: 0;
          }
          70% {
            transform: translateY(-8px) scale(1.02);
            opacity: 1;
          }
          100% {
            transform: translateY(0) scale(1);
            opacity: 1;
          }
        }
      `}</style>
    </div>,
    document.body
  );
};
