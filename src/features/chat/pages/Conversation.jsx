import { useChatView } from "../hooks/useChatView";
import ChatHeader from "../components/ChatHeader";
import MessageBubble from "../components/MessageBubble";
import ChatInput from "../components/ChatInput";
import { Loader2 } from "lucide-react";
import { host_chat } from "../../../config/apiClient";

const BACKEND_URL = host_chat;

export default function ChatView() {
  const {
    navigate,
    chatName,
    avatarUrl,
    role,
    finalPresence,
    editingMessage,
    messages,
    currentUserId,
    userId,
    messagesEndRef,
    isLoading,
    isUploading,
    text,
    setText,
    isRecording,
    startAudioRecording,
    stopAudioRecording,
    uploadFileAndSend,
    deleteMessage,
    formatLastSeen,
    playingMessageId,
    audioProgress,
    audioDuration,
    loadingAudioId,
    globalAudioPlayer,
    handlePlayOrPauseAudio,
    handleStartEdit,
    handleCancelEdit,
    handleSendOrUpdate,
    formatTime,
  } = useChatView();

  if (isLoading) {
    return (
      <div className="flex h-full w-full items-center justify-center theme-bg">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin theme-text-accent mx-auto mb-2" />
          <p className="text-xs theme-text-muted">جاري تأمين الاتصال بالغرفة...</p>
        </div>
      </div>
    );
  }

  const audioState = {
    playingMessageId,
    audioProgress,
    audioDuration,
    loadingAudioId,
    globalAudioPlayer,
    handlePlayOrPauseAudio,
    formatTime,
    setAudioProgress: (val) => {}, // سيتم تعريفها داخل AudioPlayer
  };

  return (
    <div className="flex h-full max-h-full w-full flex-col theme-bg theme-text overflow-hidden" dir="rtl">
      <ChatHeader
        chatName={chatName}
        avatarUrl={avatarUrl}
        role={role}
        finalPresence={finalPresence}
        formatLastSeen={formatLastSeen}
        onBack={() => navigate(-1)}
      />

      <main className="flex-1 overflow-y-auto p-4 space-y-3 no-scrollbar">
        {messages && messages.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center theme-text-muted">
            <p className="text-sm">لا توجد رسائل سابقة في الغرفة.</p>
          </div>
        ) : (
          messages && [...messages].reverse().map((msg) => {
            const isMe = String(msg.senderId) === String(currentUserId) || String(msg.senderId) === String(userId);
            const isDeleted = msg.type === "deleted";
            const safeFileUrl = msg.fileUrl ? msg.fileUrl.replace(/http:\/\/[0-9.]+:8000/, BACKEND_URL) : "";

            return (
              <MessageBubble
                key={msg.messageId}
                msg={msg}
                isMe={isMe}
                isDeleted={isDeleted}
                safeFileUrl={safeFileUrl}
                onStartEdit={handleStartEdit}
                onDelete={deleteMessage}
                audioState={audioState}
              />
            );
          })
        )}
        <div ref={messagesEndRef} />
      </main>

      <ChatInput
        text={text}
        setText={setText}
        isRecording={isRecording}
        isUploading={isUploading}
        editingMessage={editingMessage}
        onSend={handleSendOrUpdate}
        onCancelEdit={handleCancelEdit}
        onStartRecording={startAudioRecording}
        onStopRecording={stopAudioRecording}
        onFileUpload={uploadFileAndSend}
      />
    </div>
  );
}