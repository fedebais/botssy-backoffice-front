import { useState } from "react"
import { Search, Download, Plus } from "lucide-react"
import CustomerCard from "../components/CustomerCard"
import type { Customer } from "../types"

interface CustomersPageProps {
  customers: Customer[]
  onViewCustomer: (customer: Customer) => void
}

export default function CustomersPage({ customers, onViewCustomer }: CustomersPageProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedStatus, setSelectedStatus] = useState<string>("all")
  const [selectedSource, setSelectedSource] = useState<string>("all")

  const filteredCustomers = customers.filter((customer) => {
    const matchesSearch =
      customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.phone?.includes(searchTerm)

    const matchesStatus = selectedStatus === "all" || customer.status === selectedStatus
    const matchesSource = selectedSource === "all" || customer.source === selectedSource

    return matchesSearch && matchesStatus && matchesSource
  })

  const totalCustomers = customers.length
  const activeCustomers = customers.filter((c) => c.status === "active").length
  const contactsCount = customers.filter((c) => c.isContact).length

  const sources = ["all", ...Array.from(new Set(customers.map((c) => c.source)))]
  const statuses = ["all", "active", "inactive", "blocked"]

  return (
    <div className="p-6 h-full overflow-y-auto bg-gray-50 dark:bg-gray-900">
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Gestión de Clientes</h1>
          <div className="flex space-x-2">
            <button className="flex items-center space-x-2 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 px-4 py-2.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200 border border-gray-200 dark:border-gray-700 shadow-sm">
              <Download className="w-4 h-4" />
              <span>Exportar</span>
            </button>
            <button className="flex items-center space-x-2 bg-blue-600 dark:bg-blue-500 text-white px-4 py-2.5 rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition-all duration-200 shadow-sm hover:shadow-md">
              <Plus className="w-4 h-4" />
              <span>Agregar Cliente</span>
            </button>
          </div>
        </div>
        <p className="text-gray-600 dark:text-gray-400">Gestiona toda la información de tus clientes y contactos</p>
      </div>

      {/* Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 shadow-sm">
          <div className="text-2xl font-bold text-gray-900 dark:text-white">{totalCustomers}</div>
          <div className="text-sm text-gray-500 dark:text-gray-400">Total Clientes</div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 shadow-sm">
          <div className="text-2xl font-bold text-green-600 dark:text-green-400">{activeCustomers}</div>
          <div className="text-sm text-gray-500 dark:text-gray-400">Clientes Activos</div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 shadow-sm">
          <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{contactsCount}</div>
          <div className="text-sm text-gray-500 dark:text-gray-400">Contactos Guardados</div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 shadow-sm">
          <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
            {Math.round(customers.reduce((acc, c) => acc + c.totalConversations, 0) / customers.length) || 0}
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400">Promedio Conversaciones</div>
        </div>
      </div>

      {/* Filtros y búsqueda */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 mb-6 shadow-sm">
        <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 w-4 h-4" />
              <input
                type="text"
                placeholder="Buscar por nombre, email o teléfono..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition-colors"
              />
            </div>
          </div>
          <div className="flex space-x-2">
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition-colors"
            >
              {statuses.map((status) => (
                <option key={status} value={status}>
                  {status === "all" ? "Todos los estados" : status.charAt(0).toUpperCase() + status.slice(1)}
                </option>
              ))}
            </select>
            <select
              value={selectedSource}
              onChange={(e) => setSelectedSource(e.target.value)}
              className="border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition-colors"
            >
              {sources.map((source) => (
                <option key={source} value={source}>
                  {source === "all" ? "Todas las fuentes" : source}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Grid de clientes */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCustomers.map((customer) => (
          <CustomerCard key={customer.id} customer={customer} onViewProfile={onViewCustomer} />
        ))}
      </div>

      {filteredCustomers.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 dark:text-gray-500 mb-2 text-lg">No se encontraron clientes</div>
          <p className="text-gray-500 dark:text-gray-400">Intenta ajustar los filtros de búsqueda</p>
        </div>
      )}
    </div>
  )
}
