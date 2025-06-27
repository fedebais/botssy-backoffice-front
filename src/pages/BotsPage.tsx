import { useState } from "react"
import { Plus, Filter } from "lucide-react"
import BotCard from "../components/BotCard"
import CreateCustomBotModal from "../components/CreateCustomBotModal"
import type { BotAgent } from "../types"

interface BotsPageProps {
  bots: BotAgent[]
  onActivateBot: (botId: string) => void
  onCreateBot: (bot: Omit<BotAgent, "id">) => void
}

export default function BotsPage({ bots, onActivateBot, onCreateBot }: BotsPageProps) {
  const [selectedVertical, setSelectedVertical] = useState<string>("all")
  const [selectedPriceRange, setSelectedPriceRange] = useState<string>("all")
  const [selectedComplexity, setSelectedComplexity] = useState<string>("all")
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<string>("all")

  const verticals = ["all", ...Array.from(new Set(bots.map((bot) => bot.vertical)))]
  const complexities = ["all", "basic", "intermediate", "advanced"]
  const priceRanges = [
    { label: "Todos los precios", value: "all" },
    { label: "Gratis", value: "free" },
    { label: "$1 - $50", value: "1-50" },
    { label: "$51 - $200", value: "51-200" },
    { label: "$201+", value: "201+" },
  ]
  const categories = ["all", ...Array.from(new Set(bots.map((bot) => bot.category)))]

  const filteredBots = bots.filter((bot) => {
    const matchesVertical = selectedVertical === "all" || bot.vertical === selectedVertical
    const matchesCategory = selectedCategory === "all" || bot.category === selectedCategory
    const matchesComplexity = selectedComplexity === "all" || bot.complexity === selectedComplexity

    let matchesPrice = true
    if (selectedPriceRange !== "all") {
      const price = bot.pricing.monthly
      switch (selectedPriceRange) {
        case "free":
          matchesPrice = price === 0
          break
        case "1-50":
          matchesPrice = price >= 1 && price <= 50
          break
        case "51-200":
          matchesPrice = price >= 51 && price <= 200
          break
        case "201+":
          matchesPrice = price > 200
          break
      }
    }

    return matchesVertical && matchesCategory && matchesPrice && matchesComplexity
  })

  return (
    <div className="p-6 h-full overflow-y-auto bg-gray-50 dark:bg-gray-900">
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Marketplace de Agentes IA</h1>
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center space-x-2 bg-blue-600 dark:bg-blue-500 text-white px-4 py-2.5 rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition-all duration-200 shadow-sm hover:shadow-md"
          >
            <Plus className="w-4 h-4" />
            <span>Crear Agente Personalizado</span>
          </button>
        </div>
        <p className="text-gray-600 dark:text-gray-400">
          Descubre agentes especializados por industria con precios transparentes
        </p>
      </div>

      {/* Filtros */}
      <div className="mb-6 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 shadow-sm">
        <div className="flex items-center space-x-2 mb-3">
          <Filter className="w-4 h-4 text-gray-500 dark:text-gray-400" />
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Filtros</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Industria</label>
            <select
              value={selectedVertical}
              onChange={(e) => setSelectedVertical(e.target.value)}
              className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
            >
              {verticals.map((vertical) => (
                <option key={vertical} value={vertical}>
                  {vertical === "all" ? "Todas las industrias" : vertical}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Categoría</label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
            >
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category === "all" ? "Todas las categorías" : category}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Precio</label>
            <select
              value={selectedPriceRange}
              onChange={(e) => setSelectedPriceRange(e.target.value)}
              className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
            >
              {priceRanges.map((range) => (
                <option key={range.value} value={range.value}>
                  {range.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Complejidad</label>
            <select
              value={selectedComplexity}
              onChange={(e) => setSelectedComplexity(e.target.value)}
              className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
            >
              {complexities.map((complexity) => (
                <option key={complexity} value={complexity}>
                  {complexity === "all"
                    ? "Todas las complejidades"
                    : complexity.charAt(0).toUpperCase() + complexity.slice(1)}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Resultados */}
      <div className="mb-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            {filteredBots.length} agentes encontrados
          </h2>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            Mostrando {selectedVertical === "all" ? "todas las industrias" : selectedVertical}
          </div>
        </div>
      </div>

      {/* Grid de bots */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredBots.map((bot) => (
          <BotCard key={bot.id} bot={bot} onActivate={onActivateBot} />
        ))}
      </div>

      {filteredBots.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 dark:text-gray-500 mb-2 text-lg">No hay agentes disponibles</div>
          <p className="text-gray-500 dark:text-gray-400">Intenta ajustar los filtros o crea un agente personalizado</p>
        </div>
      )}

      <CreateCustomBotModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onCreateBot={onCreateBot} />
    </div>
  )
}
