"use client";

import { useState } from "react";
import {
  Search,
  Filter,
  MessageCircle,
  User,
  Clock,
  CheckCircle2,
  Circle,
  Trash2,
} from "lucide-react";
import type { Conversation } from "../types";
import getInitials from "../utils/getInitials";
import DeleteConversationModal from "./DeleteConversationModal";
import { deleteConversation } from "../service/conversations/deleteConversation";
import getChannelColorClasses from "../utils/getChannelColor";

interface ConversationListProps {
  conversations: Conversation[];
  selectedConversation: Conversation | null;
  onConversationSelect: (conversation: Conversation) => void;
  loading?: boolean;
  totalRequestOperator?: number;
}

export default function ConversationList({
  conversations,
  selectedConversation,
  onConversationSelect,
  loading = false,
  totalRequestOperator,
}: ConversationListProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [showUnreadOnly, setShowUnreadOnly] = useState(false);
  const [showOperatorRequestsOnly, setShowOperatorRequestsOnly] =
    useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [conversationToDelete, setConversationToDelete] =
    useState<Conversation | null>(null);

  const filteredConversations = conversations.filter((conversation) => {
    const matchesSearch =
      conversation.customer?.name
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      conversation.userPhone?.includes(searchTerm);
    const matchesUnread = !showUnreadOnly || conversation.unreadCount > 0;
    const matchesOperatorRequest =
      !showOperatorRequestsOnly || conversation.requestOperator === true;

    return matchesSearch && matchesUnread && matchesOperatorRequest;
  });

  const unreadCount = conversations.filter(
    (conv) => conv.unreadCount > 0
  ).length;

  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return "ahora";
    if (minutes < 60) return `${minutes}m`;
    if (hours < 24) return `${hours}h`;
    return `${days}d`;
  };

  const getChannelColor = (channel?: string) => {
    switch (channel?.toLowerCase()) {
      case "whatsapp":
        return "bg-green-500";
      case "instagram":
        return "bg-pink-500";
      case "web":
        return "bg-blue-500";
      case "email":
        return "bg-gray-500";
      default:
        return "bg-gray-400";
    }
  };

  const handleDeleteClick = (
    e: React.MouseEvent,
    conversation: Conversation
  ) => {
    e.stopPropagation(); // Evitar que se seleccione la conversación
    setConversationToDelete(conversation);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    if (conversationToDelete) {
      try {
        await deleteConversation(conversationToDelete.id);
        setConversationToDelete(null);
        setShowDeleteModal(false); // cerrar modal
      } catch (error) {
        console.error("Error al eliminar conversación:", error);
      }
    }
  };

  if (loading) {
    return (
      <div className="w-80 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 flex flex-col h-full">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Conversaciones
          </h2>
        </div>
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
            Cargando conversaciones...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-80 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
          Conversaciones
        </h2>

        {/* Search */}
        <div className="relative mb-3">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Buscar conversaciones..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
          />
        </div>

        {/* Filter: Solo no leídos */}
        <button
          onClick={() => setShowUnreadOnly(!showUnreadOnly)}
          className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm transition-colors ${
            showUnreadOnly
              ? "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400"
              : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700"
          }`}
        >
          <Filter className="w-4 h-4" />
          <span>Solo no leídos</span>
          {unreadCount > 0 && (
            <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
              {unreadCount}
            </span>
          )}
        </button>

        {/* Filter: Solicitan operador */}
        <button
          onClick={() => setShowOperatorRequestsOnly(!showOperatorRequestsOnly)}
          className={`mt-2 flex items-center space-x-2 px-3 py-2 rounded-lg text-sm transition-colors ${
            showOperatorRequestsOnly
              ? "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400"
              : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700"
          }`}
        >
          <Filter className="w-4 h-4" />
          <span>Solicitan operador</span>
          {(totalRequestOperator ?? 0) > 0 && (
            <span className="bg-yellow-500 text-white text-xs px-2 py-0.5 rounded-full">
              {totalRequestOperator}
            </span>
          )}
        </button>
      </div>

      {/* Conversations */}
      <div className="flex-1 overflow-y-auto">
        {filteredConversations.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full p-4 text-center">
            <MessageCircle className="w-12 h-12 text-gray-400 mb-3" />
            <p className="text-gray-500 dark:text-gray-400 text-sm">
              {searchTerm || showUnreadOnly || showOperatorRequestsOnly
                ? "No se encontraron conversaciones"
                : "No hay conversaciones"}
            </p>
          </div>
        ) : (
          <div className="space-y-1 p-2">
            {filteredConversations.map((conversation) => (
              <div
                key={conversation.id}
                onClick={() => onConversationSelect(conversation)}
                className={`p-3 rounded-lg cursor-pointer transition-all duration-200 group relative ${
                  selectedConversation?.id === conversation.id
                    ? "bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800"
                    : "hover:bg-gray-50 dark:hover:bg-gray-800"
                }`}
              >
                <div className="flex items-start space-x-3">
                  {/* Avatar */}
                  <div className="relative">
                    <div className="w-10 h-10 bg-gray-300 dark:bg-gray-600 rounded-full flex items-center justify-center">
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
                        <User className="w-6 h-6 text-gray-600 dark:text-gray-300" />
                      )}
                    </div>

                    {/* Channel badge */}
                    {conversation.channel && (
                      <div
                        className={`absolute -bottom-1 -right-1 w-4 h-4 ${getChannelColor(
                          conversation.channel
                        )} rounded-full border-2 border-white dark:border-gray-900`}
                      />
                    )}

                    {/* Botón de eliminar */}
                    <button
                      onClick={(e) => handleDeleteClick(e, conversation)}
                      className="absolute -bottom-8 -right-60 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg z-10"
                      title="Eliminar conversación"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Message Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="text-sm font-medium text-gray-900 dark:text-white truncate capitalize">
                        {conversation.customer?.name || conversation.userPhone}
                      </h3>
                      {conversation.requestOperator && (
                        <span className="bg-yellow-400 text-yellow-900 text-[10px] font-semibold px-1.5 py-0.5 rounded-full uppercase tracking-wide">
                          operador
                        </span>
                      )}
                      <div className="flex items-center space-x-1">
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {formatTime(
                            new Date(conversation.lastMessage.timestamp)
                          )}
                        </span>
                        {conversation.unreadCount > 0 && (
                          <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full min-w-[20px] text-center">
                            {conversation.unreadCount}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <p className="text-sm text-gray-600 dark:text-gray-400 truncate flex-1">
                        {conversation.lastMessage.content}
                      </p>
                      <div className="ml-2">
                        {conversation.lastMessage.isIncoming ? (
                          <Circle className="w-3 h-3 text-gray-400" />
                        ) : conversation.lastMessage.isRead ? (
                          <CheckCircle2 className="w-3 h-3 text-blue-500" />
                        ) : (
                          <Clock className="w-3 h-3 text-gray-400" />
                        )}
                      </div>
                    </div>

                    {conversation.channel && (
                      <div className="mt-1">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium capitalize ${getChannelColorClasses(
                            conversation.channel
                          )}`}
                        >
                          {conversation.channel}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-700 text-xs text-gray-500 dark:text-gray-400 text-center">
        {filteredConversations.length} conversación
        {filteredConversations.length !== 1 ? "es" : ""}
        {unreadCount > 0 && <div className="mt-1">{unreadCount} sin leer</div>}
      </div>

      {/* Modal de confirmación de eliminación */}
      <DeleteConversationModal
        isOpen={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);
          setConversationToDelete(null);
        }}
        onConfirm={handleConfirmDelete}
        conversation={conversationToDelete}
      />
    </div>
  );
}
