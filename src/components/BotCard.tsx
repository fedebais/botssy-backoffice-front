import { Bot, MessageCircle, Clock, Star, CheckCircle, DollarSign, TrendingUp } from "lucide-react"
import type { BotAgent } from "../types"

interface BotCardProps {
  bot: BotAgent
  onActivate: (botId: string) => void
}

export default function BotCard({ bot, onActivate }: BotCardProps) {
  const getIconComponent = (iconName: string) => {
    const icons = {
      bot: Bot,
      message: MessageCircle,
      clock: Clock,
      star: Star,
    }
    return icons[iconName as keyof typeof icons] || Bot
  }

  const IconComponent = getIconComponent(bot.icon)

  const getPopularityColor = (popularity?: string) => {
    switch (popularity) {
      case "high":
        return "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400 border-green-200 dark:border-green-800"
      case "medium":
        return "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-400 border-yellow-200 dark:border-yellow-800"
      case "low":
        return "bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300 border-gray-200 dark:border-gray-600"
      default:
        return "bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300 border-gray-200 dark:border-gray-600"
    }
  }

  const getComplexityColor = (complexity?: string) => {
    switch (complexity) {
      case "basic":
        return "bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-400"
      case "intermediate":
        return "bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-400"
      case "advanced":
        return "bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-400"
      default:
        return "bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300"
    }
  }

  const formatPrice = (pricing: BotAgent["pricing"]) => {
    const { monthly, currency, billingType } = pricing
    const symbol = currency === "USD" ? "$" : currency === "EUR" ? "€" : currency

    if (billingType === "per_conversation") {
      return `${symbol}${monthly}/1k conversaciones`
    } else if (billingType === "per_agent") {
      return `${symbol}${monthly}/agente`
    } else {
      return `${symbol}${monthly}/mes`
    }
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 hover:shadow-lg dark:hover:shadow-xl hover:shadow-gray-200 dark:hover:shadow-gray-900/50 transition-all duration-200 relative">
      {/* Popularity Badge */}
      {bot.popularity === "high" && (
        <div className="absolute -top-2 -right-2 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full flex items-center space-x-1 shadow-lg">
          <TrendingUp className="w-3 h-3" />
          <span>Popular</span>
        </div>
      )}

      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${bot.color} shadow-sm`}>
            <IconComponent className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{bot.name}</h3>
            <div className="flex items-center space-x-2 mt-1">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200">
                {bot.vertical}
              </span>
              {bot.complexity && (
                <span
                  className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getComplexityColor(bot.complexity)}`}
                >
                  {bot.complexity}
                </span>
              )}
            </div>
          </div>
        </div>
        {bot.isActive && (
          <div className="flex items-center space-x-1 text-green-600 dark:text-green-400">
            <CheckCircle className="w-4 h-4" />
            <span className="text-sm font-medium">Activo</span>
          </div>
        )}
      </div>

      <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 leading-relaxed">{bot.description}</p>

      {/* Pricing Section */}
      <div className="mb-4 p-3 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg border border-blue-100 dark:border-blue-800">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <DollarSign className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            <span className="text-lg font-bold text-blue-900 dark:text-blue-100">{formatPrice(bot.pricing)}</span>
          </div>
          {bot.pricing.freeTrialDays && (
            <span className="text-xs bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400 px-2 py-1 rounded-full font-medium">
              {bot.pricing.freeTrialDays} días gratis
            </span>
          )}
        </div>
        {bot.pricing.setupFee && (
          <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">
            + ${bot.pricing.setupFee} configuración inicial
          </div>
        )}
      </div>

      <div className="mb-4">
        <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">Características:</h4>
        <ul className="space-y-1">
          {bot.features.slice(0, 3).map((feature, index) => (
            <li key={index} className="text-sm text-gray-600 dark:text-gray-300 flex items-center">
              <div className="w-1.5 h-1.5 bg-blue-500 dark:bg-blue-400 rounded-full mr-2 flex-shrink-0"></div>
              {feature}
            </li>
          ))}
          {bot.features.length > 3 && (
            <li className="text-xs text-gray-500 dark:text-gray-400 ml-3.5">
              +{bot.features.length - 3} características más
            </li>
          )}
        </ul>
      </div>

      {bot.stats && (
        <div className="grid grid-cols-3 gap-4 mb-4 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-gray-100 dark:border-gray-600">
          <div className="text-center">
            <div className="text-lg font-semibold text-gray-900 dark:text-white">{bot.stats.conversations}</div>
            <div className="text-xs text-gray-500 dark:text-gray-400">Conversaciones</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-semibold text-gray-900 dark:text-white">{bot.stats.responseTime}</div>
            <div className="text-xs text-gray-500 dark:text-gray-400">Respuesta</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-semibold text-gray-900 dark:text-white">{bot.stats.satisfaction}%</div>
            <div className="text-xs text-gray-500 dark:text-gray-400">Satisfacción</div>
          </div>
        </div>
      )}

      {/* Tags */}
      {bot.tags && bot.tags.length > 0 && (
        <div className="mb-4">
          <div className="flex flex-wrap gap-1">
            {bot.tags.map((tag, index) => (
              <span
                key={index}
                className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-indigo-100 dark:bg-indigo-900/30 text-indigo-800 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      )}

      <button
        onClick={() => onActivate(bot.id)}
        disabled={bot.isActive}
        className={`w-full py-2.5 px-4 rounded-lg font-medium transition-all duration-200 ${
          bot.isActive
            ? "bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed"
            : "bg-blue-600 dark:bg-blue-500 text-white hover:bg-blue-700 dark:hover:bg-blue-600 shadow-sm hover:shadow-md"
        }`}
      >
        {bot.isActive ? "Activado" : bot.pricing.freeTrialDays ? "Iniciar Prueba Gratis" : "Activar"}
      </button>
    </div>
  )
}
