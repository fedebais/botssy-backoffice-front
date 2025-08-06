"use client";

import { useState } from "react";
import { Edit, Eye, EyeOff } from "lucide-react";
import type { Agent } from "../types";

interface AgentCardProps {
  agent: Agent;
  onEdit: (agent: Agent) => void;
}

export default function AgentCard({ agent, onEdit }: AgentCardProps) {
  const [showFullContent, setShowFullContent] = useState(false);

  const truncateContent = (content: string, maxLength = 120) => {
    if (content.length <= maxLength) return content;
    return content.substring(0, maxLength) + "...";
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 hover:shadow-xl dark:hover:shadow-2xl hover:shadow-gray-200 dark:hover:shadow-gray-900/50 transition-all duration-300 group">
      {/* Título y descripción */}
      <div className="mb-4">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
          {agent.name}
        </h3>
        <h5 className="text-xs font-medium text-gray-500 dark:text-gray-400">
          {agent.description}
        </h5>
      </div>

      {/* Preview del contenido */}
      <div className="mb-4">
        <div
          className={`bg-gradient-to-r rounded-lg p-4 border transition-all ${
            !agent.promptExtension || agent.promptExtension.trim().length === 0
              ? "from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 border-orange-200 dark:border-orange-800"
              : "from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-600 border-gray-200 dark:border-gray-600"
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
              {!agent.promptExtension ||
              agent.promptExtension.trim().length === 0
                ? "⚠️ Prompt Vacío"
                : "Vista Previa"}
            </span>
            <button
              onClick={() => setShowFullContent(!showFullContent)}
              className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
            >
              {showFullContent ? (
                <EyeOff className="w-4 h-4" />
              ) : (
                <Eye className="w-4 h-4" />
              )}
            </button>
          </div>
          <p
            className={`text-sm leading-relaxed font-medium ${
              !agent.promptExtension ||
              agent.promptExtension.trim().length === 0
                ? "text-orange-700 dark:text-orange-300 italic"
                : "text-gray-700 dark:text-gray-300"
            }`}
          >
            {!agent.promptExtension || agent.promptExtension.trim().length === 0
              ? "Este prompt necesita contenido. Haz clic en 'Editar' para completarlo."
              : showFullContent
              ? agent.promptExtension
              : truncateContent(agent.promptExtension)}
          </p>
        </div>
      </div>

      {/* Botones de acción */}
      <div className="flex space-x-2">
        <button
          onClick={() => onEdit(agent)}
          className="flex-1 flex items-center justify-center space-x-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-4 py-2.5 rounded-lg transition-all duration-200 shadow-sm hover:shadow-md transform hover:scale-105"
        >
          <Edit className="w-4 h-4" />
          <span className="font-medium">Editar</span>
        </button>
      </div>
    </div>
  );
}
