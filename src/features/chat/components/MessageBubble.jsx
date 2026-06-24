import { Check, CheckCheck, FileText,Edit2,Trash2 } from "lucide-react";
import { format } from "date-fns";
import AudioPlayer from "./AudioPlayer";
import {host_chat} from "../../../config/apiClient";

const BACKEND_URL = host_chat; // استورد من config

const MessageBubble = ({
  msg,
  isMe,
  isDeleted,
  safeFileUrl,
  onStartEdit,
  onDelete,
  audioState,
}) => (
  <div className={`flex items-center gap-1 relative group ${isMe ? "justify-start" : "justify-end"}`}>
    {isMe && !isDeleted && (
      <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-150 flex items-center gap-1 mx-2 z-10 order-last">
        {msg.type === "text" && (
          <button
            onClick={() => onStartEdit(msg)}
            className="p-1 rounded-full theme-text-muted hover:text-blue-500 hover:theme-hover-surface"
          >
            <Edit2 className="h-3.5 w-3.5" />
          </button>
        )}
        <button
          onClick={() => onDelete(msg.messageId)}
          className="p-1 rounded-full theme-text-muted hover:text-red-500 hover:theme-hover-surface"
        >
          <Trash2 className="h-3.5 w-3.5" />
        </button>
      </div>
    )}

    <div
      className={`max-w-[70%] rounded-2xl px-4 py-2 shadow-sm relative
      ${
        isDeleted
          ? "bg-slate-100 dark:bg-slate-800 text-gray-400 italic rounded-lg border theme-border"
          : isMe
            ? "theme-accent theme-text-on-accent rounded-tr-sm"
            : "theme-surface-90 theme-text rounded-tl-sm"
      }`}
    >
      {isDeleted && <p className="text-sm leading-relaxed">🚫 {msg.text}</p>}
      {!isDeleted && msg.type === "text" && (
        <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.text}</p>
      )}

      {!isDeleted && msg.type === "image" && msg.fileUrl && (
        <div className="overflow-hidden rounded-lg cursor-pointer mt-1">
          <img src={safeFileUrl} alt="المرفق" className="max-h-60 w-full object-cover hover:scale-105 transition-transform" />
        </div>
      )}

      {!isDeleted && msg.type === "file" && msg.fileUrl && (
        <a href={safeFileUrl} target="_blank" rel="noreferrer" className="flex items-center gap-2 p-2 rounded theme-surface theme-text text-xs font-semibold mt-1">
          <FileText className="h-8 w-8 text-red-500" />
          <div className="truncate max-w-[150px]">
            <p className="truncate theme-text">{msg.text || "ملف مستند"}</p>
            <span className="text-[10px] theme-text-muted">انقر للفتح</span>
          </div>
        </a>
      )}

      {!isDeleted && msg.type === "audio" && msg.fileUrl && (
        <AudioPlayer
          msg={msg}
          isMe={isMe}
          audioState={audioState}
        />
      )}

      <div className={`flex items-center justify-end gap-1 mt-1 text-[10px] ${isMe ? "text-teal-200" : "theme-text-muted"}`}>
        {msg.isEdited && !isDeleted && (
          <span className="opacity-80 scale-90 text-teal-300 font-semibold">(معدلة)</span>
        )}
        <span>{msg.timestamp ? format(msg.timestamp, "hh:mm a") : ""}</span>
        {isMe && (
          <span>
            {msg.status === "read" ? <CheckCheck className="h-3 w-3 text-cyan-300" /> : <Check className="h-3 w-3" />}
          </span>
        )}
      </div>
    </div>
  </div>
);

export default MessageBubble;