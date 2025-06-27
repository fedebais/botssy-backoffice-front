import { Globe, MessageCircle, Instagram, Facebook, CheckCircle, Settings } from "lucide-react"
import type { Channel } from "../types"

interface ChannelCardProps {
  channel: Channel
  onToggle: (channelId: string) => void
  onConfigure?: (channelId: string) => void
}

export default function ChannelCard({ channel, onToggle, onConfigure }: ChannelCardProps) {
  const getIconComponent = (iconName: string) => {
    const icons = {
      globe: Globe,
      message: MessageCircle,
      instagram: Instagram,
      facebook: Facebook,
      whatsapp: MessageCircle,
    }
    return icons[iconName as keyof typeof icons] || Globe
  }

  const IconComponent = getIconComponent(channel.icon)

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 hover:shadow-lg dark:hover:shadow-xl hover:shadow-gray-200 dark:hover:shadow-gray-900/50 transition-all duration-200">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${channel.color} shadow-sm`}>
            <IconComponent className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{channel.name}</h3>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200">
              {channel.category}
            </span>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          {channel.isConnected && (
            <div className="flex items-center space-x-1 text-green-600 dark:text-green-400">
              <CheckCircle className="w-4 h-4" />
              <span className="text-sm font-medium">Conectado</span>
            </div>
          )}
          {channel.setupRequired && !channel.isConnected && (
            <div className="flex items-center space-x-1 text-orange-600 dark:text-orange-400">
              <Settings className="w-4 h-4" />
              <span className="text-sm font-medium">Config. requerida</span>
            </div>
          )}
        </div>
      </div>

      <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 leading-relaxed">{channel.description}</p>

      <div className="mb-4">
        <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">Características:</h4>
        <ul className="space-y-1">
          {channel.features.map((feature, index) => (
            <li key={index} className="text-sm text-gray-600 dark:text-gray-300 flex items-center">
              <div className="w-1.5 h-1.5 bg-blue-500 dark:bg-blue-400 rounded-full mr-2 flex-shrink-0"></div>
              {feature}
            </li>
          ))}
        </ul>
      </div>

      {channel.stats && channel.isActive && (
        <div className="grid grid-cols-3 gap-4 mb-4 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-gray-100 dark:border-gray-600">
          <div className="text-center">
            <div className="text-lg font-semibold text-gray-900 dark:text-white">{channel.stats.messages}</div>
            <div className="text-xs text-gray-500 dark:text-gray-400">Mensajes</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-semibold text-gray-900 dark:text-white">{channel.stats.users}</div>
            <div className="text-xs text-gray-500 dark:text-gray-400">Usuarios</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-semibold text-gray-900 dark:text-white">{channel.stats.responseRate}%</div>
            <div className="text-xs text-gray-500 dark:text-gray-400">Respuesta</div>
          </div>
        </div>
      )}

      <div className="flex space-x-2">
        <button
          onClick={() => onToggle(channel.id)}
          className={`flex-1 py-2.5 px-4 rounded-lg font-medium transition-all duration-200 ${
            channel.isActive
              ? "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-900/50 border border-red-200 dark:border-red-800"
              : "bg-blue-600 dark:bg-blue-500 text-white hover:bg-blue-700 dark:hover:bg-blue-600 shadow-sm hover:shadow-md"
          }`}
        >
          {channel.isActive ? "Desactivar" : "Activar"}
        </button>
        {onConfigure && (channel.setupRequired || channel.isActive) && (
          <button
            onClick={() => onConfigure(channel.id)}
            className="px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200 bg-white dark:bg-gray-800"
          >
            <Settings className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  )
}
