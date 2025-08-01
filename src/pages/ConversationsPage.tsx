"use client";

import { useState } from "react";
import ConversationList from "../components/ConversationList";
import ChatWindow from "../components/ChatWindow";
import type { Conversation, User } from "../types";
import { useAuth } from "../contexts/AuthContext";
import { postSendMessage } from "../service/conversations/postSendMessage";
import { postResetUnreadCount } from "../service/conversationUnread/postResetUnreadCount";
import { useConversations } from "../hook/useConversations";

export default function ConversationsPage() {
  const { user } = useAuth();

  const {
    conversations,
    messages,
    loadingConversations,
    loadingMessages,
    selectedConversation,
    selectConversation,
    setConversations,
  } = useConversations(user?.tenantId);

  console.log(conversations);
  const [showUserProfile, setShowUserProfile] = useState(false);

  const handleConversationSelect = async (conversation: Conversation) => {
    setShowUserProfile(false);
    await selectConversation(conversation);

    try {
      await postResetUnreadCount(conversation.id);
      setConversations((prev) =>
        prev.map((conv) =>
          conv.id === conversation.id ? { ...conv, unreadCount: 0 } : conv
        )
      );
    } catch (error) {
      console.error("Error reseteando contador de mensajes no leídos:", error);
    }
  };

  const handleSendMessage = async (content: string) => {
    if (!selectedConversation) return;

    try {
      await postSendMessage({
        userPhone: selectedConversation.userPhone!,
        channel: selectedConversation.channel!,
        role: "system",
        content,
        botId: 1,
        conversationId: Number(
          selectedConversation.lastMessage?.conversationId ??
            selectedConversation.id
        ),
        tenantId: user?.tenantId || 0,
      });
    } catch (error) {
      console.error("Error al enviar el mensaje:", error);
    }
  };

  const handleUpdateUser = async (userId: string, updates: Partial<User>) => {
    try {
      // await postUpdateUser(userId, updates);
    } catch (error) {
      console.error("Error al actualizar usuario:", error);
    }
  };

  const handleAddToContacts = async (userId: string) => {
    try {
      //await postAddContact(userId);
    } catch (error) {
      console.error("Error al agregar contacto:", error);
    }
  };

  return (
    <div className="flex h-full bg-gray-50 dark:bg-gray-900">
      <ConversationList
        conversations={conversations}
        selectedConversation={selectedConversation}
        onConversationSelect={handleConversationSelect}
        loading={loadingConversations}
      />
      <ChatWindow
        conversation={selectedConversation}
        messages={messages}
        onSendMessage={handleSendMessage}
        onUpdateUser={handleUpdateUser}
        onAddToContacts={handleAddToContacts}
        showUserProfile={showUserProfile}
        onToggleUserProfile={() => setShowUserProfile(!showUserProfile)}
        loading={loadingMessages}
      />
    </div>
  );
}
