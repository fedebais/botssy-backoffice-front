"use client";

import type React from "react";
import { useState, useRef, useEffect } from "react";
import { User as UserIcon, Bot, Send } from "lucide-react";
import UserProfile from "./UserProfile";
import type { Conversation, Message, User } from "../types";
import getInitials from "../utils/getInitials";
import EmojiPicker from "./EmojiPicker";
import { patchConversation } from "../service/conversations/patchConversation";
import { useAuth } from "../contexts/AuthContext";

interface ChatWindowProps {
  conversation: Conversation | null;
  messages: Message[];
  onSendMessage: (content: string) => void;
  onUpdateUser: (userId: string, updates: Partial<User>) => void;
  onAddToContacts: (userId: string) => void;
  showUserProfile?: boolean;
  onToggleUserProfile?: () => void;
  loading?: boolean;
  loadMoreMessages: () => Promise<void>;
  hasMore: boolean;
  loadingMoreMessages: boolean;
}

export default function ChatWindow({
  conversation,
  messages,
  onSendMessage,
  onUpdateUser,
  onAddToContacts,
  showUserProfile = false,
  onToggleUserProfile,
  loading = false,
  loadMoreMessages,
  hasMore,
  loadingMoreMessages,
}: ChatWindowProps) {
  const { user } = useAuth();
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [operatorAssigned, setOperatorAssigned] = useState(false);

  const scrollToBottom = (behavior: ScrollBehavior = "smooth") => {
    messagesEndRef.current?.scrollIntoView({ behavior });
  };

  // Nuevo efecto que fuerza el scroll hacia abajo instantáneamente cada vez que cambian
  // la conversación o los mensajes (carga inicial o mensajes nuevos)
  useEffect(() => {
    scrollToBottom("auto");
  }, [conversation, messages]);

  // Auto-scroll abajo al cambiar mensajes (nuevo o cargar más)
  useEffect(() => {
    const container = messagesContainerRef.current;
    if (!container) return;

    const nearBottom =
      container.scrollHeight - container.scrollTop - container.clientHeight <
      100;

    if (nearBottom) {
      scrollToBottom();
    }
  }, [messages]);

  // Scroll handler para cargar más mensajes al llegar cerca del tope (<= 30 px)
  const onScroll = () => {
    if (
      !messagesContainerRef.current ||
      loading ||
      loadingMoreMessages ||
      !hasMore
    )
      return;

    if (messagesContainerRef.current.scrollTop <= 30) {
      const container = messagesContainerRef.current;
      const previousScrollHeight = container.scrollHeight;

      loadMoreMessages().then(() => {
        const newScrollHeight = container.scrollHeight;
        // Mantener la posición para que no salte el scroll al agregar mensajes arriba
        container.scrollTop = newScrollHeight - previousScrollHeight;
      });
    }
  };

  const handleEmojiSelect = (emoji: string) => {
    setNewMessage((prev) => prev + emoji);
  };

  const handleSend = () => {
    if (newMessage.trim()) {
      onSendMessage(newMessage.trim());
      setNewMessage("");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("es-ES", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleToggleOperator = async () => {
    const newState = !operatorAssigned;
    setOperatorAssigned(newState);

    // Enviar mensaje de sistema indicando el cambio de estado
    const message = newState
      ? "👨‍💼 Operador asignado a la conversación"
      : "👋 Operador ha dejado la conversación";

    try {
      await patchConversation(
        Number(conversation?.lastMessage.conversationId),
        newState
          ? {
              operatorId: Number(user?.id),
              requestOperator: true,
            }
          : {
              operatorId: null,
              requestOperator: false,
            }
      );

      // Luego enviar el mensaje al usuario
      onSendMessage(message);
    } catch (error) {
      console.error("Error al actualizar la conversación:", error);
    }
  };

  if (loading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center space-y-2">
        <svg
          className="animate-spin h-8 w-8 text-blue-600 dark:text-blue-400"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          ></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
          ></path>
        </svg>
        <p className="text-gray-600 dark:text-gray-300 text-sm">
          Cargando mensajes...
        </p>
      </div>
    );
  }

  if (!conversation) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
            <Send className="w-8 h-8 text-gray-400 dark:text-gray-500" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            Selecciona una conversación
          </h3>
          <p className="text-gray-500 dark:text-gray-400">
            Elige una conversación de la lista para ver los mensajes
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex bg-gray-50 dark:bg-gray-900">
      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Chat Header */}
        <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gray-300 dark:bg-gray-600 rounded-full flex items-center justify-center">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {conversation.user?.avatar ? (
                    <img
                      src={conversation.user.avatar}
                      alt={conversation.user.name}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                  ) : conversation.customer?.name ? (
                    <span className="text-xl font-medium text-gray-700 dark:text-gray-300">
                      {getInitials(conversation.customer.name)}
                    </span>
                  ) : (
                    <UserIcon className="w-6 h-6 text-gray-600 dark:text-gray-300" />
                  )}
                </span>
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white capitalize">
                  {conversation.customer?.name !== null
                    ? conversation.customer?.name
                    : conversation.userPhone}
                </h3>
                <div className="flex items-center space-x-2">
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {!conversation.isActive ? "En línea" : "Desconectado"}
                  </p>
                  {conversation.channel && (
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium capitalize
                      ${
                        conversation.channel === "whatsapp"
                          ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                          : "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                      }
                    `}
                    >
                      {conversation.channel}
                    </span>
                  )}
                </div>
              </div>
            </div>
            <button
              onClick={onToggleUserProfile}
              className={`p-2 rounded-lg transition-colors ${
                showUserProfile
                  ? "bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400"
                  : "text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
              }`}
              title="Ver perfil del usuario"
            >
              <UserIcon className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Messages */}
        <div
          ref={messagesContainerRef}
          onScroll={onScroll}
          className="flex-1 overflow-y-auto p-4 space-y-4"
          style={{ scrollbarWidth: "thin" }}
        >
          {loadingMoreMessages && (
            <div className="flex items-center justify-center bg-blue-50 rounded-2xl mb-2">
              <svg
                className="animate-spin h-8 w-8 text-blue-600 dark:text-blue-400"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                ></path>
              </svg>
              <p className="text-gray-600 dark:text-gray-300 text-sm ml-2">
                Cargando mensajes...
              </p>
            </div>
          )}
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${
                message.role == "user" ? "justify-start" : "justify-end"
              }`}
            >
              <div
                className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                  message.role == "user"
                    ? "bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-sm"
                    : "bg-blue-600 dark:bg-blue-500 text-white"
                }`}
              >
                <p className="text-sm">{message.content}</p>
                <p
                  className={`text-xs mt-1 ${
                    message.role == "user"
                      ? "text-gray-500 dark:text-gray-400"
                      : "text-blue-100"
                  }`}
                >
                  {formatTime(new Date(message.timestamp))}
                </p>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Message Input */}
        <div className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 p-4">
          <div className="flex space-x-2">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Escribe un mensaje..."
              className="flex-1 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={handleToggleOperator}
              className={`p-2 rounded-lg transition-colors flex justify-center items-center ${
                operatorAssigned
                  ? "bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400"
                  : "bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400"
              }`}
              title={
                operatorAssigned
                  ? "Liberar conversación (Bot)"
                  : "Tomar conversación (Operador)"
              }
            >
              {operatorAssigned ? (
                <Bot className="w-5 h-5" />
              ) : (
                <UserIcon className="w-5 h-5" />
              )}
            </button>
            <EmojiPicker
              onEmojiSelect={handleEmojiSelect}
              isOpen={showEmojiPicker}
              onToggle={() => setShowEmojiPicker(!showEmojiPicker)}
            />
            <button
              onClick={handleSend}
              disabled={!newMessage.trim()}
              className="bg-blue-600 dark:bg-blue-500 text-white rounded-lg px-4 py-2 hover:bg-blue-700 dark:hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* User Profile Sidebar */}
      {showUserProfile && conversation && (
        <UserProfile
          user={conversation.customer}
          customerId={conversation.customerId}
          totalMessages={conversation.totalMessages}
          onUpdateUser={onUpdateUser}
          onAddToContacts={onAddToContacts}
        />
      )}
    </div>
  );
}
