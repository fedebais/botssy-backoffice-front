"use client";

import { AlertTriangle, Trash2, X } from "lucide-react";
import type { Conversation } from "../types";
import getInitials from "../utils/getInitials";

interface DeleteConversationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  conversation: Conversation | null;
}

export default function DeleteConversationModal({
  isOpen,
  onClose,
  onConfirm,
  conversation,
}: DeleteConversationModalProps) {
  if (!isOpen || !conversation) return null;

  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  const formatTime = (date: Date | string) => {
    try {
      const parsedDate = typeof date === "string" ? new Date(date) : date;
      return parsedDate.toLocaleTimeString("es-ES", {
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return "-";
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-md shadow-2xl border border-gray-200 dark:border-gray-700">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400" />
            </div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Eliminar Conversación
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="mb-4">
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              ¿Estás seguro de que quieres eliminar la conversación con{" "}
              <span className="font-semibold text-gray-900 dark:text-white capitalize">
                {conversation.customer?.name || conversation.userPhone}
              </span>
              ?
            </p>
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-medium text-red-800 dark:text-red-300 mb-1">
                    Esta acción no se puede deshacer
                  </h4>
                  <ul className="text-sm text-red-700 dark:text-red-400 space-y-1">
                    <li>
                      • Se eliminarán todos los mensajes de esta conversación
                    </li>
                    <li>• El historial completo se perderá permanentemente</li>
                    <li>• Esta acción no afectará al perfil del cliente</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Información de la conversación */}
          <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 mb-6">
            <div className="flex items-center space-x-3 mb-3">
              <div className="w-8 h-8 bg-gray-300 dark:bg-gray-600 rounded-full flex items-center justify-center">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {getInitials(
                    conversation.customer?.name || conversation.userPhone || ""
                  )}
                </span>
              </div>
              <div>
                <p className="font-medium text-gray-900 dark:text-white capitalize">
                  {conversation.customer?.name || conversation.userPhone}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {conversation.channel}
                </p>
              </div>
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400 h-40 overflow-y-auto w-fit">
              <p className="mb-1 whitespace-pre-wrap">
                <span className="font-medium">Último mensaje:</span>{" "}
                {conversation.lastMessage.content}
              </p>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
              <span className="font-medium">Fecha:</span>{" "}
              {formatTime(conversation.lastMessage.timestamp)}
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex space-x-3 p-6 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={onClose}
            className="flex-1 py-3 px-4 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors bg-white dark:bg-gray-800 font-medium"
          >
            Cancelar
          </button>
          <button
            onClick={handleConfirm}
            className="flex-1 py-3 px-4 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors font-medium flex items-center justify-center space-x-2 shadow-sm hover:shadow-md"
          >
            <Trash2 className="w-4 h-4" />
            <span>Eliminar</span>
          </button>
        </div>
      </div>
    </div>
  );
}
