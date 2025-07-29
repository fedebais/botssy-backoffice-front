"use client";

import { useState } from "react";
import {
  Search,
  Download,
  Plus,
  Grid,
  List,
  Eye,
  Edit,
  MessageCircle,
  X,
  Save,
  User,
  Mail,
  Phone,
  MapPin,
  Building,
  Tag,
} from "lucide-react";
import type { Customer } from "../types";
import getInitials from "../utils/getInitials";

const filterSelectClass =
  "border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition-colors";

interface CustomersPageProps {
  customers?: Customer[];
  onViewCustomer: (customer: Customer) => void;
  onStartConversation?: (customer: Customer) => void;
}

export default function CustomersPage({
  customers = [],
  onViewCustomer,
  onStartConversation,
}: CustomersPageProps) {
  const safeCustomers = Array.isArray(customers) ? customers : [];

  console.log(customers);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [selectedSource, setSelectedSource] = useState<string>("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(
    null
  );
  const [showModal, setShowModal] = useState<"view" | "edit" | "add" | null>(
    null
  );
  const [editingCustomer, setEditingCustomer] = useState<Partial<Customer>>({});

  const searchLower = searchTerm.toLowerCase();

  const filteredCustomers = safeCustomers.filter((customer) => {
    const matchesSearch =
      customer.name?.toLowerCase().includes(searchLower) ||
      customer.email?.toLowerCase().includes(searchLower) ||
      customer.phone?.includes(searchTerm);

    const matchesStatus =
      selectedStatus === "all" || customer.status === selectedStatus;
    const matchesSource =
      selectedSource === "all" || customer.source === selectedSource;

    return matchesSearch && matchesStatus && matchesSource;
  });

  const totalCustomers = safeCustomers.length;
  const activeCustomers = safeCustomers.filter(
    (c) => c.status === "active"
  ).length;
  const contactsCount = safeCustomers.filter((c) => c.isContact).length;

  const sources = [
    "all",
    ...Array.from(new Set(safeCustomers.map((c) => c.source).filter(Boolean))),
  ];
  const statuses = ["all", "active", "inactive", "blocked"];

  const handleViewCustomer = (customer: Customer) => {
    setSelectedCustomer(customer);
    setShowModal("view");
  };

  const handleEditCustomer = (customer: Customer) => {
    setSelectedCustomer(customer);
    setEditingCustomer({ ...customer });
    setShowModal("edit");
  };

  const handleAddCustomer = () => {
    setEditingCustomer({
      name: "",
      email: "",
      phone: "",
      location: "",
      company: "",
      tags: [],
      isContact: false,
      status: "active",
      notes: "",
      source: "Manual",
    });
    setShowModal("add");
  };

  const handleSaveCustomer = () => {
    // Aquí iría la lógica para guardar el cliente
    console.log("Guardando cliente:", editingCustomer);
    setShowModal(null);
    setEditingCustomer({});
  };

  const handleStartConversation = (customer: Customer) => {
    if (onStartConversation) {
      onStartConversation(customer);
    }
    console.log("Iniciando conversación con:", customer.name);
  };

  const closeModal = () => {
    setShowModal(null);
    setSelectedCustomer(null);
    setEditingCustomer({});
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("es-ES", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400";
      case "inactive":
        return "bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300";
      case "blocked":
        return "bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-400";
      default:
        return "bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "active":
        return "Activo";
      case "inactive":
        return "Inactivo";
      case "blocked":
        return "Bloqueado";
      default:
        return status;
    }
  };

  if (safeCustomers.length === 0) {
    return (
      <div className="p-6 h-full overflow-y-auto bg-gray-50 dark:bg-gray-900">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Gestión de Clientes
          </h1>
          <p className="text-gray-500 dark:text-gray-400">
            No hay clientes disponibles todavía. Agrega tu primer cliente para
            comenzar.
          </p>
        </div>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <User className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-400 dark:text-gray-500 text-lg mb-4">
              Sin clientes
            </p>
            <button
              onClick={handleAddCustomer}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Agregar primer cliente
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 h-full overflow-y-auto bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Gestión de Clientes
          </h1>
          <div className="flex space-x-2">
            <button className="flex items-center space-x-2 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 px-4 py-2.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200 border border-gray-200 dark:border-gray-700 shadow-sm">
              <Download className="w-4 h-4" />
              <span>Exportar</span>
            </button>
            <button
              onClick={handleAddCustomer}
              className="flex items-center space-x-2 bg-blue-600 dark:bg-blue-500 text-white px-4 py-2.5 rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition-all duration-200 shadow-sm hover:shadow-md"
            >
              <Plus className="w-4 h-4" />
              <span>Agregar Cliente</span>
            </button>
          </div>
        </div>
        <p className="text-gray-600 dark:text-gray-400">
          Gestiona toda la información de tus clientes y contactos
        </p>
      </div>

      {/* Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <StatBox
          label="Total Clientes"
          value={totalCustomers}
          color="text-gray-900 dark:text-white"
        />
        <StatBox
          label="Clientes Activos"
          value={activeCustomers}
          color="text-green-600 dark:text-green-400"
        />
        <StatBox
          label="Contactos Guardados"
          value={contactsCount}
          color="text-blue-600 dark:text-blue-400"
        />
        <StatBox
          label="Promedio Conversaciones"
          value={
            Math.round(
              safeCustomers.reduce(
                (acc, c) => acc + (c.totalConversations ?? 0),
                0
              ) / safeCustomers.length
            ) || 0
          }
          color="text-purple-600 dark:text-purple-400"
        />
      </div>

      {/* Filtros y controles */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 mb-6 shadow-sm">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1">
            <SearchInput value={searchTerm} onChange={setSearchTerm} />
          </div>
          <div className="flex gap-2">
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className={filterSelectClass}
            >
              {statuses.map((status) => (
                <option key={status} value={status}>
                  {status === "all"
                    ? "Todos los estados"
                    : status.charAt(0).toUpperCase() + status.slice(1)}
                </option>
              ))}
            </select>
            <select
              value={selectedSource}
              onChange={(e) => setSelectedSource(e.target.value)}
              className={filterSelectClass}
            >
              {sources.map((source) => (
                <option key={source} value={source}>
                  {source === "all" ? "Todas las fuentes" : source}
                </option>
              ))}
            </select>
            <div className="flex border border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-2 ${
                  viewMode === "grid"
                    ? "bg-blue-600 text-white"
                    : "bg-white dark:bg-gray-700 text-gray-600 dark:text-gray-300"
                }`}
              >
                <Grid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-2 ${
                  viewMode === "list"
                    ? "bg-blue-600 text-white"
                    : "bg-white dark:bg-gray-700 text-gray-600 dark:text-gray-300"
                }`}
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Lista de clientes */}
      {filteredCustomers.length > 0 ? (
        viewMode === "grid" ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCustomers.map((customer) => (
              <CustomerCard
                key={customer.id}
                customer={customer}
                onView={() => handleViewCustomer(customer)}
                onEdit={() => handleEditCustomer(customer)}
                onStartConversation={() => handleStartConversation(customer)}
              />
            ))}
          </div>
        ) : (
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Cliente
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Contacto
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Estado
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Conversaciones
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Última actividad
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {filteredCustomers.map((customer) => (
                    <CustomerRow
                      key={customer.id}
                      customer={customer}
                      onView={() => handleViewCustomer(customer)}
                      onEdit={() => handleEditCustomer(customer)}
                      onStartConversation={() =>
                        handleStartConversation(customer)
                      }
                    />
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )
      ) : (
        <div className="text-center py-12">
          <div className="text-gray-400 dark:text-gray-500 mb-2 text-lg">
            No se encontraron clientes
          </div>
          <p className="text-gray-500 dark:text-gray-400">
            Intenta ajustar los filtros de búsqueda
          </p>
        </div>
      )}

      {/* Modales */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            {showModal === "view" && selectedCustomer && (
              <CustomerViewModal
                customer={selectedCustomer}
                onClose={closeModal}
                onEdit={() => handleEditCustomer(selectedCustomer)}
                onStartConversation={() =>
                  handleStartConversation(selectedCustomer)
                }
              />
            )}
            {(showModal === "edit" || showModal === "add") && (
              <CustomerEditModal
                customer={editingCustomer}
                isNew={showModal === "add"}
                onChange={setEditingCustomer}
                onSave={handleSaveCustomer}
                onClose={closeModal}
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// Componente de tarjeta de cliente
function CustomerCard({
  customer,
  onView,
  onEdit,
  onStartConversation,
}: {
  customer: Customer;
  onView: () => void;
  onEdit: () => void;
  onStartConversation: () => void;
}) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400";
      case "inactive":
        return "bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300";
      case "blocked":
        return "bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-400";
      default:
        return "bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "active":
        return "Activo";
      case "inactive":
        return "Inactivo";
      case "blocked":
        return "Bloqueado";
      default:
        return status;
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 hover:shadow-lg transition-all duration-200">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-gray-300 dark:bg-gray-600 rounded-full flex items-center justify-center">
            {customer.avatar ? (
              <img
                src={customer.avatar || "/placeholder.svg"}
                alt={customer.name}
                className="w-12 h-12 rounded-full object-cover"
              />
            ) : customer.name ? (
              <span className="text-xl font-medium text-gray-700 dark:text-gray-300">
                {getInitials(customer.name)}
              </span>
            ) : (
              <User className="w-6 h-6 text-gray-600 dark:text-gray-300" />
            )}
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              {customer.name}
            </h3>
            <div className="flex items-center space-x-2 mt-1">
              <span
                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                  customer.status
                )}`}
              >
                {getStatusText(customer.status)}
              </span>
              {customer.isContact && (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-400">
                  Contacto
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-2 mb-4">
        {customer.email && (
          <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-300">
            <Mail className="w-4 h-4 text-gray-400" />
            <span className="truncate">{customer.email}</span>
          </div>
        )}
        {customer.phone && (
          <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-300">
            <Phone className="w-4 h-4 text-gray-400" />
            <span>{customer.phone}</span>
          </div>
        )}
        {customer.company && (
          <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-300">
            <Building className="w-4 h-4 text-gray-400" />
            <span className="truncate">{customer.company}</span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
        <div className="text-center">
          <div className="text-lg font-semibold text-gray-900 dark:text-white">
            {customer.totalConversations}
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400">
            Conversaciones
          </div>
        </div>
        <div className="text-center">
          <div className="text-lg font-semibold text-gray-900 dark:text-white">
            {customer.satisfaction || "N/A"}%
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400">
            Satisfacción
          </div>
        </div>
      </div>

      {/* Etiquetas */}
      {customer.tags && customer.tags.length > 0 && (
        <div className="mb-4">
          <div className="flex flex-wrap gap-1">
            {customer.tags.slice(0, 3).map((tag, index) => (
              <span
                key={index}
                className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 border border-gray-200 dark:border-gray-600"
              >
                <Tag className="w-3 h-3 mr-1 text-gray-500 dark:text-gray-400" />
                {tag}
              </span>
            ))}
            {customer.tags.length > 3 && (
              <span className="text-xs text-gray-500 dark:text-gray-400 px-2 py-1">
                +{customer.tags.length - 3} más
              </span>
            )}
          </div>
        </div>
      )}

      <div className="flex space-x-2">
        <button
          onClick={onView}
          className="flex-1 flex items-center justify-center space-x-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-3 py-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
        >
          <Eye className="w-4 h-4" />
          <span>Ver</span>
        </button>
        <button
          onClick={onEdit}
          className="flex-1 flex items-center justify-center space-x-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 px-3 py-2 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors"
        >
          <Edit className="w-4 h-4" />
          <span>Editar</span>
        </button>
        <button
          onClick={onStartConversation}
          className="flex-1 flex items-center justify-center space-x-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 px-3 py-2 rounded-lg hover:bg-green-200 dark:hover:bg-green-900/50 transition-colors"
        >
          <MessageCircle className="w-4 h-4" />
          <span>Chat</span>
        </button>
      </div>
    </div>
  );
}

// Componente de fila de tabla
function CustomerRow({
  customer,
  onView,
  onEdit,
  onStartConversation,
}: {
  customer: Customer;
  onView: () => void;
  onEdit: () => void;
  onStartConversation: () => void;
}) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400";
      case "inactive":
        return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300";
      case "blocked":
        return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "active":
        return "Activo";
      case "inactive":
        return "Inactivo";
      case "blocked":
        return "Bloqueado";
      default:
        return status;
    }
  };

  return (
    <tr className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center">
          <div className="w-10 h-10 bg-gray-300 dark:bg-gray-600 rounded-full flex items-center justify-center mr-3">
            {customer.avatar ? (
              <img
                src={customer.avatar || "/placeholder.svg"}
                alt={customer.name}
                className="w-10 h-10 rounded-full object-cover"
              />
            ) : (
              <User className="w-5 h-5 text-gray-600 dark:text-gray-300" />
            )}
          </div>
          <div>
            <div className="text-sm font-medium text-gray-900 dark:text-white">
              {customer.name}
            </div>
            {customer.company && (
              <div className="text-sm text-gray-500 dark:text-gray-400">
                {customer.company}
              </div>
            )}
          </div>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm text-gray-900 dark:text-white">
          {customer.email}
        </div>
        {customer.phone && (
          <div className="text-sm text-gray-500 dark:text-gray-400">
            {customer.phone}
          </div>
        )}
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <span
          className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(
            customer.status
          )}`}
        >
          {getStatusText(customer.status)}
        </span>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
        {customer.totalConversations}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
        {new Date(customer.lastActivity).toLocaleDateString()}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
        <div className="flex space-x-2">
          <button
            onClick={onView}
            className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
          >
            <Eye className="w-4 h-4" />
          </button>
          <button
            onClick={onEdit}
            className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-300"
          >
            <Edit className="w-4 h-4" />
          </button>
          <button
            onClick={onStartConversation}
            className="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300"
          >
            <MessageCircle className="w-4 h-4" />
          </button>
        </div>
      </td>
    </tr>
  );
}

// Modal de visualización de cliente
function CustomerViewModal({
  customer,
  onClose,
  onEdit,
  onStartConversation,
}: {
  customer: Customer;
  onClose: () => void;
  onEdit: () => void;
  onStartConversation: () => void;
}) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400";
      case "inactive":
        return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300";
      case "blocked":
        return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "active":
        return "Activo";
      case "inactive":
        return "Inactivo";
      case "blocked":
        return "Bloqueado";
      default:
        return status;
    }
  };

  return (
    <>
      <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
          Detalles del Cliente
        </h2>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
        >
          <X className="w-6 h-6" />
        </button>
      </div>

      <div className="p-6">
        <div className="flex items-center space-x-4 mb-6">
          <div className="w-16 h-16 bg-gray-300 dark:bg-gray-600 rounded-full flex items-center justify-center">
            {customer.avatar ? (
              <img
                src={customer.avatar || "/placeholder.svg"}
                alt={customer.name}
                className="w-16 h-16 rounded-full object-cover"
              />
            ) : (
              <User className="w-8 h-8 text-gray-600 dark:text-gray-300" />
            )}
          </div>
          <div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
              {customer.name}
            </h3>
            <div className="flex items-center space-x-2 mt-1">
              <span
                className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                  customer.status
                )}`}
              >
                {getStatusText(customer.status)}
              </span>
              {customer.isContact && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-400">
                  Contacto
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
              Información de Contacto
            </h4>
            <div className="space-y-3">
              {customer.email && (
                <div className="flex items-center space-x-3">
                  <Mail className="w-5 h-5 text-gray-400" />
                  <span className="text-gray-700 dark:text-gray-300">
                    {customer.email}
                  </span>
                </div>
              )}
              {customer.phone && (
                <div className="flex items-center space-x-3">
                  <Phone className="w-5 h-5 text-gray-400" />
                  <span className="text-gray-700 dark:text-gray-300">
                    {customer.phone}
                  </span>
                </div>
              )}
              {customer.location && (
                <div className="flex items-center space-x-3">
                  <MapPin className="w-5 h-5 text-gray-400" />
                  <span className="text-gray-700 dark:text-gray-300">
                    {customer.location}
                  </span>
                </div>
              )}
              {customer.company && (
                <div className="flex items-center space-x-3">
                  <Building className="w-5 h-5 text-gray-400" />
                  <span className="text-gray-700 dark:text-gray-300">
                    {customer.company}
                  </span>
                </div>
              )}
            </div>
          </div>

          <div>
            <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
              Estadísticas
            </h4>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  {customer.totalConversations}
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  Conversaciones
                </div>
              </div>
              <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  {customer.totalMessages}
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  Mensajes
                </div>
              </div>
              <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  {customer.satisfaction || "N/A"}%
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  Satisfacción
                </div>
              </div>
              <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  {customer.averageResponseTime}
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  Tiempo respuesta
                </div>
              </div>
            </div>
          </div>
        </div>

        {customer.tags && customer.tags.length > 0 && (
          <div className="mb-6">
            <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
              Etiquetas
            </h4>
            <div className="flex flex-wrap gap-2">
              {customer.tags.map((tag, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200"
                >
                  <Tag className="w-3 h-3 mr-1" />
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}

        {customer.notes && (
          <div className="mb-6">
            <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
              Notas
            </h4>
            <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
              <p className="text-gray-700 dark:text-gray-300">
                {customer.notes}
              </p>
            </div>
          </div>
        )}

        <div className="text-sm text-gray-500 dark:text-gray-400 mb-6">
          <p>
            Cliente desde: {new Date(customer.createdAt).toLocaleDateString()}
          </p>
          <p>
            Última actividad:{" "}
            {new Date(customer.lastActivity).toLocaleDateString()}
          </p>
          <p>Fuente: {customer.source}</p>
        </div>
      </div>

      <div className="flex space-x-3 p-6 border-t border-gray-200 dark:border-gray-700">
        <button
          onClick={onEdit}
          className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2"
        >
          <Edit className="w-4 h-4" />
          <span>Editar</span>
        </button>
        <button
          onClick={onStartConversation}
          className="flex-1 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center space-x-2"
        >
          <MessageCircle className="w-4 h-4" />
          <span>Iniciar Conversación</span>
        </button>
      </div>
    </>
  );
}

// Modal de edición/creación de cliente
function CustomerEditModal({
  customer,
  isNew,
  onChange,
  onSave,
  onClose,
}: {
  customer: Partial<Customer>;
  isNew: boolean;
  onChange: (customer: Partial<Customer>) => void;
  onSave: () => void;
  onClose: () => void;
}) {
  const handleInputChange = (field: keyof Customer, value: any) => {
    onChange({ ...customer, [field]: value });
  };

  const handleTagAdd = (tag: string) => {
    if (tag.trim() && !customer.tags?.includes(tag.trim())) {
      onChange({ ...customer, tags: [...(customer.tags || []), tag.trim()] });
    }
  };

  const handleTagRemove = (tagToRemove: string) => {
    onChange({
      ...customer,
      tags: customer.tags?.filter((tag) => tag !== tagToRemove) || [],
    });
  };

  return (
    <>
      <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
          {isNew ? "Agregar Cliente" : "Editar Cliente"}
        </h2>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
        >
          <X className="w-6 h-6" />
        </button>
      </div>

      <div className="p-6 max-h-[60vh] overflow-y-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Nombre *
            </label>
            <input
              type="text"
              value={customer.name || ""}
              onChange={(e) => handleInputChange("name", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Nombre completo"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Email
            </label>
            <input
              type="email"
              value={customer.email || ""}
              onChange={(e) => handleInputChange("email", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="email@ejemplo.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Teléfono
            </label>
            <input
              type="tel"
              value={customer.phone || ""}
              onChange={(e) => handleInputChange("phone", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="+34 123 456 789"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Empresa
            </label>
            <input
              type="text"
              value={customer.company || ""}
              onChange={(e) => handleInputChange("company", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Nombre de la empresa"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Ubicación
            </label>
            <input
              type="text"
              value={customer.location || ""}
              onChange={(e) => handleInputChange("location", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Ciudad, País"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Estado
            </label>
            <select
              value={customer.status || "active"}
              onChange={(e) => handleInputChange("status", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="active">Activo</option>
              <option value="inactive">Inactivo</option>
              <option value="blocked">Bloqueado</option>
            </select>
          </div>
        </div>

        <div className="mt-6">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Etiquetas
          </label>
          <div className="flex flex-wrap gap-2 mb-2">
            {customer.tags?.map((tag, index) => (
              <span
                key={index}
                className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-400"
              >
                {tag}
                <button
                  onClick={() => handleTagRemove(tag)}
                  className="ml-2 text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-200"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
          </div>
          <input
            type="text"
            placeholder="Agregar etiqueta y presionar Enter"
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            onKeyPress={(e) => {
              if (e.key === "Enter") {
                handleTagAdd(e.currentTarget.value);
                e.currentTarget.value = "";
              }
            }}
          />
        </div>

        <div className="mt-6">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Notas
          </label>
          <textarea
            value={customer.notes || ""}
            onChange={(e) => handleInputChange("notes", e.target.value)}
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            placeholder="Notas adicionales sobre el cliente..."
          />
        </div>

        <div className="mt-6">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={customer.isContact || false}
              onChange={(e) => handleInputChange("isContact", e.target.checked)}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
              Marcar como contacto
            </span>
          </label>
        </div>
      </div>

      <div className="flex space-x-3 p-6 border-t border-gray-200 dark:border-gray-700">
        <button
          onClick={onClose}
          className="flex-1 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-300 px-4 py-2 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
        >
          Cancelar
        </button>
        <button
          onClick={onSave}
          className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2"
        >
          <Save className="w-4 h-4" />
          <span>{isNew ? "Crear Cliente" : "Guardar Cambios"}</span>
        </button>
      </div>
    </>
  );
}

// Componentes auxiliares
function StatBox({
  label,
  value,
  color,
}: {
  label: string;
  value: number;
  color: string;
}) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 shadow-sm">
      <div className={`text-2xl font-bold ${color}`}>{value}</div>
      <div className="text-sm text-gray-500 dark:text-gray-400">{label}</div>
    </div>
  );
}

function SearchInput({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 w-4 h-4" />
      <input
        type="text"
        placeholder="Buscar por nombre, email o teléfono..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full pl-10 pr-4 py-2.5 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition-colors"
      />
    </div>
  );
}
