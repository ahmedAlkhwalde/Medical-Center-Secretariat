// import React, { useRef, useEffect, useState } from 'react';
// import { useParams, useNavigate, useLocation } from 'react-router-dom';
// import { useChatController } from "../../firebase";
// import {
//   Send, Mic, Square, Paperclip, Camera,
//   FileText, ArrowLeft, Check, CheckCheck, Loader2, Play, Pause,
//   Trash2, Edit2, X
// } from 'lucide-react';
// import { format } from 'date-fns';
// import { db } from "../../firebase";
// import { doc, onSnapshot } from "firebase/firestore";
// import chatService from "../../app/services/chatService";
// import apiClient from '../../config/apiClient';
// import {host_chat} from '../../config/apiClient';

// const BACKEND_URL = host_chat;

// // كائن صوت عالمي مستقر لا يتأثر بالـ Re-renders
// const globalAudioPlayer = new Audio();

// export default function ChatView() {
//   const navigate = useNavigate();
//   const location = useLocation();

//   // استقبال البيانات الممررة من قائمة المحادثات
//   const {
//     chatId: targetId,
//     currentUserId: myUserId,
//     chatName = "غرفة محادثة",
//     avatarUrl = "",
//     role = "مركز الشفاء الطبي",
//     isActive = true
//   } = location.state || {};

//   const userId = myUserId;

//   // الحالات المحلية (State)
//   const [firebaseRoomKey, setFirebaseRoomKey] = useState("");
//   const [editingMessage, setEditingMessage] = useState(null);
//   const [presenceData, setPresenceData] = useState(null);
//   const [tick, setTick] = useState(0);

//   // تتبع الحالات الرسومية للـ UI الخاصة بالصوت
//   const [playingMessageId, setPlayingMessageId] = useState('');
//   const [audioProgress, setAudioProgress] = useState(0);
//   const [audioDuration, setAudioDuration] = useState(0);
//   const [loadingAudioId, setLoadingAudioId] = useState('');

//   // هوكات الـ TanStack Query الخاصة بالربط والمزامنة
//   const getOrCreateRoomMutation = chatService.useGetOrCreateRoomMutation();
//   const storeMessageMutation = chatService.useStoreMessageMutation();

//   // ربط الكنترولر بمفتاح الغرفة والمعرف الحالي
//   const c = useChatController(firebaseRoomKey || "placeholder_room", userId);
//   const messagesEndRef = useRef(null);

//   // =============================================================
//   // 🔄 1. جلب أو إنشاء الغرفة من الـ لارافل
//   // =============================================================
//   useEffect(() => {
//     if (targetId && userId) {
//       getOrCreateRoomMutation.mutate(
//         { senderId: userId, targetId: targetId },
//         {
//           onSuccess: (res) => {
//             if (res && res.firebase_room_key) {
//               setFirebaseRoomKey(res.firebase_room_key);
//             }
//           }
//         }
//       );
//     }
//   }, [targetId, userId]);

//   // =============================================================
//   // 🟢 2. مراقبة الـ Presence والتواجد الحي الشامل (تم التعديل الجذري)
//   // =============================================================
//   useEffect(() => {
//     const currentStatus = presenceData?.status || c.peerPresence?.status;
//     if (currentStatus === "offline") {
//       const timer = setInterval(() => {
//         setTick((prev) => prev + 1);
//       }, 10000);
//       return () => clearInterval(timer);
//     }
//   }, [presenceData?.status, c.peerPresence?.status]);

//   useEffect(() => {
//     if (!firebaseRoomKey || firebaseRoomKey === "placeholder_room" || !targetId) return;

//     const roomRef = doc(db, 'ChatRooms', firebaseRoomKey);

//     const unsub = onSnapshot(roomRef, (docSnap) => {
//       if (docSnap.exists()) {
//         const data = docSnap.data();
//         const presenceMap = data.presence || {};

//         // 🛠 صياغة هجينة ذكية لقراءة الطرف الآخر بالصيغتين الرقمية والنصية (تمنع مشكلة الظهور اللعينة)
//         const formattedTargetId = String(targetId).startsWith("user_") ? String(targetId) : `user_${targetId}`;
//         const rawTargetId = String(targetId).replace("user_", "");

//         const peerData = presenceMap[formattedTargetId] || presenceMap[rawTargetId];

//         if (peerData && typeof peerData === 'object') {
//           setPresenceData(peerData);
//         } else {
//           // استماع احتياطي لكولكشن الحالات المستقلة
//           const fallbackRef = doc(db, 'UsersStatus', formattedTargetId);
//           onSnapshot(fallbackRef, (statusSnap) => {
//             if (statusSnap.exists()) {
//               setPresenceData(statusSnap.data());
//             }
//           });
//         }
//       }
//     });

//     // 🎯 تحديث حالتي الحالية بشكل متزامن فوري عند الدخول
//     if (typeof c.updateUserPresence === 'function') {
//       c.updateUserPresence("online");
//     }

//     const handleVisibilityChange = () => {
//       if (typeof c.updateUserPresence === 'function') {
//         if (document.visibilityState === 'hidden') {
//           c.updateUserPresence("offline");
//         } else {
//           c.updateUserPresence("online");
//         }
//       }
//     };

//     document.addEventListener('visibilitychange', handleVisibilityChange);

//     return () => {
//       if (typeof c.updateUserPresence === 'function') {
//         c.updateUserPresence("offline");
//       }
//       document.removeEventListener('visibilitychange', handleVisibilityChange);
//       unsub();
//     };
//   }, [firebaseRoomKey, c.currentUserId, targetId]); // تم ربطها بـ c.currentUserId لضمان الجاهزية

//   // دمج حالة الحضور المفصّلة والمستقرة
//   const finalPresence = presenceData || c.peerPresence;

//   // =============================================================
//   // 🎵 3. منطق تشغيل الريكوردات والصوت
//   // =============================================================
//   const formatTime = (timeInSeconds) => {
//     if (!isFinite(timeInSeconds) || isNaN(timeInSeconds) || timeInSeconds < 0) return "0:00";
//     const minutes = Math.floor(timeInSeconds / 60);
//     const seconds = Math.floor(timeInSeconds % 60);
//     return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
//   };

//   useEffect(() => {
//     const player = globalAudioPlayer;

//     const handleTimeUpdate = () => {
//       if (playingMessageId) {
//         setAudioProgress(player.currentTime);
//         if (!isFinite(player.duration) || player.duration === Infinity) {
//           if (player.seekable && player.seekable.length > 0) {
//             setAudioDuration(player.seekable.end(0));
//           }
//         } else {
//           setAudioDuration(player.duration);
//         }
//       }
//     };

//     const handleDurationChange = () => {
//       if (playingMessageId) {
//         if (isFinite(player.duration) && player.duration > 0) {
//           setAudioDuration(player.duration);
//         } else if (player.seekable && player.seekable.length > 0) {
//           setAudioDuration(player.seekable.end(0));
//         }
//       }
//     };

//     const handleEnded = () => {
//       setPlayingMessageId('');
//       setAudioProgress(0);
//       setAudioDuration(0);
//     };

//     player.addEventListener('timeupdate', handleTimeUpdate);
//     player.addEventListener('durationchange', handleDurationChange);
//     player.addEventListener('ended', handleEnded);

//     return () => {
//       player.removeEventListener('timeupdate', handleTimeUpdate);
//       player.removeEventListener('durationchange', handleDurationChange);
//       player.removeEventListener('ended', handleEnded);
//     };
//   }, [playingMessageId]);

//   const handlePlayOrPauseAudio = async (e, messageId, fileUrl) => {
//     e.preventDefault();
//     e.stopPropagation();

//     const safeUrl = fileUrl ? fileUrl.replace(/http:\/\/[0-9.]+:8000/, BACKEND_URL) : '';
//     const player = globalAudioPlayer;

//     if (playingMessageId === messageId) {
//       player.pause();
//       setPlayingMessageId('');
//       return;
//     }

//     try {
//       player.pause();
//       player.oncanplaythrough = null;
//       player.onerror = null;
//       setAudioProgress(0);
//       setAudioDuration(0);
//       setLoadingAudioId(messageId);

//       player.onerror = () => {
//         setLoadingAudioId('');
//         setPlayingMessageId('');
//       };

//       player.src = safeUrl;
//       player.load();

//       player.oncanplaythrough = async () => {
//         setLoadingAudioId('');
//         setPlayingMessageId(messageId);
//         try {
//           if (player.seekable && player.seekable.length > 0) {
//             setAudioDuration(player.seekable.end(0));
//           } else if (isFinite(player.duration)) {
//             setAudioDuration(player.duration);
//           }
//           await player.play();
//         } catch (playError) {
//           setPlayingMessageId('');
//         }
//       };
//     } catch (error) {
//       setLoadingAudioId('');
//       setPlayingMessageId('');
//     }
//   };

//   // =============================================================
//   // ✉️ 4. منطق الإرسال، التعديل والمزامنة
//   // =============================================================
//   useEffect(() => {
//     messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
//   }, [c.messages]);

//   const handleStartEdit = (msg) => {
//     setEditingMessage({ id: msg.messageId, text: msg.text });
//     c.setText(msg.text);
//   };

//   const handleCancelEdit = () => {
//     setEditingMessage(null);
//     c.setText("");
//   };

//   const handleSendOrUpdate = async () => {
//     if (editingMessage) {
//       if (typeof c.updateMessage === 'function') {
//         await c.updateMessage(editingMessage.id, c.text);
//       }
//       handleCancelEdit();
//     } else {
//       if (!c.text.trim()) return;
//       await c.sendMessage();
//     }
//   };

//   if (getOrCreateRoomMutation.isLoading || !firebaseRoomKey || c.isRoomLoading) {
//     return (
//       <div className="flex h-full w-full items-center justify-center bg-gray-50 dark:bg-gray-900">
//         <div className="text-center">
//           <Loader2 className="h-8 w-8 animate-spin text-blue-600 mx-auto mb-2" />
//           <p className="text-xs text-gray-500 dark:text-gray-400">جاري تأمين الاتصال بالغرفة...</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="flex h-full max-h-full w-full flex-col bg-gray-50 text-gray-900 dark:bg-[#0f172a] dark:text-gray-100 overflow-hidden" dir="rtl">

//       {/* الـ Header */}
//       <header className="flex h-16 w-full items-center justify-between border-b border-gray-200 bg-white px-4 shadow-sm dark:border-slate-800 dark:bg-[#1e293b] flex-shrink-0 z-10">
//         <div className="flex items-center gap-3">
//           <button onClick={() => navigate(-1)} className="rounded-full p-1 hover:bg-gray-100 dark:hover:bg-slate-700">
//             <ArrowLeft className="h-6 w-6" />
//           </button>

//           <div className="relative">
//             {avatarUrl && avatarUrl !== "group_placeholder" ? (
//               <img src={avatarUrl} alt={chatName} className="h-10 w-10 rounded-full object-cover" />
//             ) : (
//               <div className="flex h-10 w-10 items-center justify-center rounded-full bg-teal-500/10 text-teal-500 dark:bg-teal-500/20">
//                 <span className="font-bold">{chatName ? chatName[0] : "?"}</span>
//               </div>
//             )}

//             {(finalPresence?.status === "online" || finalPresence?.isOnline === true) && (
//               <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white bg-green-500 dark:border-gray-900" />
//             )}
//           </div>

//           <div>
//             <h2 className="text-sm font-bold max-w-[200px] truncate">{chatName}</h2>
//             <p className="text-xs text-gray-500 dark:text-gray-400">
//               {role} • {c.formatLastSeen(finalPresence)}
//             </p>
//           </div>
//         </div>
//       </header>

//       {/* منطقة عرض الرسائل */}
//       <main className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar bg-transparent">
//         {c.messages && c.messages.length === 0 ? (
//           <div className="flex h-full flex-col items-center justify-center text-gray-400">
//             <p className="text-sm">لا توجد رسائل سابقة في الغرفة.</p>
//           </div>
//         ) : (
//           c.messages && [...c.messages].reverse().map((msg) => {
//             const isMe = String(msg.senderId) === String(c.currentUserId) || String(msg.senderId) === String(userId);
//             const isDeleted = msg.type === 'deleted';
//             const safeFileUrl = msg.fileUrl ? msg.fileUrl.replace(/http:\/\/[0-9.]+:8000/, BACKEND_URL) : '';

//             return (
//               <div key={msg.messageId} className={`flex items-center gap-1 relative group ${isMe ? 'justify-start' : 'justify-end'}`}>

//                 {/* خيارات التعديل والحذف للرسائل التابعة للمستخدم الحالي */}
//                 {isMe && !isDeleted && (
//                   <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-150 flex items-center gap-1 mx-2 z-10 order-last">
//                     {msg.type === 'text' && (
//                       <button onClick={() => handleStartEdit(msg)} className="p-1 rounded-full text-gray-400 hover:text-blue-500 hover:bg-slate-200 dark:hover:bg-slate-800">
//                         <Edit2 className="h-3.5 w-3.5" />
//                       </button>
//                     )}
//                     <button onClick={() => { if (typeof c.deleteMessage === 'function') c.deleteMessage(msg.messageId); }} className="p-1 rounded-full text-gray-400 hover:text-red-500 hover:bg-slate-200 dark:hover:bg-slate-800">
//                       <Trash2 className="h-3.5 w-3.5" />
//                     </button>
//                   </div>
//                 )}

//                 {/* تصميم الفقاعات */}
//                 <div className={`max-w-[70%] rounded-2xl px-4 py-2 shadow-sm relative
//                   ${isDeleted ? 'bg-slate-100 dark:bg-slate-800 text-gray-400 italic rounded-lg border border-slate-200 dark:border-slate-700'
//                                : isMe ? 'bg-blue-600 text-white rounded-tr-sm' : 'bg-[#1e293b] text-gray-100 rounded-tl-sm'}`}
//                 >
//                   {isDeleted && <p className="text-sm leading-relaxed">🚫 {msg.text}</p>}
//                   {!isDeleted && msg.type === 'text' && <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.text}</p>}

//                   {/* الصور */}
//                   {!isDeleted && msg.type === 'image' && msg.fileUrl && (
//                     <div className="overflow-hidden rounded-lg cursor-pointer mt-1">
//                       <img src={safeFileUrl} alt="المرفق" className="max-h-60 w-full object-cover hover:scale-105 transition-transform" />
//                     </div>
//                   )}

//                   {/* الملفات والمستندات */}
//                   {!isDeleted && msg.type === 'file' && msg.fileUrl && (
//                     <a href={safeFileUrl} target="_blank" rel="noreferrer" className="flex items-center gap-2 p-2 rounded bg-gray-50 dark:bg-slate-800 text-xs font-semibold mt-1">
//                       <FileText className="h-8 w-8 text-red-500" />
//                       <div className="truncate max-w-[150px]">
//                         <p className="truncate text-gray-700 dark:text-gray-200">{msg.text || "ملف مستند"}</p>
//                         <span className="text-[10px] text-gray-400">انقر للفتح</span>
//                       </div>
//                     </a>
//                   )}

//                   {/* التسجيلات الصوتية */}
//                   {!isDeleted && msg.type === 'audio' && msg.fileUrl && (
//                     <div className="flex items-center gap-3 w-56 p-1 mt-1 text-gray-800 dark:text-gray-100" onClick={(e) => e.stopPropagation()}>
//                       <button type="button" onClick={(e) => handlePlayOrPauseAudio(e, msg.messageId, msg.fileUrl)} className="flex h-8 w-8 min-w-[32px] items-center justify-center rounded-full bg-white text-blue-600 shadow hover:bg-gray-100 transition z-20" disabled={loadingAudioId === msg.messageId}>
//                         {loadingAudioId === msg.messageId ? <Loader2 className="h-4 w-4 animate-spin text-blue-600" /> : playingMessageId === msg.messageId ? <Pause className="h-4 w-4 text-blue-600" /> : <Play className="h-4 w-4 text-blue-600 fill-current" />}
//                       </button>
//                       <div className="flex-1">
//                         <input type="range" min="0" step="0.01" max={playingMessageId === msg.messageId && isFinite(audioDuration) && audioDuration > 0 ? audioDuration : 100} value={playingMessageId === msg.messageId ? audioProgress : 0} onChange={(e) => { if (playingMessageId === msg.messageId) { const newTime = parseFloat(e.target.value); globalAudioPlayer.currentTime = newTime; setAudioProgress(newTime); }}} className="w-full h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-500" />
//                         <span className={`text-[10px] ${isMe ? 'text-blue-100' : 'text-gray-400'}`}>
//                           {loadingAudioId === msg.messageId ? "جاري التحميل..." : playingMessageId === msg.messageId ? `${formatTime(audioProgress)} / ${formatTime(audioDuration)}` : "🎤 تسجيل صوتي"}
//                         </span>
//                       </div>
//                     </div>
//                   )}

//                   {/* التوقيت والحالة */}
//                   <div className={`flex items-center justify-end gap-1 mt-1 text-[10px] ${isMe ? 'text-blue-200' : 'text-gray-400'}`}>
//                     {msg.isEdited && !isDeleted && <span className="opacity-80 scale-90 text-blue-300 font-semibold">(معدلة)</span>}
//                     <span>{msg.timestamp ? format(msg.timestamp, 'hh:mm a') : ''}</span>
//                     {isMe && (<span>{msg.status === 'read' ? <CheckCheck className="h-3 w-3 text-cyan-300" /> : <Check className="h-3 w-3" />}</span>)}
//                   </div>
//                 </div>
//               </div>
//             );
//           })
//         )}
//         <div ref={messagesEndRef} />
//       </main>

//       {/* شريط مؤشر تعديل الرسالة الحالي */}
//       {editingMessage && (
//         <div className="w-full bg-yellow-500/10 border-t border-yellow-500/20 px-4 py-1.5 flex items-center justify-between text-xs text-yellow-600 dark:text-yellow-400 flex-shrink-0">
//           <div className="flex items-center gap-2 truncate max-w-[80%]">
//             <Edit2 className="h-3.5 w-3.5" />
//             <span className="font-semibold">جاري التعديل:</span>
//             <span className="truncate italic text-gray-400">"{editingMessage.text}"</span>
//           </div>
//           <button onClick={handleCancelEdit} className="p-1 rounded-full hover:bg-slate-700 text-gray-400 hover:text-gray-200">
//             <X className="h-4 w-4" />
//           </button>
//         </div>
//       )}

//       {/* مؤشر الرفع المتزامن */}
//       {(c.isUploading || storeMessageMutation.isLoading) && (
//         <div className="w-full bg-blue-100 dark:bg-blue-900 p-1 text-center text-xs font-semibold text-blue-600 animate-pulse flex-shrink-0">
//           جاري المزامنة والرفع...
//         </div>
//       )}

//       {/* الـ Footer */}
//       <footer className="p-3 bg-white border-t border-gray-200 dark:bg-[#1e293b] dark:border-slate-800 flex-shrink-0">
//         <div className="flex items-center gap-2 max-w-4xl mx-auto">
//           <div className="flex flex-1 items-center gap-2 rounded-full bg-gray-100 px-3 py-1.5 dark:bg-slate-800">
//             <label className="cursor-pointer p-1 text-gray-500 hover:text-gray-700 dark:text-gray-400">
//               <Paperclip className="h-5 w-5" />
//               <input type="file" className="hidden" onChange={(e) => e.target.files[0] && c.uploadFileAndSend(e.target.files[0], 'file', '')} />
//             </label>
//             <label className="cursor-pointer p-1 text-gray-500 hover:text-gray-700 dark:text-gray-400">
//               <Camera className="h-5 w-5" />
//               <input type="file" accept="image/*" className="hidden" onChange={(e) => e.target.files[0] && c.uploadFileAndSend(e.target.files[0], 'image', 'أرسل صورة')} />
//             </label>
//             {c.isRecording ? (
//               <div className="flex-1 text-sm text-red-500 font-bold animate-pulse px-2">🔴 جاري تسجيل الصوت...</div>
//             ) : (
//               <input type="text" value={c.text} onChange={(e) => c.setText(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleSendOrUpdate()} placeholder="اكتب رسالتك هنا..." className="flex-1 bg-transparent text-sm outline-none border-none focus:ring-0 text-gray-950 dark:text-gray-50" />
//             )}
//           </div>
//           {c.text.trim().length > 0 ? (
//             <button onClick={handleSendOrUpdate} className="flex h-10 w-10 min-w-[40px] items-center justify-center rounded-full bg-blue-600 text-white shadow hover:bg-blue-700 transition">
//               <Send className="h-5 w-5" style={{ transform: 'scaleX(-1)' }} />
//             </button>
//           ) : (
//             <button disabled={!!editingMessage} onClick={c.isRecording ? c.stopAudioRecording : c.startAudioRecording} className={`flex h-10 w-10 min-w-[40px] items-center justify-center rounded-full text-white shadow transition ${c.isRecording ? 'bg-red-500 hover:bg-red-600' : 'bg-blue-600 hover:bg-blue-700'}`}>
//               {c.isRecording ? <Square className="h-5 w-5 fill-current" /> : <Mic className="h-5 w-5" />}
//             </button>
//           )}
//         </div>
//       </footer>
//     </div>
//   );
// }

import React, { useRef, useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useChatController } from "../../firebase";
import {
  Send,
  Mic,
  Square,
  Paperclip,
  Camera,
  FileText,
  ArrowLeft,
  Check,
  CheckCheck,
  Loader2,
  Play,
  Pause,
  Trash2,
  Edit2,
  X,
} from "lucide-react";
import { format } from "date-fns";
import { db } from "../../firebase";
import { doc, onSnapshot } from "firebase/firestore";
import chatService from "../../services/chatService";
import apiClient from "../../config/apiClient";
import { host_chat } from "../../config/apiClient";

const BACKEND_URL = host_chat;

// كائن صوت عالمي مستقر لا يتأثر بالـ Re-renders
const globalAudioPlayer = new Audio();

export default function ChatView() {
  const navigate = useNavigate();
  const location = useLocation();

  // استقبال البيانات الممررة من قائمة المحادثات
  const {
    chatId: targetId,
    currentUserId: myUserId,
    chatName = "غرفة محادثة",
    avatarUrl = "",
    role = "مركز الشفاء الطبي",
    isActive = true,
  } = location.state || {};

  const userId = myUserId;

  // الحالات المحلية (State)
  const [firebaseRoomKey, setFirebaseRoomKey] = useState("");
  const [editingMessage, setEditingMessage] = useState(null);
  const [presenceData, setPresenceData] = useState(null);
  const [tick, setTick] = useState(0);

  // تتبع الحالات الرسومية للـ UI الخاصة بالصوت
  const [playingMessageId, setPlayingMessageId] = useState("");
  const [audioProgress, setAudioProgress] = useState(0);
  const [audioDuration, setAudioDuration] = useState(0);
  const [loadingAudioId, setLoadingAudioId] = useState("");

  // هوكات الـ TanStack Query الخاصة بالربط والمزامنة
  const getOrCreateRoomMutation = chatService.useGetOrCreateRoomMutation();
  const storeMessageMutation = chatService.useStoreMessageMutation();

  // ربط الكنترولر بمفتاح الغرفة والمعرف الحالي
  const c = useChatController(firebaseRoomKey || "placeholder_room", userId);
  const messagesEndRef = useRef(null);

  // =============================================================
  // 🔄 1. جلب أو إنشاء الغرفة من الـ لارافل
  // =============================================================
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

  // =============================================================
  // 🟢 2. مراقبة الـ Presence والتواجد الحي الشامل (تم التعديل الجذري)
  // =============================================================
  useEffect(() => {
    const currentStatus = presenceData?.status || c.peerPresence?.status;
    if (currentStatus === "offline") {
      const timer = setInterval(() => {
        setTick((prev) => prev + 1);
      }, 10000);
      return () => clearInterval(timer);
    }
  }, [presenceData?.status, c.peerPresence?.status]);

  useEffect(() => {
    if (!firebaseRoomKey || firebaseRoomKey === "placeholder_room" || !targetId)
      return;

    const roomRef = doc(db, "ChatRooms", firebaseRoomKey);

    const unsub = onSnapshot(roomRef, (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        const presenceMap = data.presence || {};

        // 🛠 صياغة هجينة ذكية لقراءة الطرف الآخر بالصيغتين الرقمية والنصية (تمنع مشكلة الظهور اللعينة)
        const formattedTargetId = String(targetId).startsWith("user_")
          ? String(targetId)
          : `user_${targetId}`;
        const rawTargetId = String(targetId).replace("user_", "");

        const peerData =
          presenceMap[formattedTargetId] || presenceMap[rawTargetId];

        if (peerData && typeof peerData === "object") {
          setPresenceData(peerData);
        } else {
          // استماع احتياطي لكولكشن الحالات المستقلة
          const fallbackRef = doc(db, "UsersStatus", formattedTargetId);
          onSnapshot(fallbackRef, (statusSnap) => {
            if (statusSnap.exists()) {
              setPresenceData(statusSnap.data());
            }
          });
        }
      }
    });

    // 🎯 تحديث حالتي الحالية بشكل متزامن فوري عند الدخول
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
      if (typeof c.updateUserPresence === "function") {
        c.updateUserPresence("offline");
      }
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      unsub();
    };
  }, [firebaseRoomKey, c.currentUserId, targetId]); // تم ربطها بـ c.currentUserId لضمان الجاهزية

  // دمج حالة الحضور المفصّلة والمستقرة
  const finalPresence = presenceData || c.peerPresence;

  // =============================================================
  // 🎵 3. منطق تشغيل الريكوردات والصوت
  // =============================================================
  const formatTime = (timeInSeconds) => {
    if (!isFinite(timeInSeconds) || isNaN(timeInSeconds) || timeInSeconds < 0)
      return "0:00";
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
      if (playingMessageId) {
        if (isFinite(player.duration) && player.duration > 0) {
          setAudioDuration(player.duration);
        } else if (player.seekable && player.seekable.length > 0) {
          setAudioDuration(player.seekable.end(0));
        }
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

    const safeUrl = fileUrl
      ? fileUrl.replace(/http:\/\/[0-9.]+:8000/, BACKEND_URL)
      : "";
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

  // =============================================================
  // ✉️ 4. منطق الإرسال، التعديل والمزامنة
  // =============================================================
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [c.messages]);

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

  if (
    getOrCreateRoomMutation.isLoading ||
    !firebaseRoomKey ||
    c.isRoomLoading
  ) {
    return (
      <div className="flex h-full w-full items-center justify-center theme-bg">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin theme-text-accent mx-auto mb-2" />
          <p className="text-xs theme-text-muted">
            جاري تأمين الاتصال بالغرفة...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      className="flex h-full max-h-full w-full flex-col theme-bg theme-text overflow-hidden"
      dir="rtl"
    >
      {/* الـ Header */}
      <header className="flex h-16 w-full items-center justify-between border-b theme-border theme-surface px-4 shadow-sm flex-shrink-0 z-10">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="rounded-full p-1 theme-hover-surface"
          >
            <ArrowLeft className="h-6 w-6 theme-text" />
          </button>

          <div className="relative">
            {avatarUrl && avatarUrl !== "group_placeholder" ? (
              <img
                src={avatarUrl}
                alt={chatName}
                className="h-10 w-10 rounded-full object-cover"
              />
            ) : (
              <div className="flex h-10 w-10 items-center justify-center rounded-full theme-accent-soft theme-text-accent">
                <span className="font-bold">
                  {chatName ? chatName[0] : "?"}
                </span>
              </div>
            )}

            {(finalPresence?.status === "online" ||
              finalPresence?.isOnline === true) && (
              <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white bg-green-500 dark:border-gray-900" />
            )}
          </div>

          <div>
            <h2 className="text-sm font-bold max-w-[200px] truncate theme-text">
              {chatName}
            </h2>
            <p className="text-xs theme-text-muted">
              {role} • {c.formatLastSeen(finalPresence)}
            </p>
          </div>
        </div>
      </header>

      {/* منطقة عرض الرسائل */}
      <main className="flex-1 overflow-y-auto p-4 space-y-3 no-scrollbar">
        {c.messages && c.messages.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center theme-text-muted">
            <p className="text-sm">لا توجد رسائل سابقة في الغرفة.</p>
          </div>
        ) : (
          c.messages &&
          [...c.messages].reverse().map((msg) => {
            const isMe =
              String(msg.senderId) === String(c.currentUserId) ||
              String(msg.senderId) === String(userId);
            const isDeleted = msg.type === "deleted";
            const safeFileUrl = msg.fileUrl
              ? msg.fileUrl.replace(/http:\/\/[0-9.]+:8000/, BACKEND_URL)
              : "";

            return (
              <div
                key={msg.messageId}
                className={`flex items-center gap-1 relative group ${isMe ? "justify-start" : "justify-end"}`}
              >
                {/* خيارات التعديل والحذف للرسائل التابعة للمستخدم الحالي */}
                {isMe && !isDeleted && (
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-150 flex items-center gap-1 mx-2 z-10 order-last">
                    {msg.type === "text" && (
                      <button
                        onClick={() => handleStartEdit(msg)}
                        className="p-1 rounded-full theme-text-muted hover:text-blue-500 hover:theme-hover-surface"
                      >
                        <Edit2 className="h-3.5 w-3.5" />
                      </button>
                    )}
                    <button
                      onClick={() => {
                        if (typeof c.deleteMessage === "function")
                          c.deleteMessage(msg.messageId);
                      }}
                      className="p-1 rounded-full theme-text-muted hover:text-red-500 hover:theme-hover-surface"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                )}

                {/* تصميم الفقاعات */}
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
                  {isDeleted && (
                    <p className="text-sm leading-relaxed">🚫 {msg.text}</p>
                  )}
                  {!isDeleted && msg.type === "text" && (
                    <p className="text-sm leading-relaxed whitespace-pre-wrap">
                      {msg.text}
                    </p>
                  )}

                  {/* الصور */}
                  {!isDeleted && msg.type === "image" && msg.fileUrl && (
                    <div className="overflow-hidden rounded-lg cursor-pointer mt-1">
                      <img
                        src={safeFileUrl}
                        alt="المرفق"
                        className="max-h-60 w-full object-cover hover:scale-105 transition-transform"
                      />
                    </div>
                  )}

                  {/* الملفات والمستندات */}
                  {!isDeleted && msg.type === "file" && msg.fileUrl && (
                    <a
                      href={safeFileUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-2 p-2 rounded theme-surface theme-text text-xs font-semibold mt-1"
                    >
                      <FileText className="h-8 w-8 text-red-500" />
                      <div className="truncate max-w-[150px]">
                        <p className="truncate theme-text">
                          {msg.text || "ملف مستند"}
                        </p>
                        <span className="text-[10px] theme-text-muted">
                          انقر للفتح
                        </span>
                      </div>
                    </a>
                  )}

                  {/* التسجيلات الصوتية */}
                  {!isDeleted && msg.type === "audio" && msg.fileUrl && (
                    <div
                      className="flex items-center gap-3 w-56 p-1 mt-1 theme-text"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <button
                        type="button"
                        onClick={(e) =>
                          handlePlayOrPauseAudio(e, msg.messageId, msg.fileUrl)
                        }
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
                          max={
                            playingMessageId === msg.messageId &&
                            isFinite(audioDuration) &&
                            audioDuration > 0
                              ? audioDuration
                              : 100
                          }
                          value={
                            playingMessageId === msg.messageId
                              ? audioProgress
                              : 0
                          }
                          onChange={(e) => {
                            if (playingMessageId === msg.messageId) {
                              const newTime = parseFloat(e.target.value);
                              globalAudioPlayer.currentTime = newTime;
                              setAudioProgress(newTime);
                            }
                          }}
                          className="w-full h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-teal-500"
                        />
                        <span
                          className={`text-[10px] ${isMe ? "text-teal-100" : "theme-text-muted"}`}
                        >
                          {loadingAudioId === msg.messageId
                            ? "جاري التحميل..."
                            : playingMessageId === msg.messageId
                              ? `${formatTime(audioProgress)} / ${formatTime(audioDuration)}`
                              : "🎤 تسجيل صوتي"}
                        </span>
                      </div>
                    </div>
                  )}

                  {/* التوقيت والحالة */}
                  <div
                    className={`flex items-center justify-end gap-1 mt-1 text-[10px] ${isMe ? "text-teal-200" : "theme-text-muted"}`}
                  >
                    {msg.isEdited && !isDeleted && (
                      <span className="opacity-80 scale-90 text-teal-300 font-semibold">
                        (معدلة)
                      </span>
                    )}
                    <span>
                      {msg.timestamp ? format(msg.timestamp, "hh:mm a") : ""}
                    </span>
                    {isMe && (
                      <span>
                        {msg.status === "read" ? (
                          <CheckCheck className="h-3 w-3 text-cyan-300" />
                        ) : (
                          <Check className="h-3 w-3" />
                        )}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </main>

      {/* شريط مؤشر تعديل الرسالة الحالي */}
      {editingMessage && (
        <div className="w-full bg-yellow-500/10 border-t border-yellow-500/20 px-4 py-1.5 flex items-center justify-between text-xs text-yellow-600 dark:text-yellow-400 flex-shrink-0">
          <div className="flex items-center gap-2 truncate max-w-[80%]">
            <Edit2 className="h-3.5 w-3.5" />
            <span className="font-semibold">جاري التعديل:</span>
            <span className="truncate italic theme-text-muted">
              "{editingMessage.text}"
            </span>
          </div>
          <button
            onClick={handleCancelEdit}
            className="p-1 rounded-full hover:bg-slate-700 text-gray-400 hover:text-gray-200"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* مؤشر الرفع المتزامن */}
      {(c.isUploading || storeMessageMutation.isLoading) && (
        <div className="w-full bg-blue-100 dark:bg-blue-900 p-1 text-center text-xs font-semibold text-blue-600 animate-pulse flex-shrink-0">
          جاري المزامنة والرفع...
        </div>
      )}

      {/* الـ Footer */}
      <footer className="chat-input-fixed p-3 theme-surface border-t theme-border">
        <div className="flex items-center gap-2 max-w-4xl mx-auto">
          <div className="flex flex-1 items-center gap-2 rounded-full theme-bg px-3 py-1.5">
            <label className="cursor-pointer p-1 theme-text-muted hover:theme-text">
              <Paperclip className="h-5 w-5" />
              <input
                type="file"
                className="hidden"
                onChange={(e) =>
                  e.target.files[0] &&
                  c.uploadFileAndSend(e.target.files[0], "file", "")
                }
              />
            </label>
            <label className="cursor-pointer p-1 theme-text-muted hover:theme-text">
              <Camera className="h-5 w-5" />
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) =>
                  e.target.files[0] &&
                  c.uploadFileAndSend(e.target.files[0], "image", "أرسل صورة")
                }
              />
            </label>
            {c.isRecording ? (
              <div className="flex-1 text-sm text-red-500 font-bold animate-pulse px-2">
                🔴 جاري تسجيل الصوت...
              </div>
            ) : (
              <input
                type="text"
                value={c.text}
                onChange={(e) => c.setText(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSendOrUpdate()}
                placeholder="اكتب رسالتك هنا..."
                className="flex-1 bg-transparent text-sm outline-none border-none focus:ring-0 theme-text placeholder:text-(--color-grey)"
              />
            )}
          </div>
          {c.text.trim().length > 0 ? (
            <button
              onClick={handleSendOrUpdate}
              className="flex h-10 w-10 min-w-[40px] items-center justify-center rounded-full theme-accent theme-text-on-accent shadow hover:opacity-90 transition"
            >
              <Send className="h-5 w-5" style={{ transform: "scaleX(-1)" }} />
            </button>
          ) : (
            <button
              disabled={!!editingMessage}
              onClick={
                c.isRecording ? c.stopAudioRecording : c.startAudioRecording
              }
              className={`flex h-10 w-10 min-w-[40px] items-center justify-center rounded-full text-white shadow transition ${c.isRecording ? "bg-red-500 hover:bg-red-600" : "theme-accent hover:opacity-90"}`}
            >
              {c.isRecording ? (
                <Square className="h-5 w-5 fill-current" />
              ) : (
                <Mic className="h-5 w-5" />
              )}
            </button>
          )}
        </div>
      </footer>
    </div>
  );
}
