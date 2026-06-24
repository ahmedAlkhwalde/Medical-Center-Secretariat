import { Send, Mic, Square, Paperclip, Camera } from "lucide-react";

const ChatInput = ({
  text,
  setText,
  isRecording,
  isUploading,
  editingMessage,
  onSend,
  onCancelEdit,
  onStartRecording,
  onStopRecording,
  onFileUpload,
}) => (
  <>
    {editingMessage && (
      <div className="w-full bg-yellow-500/10 border-t border-yellow-500/20 px-4 py-1.5 flex items-center justify-between text-xs text-yellow-600 dark:text-yellow-400 flex-shrink-0">
        <div className="flex items-center gap-2 truncate max-w-[80%]">
          <Edit2 className="h-3.5 w-3.5" />
          <span className="font-semibold">جاري التعديل:</span>
          <span className="truncate italic theme-text-muted">"{editingMessage.text}"</span>
        </div>
        <button onClick={onCancelEdit} className="p-1 rounded-full hover:bg-slate-700 text-gray-400 hover:text-gray-200">
          <X className="h-4 w-4" />
        </button>
      </div>
    )}

    {isUploading && (
      <div className="w-full bg-blue-100 dark:bg-blue-900 p-1 text-center text-xs font-semibold text-blue-600 animate-pulse flex-shrink-0">
        جاري المزامنة والرفع...
      </div>
    )}

    <footer className="chat-input-fixed p-3 theme-surface border-t theme-border">
      <div className="flex items-center gap-2 max-w-4xl mx-auto">
        <div className="flex flex-1 items-center gap-2 rounded-full theme-bg px-3 py-1.5">
          <label className="cursor-pointer p-1 theme-text-muted hover:theme-text">
            <Paperclip className="h-5 w-5" />
            <input type="file" className="hidden" onChange={(e) => e.target.files[0] && onFileUpload(e.target.files[0], "file", "")} />
          </label>
          <label className="cursor-pointer p-1 theme-text-muted hover:theme-text">
            <Camera className="h-5 w-5" />
            <input type="file" accept="image/*" className="hidden" onChange={(e) => e.target.files[0] && onFileUpload(e.target.files[0], "image", "أرسل صورة")} />
          </label>
          {isRecording ? (
            <div className="flex-1 text-sm text-red-500 font-bold animate-pulse px-2">🔴 جاري تسجيل الصوت...</div>
          ) : (
            <input
              type="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && onSend()}
              placeholder="اكتب رسالتك هنا..."
              className="flex-1 bg-transparent text-sm outline-none border-none focus:ring-0 theme-text placeholder:text-(--color-grey)"
            />
          )}
        </div>
        {text.trim().length > 0 ? (
          <button onClick={onSend} className="flex h-10 w-10 min-w-[40px] items-center justify-center rounded-full theme-accent theme-text-on-accent shadow hover:opacity-90 transition">
            <Send className="h-5 w-5" style={{ transform: "scaleX(-1)" }} />
          </button>
        ) : (
          <button
            disabled={!!editingMessage}
            onClick={isRecording ? onStopRecording : onStartRecording}
            className={`flex h-10 w-10 min-w-[40px] items-center justify-center rounded-full text-white shadow transition ${isRecording ? "bg-red-500 hover:bg-red-600" : "theme-accent hover:opacity-90"}`}
          >
            {isRecording ? <Square className="h-5 w-5 fill-current" /> : <Mic className="h-5 w-5" />}
          </button>
        )}
      </div>
    </footer>
  </>
);

export default ChatInput;