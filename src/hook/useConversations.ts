import { useEffect, useState, useRef } from "react";
import type { Conversation, Message } from "../types";
import { getConversations } from "../service/conversations/getConversations";
import { getConversationId } from "../service/conversations/getConversationId";
import { getTotalOperators } from "../service/conversations/getTotalOperators";
import socket from "../../socket";

export function useConversations(tenantId?: number) {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loadingConversations, setLoadingConversations] = useState(false);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [loadingMoreMessages, setLoadingMoreMessages] = useState(false);
  const [selectedConversation, setSelectedConversation] =
    useState<Conversation | null>(null);

  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const [totalRequestOperator, setTotalRequestOperator] = useState<number>(0);

  const selectedConversationRef = useRef<Conversation | null>(null);
  const conversationsRef = useRef<Conversation[]>([]);

  selectedConversationRef.current = selectedConversation;
  conversationsRef.current = conversations;

  useEffect(() => {
    async function loadConversations() {
      if (!tenantId) return;
      setLoadingConversations(true);
      try {
        const data = await getConversations(tenantId);
        setConversations(data);

        const total = await getTotalOperators(tenantId);
        setTotalRequestOperator(total);
      } catch (error) {
        console.error("Error al cargar conversaciones o total:", error);
      } finally {
        setLoadingConversations(false);
      }
    }
    loadConversations();
  }, [tenantId]);

  useEffect(() => {
    async function fetchFullConversation(conversationId: number | string) {
      try {
        return await getConversationId(Number(conversationId), 1, 20);
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
      requestOperator,
      totalRequestOperator: totalRequestOperatorFromSocket,
    }: {
      conversationId: number | string;
      message: Message | null; // <-- mensaje puede ser null
      customer: {
        name: string;
        phone: string;
        email?: string | null;
        tags?: string[];
        notes?: string | null;
      };
      channel: string;
      requestOperator?: boolean;
      totalRequestOperator?: number;
    }) {
      if (typeof totalRequestOperatorFromSocket === "number") {
        setTotalRequestOperator(totalRequestOperatorFromSocket);
      }

      const selectedConv = selectedConversationRef.current;

      if (
        selectedConv &&
        String(selectedConv.id) === String(conversationId) &&
        message
      ) {
        setMessages((prev) => {
          const combined = [...prev, message];
          return combined.sort(
            (a, b) =>
              new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
          );
        });
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
                  lastMessage: message ?? conv.lastMessage,
                  unreadCount: message
                    ? conv.unreadCount
                      ? conv.unreadCount + 1
                      : 1
                    : conv.unreadCount,
                  isActive: true,
                  channel,
                  requestOperator: requestOperator ?? conv.requestOperator,
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
          fullConv.requestOperator = requestOperator ?? false;

          setConversations((prev) => [fullConv, ...prev]);
        }
      }
    }

    socket.on("newMessage", handleNewMessage);
    return () => {
      socket.off("newMessage", handleNewMessage);
    };
  }, []);

  // resto de funciones (selectConversation, loadMoreMessages) igual

  async function selectConversation(conversation: Conversation) {
    setSelectedConversation(conversation);
    setLoadingMessages(true);
    setPage(1);
    setHasMore(true);
    try {
      const data = await getConversationId(conversation.id, 1, 20);
      setMessages(
        (data.messages || []).sort(
          (a: Message, b: Message) =>
            new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
        )
      );
      if (!data.messages || data.messages.length < 20) {
        setHasMore(false);
      }
    } catch (error) {
      console.error("Error cargando conversación:", error);
      setMessages([]);
    } finally {
      setLoadingMessages(false);
    }
  }

  async function loadMoreMessages() {
    if (
      !selectedConversation ||
      loadingMessages ||
      loadingMoreMessages ||
      !hasMore
    )
      return;

    setLoadingMoreMessages(true);
    const nextPage = page + 1;

    try {
      const data = await getConversationId(
        selectedConversation.id,
        nextPage,
        20
      );

      if (!data.messages || data.messages.length === 0) {
        setHasMore(false);
      } else {
        setMessages((prev) => {
          const combined = [...data.messages, ...prev];
          return combined.sort(
            (a, b) =>
              new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
          );
        });
        setPage(nextPage);

        if (data.messages.length < 20) {
          setHasMore(false);
        }
      }
    } catch (error) {
      console.error("Error cargando más mensajes:", error);
    } finally {
      setLoadingMoreMessages(false);
    }
  }

  return {
    conversations,
    messages,
    loadingConversations,
    loadingMessages,
    loadingMoreMessages,
    selectedConversation,
    setSelectedConversation,
    selectConversation,
    setConversations,
    setMessages,
    loadMoreMessages,
    hasMore,
    totalRequestOperator,
  };
}
