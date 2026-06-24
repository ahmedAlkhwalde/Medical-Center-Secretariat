import { Loader2, Play, Pause } from "lucide-react";

const AudioPlayer = ({ msg, isMe, audioState }) => {
  const {
    playingMessageId,
    audioProgress,
    audioDuration,
    loadingAudioId,
    globalAudioPlayer,
    handlePlayOrPauseAudio,
    formatTime,
    setAudioProgress,
  } = audioState;

  return (
    <div className="flex items-center gap-3 w-56 p-1 mt-1 theme-text" onClick={(e) => e.stopPropagation()}>
      <button
        type="button"
        onClick={(e) => handlePlayOrPauseAudio(e, msg.messageId, msg.fileUrl)}
        className="flex h-8 w-8 min-w-[32px] items-center justify-center rounded-full theme-accent-soft theme-text-accent shadow hover:theme-hover-accent transition z-20"
        disabled={loadingAudioId === msg.messageId}
      >
        {loadingAudioId === msg.messageId ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : playingMessageId === msg.messageId ? (
          <Pause className="h-4 w-4" />
        ) : (
          <Play className="h-4 w-4 text-white fill-current" />
        )}
      </button>
      <div className="flex-1">
        <input
          type="range"
          min="0"
          step="0.01"
          max={playingMessageId === msg.messageId && isFinite(audioDuration) && audioDuration > 0 ? audioDuration : 100}
          value={playingMessageId === msg.messageId ? audioProgress : 0}
          onChange={(e) => {
            if (playingMessageId === msg.messageId) {
              const newTime = parseFloat(e.target.value);
              globalAudioPlayer.currentTime = newTime;
              setAudioProgress(newTime);
            }
          }}
          className="w-full h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-teal-500"
        />
        <span className={`text-[10px] ${isMe ? "text-teal-100" : "theme-text-muted"}`}>
          {loadingAudioId === msg.messageId
            ? "جاري التحميل..."
            : playingMessageId === msg.messageId
              ? `${formatTime(audioProgress)} / ${formatTime(audioDuration)}`
              : "🎤 تسجيل صوتي"}
        </span>
      </div>
    </div>
  );
};

export default AudioPlayer;