import { useRef, useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useChatController } from "../../../firebase";
import { db } from "../../../firebase";
import { doc, onSnapshot } from "firebase/firestore";
import chatService from "../service/chatService";

const globalAudioPlayer = new Audio();

export const useChatView = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const {
    chatId: targetId,
    currentUserId: myUserId,
    chatName = "غرفة محادثة",
    avatarUrl = "",
    role = "مركز الشفاء الطبي",
    isActive = true,
  } = location.state || {};

  const userId = myUserId;

  const [firebaseRoomKey, setFirebaseRoomKey] = useState("");
  const [editingMessage, setEditingMessage] = useState(null);
  const [presenceData, setPresenceData] = useState(null);
  const [tick, setTick] = useState(0);

  const [playingMessageId, setPlayingMessageId] = useState("");
  const [audioProgress, setAudioProgress] = useState(0);
  const [audioDuration, setAudioDuration] = useState(0);
  const [loadingAudioId, setLoadingAudioId] = useState("");

  const getOrCreateRoomMutation = chatService.useGetOrCreateRoomMutation();
  const storeMessageMutation = chatService.useStoreMessageMutation();

  const c = useChatController(firebaseRoomKey || "placeholder_room", userId);
  const messagesEndRef = useRef(null);

  // جلب أو إنشاء الغرفة
  useEffect(() => {
    if (targetId && userId) {
      getOrCreateRoomMutation.mutate(
        { senderId: userId, targetId: targetId },
        {
          onSuccess: (res) => {
            if (res && res.firebase_room_key) {
              setFirebaseRoomKey(res.firebase_room_key);
            }
          },
        },
      );
    }
  }, [targetId, userId]);

  // مراقبة التواجد
  useEffect(() => {
    const currentStatus = presenceData?.status || c.peerPresence?.status;
    if (currentStatus === "offline") {
      const timer = setInterval(() => setTick((prev) => prev + 1), 10000);
      return () => clearInterval(timer);
    }
  }, [presenceData?.status, c.peerPresence?.status]);

  useEffect(() => {
    if (!firebaseRoomKey || firebaseRoomKey === "placeholder_room" || !targetId) return;

    const roomRef = doc(db, "ChatRooms", firebaseRoomKey);

    const unsub = onSnapshot(roomRef, (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        const presenceMap = data.presence || {};
        const formattedTargetId = String(targetId).startsWith("user_")
          ? String(targetId)
          : `user_${targetId}`;
        const rawTargetId = String(targetId).replace("user_", "");
        const peerData = presenceMap[formattedTargetId] || presenceMap[rawTargetId];

        if (peerData && typeof peerData === "object") {
          setPresenceData(peerData);
        } else {
          const fallbackRef = doc(db, "UsersStatus", formattedTargetId);
          onSnapshot(fallbackRef, (statusSnap) => {
            if (statusSnap.exists()) setPresenceData(statusSnap.data());
          });
        }
      }
    });

    if (typeof c.updateUserPresence === "function") {
      c.updateUserPresence("online");
    }

    const handleVisibilityChange = () => {
      if (typeof c.updateUserPresence === "function") {
        if (document.visibilityState === "hidden") {
          c.updateUserPresence("offline");
        } else {
          c.updateUserPresence("online");
        }
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      if (typeof c.updateUserPresence === "function") c.updateUserPresence("offline");
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      unsub();
    };
  }, [firebaseRoomKey, c.currentUserId, targetId]);

  const finalPresence = presenceData || c.peerPresence;

  // منطق الصوت
  const formatTime = (timeInSeconds) => {
    if (!isFinite(timeInSeconds) || isNaN(timeInSeconds) || timeInSeconds < 0) return "0:00";
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = Math.floor(timeInSeconds % 60);
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  useEffect(() => {
    const player = globalAudioPlayer;
    const handleTimeUpdate = () => {
      if (playingMessageId) {
        setAudioProgress(player.currentTime);
        if (!isFinite(player.duration) || player.duration === Infinity) {
          if (player.seekable && player.seekable.length > 0) {
            setAudioDuration(player.seekable.end(0));
          }
        } else {
          setAudioDuration(player.duration);
        }
      }
    };
    const handleDurationChange = () => {
      if (playingMessageId && isFinite(player.duration) && player.duration > 0) {
        setAudioDuration(player.duration);
      } else if (player.seekable && player.seekable.length > 0) {
        setAudioDuration(player.seekable.end(0));
      }
    };
    const handleEnded = () => {
      setPlayingMessageId("");
      setAudioProgress(0);
      setAudioDuration(0);
    };

    player.addEventListener("timeupdate", handleTimeUpdate);
    player.addEventListener("durationchange", handleDurationChange);
    player.addEventListener("ended", handleEnded);
    return () => {
      player.removeEventListener("timeupdate", handleTimeUpdate);
      player.removeEventListener("durationchange", handleDurationChange);
      player.removeEventListener("ended", handleEnded);
    };
  }, [playingMessageId]);

  const handlePlayOrPauseAudio = async (e, messageId, fileUrl) => {
    e.preventDefault();
    e.stopPropagation();
    const safeUrl = fileUrl ? fileUrl.replace(/http:\/\/[0-9.]+:8000/, BACKEND_URL) : "";
    const player = globalAudioPlayer;

    if (playingMessageId === messageId) {
      player.pause();
      setPlayingMessageId("");
      return;
    }

    try {
      player.pause();
      player.oncanplaythrough = null;
      player.onerror = null;
      setAudioProgress(0);
      setAudioDuration(0);
      setLoadingAudioId(messageId);

      player.onerror = () => {
        setLoadingAudioId("");
        setPlayingMessageId("");
      };

      player.src = safeUrl;
      player.load();

      player.oncanplaythrough = async () => {
        setLoadingAudioId("");
        setPlayingMessageId(messageId);
        try {
          if (player.seekable && player.seekable.length > 0) {
            setAudioDuration(player.seekable.end(0));
          } else if (isFinite(player.duration)) {
            setAudioDuration(player.duration);
          }
          await player.play();
        } catch (playError) {
          setPlayingMessageId("");
        }
      };
    } catch (error) {
      setLoadingAudioId("");
      setPlayingMessageId("");
    }
  };

  // التمرير التلقائي
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [c.messages]);

  // تعديل وإرسال
  const handleStartEdit = (msg) => {
    setEditingMessage({ id: msg.messageId, text: msg.text });
    c.setText(msg.text);
  };

  const handleCancelEdit = () => {
    setEditingMessage(null);
    c.setText("");
  };

  const handleSendOrUpdate = async () => {
    if (editingMessage) {
      if (typeof c.updateMessage === "function") {
        await c.updateMessage(editingMessage.id, c.text);
      }
      handleCancelEdit();
    } else {
      if (!c.text.trim()) return;
      await c.sendMessage();
    }
  };

  const isLoading = getOrCreateRoomMutation.isLoading || !firebaseRoomKey || c.isRoomLoading;

  return {
    navigate,
    chatName,
    avatarUrl,
    role,
    finalPresence,
    editingMessage,
    messages: c.messages,
    currentUserId: c.currentUserId,
    userId,
    messagesEndRef,
    isLoading,
    isUploading: c.isUploading || storeMessageMutation.isLoading,
    text: c.text,
    setText: c.setText,
    isRecording: c.isRecording,
    startAudioRecording: c.startAudioRecording,
    stopAudioRecording: c.stopAudioRecording,
    uploadFileAndSend: c.uploadFileAndSend,
    deleteMessage: c.deleteMessage,
    updateMessage: c.updateMessage,
    formatLastSeen: c.formatLastSeen,
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
  };
};