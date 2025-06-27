import type React from "react"

import { useState } from "react"
import { X, Bot, MessageCircle, Star, Clock, Settings, Users } from "lucide-react"
import type { BotAgent } from "../types"

interface CreateCustomBotModalProps {
  isOpen: boolean
  onClose: () => void
  onCreateBot: (bot: Omit<BotAgent, "id">) => void
}

export default function CreateCustomBotModal({ isOpen, onClose, onCreateBot }: CreateCustomBotModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: "Personalizado",
    selectedFeatures: [] as string[],
    selectedIcon: "bot",
    selectedColor: "bg-blue-600",
  })

  const availableFeatures = [
    "Respuestas automáticas",
    "Integración con CRM",
    "Análisis de sentimientos",
    "Escalamiento inteligente",
    "Horarios personalizados",
    "Múltiples idiomas",
    "Base de conocimientos",
    "Reportes avanzados",
    "Webhooks personalizados",
    "API personalizada",
  ]

  const iconOptions = [
    { name: "bot", icon: Bot },
    { name: "message", icon: MessageCircle },
    { name: "star", icon: Star },
    { name: "clock", icon: Clock },
    { name: "settings", icon: Settings },
    { name: "users", icon: Users },
  ]

  const colorOptions = [
    "bg-blue-600",
    "bg-green-600",
    "bg-purple-600",
    "bg-red-600",
    "bg-yellow-600",
    "bg-indigo-600",
    "bg-pink-600",
    "bg-gray-600",
  ]

  const handleFeatureToggle = (feature: string) => {
    setFormData((prev) => ({
      ...prev,
      selectedFeatures: prev.selectedFeatures.includes(feature)
        ? prev.selectedFeatures.filter((f) => f !== feature)
        : [...prev.selectedFeatures, feature],
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (formData.name && formData.description && formData.selectedFeatures.length > 0) {
      onCreateBot({
        name: formData.name,
        description: formData.description,
        category: formData.category,
        features: formData.selectedFeatures,
        isActive: false,
        icon: formData.selectedIcon,
        color: formData.selectedColor,
        isCustom: true,
      })
      setFormData({
        name: "",
        description: "",
        category: "Personalizado",
        selectedFeatures: [],
        selectedIcon: "bot",
        selectedColor: "bg-blue-600",
      })
      onClose()
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 dark:bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-gray-200 dark:border-gray-700 shadow-xl">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Crear Agente Personalizado</h2>
          <button
            onClick={onClose}
            className="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Nombre del Agente</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
              className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition-colors"
              placeholder="Ej: Asistente de Marketing"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Descripción</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
              className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition-colors resize-none"
              rows={3}
              placeholder="Describe qué hace este agente y cómo ayuda a los usuarios..."
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Ícono</label>
            <div className="grid grid-cols-6 gap-2">
              {iconOptions.map((option) => {
                const IconComponent = option.icon
                return (
                  <button
                    key={option.name}
                    type="button"
                    onClick={() => setFormData((prev) => ({ ...prev, selectedIcon: option.name }))}
                    className={`p-3 rounded-lg border-2 transition-all duration-200 ${
                      formData.selectedIcon === option.name
                        ? "border-blue-500 dark:border-blue-400 bg-blue-50 dark:bg-blue-900/30"
                        : "border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500 bg-white dark:bg-gray-700"
                    }`}
                  >
                    <IconComponent className="w-6 h-6 mx-auto text-gray-700 dark:text-gray-300" />
                  </button>
                )
              })}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Color</label>
            <div className="grid grid-cols-8 gap-2">
              {colorOptions.map((color) => (
                <button
                  key={color}
                  type="button"
                  onClick={() => setFormData((prev) => ({ ...prev, selectedColor: color }))}
                  className={`w-8 h-8 rounded-lg ${color} transition-all duration-200 ${
                    formData.selectedColor === color
                      ? "ring-2 ring-offset-2 dark:ring-offset-gray-800 ring-gray-400 dark:ring-gray-500 scale-110"
                      : "hover:scale-105"
                  }`}
                />
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Características ({formData.selectedFeatures.length} seleccionadas)
            </label>
            <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto p-2 border border-gray-200 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700/50">
              {availableFeatures.map((feature) => (
                <label
                  key={feature}
                  className="flex items-center space-x-2 cursor-pointer p-2 rounded hover:bg-white dark:hover:bg-gray-700 transition-colors"
                >
                  <input
                    type="checkbox"
                    checked={formData.selectedFeatures.includes(feature)}
                    onChange={() => handleFeatureToggle(feature)}
                    className="rounded border-gray-300 dark:border-gray-600 text-blue-600 dark:text-blue-500 focus:ring-blue-500 dark:focus:ring-blue-400 bg-white dark:bg-gray-700"
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300">{feature}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="flex space-x-3 pt-4 border-t border-gray-200 dark:border-gray-700">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 px-4 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors bg-white dark:bg-gray-800"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex-1 py-2.5 px-4 bg-blue-600 dark:bg-blue-500 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors shadow-sm hover:shadow-md"
            >
              Crear Agente
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
