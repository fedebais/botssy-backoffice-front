"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { X, Save, Lightbulb } from "lucide-react";
import type { Agent } from "../types";
import { patchAgent } from "../service/agent/patchAgent";

interface AgenttEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (promptId: string, updates: Partial<Agent>) => void;
  agent: Agent;
}

export default function AgentEditModal({
  isOpen,
  onClose,
  onSave,
  agent,
}: AgenttEditModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    prompt: "",
    promptExtension: "",
  });

  useEffect(() => {
    if (agent) {
      setFormData({
        name: agent.name || "",
        description: agent.description || "",
        prompt: agent.prompt,
        promptExtension: agent.promptExtension || "",
      });
    }
  }, [agent]);

  const handleChange = (field: keyof typeof formData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt) return;
    if (!formData.prompt.trim()) {
      alert("El contenido original del prompt no puede estar vacío");
      return;
    }
    try {
      await patchAgent(Number(agent.id), {
        name: formData.name,
        description: formData.description,
        promptExtension: formData.promptExtension,
        prompt: formData.prompt,
      });
      onSave(agent.id, { ...formData });
      onClose();
    } catch (error) {
      console.error("Error guardando prompt:", error);
    }
  };

  if (!isOpen || !agent) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-700 rounded-t-2xl">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            Editar Prompt: {agent.name}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 p-2 rounded-xl hover:bg-white/50 dark:hover:bg-gray-700/50 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              📝 Nombre del Prompt
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => handleChange("name", e.target.value)}
              className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition-colors"
              placeholder="Dale un nombre descriptivo a tu prompt"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              💭 Descripción (opcional)
            </label>
            <input
              type="text"
              value={formData.description}
              onChange={(e) => handleChange("description", e.target.value)}
              className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition-colors"
              placeholder="Describe cuándo y cómo usar este prompt"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              ✨ Contenido Base
            </label>
            <textarea
              value={formData.prompt}
              onChange={(e) => handleChange("prompt", e.target.value)}
              className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition-colors resize-none text-sm leading-relaxed"
              rows={8}
              placeholder="Escribe aquí el contenido de tu prompt..."
            />
          </div>

          {/* Advertencia importante */}
          <div className="mt-3 p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-300 dark:border-yellow-700 rounded-lg">
            <div className="flex items-start space-x-2">
              <Lightbulb className="w-4 h-4 text-yellow-600 dark:text-yellow-400 mt-0.5 flex-shrink-0" />
              <div className="text-xs text-yellow-700 dark:text-yellow-300">
                <strong>⚠️ Advertencia importante:</strong>
                <p className="mt-1">
                  Modificar el formato de este contenido puede afectar el
                  correcto funcionamiento del bot. Por favor, evita cambiar la
                  estructura general del texto, ya que esto puede causar errores
                  o comportamientos inesperados.
                </p>
                <p className="mt-1">
                  Si no estás seguro, consulta con el administrador antes de
                  realizar cambios significativos.
                </p>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              ✨ Contenido Adicional
            </label>
            <textarea
              value={formData.promptExtension}
              onChange={(e) => handleChange("promptExtension", e.target.value)}
              className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition-colors resize-none text-sm leading-relaxed"
              rows={8}
              placeholder="Escribe aquí el contenido de tu prompt..."
            />
          </div>

          {/* Tips de ayuda */}
          <div className="mt-3 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
            <div className="flex items-start space-x-2">
              <Lightbulb className="w-4 h-4 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
              <div className="text-xs text-blue-700 dark:text-blue-300">
                <strong>💡 Consejos:</strong>
                <ul className="mt-1 space-y-1 list-disc list-inside">
                  <li>Usa un tono amigable y profesional</li>
                  <li>Sé claro y conciso en tu mensaje</li>
                  <li>Termina con una pregunta o llamada a la acción</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="flex space-x-3 pt-6 border-t border-gray-200 dark:border-gray-700">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 px-6 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors bg-white dark:bg-gray-800"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={!formData.prompt.trim()}
              className="flex-1 py-3 px-6 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:from-gray-400 disabled:to-gray-500 text-white rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center space-x-2 transform hover:scale-105 disabled:transform-none disabled:cursor-not-allowed"
            >
              <Save className="w-5 h-5" />
              <span className="font-medium">Guardar Prompt</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
