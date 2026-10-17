import React, { useState, useEffect, useRef } from "react";
import { Volume2, Play, Pause, RotateCcw, AlertCircle, Sparkles, UserCheck, ChevronDown } from "lucide-react";
import { api } from "@/lib/api/api-client";

interface VerseAudioPlayerProps {
  audioUrl: string | null;
  lang: "ml" | "en";
  verseNumber: number;
}

interface Reciter {
  id: string;
  reciterId: number;
  nameEnglish: string;
  nameArabic: string;
  nameMalayalam: string;
  style: string;
  serverSubfolder: string;
  avatarUrl: string;
}

const DEFAULT_RECITERS: Reciter[] = [
  {
    id: "alafasy",
    reciterId: 7,
    nameEnglish: "Mishary Rashid Alafasy",
    nameArabic: "مشاري راشد العفاسي",
    nameMalayalam: "മിശാരി റാഷിദ് അൽ-അഫാസി",
    style: "Murattal",
    serverSubfolder: "Alafasy_128kbps",
    avatarUrl: "https://images.quran.com/reciters/7/mishari-alafasy.jpg",
  },
  {
    id: "abdul-basit-mujawwad",
    reciterId: 1,
    nameEnglish: "Abdul Basit (Mujawwad)",
    nameArabic: "عبد الباسط عبد الصمد",
    nameMalayalam: "അബ്ദുൽ ബാസിത് അബ്ദുസ്സമദ് (മുജവ്വദ്)",
    style: "Mujawwad",
    serverSubfolder: "Abdul_Basit_Mujawwad_128kbps",
    avatarUrl: "https://images.quran.com/reciters/1/abdul-basit.jpg",
  },
  {
    id: "al-husary",
    reciterId: 5,
    nameEnglish: "Mahmoud Khalil Al-Husary",
    nameArabic: "محمود خليل الحصري",
    nameMalayalam: "മഹ്മൂദ് ഖലീൽ അൽ-ഹുസരി (തജ്‌വീദ് അധ്യാപകൻ)",
    style: "Tajweed Teacher",
    serverSubfolder: "Husary_128kbps",
    avatarUrl: "https://images.quran.com/reciters/5/mahmoud-khalil-al-husary.jpg",
  },
  {
    id: "shatri",
    reciterId: 4,
    nameEnglish: "Abu Bakr Al-Shatri",
    nameArabic: "أبو بكر الشاطري",
    nameMalayalam: "അബൂബക്കർ അൽ-ശാത്വിരി",
    style: "Murattal",
    serverSubfolder: "Abu_Bakr_Ash-Shaatree_128kbps",
    avatarUrl: "https://images.quran.com/reciters/4/abu-bakr-al-shatri.jpg",
  },
];

export const VerseAudioPlayer: React.FC<VerseAudioPlayerProps> = ({
  audioUrl: fallbackAudioUrl,
  lang,
  verseNumber,
}) => {
  const [reciters, setReciters] = useState<Reciter[]>(DEFAULT_RECITERS);
  const [selectedReciterId, setSelectedReciterId] = useState<string>("alafasy");
  const [isPlaying, setIsPlaying] = useState(false);
  const [repeatMode, setRepeatMode] = useState<1 | 3>(1);
  const [playsRemaining, setPlaysRemaining] = useState<number>(0);
  const [showReciterPicker, setShowReciterPicker] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Fetch live Qaris from Quran Foundation backend endpoint
  useEffect(() => {
    let mounted = true;
    api.madrasa.getReciters()
      .then((data) => {
        if (mounted && Array.isArray(data) && data.length > 0) {
          setReciters(data as Reciter[]);
        }
      })
      .catch(() => {});
    return () => {
      mounted = false;
    };
  }, []);

  const activeReciter = reciters.find((r) => r.id === selectedReciterId) || reciters[0] || DEFAULT_RECITERS[0];
  const effectiveAudioUrl = `https://everyayah.com/data/${activeReciter.serverSubfolder}/00100${verseNumber}.mp3`;

  // Stop audio on unmount or URL switch
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, [effectiveAudioUrl]);

  const handleTogglePlay = () => {
    if (!effectiveAudioUrl) return;

    if (isPlaying) {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
      setIsPlaying(false);
      setPlaysRemaining(0);
    } else {
      if (audioRef.current) {
        audioRef.current.pause();
      }
      const audio = new Audio(effectiveAudioUrl);
      audioRef.current = audio;
      setPlaysRemaining(repeatMode - 1);
      audio.currentTime = 0;
      audio
        .play()
        .then(() => setIsPlaying(true))
        .catch(() => setIsPlaying(false));

      audio.onended = () => {
        setPlaysRemaining((prev) => {
          if (prev > 0) {
            setTimeout(() => {
              if (audioRef.current) {
                audioRef.current.currentTime = 0;
                audioRef.current.play();
              }
            }, 600);
            return prev - 1;
          } else {
            setIsPlaying(false);
            return 0;
          }
        });
      };
    }
  };

  const handleSelectReciter = (id: string) => {
    if (audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
      setPlaysRemaining(0);
    }
    setSelectedReciterId(id);
    setShowReciterPicker(false);
  };

  return (
    <div className="w-full bg-[#F0E9FF] border border-[#E3D4FF] rounded-[26px] p-4 flex flex-col gap-3 shadow-2xs animate-pop">
      {/* Top: Play Controls & Qari info */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 w-full">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleTogglePlay}
            className="w-12 h-12 rounded-full bg-[#7857E8] hover:bg-[#6846D4] text-white flex items-center justify-center shadow-md tactile transition-all shrink-0"
            aria-label={isPlaying ? "Pause Recitation" : "Listen to Recitation"}
          >
            {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5" />}
          </button>

          <div className="text-left">
            <span className="text-xs font-black text-[#141426] block">
              {isPlaying
                ? lang === "ml"
                  ? `കേൾക്കുന്നു... (ശേഷിക്കുന്നത്: ${playsRemaining})`
                  : `Playing... (${playsRemaining} repeats left)`
                : lang === "ml"
                ? `ആയത്ത് ${verseNumber} കേൾക്കാം`
                : `Listen to Verse ${verseNumber}`}
            </span>
            <span className="text-[11px] text-[#626273] font-bold block">
              🎙️ {lang === "ml" ? activeReciter.nameMalayalam : activeReciter.nameEnglish}
            </span>
          </div>
        </div>

        {/* Right side: Reciter picker toggle & Repeat Choices */}
        <div className="flex items-center gap-2 self-end sm:self-center">
          {/* Reciter Selector Button */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowReciterPicker(!showReciterPicker)}
              className="px-3 py-1.5 rounded-2xl bg-white border border-[#E3D4FF] text-xs font-black text-[#141426] hover:bg-[#FAF9FC] transition-all tactile flex items-center gap-1.5 shadow-2xs"
            >
              <span className="text-xs">🎙️</span>
              <span className="max-w-[120px] truncate">
                {lang === "ml" ? activeReciter.nameMalayalam.split(" ")[0] : activeReciter.nameEnglish.split(" ")[0]}
              </span>
              <ChevronDown className="w-3.5 h-3.5 text-[#7857E8]" />
            </button>

            {/* Reciter dropdown list */}
            {showReciterPicker && (
              <div className="absolute right-0 bottom-full mb-2 w-64 bg-white border border-[#E4E0E9] rounded-2xl shadow-xl p-1.5 z-50 space-y-1 animate-pop">
                <div className="px-2.5 py-1 text-[10px] font-black uppercase text-[#626273]">
                  {lang === "ml" ? "ഖാരിഅ് തിരഞ്ഞെടുക്കുക" : "Select Quran Reciter"}
                </div>
                {reciters.map((r) => (
                  <button
                    key={r.id}
                    type="button"
                    onClick={() => handleSelectReciter(r.id)}
                    className={`w-full text-left p-2 rounded-xl text-xs flex items-center justify-between transition-all ${
                      r.id === selectedReciterId
                        ? "bg-[#7857E8] text-white font-black"
                        : "text-[#141426] hover:bg-[#F3F1F4] font-bold"
                    }`}
                  >
                    <div>
                      <span className="block">{lang === "ml" ? r.nameMalayalam : r.nameEnglish}</span>
                      <span className={`text-[10px] block ${r.id === selectedReciterId ? "text-white/80" : "text-[#626273]"}`}>
                        {r.style}
                      </span>
                    </div>
                    {r.id === selectedReciterId && <span>✓</span>}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Repeat Choices: 1x or 3x */}
          <div className="flex items-center gap-1 bg-white/80 p-0.5 rounded-2xl border border-[#E3D4FF]">
            <button
              type="button"
              onClick={() => setRepeatMode(1)}
              className={`px-2.5 py-1 rounded-xl text-xs font-black transition-all ${
                repeatMode === 1 ? "bg-[#191A22] text-white shadow-2xs" : "text-[#626273] hover:text-[#141426]"
              }`}
            >
              1x
            </button>
            <button
              type="button"
              onClick={() => setRepeatMode(3)}
              className={`px-2.5 py-1 rounded-xl text-xs font-black transition-all ${
                repeatMode === 3 ? "bg-[#191A22] text-white shadow-2xs" : "text-[#626273] hover:text-[#141426]"
              }`}
            >
              3x
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
