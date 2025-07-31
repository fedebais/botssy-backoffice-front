"use client";

import { useEffect, useState, useRef } from "react";
import ConversationList from "../components/ConversationList";
import ChatWindow from "../components/ChatWindow";
import type { Conversation, Message, User } from "../types";
import { getConversations } from "../service/conversations/getConversations";
import { getConversationId } from "../service/conversations/getConversationId";
import socket from "../../socket";
import { postSendMessage } from "../service/conversations/postSendMessage";
import { postResetUnreadCount } from "../service/conversationUnread/postResetUnreadCount";
import { useAuth } from "../contexts/AuthContext";

interface ConversationsPageProps {
  onSendMessage: (conversationId: string, content: string) => void;
  onUpdateUser: (userId: string, updates: Partial<User>) => void;
  onAddToContacts: (userId: string) => void;
}

export default function ConversationsPage({
  onSendMessage,
  onUpdateUser,
  onAddToContacts,
}: ConversationsPageProps) {
  const { user } = useAuth();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loadingConversations, setLoadingConversations] = useState(false);

  const [selectedConversation, setSelectedConversation] =
    useState<Conversation | null>(null);
  const selectedConversationRef = useRef<Conversation | null>(null);
  selectedConversationRef.current = selectedConversation;

  const [messages, setMessages] = useState<Message[]>([]);
  const [loadingMessages, setLoadingMessages] = useState(false);

  const [showUserProfile, setShowUserProfile] = useState(false);

  const conversationsRef = useRef<Conversation[]>([]);
  conversationsRef.current = conversations;

  useEffect(() => {
    async function loadConversations() {
      if (!user?.tenantId) return;
      setLoadingConversations(true);
      try {
        const data = await getConversations(user.tenantId);
        setConversations(data);
      } catch (error) {
        console.error("Error al cargar conversaciones:", error);
      } finally {
        setLoadingConversations(false);
      }
    }
    loadConversations();
  }, [user?.tenantId]);

  useEffect(() => {
    async function fetchFullConversation(conversationId: number | string) {
      try {
        const fullConv = await getConversationId(Number(conversationId));
        return fullConv;
      } catch (error) {
        console.error("Error fetching full conversation:", error);
        return null;
      }
    }

    async function handleNewMessage({
      conversationId,
      message,
      customer,
      channel,
    }: {
      conversationId: number | string;
      message: Message;
      customer: {
        name: string;
        phone: string;
        email?: string | null;
        tags?: string[];
        notes?: string | null;
      };
      channel: string;
    }) {
      const selectedConv = selectedConversationRef.current;

      if (selectedConv && String(selectedConv.id) === String(conversationId)) {
        setMessages((prev) => [...prev, message]);
        return;
      }

      setConversations((prev) => {
        const exists = prev.find(
          (conv) => String(conv.id) === String(conversationId)
        );
        if (exists) {
          return prev.map((conv) =>
            String(conv.id) === String(conversationId)
              ? {
                  ...conv,
                  lastMessage: message,
                  unreadCount: conv.unreadCount ? conv.unreadCount + 1 : 1,
                  isActive: true,
                  customer: {
                    ...conv.customer,
                    ...customer, // actualizás nombre si no estaba
                  },
                }
              : conv
          );
        }
        return prev;
      });

      const existsAfter = conversationsRef.current.find(
        (conv) => String(conv.id) === String(conversationId)
      );
      if (!existsAfter) {
        const fullConv = await fetchFullConversation(conversationId);
        if (fullConv) {
          if (!fullConv.lastMessage) {
            fullConv.lastMessage = {
              id: 0,
              content: "Sin mensajes aún",
              timestamp: new Date().toISOString(),
              role: "system",
              conversationId: fullConv.id,
            };
          }

          // Asegurás que tenga el customer
          fullConv.customer = {
            ...customer,
          };

          setConversations((prev) => [fullConv, ...prev]);
        }
      }
    }

    socket.on("newMessage", handleNewMessage);

    return () => {
      socket.off("newMessage", handleNewMessage);
    };
  }, []);

  const handleConversationSelect = async (conversation: Conversation) => {
    setSelectedConversation(conversation);
    setShowUserProfile(false);
    setLoadingMessages(true);

    try {
      const conversationData = await getConversationId(conversation.id);
      setMessages(conversationData.messages || []);

      await postResetUnreadCount(conversation.id);

      setConversations((prev) =>
        prev.map((conv) =>
          conv.id === conversation.id ? { ...conv, unreadCount: 0 } : conv
        )
      );
    } catch (error) {
      console.error(
        "Error cargando conversación o reseteando contador:",
        error
      );
      setMessages([]);
    } finally {
      setLoadingMessages(false);
    }
  };

  const handleSendMessage = async (content: string) => {
    if (!selectedConversation) return;

    onSendMessage(selectedConversation.id.toString(), content);

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
        onUpdateUser={onUpdateUser}
        onAddToContacts={onAddToContacts}
        showUserProfile={showUserProfile}
        onToggleUserProfile={() => setShowUserProfile(!showUserProfile)}
        loading={loadingMessages}
      />
    </div>
  );
}
