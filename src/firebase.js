import { initializeApp } from "firebase/app";
import { getMessaging, getToken, onMessage } from "firebase/messaging";
import { useState, useEffect, useRef } from 'react';
import { 
  getFirestore, collection, doc, onSnapshot, 
  orderBy, query, writeBatch, addDoc, serverTimestamp,
  updateDoc, deleteDoc, setDoc
} from 'firebase/firestore';
import { getAuth, signInAnonymously } from 'firebase/auth';
import { format } from 'date-fns';
import chatService from "./features/chat/service/chatService"; 

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
      if (permission === 'granted') return await requestForToken();
    }
  } catch (err) {
    console.log("❌ خطأ أثناء جلب التوكن:", err);
    return null;
  }
};

export const onMessageListener = () =>
  new Promise((resolve) => {
    onMessage(messaging, (payload) => { resolve(payload); });
  });

export const useChatController = (roomKey, myUserId) => {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [isRoomLoading, setIsRoomLoading] = useState(true);
  
  // حالة مراقبة حضور الطرف الآخر المحدثة
  const [peerPresence, setPeerPresence] = useState(null);
  
  const chatRoomId = roomKey && roomKey !== "placeholder_room" ? roomKey : "doctor_patient_123";
  
  // صياغة المعرف الخاص بي ليكون متوافقاً مع الفلاتر (مثال: user_7 أو user_1)
  const currentUserId = myUserId ? (String(myUserId).startsWith("user_") ? String(myUserId) : `user_${myUserId}`) : "user_1";

  const [isRecording, setIsRecording] = useState(false);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);

  const [playingMessageId, setPlayingMessageId] = useState('');
  const [audioProgress, setAudioProgress] = useState(0);
  const [audioDuration, setAudioDuration] = useState(0);
  const audioPlayerRef = useRef(new Audio());

  const unsubscribeRef = useRef(null); 
  const unsubscribePresenceRef = useRef(null);

  // تنسيق ذكي لآخر ظهور متوافق مع الفلاتر والويب
  const formatLastSeen = (presenceData) => {
    if (!presenceData) return "غير متصل";
    
    if (presenceData.status === "online" || presenceData.isOnline === true) {
      return "نشط الآن";
    }
    
    const timeData = presenceData.lastSeen;
    if (!timeData) return "غير متصل";
    
    let timeInMillis = typeof timeData.toDate === 'function' ? timeData.toDate().getTime() : Number(timeData);
    if (!timeInMillis || isNaN(timeInMillis)) return "غير متصل";

    const now = Date.now();
    // const diffInSeconds = Math.floor((now - timeInMillis) / 1000);
    // if (diffInSeconds < 60) return "آخر ظهور منذ لحظات";
    
    return `آخر ظهور ${format(new Date(timeInMillis), 'hh:mm a')}`;
  };

  // 🎯 الدالة السحرية التي ستحدث كولكشن UsersStatus (لتصبح true) وماب الغرفة معاً فوراً
  const updateUserPresence = async (status) => {
    if (!currentUserId || !chatRoomId || chatRoomId === "placeholder_room") return;
    
    const isOnlineBool = status === "online";
    const userStatusRef = doc(db, 'UsersStatus', currentUserId);
    const roomRef = doc(db, 'ChatRooms', chatRoomId);
    
    const rawIdWithoutPrefix = currentUserId.replace('user_', '');
    const currentTimestamp = Date.now();

    try {
      // 1. تحديث كولكشن صورتك (UsersStatus -> user_x) لتتحول القيمة حياً إلى true أو false
      await setDoc(userStatusRef, {
        isOnline: isOnlineBool,
        lastSeen: currentTimestamp
      }, { merge: true });

      // 2. تحديث ماب الغرفة الداخلي بالصيغتين النظيفة والموسومة لحماية قراءة الفلاتر
      await setDoc(roomRef, {
        presence: {
          [currentUserId]: { status: status, lastSeen: currentTimestamp },
          [rawIdWithoutPrefix]: { status: status, lastSeen: currentTimestamp }
        }
      }, { merge: true });

      console.log(`Presence updated successfully for ${currentUserId} to ${status}`);
    } catch (error) {
      console.error("❌ فشل تحديث التواجد الحظي في قاعدة البيانات:", error);
    }
  };

  useEffect(() => {
    if (chatRoomId && chatRoomId !== "placeholder_room") {
      prepareAndFetchRoom();
    }
    return () => {
      if (unsubscribeRef.current) unsubscribeRef.current();
      if (unsubscribePresenceRef.current) unsubscribePresenceRef.current();
      audioPlayerRef.current.pause();
    };
  }, [chatRoomId, currentUserId]); 

  const prepareAndFetchRoom = async () => {
    try {
      setIsRoomLoading(true);
      if (!auth.currentUser) await signInAnonymously(auth);
      
      if (unsubscribeRef.current) unsubscribeRef.current(); 
      if (unsubscribePresenceRef.current) unsubscribePresenceRef.current();

      listenToMessages(chatRoomId, currentUserId);
      listenToPeerPresenceDynamically(chatRoomId, currentUserId);
      
      // بمجرد الدخول والتهيئة، نرفع حالتنا فوراً إلى أونلاين
      await updateUserPresence("online");
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

  // دالة الاستماع المتطورة للطرف الآخر (تراقب الغرفة والكولكشن الخارجي معاً)
  const listenToPeerPresenceDynamically = (roomKey, userId) => {
    const roomRef = doc(db, 'ChatRooms', roomKey);
    const cleanMyId = String(userId).replace('user_', '');

    unsubscribePresenceRef.current = onSnapshot(roomRef, (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        const presenceMap = data.presence || {};
        
        const peerKey = Object.keys(presenceMap).find(key => {
          const cleanKey = String(key).replace('user_', '');
          return cleanKey !== cleanMyId;
        });
        
        if (peerKey && presenceMap[peerKey]) {
          setPeerPresence(presenceMap[peerKey]);
        } else {
          // استماع احتياطي في حال عدم تهيئة الماب داخل المستند للروم
          const fallbackPeerId = cleanMyId === "1" ? "user_7" : "user_1"; 
          const fallbackRef = doc(db, 'UsersStatus', fallbackPeerId);
          onSnapshot(fallbackRef, (statusSnap) => {
            if (statusSnap.exists()) setPeerPresence(statusSnap.data());
          });
        }
      }
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

  const sendMessage = async () => {
    if (!text.trim() || !chatRoomId) return;
    const msgText = text.trim();
    setText("");
    try {
      await addDoc(collection(db, 'ChatRooms', chatRoomId, 'Messages'), {
        senderId: currentUserId,
        text: msgText,
        timestamp: serverTimestamp(),
        type: 'text',
        status: 'sent'
      });
      try {
        await chatService.storeMessageApi({
          chatRoomId: chatRoomId,
          senderId: currentUserId.replace('user_', ''), 
          type: 'text',
          text: msgText,
          fileUrl: ''
        });
      } catch (laravelErr) {
        console.error("⚠️ فشل المزامنة مع سيرفر لارافيل:", laravelErr);
      }
    } catch (e) {
      console.error("❌ فشل إرسال الرسالة لفايربيس:", e);
      setText(msgText);
    }
  };

  const updateMessage = async (messageId, newText) => {
    if (!newText.trim() || !chatRoomId) return;
    try {
      const messageRef = doc(db, 'ChatRooms', chatRoomId, 'Messages', messageId);
      await updateDoc(messageRef, { text: newText.trim(), isEdited: true, updatedAt: serverTimestamp() });
    } catch (e) { console.error(e); }
  };

  const deleteMessage = async (messageId) => {
    if (!chatRoomId) return;
    try {
      const messageRef = doc(db, 'ChatRooms', chatRoomId, 'Messages', messageId);
      await updateDoc(messageRef, { text: "تم حذف هذه الرسالة", type: "deleted", isDeleted: true });
    } catch (e) { console.error(e); }
  };

  const uploadFileAndSend = async (file, type, defaultText) => {
    if (!chatRoomId) return;
    setIsUploading(true);
    try {
      let uploadResponse;
      const cleanSenderId = currentUserId.replace('user_', '');
      if (type === 'file') {
        uploadResponse = await chatService.uploadAttachmentApi({
          file: file, fileName: file.name, chatRoomId: chatRoomId, senderId: cleanSenderId
        });
      } else {
        uploadResponse = await chatService.uploadFileOrMediaApi({
          file: file, type: type, chatRoomId: chatRoomId, senderId: cleanSenderId
        });
      }
      const fileUrl = uploadResponse?.url || uploadResponse?.data?.url;
      if (fileUrl) {
        const messageText = type === 'file' ? file.name : defaultText;
        await addDoc(collection(db, 'ChatRooms', chatRoomId, 'Messages'), {
          senderId: currentUserId, text: messageText, timestamp: serverTimestamp(), type: type, fileUrl: fileUrl, status: 'sent'
        });
      }
    } catch (e) {
      console.error(e);
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
    } catch (e) { console.error(e); }
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
    playingMessageId, audioProgress, audioDuration, peerPresence, 
    sendMessage, uploadFileAndSend, startAudioRecording, stopAudioRecording,
    audioPlayerRef, updateUserPresence, formatLastSeen, updateMessage, deleteMessage
  };
};

export default app;