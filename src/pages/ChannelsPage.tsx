"use client"

import { useState } from "react"
import ChannelCard from "../components/ChannelCard"
import type { Channel } from "../types"

interface ChannelsPageProps {
  channels: Channel[]
  onToggleChannel: (channelId: string) => void
  onConfigureChannel?: (channelId: string) => void
}

export default function ChannelsPage({ channels, onToggleChannel, onConfigureChannel }: ChannelsPageProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("all")

  const categories = ["all", ...Array.from(new Set(channels.map((channel) => channel.category)))]

  const filteredChannels =
    selectedCategory === "all" ? channels : channels.filter((channel) => channel.category === selectedCategory)

  const activeChannels = channels.filter((channel) => channel.isActive).length
  const connectedChannels = channels.filter((channel) => channel.isConnected).length

  return (
    <div className="p-6 h-full overflow-y-auto bg-gray-50 dark:bg-gray-900">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Canales de Comunicación</h1>
        <p className="text-gray-600 dark:text-gray-400">Conecta y gestiona todos tus canales de atención al cliente</p>
      </div>

      {/* Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 shadow-sm">
          <div className="text-2xl font-bold text-gray-900 dark:text-white">{channels.length}</div>
          <div className="text-sm text-gray-500 dark:text-gray-400">Canales Disponibles</div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 shadow-sm">
          <div className="text-2xl font-bold text-green-600 dark:text-green-400">{activeChannels}</div>
          <div className="text-sm text-gray-500 dark:text-gray-400">Canales Activos</div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 shadow-sm">
          <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{connectedChannels}</div>
          <div className="text-sm text-gray-500 dark:text-gray-400">Canales Conectados</div>
        </div>
      </div>

      {/* Filtros por categoría */}
      <div className="mb-6">
        <div className="flex space-x-2 overflow-x-auto pb-2">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 whitespace-nowrap ${
                selectedCategory === category
                  ? "bg-blue-600 dark:bg-blue-500 text-white shadow-sm"
                  : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700"
              }`}
            >
              {category === "all" ? "Todos" : category}
            </button>
          ))}
        </div>
      </div>

      {/* Grid de canales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredChannels.map((channel) => (
          <ChannelCard key={channel.id} channel={channel} onToggle={onToggleChannel} onConfigure={onConfigureChannel} />
        ))}
      </div>

      {filteredChannels.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 dark:text-gray-500 mb-2 text-lg">
            No hay canales disponibles en esta categoría
          </div>
          <p className="text-gray-500 dark:text-gray-400">Intenta seleccionar otra categoría</p>
        </div>
      )}
    </div>
  )
}
