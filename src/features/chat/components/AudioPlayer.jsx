import { Loader2, Play, Pause } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { host_chat } from "../../../config/apiClient";

const AudioPlayer = ({ msg, isMe }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const playerRef = useRef(null);
  const intervalRef = useRef(null);

  // إنشاء كائن الصوت مرة واحدة
  useEffect(() => {
    playerRef.current = new Audio();
    
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (playerRef.current) {
        playerRef.current.pause();
        playerRef.current.src = '';
      }
    };
  }, []);

  const formatTime = (timeInSeconds) => {
    if (!isFinite(timeInSeconds) || isNaN(timeInSeconds) || timeInSeconds < 0) {
      return "0:00";
    }
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = Math.floor(timeInSeconds % 60);
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  const handlePlayPause = async () => {
    const BACKEND_URL = host_chat || "http://127.0.0.1:8000";
    const safeUrl = msg.fileUrl
      ? msg.fileUrl.replace(/http:\/\/[0-9.]+:8000/, BACKEND_URL)
      : '';

    if (!safeUrl) {
      console.error("No valid audio URL");
      return;
    }

    const player = playerRef.current;
    if (!player) return;

    try {
      // إذا كان قيد التشغيل، أوقفه
      if (isPlaying) {
        player.pause();
        setIsPlaying(false);
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
        }
        return;
      }

      // بدء التشغيل
      setIsLoading(true);

      // إيقاف أي تشغيل سابق
      player.pause();
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }

      // إعادة تعيين الحالة
      setCurrentTime(0);
      setDuration(0);

      // تعيين المصدر الجديد
      player.src = safeUrl;

      // انتظار تحميل البيانات الوصفية
      player.onloadedmetadata = () => {
        console.log("المدة:", player.duration);
        setDuration(player.duration);
      };

      // انتظار حتى يمكن التشغيل
      player.oncanplaythrough = async () => {
        setIsLoading(false);
        try {
          await player.play();
          setIsPlaying(true);

          // بدء عداد الوقت - تحديث كل 100 مللي ثانية
          intervalRef.current = setInterval(() => {
            if (player && !player.paused) {
              setCurrentTime(player.currentTime);
            }
          }, 100);
        } catch (playError) {
          console.error("خطأ في التشغيل:", playError);
          setIsPlaying(false);
          setIsLoading(false);
        }
      };

      // معالجة انتهاء الصوت
      player.onended = () => {
        setIsPlaying(false);
        setCurrentTime(0);
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
        }
      };

      // معالجة الأخطاء
      player.onerror = (e) => {
        console.error("خطأ في الصوت:", e);
        setIsLoading(false);
        setIsPlaying(false);
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
        }
      };

      // بدء التحميل
      player.load();

    } catch (error) {
      console.error("خطأ في إعداد الصوت:", error);
      setIsLoading(false);
    }
  };

  const handleSeek = (e) => {
    const newTime = parseFloat(e.target.value);
    if (playerRef.current) {
      playerRef.current.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };

  return (
    <div className="flex items-center gap-3 w-56 p-1 mt-1 theme-text" onClick={(e) => e.stopPropagation()}>
      {/* زر التشغيل/الإيقاف */}
      <button
        type="button"
        onClick={handlePlayPause}
        className="flex h-8 w-8 min-w-[32px] items-center justify-center rounded-full theme-accent-soft theme-text-accent shadow hover:theme-hover-accent transition z-20"
        disabled={isLoading}
      >
        {isLoading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : isPlaying ? (
          <Pause className="h-4 w-4" />
        ) : (
          <Play className="h-4 w-4 text-white fill-current" />
        )}
      </button>

      {/* شريط التقدم وعداد الوقت */}
      <div className="flex-1">
        <input
          type="range"
          min="0"
          step="0.1"
          max={duration > 0 ? duration : 100}
          value={currentTime}
          onChange={handleSeek}
          className="w-full h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-teal-500"
        />
        <span className={`text-[10px] ${isMe ? "text-teal-100" : "theme-text-muted"}`}>
          {isLoading
            ? "جاري التحميل..."
            : isPlaying
              ? `${formatTime(currentTime)} / ${formatTime(duration)}`
              : "🎤 تسجيل صوتي"}
        </span>
      </div>
    </div>
  );
};

export default AudioPlayer;