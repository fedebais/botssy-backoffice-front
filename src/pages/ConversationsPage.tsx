"use client";

import { useEffect, useState } from "react";
import ConversationList from "../components/ConversationList";
import ChatWindow from "../components/ChatWindow";
import type { Conversation, Message, User } from "../types";
import { getConversationId } from "../service/conversations/getConversationId";
import socket from "../../socket";
import { postSendMessage } from "../service/conversations/postSendMessage";

interface ConversationsPageProps {
  conversations: Conversation[];
  messages: Message[]; // inicialmente puede venir vacío o con mensajes generales
  onSendMessage: (conversationId: string, content: string) => void;
  onUpdateUser: (userId: string, updates: Partial<User>) => void;
  onAddToContacts: (userId: string) => void;
  loading?: boolean;
}

export default function ConversationsPage({
  conversations,
  messages: initialMessages,
  onSendMessage,
  onUpdateUser,
  onAddToContacts,
  loading = false,
}: ConversationsPageProps) {
  const [selectedConversation, setSelectedConversation] =
    useState<Conversation | null>(null);
  const [showUserProfile, setShowUserProfile] = useState(false);
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [loadingMessages, setLoadingMessages] = useState(false);

  useEffect(() => {
    // Escucho evento de nuevo mensaje
    socket.on("newMessage", (newMessage) => {
      // Solo agrego el mensaje si es para la conversación seleccionada
      if (
        selectedConversation &&
        newMessage.conversationId === selectedConversation.id
      ) {
        setMessages((prev) => [...prev, newMessage.message]);
      }
    });

    return () => {
      socket.off("newMessage"); // limpio al desmontar el componente
    };
  }, [selectedConversation]);

  const handleConversationSelect = async (conversation: Conversation) => {
    setSelectedConversation(conversation);
    setShowUserProfile(false);
    setLoadingMessages(true);

    try {
      const conversationData = await getConversationId(Number(conversation.id));
      // asumo que conversationData trae algo como { messages: Message[], ... }
      if (conversationData.messages) {
        setMessages(conversationData.messages);
      } else {
        setMessages([]); // no hay mensajes para esa conversación
      }
    } catch (error) {
      console.error("Error cargando conversación:", error);
      setMessages([]);
    } finally {
      setLoadingMessages(false);
    }
  };

  const handleSendMessage = async (content: string) => {
    if (selectedConversation) {
      // Primero se dispara el callback para actualizar la UI
      onSendMessage(selectedConversation.id, content);

      try {
        await postSendMessage({
          userPhone: selectedConversation.userPhone!,
          channel: selectedConversation.channel!,
          role: "system",
          content: content,
          botId: 1,
          conversationId: Number(
            selectedConversation.lastMessage.conversationId
          ),
          tenantId: 1,
          //operatorId: 1,
        });
      } catch (error) {
        console.error("Error al enviar el mensaje:", error);
      }
    }
  };

  return (
    <div className="flex h-full bg-gray-50 dark:bg-gray-900">
      <ConversationList
        conversations={conversations}
        selectedConversation={selectedConversation}
        onConversationSelect={handleConversationSelect}
        loading={loading}
      />
      <ChatWindow
        conversation={selectedConversation}
        messages={messages}
        onSendMessage={handleSendMessage}
        onUpdateUser={onUpdateUser}
        onAddToContacts={onAddToContacts}
        showUserProfile={showUserProfile}
        onToggleUserProfile={() => setShowUserProfile(!showUserProfile)}
        loading={loadingMessages}
      />
    </div>
  );
}
