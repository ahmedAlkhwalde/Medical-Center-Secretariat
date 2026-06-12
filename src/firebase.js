// import { initializeApp } from "firebase/app";
// import { getMessaging, getToken, onMessage } from "firebase/messaging";
// import { useState, useEffect, useRef } from 'react';
// import { 
//   getFirestore, collection, doc, onSnapshot, 
//   orderBy, query, writeBatch, addDoc, serverTimestamp,
//   updateDoc, deleteDoc 
// } from 'firebase/firestore';
// import { getAuth, signInAnonymously } from 'firebase/auth';
// import axios from 'axios';
// import { format } from 'date-fns';
// import apiClient from "./config/apiClient";

// const firebaseConfig = {
//   apiKey: "AIzaSyDC_PG6WCHGZpxFlQTRnysaivEI_szYslg",
//   authDomain: "doctor-app-syria-2026.firebaseapp.com",
//   projectId: "doctor-app-syria-2026",
//   storageBucket: "doctor-app-syria-2026.firebasestorage.app",
//   messagingSenderId: "944253436216",
//   appId: "1:944253436216:web:81cdb24637f0426a1b01cd"
// };

// const app = initializeApp(firebaseConfig);
// export const db = getFirestore(app);
// export const auth = getAuth(app);
// export const messaging = getMessaging(app);

// export const requestForToken = async () => {
//   try {
//     if (!('serviceWorker' in navigator)) return null;

//     const currentToken = await getToken(messaging, {
//       vapidKey: "BOEPAyLu2aTAFd11s10SqIaZrxH4Trja5BXy9srigPG6B6_G3rLnVQ11jIB7QnhZBo0EQimotSVhDBevd8sb-r0"
//     });

//     if (currentToken) {
//       console.log("✅ Web Token الحجز جاهز:", currentToken);
//       return currentToken;
//     } else {
//       const permission = await Notification.requestPermission();
//       if (permission === 'granted') {
//         return await requestForToken();
//       }
//     }
//   } catch (err) {
//     console.log("❌ خطأ أثناء جلب التوكن:", err);
//     return null;
//   }
// };

// export const onMessageListener = () =>
//   new Promise((resolve) => {
//     onMessage(messaging, (payload) => {
//       resolve(payload);
//     });
//   });

// const LARAVEL_BASE = apiClient.create; 

// export const useChatController = (targetId) => {
//   const [messages, setMessages] = useState([]);
//   const [text, setText] = useState("");
//   const [isUploading, setIsUploading] = useState(false);
//   const [isRoomLoading, setIsRoomLoading] = useState(true);
//   const chatRoomId = "doctor_patient_123"; 
//   const currentUserId = "1"; 
//   const [isRecording, setIsRecording] = useState(false);
//   const mediaRecorderRef = useRef(null);
//   const audioChunksRef = useRef([]);

//   const [playingMessageId, setPlayingMessageId] = useState('');
//   const [audioProgress, setAudioProgress] = useState(0);
//   const [audioDuration, setAudioDuration] = useState(0);
//   const audioPlayerRef = useRef(new Audio());

//   const unsubscribeRef = useRef(null); 


// const formatLastSeen = (presenceData) => {
//   // 1. التأكد من وجود البيانات
//   if (!presenceData) return "غير متصل";
  
//   // 2. التحقق من الحالة (سواء كانت نصية أو داخل الماب)
//   const isOnline = presenceData.status === "online";
//   if (isOnline) return "نشط الآن";

//   // 3. الحصول على الوقت
//   const time = presenceData.lastSeen;
//   if (!time) return "غير متصل";
  
//   const now = Date.now();
//   const diffInSeconds = Math.floor((now - time) / 1000);

//   // 4. جعل النطاق أكثر مرونة (من 0 إلى 60 ثانية)
//   // بدل أن تكون < 1 فقط، اجعلها كل ما هو أقل من دقيقة
//   if (diffInSeconds < 1) {
//     return "آخر ظهور منذ لحظات";
//   }

//   // 5. إذا مر أكثر من دقيقة، أعطنا الوقت
//   return ` آخر ظهور ${format(new Date(time), 'hh:mm a')}`;
// };
  

//  // في ملف firebase.js
// const updateUserPresence = async (status) => {
//   if (!currentUserId || !chatRoomId) return;
  
//   const roomRef = doc(db, 'ChatRooms', chatRoomId);
  
//   // نرسل ماب (Map) تحتوي على الحالة والوقت دائماً
//   // هذا يضمن أن الويب والفلتر يقرؤون نفس الهيكل
//   await updateDoc(roomRef, {
//     [`presence.${currentUserId}`]: {
//       status: status, 
//       lastSeen: Date.now() // نرسل الوقت بالملي ثانية لتسهيل الحسابات
//     }
//   }).catch((error) => {
//     console.error("❌ خطأ في تحديث الحالة:", error);
//   });
// };


//   useEffect(() => {
//     if (targetId) {
//       prepareAndFetchRoom();
//     }
//     return () => {
//       if (unsubscribeRef.current) unsubscribeRef.current();
//       audioPlayerRef.current.pause();
//     };
//   }, [targetId]); 

//   const prepareAndFetchRoom = async () => {
//     try {
//       setIsRoomLoading(true);
//       if (!auth.currentUser) {
//         await signInAnonymously(auth);
//       }
//       if (unsubscribeRef.current) { unsubscribeRef.current(); }          
//       listenToMessages(chatRoomId, currentUserId);
//     } catch (e) {
//       console.error("خطأ في التهيئة:", e);
//     } finally {
//       setIsRoomLoading(false);
//     }
//   };

//   const listenToMessages = (roomKey, userId) => {
//     const q = query(
//       collection(db, 'ChatRooms', roomKey, 'Messages'),
//       orderBy('timestamp', 'desc')
//     );

//     unsubscribeRef.current = onSnapshot(q, (snapshot) => {
//       const msgs = snapshot.docs.map(doc => {
//         const data = doc.data();
//         return {
//           messageId: doc.id,
//           ...data,
//           senderId: String(data.senderId), 
//           timestamp: data.timestamp?.toDate() || new Date()
//         };
//       });
//       setMessages(msgs);
//       markIncomingMessagesAsRead(snapshot.docs, userId);
//     });
//   };

//   const markIncomingMessagesAsRead = async (docs, userId) => {
//     const batch = writeBatch(db);
//     let hasUpdates = false;
//     docs.forEach((docSnap) => {
//       const data = docSnap.data();
//       if (data.senderId !== userId && data.status !== 'read') {
//         batch.update(docSnap.ref, { status: 'read' });
//         hasUpdates = true;
//       }
//     });
//     if (hasUpdates) await batch.commit();
//   };

//   const sendMessage = async () => {
//     if (!text.trim() || !chatRoomId) return;
//     const msgText = text.trim();
//     setText("");
//     try {
//       await addDoc(collection(db, 'ChatRooms', chatRoomId, 'Messages'), {
//         senderId: currentUserId,
//         text: msgText,
//         timestamp: serverTimestamp(),
//         type: 'text',
//         status: 'sent'
//       });
//     } catch (e) {
//       console.error("فشل إرسال الرسالة:", e);
//       setText(msgText);
//     }
//   };

//   const updateMessage = async (messageId, newText) => {
//     if (!newText.trim() || !chatRoomId) return;
//     try {
//       const messageRef = doc(db, 'ChatRooms', chatRoomId, 'Messages', messageId);
//       await updateDoc(messageRef, {
//         text: newText.trim(),
//         isEdited: true, 
//         updatedAt: serverTimestamp()
//       });
//     } catch (e) {
//       console.error("❌ فشل تعديل الرسالة:", e);
//     }
//   };

//   const deleteMessage = async (messageId) => {
//     if (!chatRoomId) return;
//     try {
//       const messageRef = doc(db, 'ChatRooms', chatRoomId, 'Messages', messageId);
//       await updateDoc(messageRef, {
//         text: "تم حذف هذه الرسالة",
//         type: "deleted", 
//         isDeleted: true
//       });
//     } catch (e) {
//       console.error("❌ فشل حذف الرسالة:", e);
//     }
//   };

//   const uploadFileAndSend = async (file, type, defaultText) => {
//     if (!chatRoomId) return;
//     setIsUploading(true);
//     const formData = new FormData();
//     formData.append('file', file);
//     const uploadUrl = type === 'file' ? `${LARAVEL_BASE}/api/chat/attachments/upload` : `${LARAVEL_BASE}/api/chat/upload`;
//     try {
//       const response = await axios.post(uploadUrl, formData, { headers: { 'Content-Type': 'multipart/form-data' } });
//       if (response.status === 200) {
//         await addDoc(collection(db, 'ChatRooms', chatRoomId, 'Messages'), {
//           senderId: currentUserId,
//           text: type === 'file' ? file.name : defaultText,
//           timestamp: serverTimestamp(),
//           type: type,
//           fileUrl: response.data.url,
//           status: 'sent'
//         });
//       }
//     } catch (e) {
//       console.error("خطأ في رفع الملف:", e);
//     } finally {
//       setIsUploading(false);
//     }
//   };
  
//   const startAudioRecording = async () => {
//     try {
//       const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
//       mediaRecorderRef.current = new MediaRecorder(stream);
//       audioChunksRef.current = [];
//       mediaRecorderRef.current.ondataavailable = (e) => { if (e.data.size > 0) audioChunksRef.current.push(e.data); };
//       mediaRecorderRef.current.onstop = async () => {
//         const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/m4a' });
//         const audioFile = new File([audioBlob], `audio_${Date.now()}.m4a`, { type: 'audio/m4a' });
//         await uploadFileAndSend(audioFile, 'audio', 'تسجيل صوتي 🎤');
//       };
//       mediaRecorderRef.current.start();
//       setIsRecording(true);
//     } catch (e) { console.error(e); }
//   };

//   const stopAudioRecording = () => {
//     if (mediaRecorderRef.current && isRecording) {
//       mediaRecorderRef.current.stop();
//       setIsRecording(false);
//       mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
//     }
//   };

//   return {
//     messages, currentUserId, text, setText, isUploading, isRoomLoading, isRecording,
//     playingMessageId, audioProgress, audioDuration,
//     sendMessage, uploadFileAndSend, startAudioRecording, stopAudioRecording,
//     audioPlayerRef, updateUserPresence, formatLastSeen,
//     updateMessage, deleteMessage
//   };
// };

// export default app;

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////
















import { initializeApp } from "firebase/app";
import { getMessaging, getToken, onMessage } from "firebase/messaging";
import { useState, useEffect, useRef } from 'react';
import { 
  getFirestore, collection, doc, onSnapshot, 
  orderBy, query, writeBatch, addDoc, serverTimestamp,
  updateDoc, deleteDoc 
} from 'firebase/firestore';
import { getAuth, signInAnonymously } from 'firebase/auth';
import { format } from 'date-fns';
// import apiClient from "./config/apiClient";
import chatService from "./app/services/chatService"; 

const firebaseConfig = {
  apiKey: "AIzaSyDC_PG6WCHGZpxFlQTRnysaivEI_szYslg",
  authDomain: "doctor-app-syria-2026.firebaseapp.com",
  projectId: "doctor-app-syria-2026",
  storageBucket: "doctor-app-syria-2026.firebasestorage.app",
  messagingSenderId: "944253436216",
  appId: "1:944253436216:web:81cdb24637f0426a1b01cd"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
export const messaging = getMessaging(app);

export const requestForToken = async () => {
  try {
    if (!('serviceWorker' in navigator)) return null;

    const currentToken = await getToken(messaging, {
      vapidKey: "BOEPAyLu2aTAFd11s10SqIaZrxH4Trja5BXy9srigPG6B6_G3rLnVQ11jIB7QnhZBo0EQimotSVhDBevd8sb-r0"
    });

    if (currentToken) {
      console.log("✅ Web Token الحجز جاهز:", currentToken);
      return currentToken;
    } else {
      const permission = await Notification.requestPermission();
      if (permission === 'granted') {
        return await requestForToken();
      }
    }
  } catch (err) {
    console.log("❌ خطأ أثناء جلب التوكن:", err);
    return null;
  }
};

export const onMessageListener = () =>
  new Promise((resolve) => {
    onMessage(messaging, (payload) => {
      resolve(payload);
    });
  });


export const useChatController = (roomKey, myUserId) => {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [isRoomLoading, setIsRoomLoading] = useState(true);
  
  const chatRoomId = roomKey && roomKey !== "placeholder_room" ? roomKey : "doctor_patient_123";
  const currentUserId = myUserId ? String(myUserId) : "1";

  const [isRecording, setIsRecording] = useState(false);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);

  const [playingMessageId, setPlayingMessageId] = useState('');
  const [audioProgress, setAudioProgress] = useState(0);
  const [audioDuration, setAudioDuration] = useState(0);
  const audioPlayerRef = useRef(new Audio());

  const unsubscribeRef = useRef(null); 

  const formatLastSeen = (presenceData) => {
    if (!presenceData) return "غير متصل";
    const isOnline = presenceData.status === "online";
    if (isOnline) return "نشط الآن";
    const time = presenceData.lastSeen;
    if (!time) return "غير متصل";
    const now = Date.now();
    const diffInSeconds = Math.floor((now - time) / 1000);
    if (diffInSeconds < 60) return "آخر ظهور منذ لحظات";
    return `آخر ظهور ${format(new Date(time), 'hh:mm a')}`;
  };

  const updateUserPresence = async (status) => {
    if (!currentUserId || !chatRoomId || chatRoomId === "placeholder_room") return;
    const roomRef = doc(db, 'ChatRooms', chatRoomId);
    await updateDoc(roomRef, {
      [`presence.${currentUserId}`]: { status: status, lastSeen: Date.now() }
    }).catch((error) => {
      console.error("❌ خطأ في تحديث الحالة على الفايربيس:", error);
    });
  };

  useEffect(() => {
    if (chatRoomId) {
      prepareAndFetchRoom();
    }
    return () => {
      if (unsubscribeRef.current) unsubscribeRef.current();
      audioPlayerRef.current.pause();
    };
  }, [chatRoomId, currentUserId]); 

  const prepareAndFetchRoom = async () => {
    try {
      setIsRoomLoading(true);
      if (!auth.currentUser) {
        await signInAnonymously(auth);
      }
      if (unsubscribeRef.current) { unsubscribeRef.current(); }          
      listenToMessages(chatRoomId, currentUserId);
    } catch (e) {
      console.error("خطأ في تهيئة المحادثة:", e);
    } finally {
      setIsRoomLoading(false);
    }
  };

  const listenToMessages = (roomKey, userId) => {
    const q = query(collection(db, 'ChatRooms', roomKey, 'Messages'), orderBy('timestamp', 'desc'));
    unsubscribeRef.current = onSnapshot(q, (snapshot) => {
      const msgs = snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          messageId: doc.id,
          ...data,
          senderId: String(data.senderId), 
          timestamp: data.timestamp?.toDate() || new Date()
        };
      });
      setMessages(msgs);
      markIncomingMessagesAsRead(snapshot.docs, userId);
    });
  };

  const markIncomingMessagesAsRead = async (docs, userId) => {
    const batch = writeBatch(db);
    let hasUpdates = false;
    docs.forEach((docSnap) => {
      const data = docSnap.data();
      if (String(data.senderId) !== String(userId) && data.status !== 'read') {
        batch.update(docSnap.ref, { status: 'read' });
        hasUpdates = true;
      }
    });
    if (hasUpdates) await batch.commit();
  };

  // إرسال الرسالة النصية مع عزل خطأ لارافل لحماية الشات الحي
  const sendMessage = async () => {
    if (!text.trim() || !chatRoomId) return;
    const msgText = text.trim();
    setText("");
    try {
      // 1. الحفظ في الفايربيس أولاً (ليظهر فوراً عند الطرف الآخر)
      await addDoc(collection(db, 'ChatRooms', chatRoomId, 'Messages'), {
        senderId: currentUserId,
        text: msgText,
        timestamp: serverTimestamp(),
        type: 'text',
        status: 'sent'
      });

      // 2. المزامنة مع لارافل داخل بلوك معزول من التراي والكاتش
      try {
        await chatService.storeMessageApi({
          chatRoomId: chatRoomId,
          senderId: currentUserId.replace('user_', ''), // تنظيف وحماية الـ ID
          type: 'text',
          text: msgText,
          fileUrl: ''
        });
      } catch (laravelErr) {
        console.error("⚠️ فشل حفظ الرسالة بجدول السيرفر، لكنها أرسلت حياً بالفايربيس:", laravelErr);
      }

    } catch (e) {
      console.error("❌ فشل إرسال الرسالة كلياً للفايربيس:", e);
      setText(msgText);
    }
  };

  const updateMessage = async (messageId, newText) => {
    if (!newText.trim() || !chatRoomId) return;
    try {
      const messageRef = doc(db, 'ChatRooms', chatRoomId, 'Messages', messageId);
      await updateDoc(messageRef, { text: newText.trim(), isEdited: true, updatedAt: serverTimestamp() });
    } catch (e) { console.error("❌ فشل تعديل الرسالة:", e); }
  };

  const deleteMessage = async (messageId) => {
    if (!chatRoomId) return;
    try {
      const messageRef = doc(db, 'ChatRooms', chatRoomId, 'Messages', messageId);
      await updateDoc(messageRef, { text: "تم حذف هذه الرسالة", type: "deleted", isDeleted: true });
    } catch (e) { console.error("❌ فشل حذف الرسالة:", e); }
  };



// رفع الملفات والمستندات مع تأمين البيانات المرسلة للسيرفر
  const uploadFileAndSend = async (file, type, defaultText) => {
    if (!chatRoomId) return;
    setIsUploading(true);
    try {
      let uploadResponse;
      const cleanSenderId = currentUserId.replace('user_', '');

      // 1. الرفع عبر السيرفس المتوافق
      if (type === 'file') {
        uploadResponse = await chatService.uploadAttachmentApi({
          file: file,
          fileName: file.name,
          chatRoomId: chatRoomId,
          senderId: cleanSenderId
        });
      } else {
        uploadResponse = await chatService.uploadFileOrMediaApi({
          file: file,
          type: type,
          chatRoomId: chatRoomId,
          senderId: cleanSenderId
        });
      }

      // استخراج الرابط بشكل آمن حسب طريقة بناء الـ Response من لارافل
      const fileUrl = uploadResponse?.url || uploadResponse?.data?.url;

      if (fileUrl) {
        const messageText = type === 'file' ? file.name : defaultText;

        // 2. المزامنة اللحظية بالفايربيس لتظهر في الشات فوراً للطرفين
        await addDoc(collection(db, 'ChatRooms', chatRoomId, 'Messages'), {
          senderId: currentUserId,
          text: messageText,
          timestamp: serverTimestamp(),
          type: type,
          fileUrl: fileUrl,
          status: 'sent'
        });

        // 3. المزامنة الخلفية مع لارافل (نقوم بها فقط للصوت والصورة، ونمنعها للمستندات لمنع الـ 500)
        if (type !== 'file') {
          try {
            await chatService.storeMessageApi({
              chatRoomId: chatRoomId,
              senderId: cleanSenderId,
              type: type,
              text: messageText,
              fileUrl: fileUrl
            });
            console.log(`✅ [Laravel Sync] تمت مزامنة رسالة [${type}] بنجاح مع السيرفر.`);
          } catch (syncErr) {
            console.error("⚠️ فشل التخزين الاحتياطي بالمزامنة:", syncErr);
          }
        } else {
          // في حال كان ملفاً (document)، لارافل يخزنه تلقائياً أثناء الرفع مثل فلاتر
          console.log("✅ [File Success] تم رفع الملف وحفظه بالسيرفر والفايربيس كفلاتر تماماً وتجنبنا الـ 500 الزائدة.");
        }

      } else {
        console.error("❌ لم يعُد السيرفر برابط صالح للملف المرفوع.");
      }
    } catch (e) {
      console.error("❌ خطأ أثناء معالجة رفع الملف المرفق:", e);
    } finally {
      setIsUploading(false);
    }
  };

  const startAudioRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      audioChunksRef.current = [];
      mediaRecorderRef.current.ondataavailable = (e) => { if (e.data.size > 0) audioChunksRef.current.push(e.data); };
      
      mediaRecorderRef.current.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/m4a' });
        const audioFile = new File([audioBlob], `audio_${Date.now()}.m4a`, { type: 'audio/m4a' });
        await uploadFileAndSend(audioFile, 'audio', 'تسجيل صوتي 🎤');
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
    } catch (e) { console.error("❌ فشل المايكروفون:", e); }
  };

  const stopAudioRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
    }
  };

  return {
    messages, currentUserId, text, setText, isUploading, setIsUploading, isRoomLoading, isRecording,
    playingMessageId, audioProgress, audioDuration,
    sendMessage, uploadFileAndSend, startAudioRecording, stopAudioRecording,
    audioPlayerRef, updateUserPresence, formatLastSeen, updateMessage, deleteMessage
  };
};

export default app;