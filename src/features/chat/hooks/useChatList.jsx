import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import chatService from "../service/chatService";

export const useChatList = () => {
  const navigate = useNavigate();
  const [activeChatId, setActiveChatId] = useState("");
  const [allChats, setAllChats] = useState([]);
  const [filteredChats, setFilteredChats] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentUserId, setCurrentUserId] = useState("");

  const { data: responseMap, isLoading } =
    chatService.useGetPotentialContacts();

  useEffect(() => {
    if (responseMap) {
      if (responseMap.current_user) {
        setCurrentUserId(String(responseMap.current_user.id));
        console.log(
          `✅ تم التقاط ID الطبيب الحالي من السيرفر: ${responseMap.current_user.id}`,
        );
      }

      const rawData = responseMap.data || [];
      setAllChats(rawData);

      if (searchQuery.trim() === "") {
        setFilteredChats(rawData);
      }
    }
  }, [responseMap]);

  const handleSearch = (query) => {
    setSearchQuery(query);
    if (query.trim() === "") {
      setFilteredChats(allChats);
    } else {
      const filtered = allChats.filter(
        (chat) =>
          chat.name?.toLowerCase().includes(query.toLowerCase()) ||
          chat.role?.toLowerCase().includes(query.toLowerCase()),
      );
      setFilteredChats(filtered);
    }
  };

  const navigateToChat = (chat) => {
    setActiveChatId(chat.id);

    const updatedChats = allChats.map((item) => {
      if (item.id === chat.id) {
        return { ...item, unreadCount: 0 };
      }
      return item;
    });

    setAllChats(updatedChats);

    if (searchQuery.trim() === "") {
      setFilteredChats(updatedChats);
    } else {
      setFilteredChats(
        updatedChats.filter(
          (item) =>
            item.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.role?.toLowerCase().includes(searchQuery.toLowerCase()),
        ),
      );
    }

    navigate(`/main-page/conversations/view/${chat.id}`, {
      state: {
        chatId: chat.id,
        currentUserId: currentUserId,
        chatName: chat.name,
        avatarUrl: chat.avatarUrl,
        role: chat.role,
        isActive: chat.isActive,
      },
    });
  };

  return {
    isLoading,
    filteredChats,
    searchQuery,
    activeChatId,
    handleSearch,
    navigateToChat,
  };
};
