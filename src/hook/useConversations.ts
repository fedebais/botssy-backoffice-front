import { useEffect, useState, useRef } from "react";
import type { Conversation, Message } from "../types";
import { getConversations } from "../service/conversations/getConversations";
import { getConversationId } from "../service/conversations/getConversationId";
import socket from "../../socket";

export function useConversations(tenantId?: number) {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loadingConversations, setLoadingConversations] = useState(false);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [selectedConversation, setSelectedConversation] =
    useState<Conversation | null>(null);
  const selectedConversationRef = useRef<Conversation | null>(null);
  const conversationsRef = useRef<Conversation[]>([]);

  selectedConversationRef.current = selectedConversation;
  conversationsRef.current = conversations;

  // Cargar conversaciones al iniciar o cuando cambia tenantId
  useEffect(() => {
    async function loadConversations() {
      if (!tenantId) return;
      setLoadingConversations(true);
      try {
        const data = await getConversations(tenantId);
        setConversations(data);
      } catch (error) {
        console.error("Error al cargar conversaciones:", error);
      } finally {
        setLoadingConversations(false);
      }
    }
    loadConversations();
  }, [tenantId]);

  // Escuchar mensajes nuevos por socket
  useEffect(() => {
    async function fetchFullConversation(conversationId: number | string) {
      try {
        return await getConversationId(Number(conversationId));
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
                  channel: channel,
                  customer: {
                    ...conv.customer,
                    ...customer,
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
          fullConv.customer = { ...customer };

          setConversations((prev) => [fullConv, ...prev]);
        }
      }
    }

    socket.on("newMessage", handleNewMessage);
    return () => {
      socket.off("newMessage", handleNewMessage);
    };
  }, []);

  // Función para seleccionar una conversación y cargar sus mensajes
  async function selectConversation(conversation: Conversation) {
    setSelectedConversation(conversation);
    setLoadingMessages(true);
    try {
      const conversationData = await getConversationId(conversation.id);
      setMessages(conversationData.messages || []);
    } catch (error) {
      console.error("Error cargando conversación:", error);
      setMessages([]);
    } finally {
      setLoadingMessages(false);
    }
  }

  return {
    conversations,
    messages,
    loadingConversations,
    loadingMessages,
    selectedConversation,
    setSelectedConversation,
    selectConversation,
    setConversations,
    setMessages,
  };
}
