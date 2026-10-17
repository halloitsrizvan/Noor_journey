import React, { useState, useRef, useEffect } from "react";
import { Mic, Square, Play, Pause, Trash2, ShieldCheck, AlertCircle } from "lucide-react";

interface LocalPracticeRecorderProps {
  lang: "ml" | "en";
  verseNumber: number;
  onRecordingSaved?: () => void;
}

export const LocalPracticeRecorder: React.FC<LocalPracticeRecorderProps> = ({
  lang,
  verseNumber,
  onRecordingSaved,
}) => {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingBlobUrl, setRecordingBlobUrl] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [recordDuration, setRecordDuration] = useState(0);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const playbackAudioRef = useRef<HTMLAudioElement | null>(null);
  const timerIntervalRef = useRef<any>(null);

  // Stop microphone and revoke object URL on unmount
  useEffect(() => {
    return () => {
      stopMicrophoneStream();
      if (recordingBlobUrl) {
        URL.revokeObjectURL(recordingBlobUrl);
      }
      if (playbackAudioRef.current) {
        playbackAudioRef.current.pause();
        playbackAudioRef.current = null;
      }
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
      }
    };
  }, [recordingBlobUrl]);

  const stopMicrophoneStream = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
  };

  const startRecording = async () => {
    setErrorMessage(null);
    if (!navigator?.mediaDevices?.getUserMedia) {
      setErrorMessage(
        lang === "ml"
          ? "നിങ്ങളുടെ ബ്രൗസർ മൈക്രോഫോൺ റെക്കോർഡിംഗ് പിന്തുണയ്ക്കുന്നില്ല."
          : "Audio recording is not supported in this browser."
      );
      return;
    }

    try {
      // 1. Explicit permission request only after pressing Record
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      // 2. Detect supported MIME types
      let mimeType = "";
      if (typeof MediaRecorder !== "undefined") {
        if (MediaRecorder.isTypeSupported("audio/webm;codecs=opus")) {
          mimeType = "audio/webm;codecs=opus";
        } else if (MediaRecorder.isTypeSupported("audio/webm")) {
          mimeType = "audio/webm";
        } else if (MediaRecorder.isTypeSupported("audio/mp4")) {
          mimeType = "audio/mp4";
        }
      }

      const recorder = mimeType
        ? new MediaRecorder(stream, { mimeType })
        : new MediaRecorder(stream);

      mediaRecorderRef.current = recorder;
      audioChunksRef.current = [];

      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      recorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, {
          type: recorder.mimeType || "audio/webm",
        });
        const url = URL.createObjectURL(audioBlob);
        setRecordingBlobUrl(url);
        stopMicrophoneStream();
        if (onRecordingSaved) onRecordingSaved();
      };

      recorder.start();
      setIsRecording(true);
      setRecordDuration(0);

      timerIntervalRef.current = setInterval(() => {
        setRecordDuration((prev) => prev + 1);
      }, 1000);
    } catch (err: any) {
      stopMicrophoneStream();
      setErrorMessage(
        lang === "ml"
          ? "മൈക്രോഫോൺ അനുമതി നൽകിയിട്ടില്ല അല്ലെങ്കിൽ കണക്റ്റുചെയ്തിട്ടില്ല."
          : "Microphone access was denied or is unavailable on this device."
      );
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
      }
    }
  };

  const handleTogglePlayback = () => {
    if (!recordingBlobUrl) return;

    if (isPlaying) {
      if (playbackAudioRef.current) {
        playbackAudioRef.current.pause();
        playbackAudioRef.current.currentTime = 0;
      }
      setIsPlaying(false);
    } else {
      if (!playbackAudioRef.current) {
        playbackAudioRef.current = new Audio(recordingBlobUrl);
      }
      playbackAudioRef.current.currentTime = 0;
      playbackAudioRef.current
        .play()
        .then(() => setIsPlaying(true))
        .catch(() => setIsPlaying(false));

      playbackAudioRef.current.onended = () => {
        setIsPlaying(false);
      };
    }
  };

  const handleDeleteRecording = () => {
    if (playbackAudioRef.current) {
      playbackAudioRef.current.pause();
      playbackAudioRef.current = null;
    }
    if (recordingBlobUrl) {
      URL.revokeObjectURL(recordingBlobUrl);
    }
    setRecordingBlobUrl(null);
    setIsPlaying(false);
    setRecordDuration(0);
  };

  return (
    <div className="w-full bg-white border border-[#E4E0E9] rounded-[26px] p-5 shadow-2xs space-y-3">
      {/* Title & Privacy Label */}
      <div className="flex items-center justify-between">
        <div>
          <span className="text-xs font-black text-[#141426] block">
            {lang === "ml" ? "എന്റെ പരിശീലന റെക്കോർഡിംഗ്" : "My Practice Recording"}
          </span>
          <span className="text-[11px] text-[#626273] font-medium">
            {lang === "ml"
              ? `ആയത്ത് ${verseNumber} സ്വന്തമായി ഓതി പരിശീലിക്കാം`
              : `Recite verse ${verseNumber} aloud and listen back`}
          </span>
        </div>

        {/* Privacy Badge */}
        <div className="flex items-center gap-1 text-[10px] font-bold text-[#287553] bg-[#287553]/10 px-2.5 py-1 rounded-full border border-[#287553]/20">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>{lang === "ml" ? "ഉപകരണത്തിൽ മാത്രം" : "On-Device Only"}</span>
        </div>
      </div>

      {/* Recording & Playback Controls */}
      <div className="bg-[#F3F1F4] rounded-[20px] p-4 flex flex-col sm:flex-row items-center justify-between gap-3">
        {/* State A: Currently Recording */}
        {isRecording ? (
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-2.5">
              <span className="w-3 h-3 rounded-full bg-[#B93848] animate-ping" />
              <span className="text-xs font-black text-[#B93848]">
                {lang === "ml" ? "റെക്കോർഡ് ചെയ്യുന്നു..." : "Recording..."} ({recordDuration}s)
              </span>
            </div>

            <button
              type="button"
              onClick={stopRecording}
              className="px-4 py-2 rounded-2xl bg-[#B93848] text-white hover:bg-black font-black text-xs flex items-center gap-1.5 shadow-sm tactile transition-all"
            >
              <Square className="w-3.5 h-3.5 fill-current" />
              <span>{lang === "ml" ? "നിർത്തുക" : "Stop"}</span>
            </button>
          </div>
        ) : !recordingBlobUrl ? (
          /* State B: Ready to Record */
          <div className="flex items-center justify-between w-full">
            <span className="text-xs font-bold text-[#626273]">
              {lang === "ml"
                ? "റെക്കോർഡ് ബട്ടൺ അമർത്തി തുടങ്ങുക"
                : "Press the microphone to record your attempt"}
            </span>

            <button
              type="button"
              onClick={startRecording}
              className="px-4 py-2.5 rounded-2xl bg-[#191A22] text-[#FFD184] hover:bg-black font-black text-xs flex items-center gap-2 shadow-md tactile transition-all"
            >
              <Mic className="w-4 h-4" />
              <span>{lang === "ml" ? "റെക്കോർഡ് ചെയ്യാം" : "Record Voice"}</span>
            </button>
          </div>
        ) : (
          /* State C: Recording Saved In Memory */
          <div className="flex items-center justify-between w-full gap-2">
            <button
              type="button"
              onClick={handleTogglePlayback}
              className="px-4 py-2 rounded-2xl bg-[#7857E8] text-white hover:bg-[#6846D4] font-black text-xs flex items-center gap-2 tactile shadow-2xs transition-all"
            >
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-current" />}
              <span>{isPlaying ? (lang === "ml" ? "പോസ് ചെയ്യൂ" : "Pause") : (lang === "ml" ? "കേട്ടുനോക്കാം" : "Listen Back")}</span>
            </button>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={startRecording}
                className="px-3 py-1.5 rounded-xl bg-white text-[#141426] hover:bg-[#E4E0E9] font-bold text-xs tactile border border-[#E4E0E9]"
              >
                {lang === "ml" ? "വീണ്ടും ഓതുക" : "Re-record"}
              </button>

              <button
                type="button"
                onClick={handleDeleteRecording}
                className="w-8 h-8 rounded-xl bg-white text-[#B93848] hover:bg-[#FFE5E8] flex items-center justify-center tactile border border-[#E4E0E9]"
                aria-label="Delete Practice Recording"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Error Message if Mic Access Denied */}
      {errorMessage && (
        <div className="p-3 bg-[#B93848]/10 border border-[#B93848]/30 text-[#B93848] rounded-[18px] text-xs font-bold flex items-center gap-2 animate-pop">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Truthful Notice: No Automatic Speech Grading */}
      <p className="text-[10px] text-[#626273] leading-relaxed text-center">
        {lang === "ml"
          ? "ശ്രദ്ധിക്കുക: ഖുർആൻ ഉച്ചാരണം മെഷീൻ വഴി പരിശോധിക്കില്ല. സ്വന്തമായി കേട്ടുനോക്കാനും അധ്യാപകരുടെ സാന്നിധ്യത്തിൽ ശരിപ്പെടുത്താനുമുള്ളതാണ്."
          : "Note: Recitation accuracy is evaluated by a teacher, not an automated algorithm."}
      </p>
    </div>
  );
};
