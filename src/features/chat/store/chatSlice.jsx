import { createSlice } from "@reduxjs/toolkit";

const formatTime = (date = new Date()) =>
  new Intl.DateTimeFormat("ar-SY", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);

const buildPreview = (message) => {
  if (message.type === "text") {
    return message.text;
  }

  if (message.type === "audio") {
    return "رسالة صوتية";
  }

  return `ملف: ${message.fileName}`;
};

const createMessage = (type, payload) => ({
  id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
  type,
  createdAt: formatTime(),
  direction: "outgoing",
  ...payload,
});

const initialState = {
  chats: [
    {
      id: 1,
      name: "استقبال المركز",
      role: "فريق الدعم",
      lastMessage: "مرحبا، كيف يمكننا مساعدتك اليوم؟",
      lastMessageAt: "09:15",
      unreadCount: 0,
    },
    {
      id: 2,
      name: "د. أحمد علي",
      role: "العيادة الداخلية",
      lastMessage: "أرسلت لك الجدول النهائي.",
      lastMessageAt: "08:42",
      unreadCount: 2,
    },
    {
      id: 3,
      name: "سكرتاريا القسم",
      role: "تنسيق المواعيد",
      lastMessage: "تم تأكيد موعد المريض الجديد.",
      lastMessageAt: "أمس",
      unreadCount: 1,
    },
  ],
  messagesByChatId: {
    1: [
      {
        id: "m-1",
        type: "text",
        text: "مرحبا، كيف يمكننا مساعدتك اليوم؟",
        createdAt: "09:15",
        direction: "incoming",
      },
    ],
    2: [
      {
        id: "m-2",
        type: "text",
        text: "تم تحديث ملفك على النظام.",
        createdAt: "08:22",
        direction: "incoming",
      },
      {
        id: "m-3",
        type: "text",
        text: "ممتاز، شكرا لك.",
        createdAt: "08:30",
        direction: "outgoing",
      },
    ],
    3: [
      {
        id: "m-4",
        type: "text",
        text: "تم تأكيد موعد المريض الجديد.",
        createdAt: "07:50",
        direction: "incoming",
      },
    ],
  },
};

const updateChatMeta = (state, chatId, message) => {
  const chat = state.chats.find((item) => item.id === chatId);
  if (!chat) {
    return;
  }

  chat.lastMessage = buildPreview(message);
  chat.lastMessageAt = message.createdAt;

  state.chats.sort((a, b) => {
    if (a.id === chatId) {
      return -1;
    }
    if (b.id === chatId) {
      return 1;
    }
    return 0;
  });
};

const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    deleteMessage: (state, action) => {
      const { chatId, messageId } = action.payload;
      const key = String(chatId);
      if (state.messagesByChatId[key]) {
        state.messagesByChatId[key] = state.messagesByChatId[key].filter(
          (m) => m.id !== messageId,
        );
      }
    },
    sendTextMessage: (state, action) => {
      const { chatId, text } = action.payload;
      const messageText = text?.trim();

      if (!messageText) {
        return;
      }

      const message = createMessage("text", { text: messageText });
      const key = String(chatId);
      if (!state.messagesByChatId[key]) {
        state.messagesByChatId[key] = [];
      }
      state.messagesByChatId[key].push(message);
      updateChatMeta(state, chatId, message);
    },
    sendAudioMessage: (state, action) => {
      const { chatId, url, duration } = action.payload;
      const message = createMessage("audio", {
        url,
        duration,
      });

      const key = String(chatId);
      if (!state.messagesByChatId[key]) {
        state.messagesByChatId[key] = [];
      }
      state.messagesByChatId[key].push(message);
      updateChatMeta(state, chatId, message);
    },
    sendFileMessage: (state, action) => {
      const { chatId, fileName, fileType, fileSize, url } = action.payload;
      const message = createMessage("file", {
        fileName,
        fileType,
        fileSize,
        url,
      });

      const key = String(chatId);
      if (!state.messagesByChatId[key]) {
        state.messagesByChatId[key] = [];
      }
      state.messagesByChatId[key].push(message);
      updateChatMeta(state, chatId, message);
    },
  },
});

export const {
  sendTextMessage,
  sendAudioMessage,
  sendFileMessage,
  deleteMessage,
} = chatSlice.actions;

export default chatSlice.reducer;
