"use client";

import { User, Mail, Phone, MapPin, Tag } from "lucide-react";
import type { Customer } from "../types";

interface CustomerCardProps {
  customer: Customer;
  onViewProfile: (customer: Customer) => void;
}

export default function CustomerCard({
  customer,
  onViewProfile,
}: CustomerCardProps) {
  const formatDate = (date: Date) => {
    return date.toLocaleDateString("es-ES", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400 border border-green-200 dark:border-green-800";
      case "inactive":
        return "bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300 border border-gray-200 dark:border-gray-600";
      case "blocked":
        return "bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-400 border border-red-200 dark:border-red-800";
      default:
        return "bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300 border border-gray-200 dark:border-gray-600";
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
    <div
      className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 hover:shadow-lg dark:hover:shadow-xl hover:shadow-gray-200 dark:hover:shadow-gray-900/50 transition-all duration-200 cursor-pointer group"
      onClick={() => onViewProfile(customer)}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-gray-300 dark:bg-gray-600 rounded-full flex items-center justify-center ring-2 ring-gray-100 dark:ring-gray-700">
            {customer.avatar ? (
              <img
                src={customer.avatar || "/placeholder.svg"}
                alt={customer.name}
                className="w-12 h-12 rounded-full object-cover"
              />
            ) : (
              <User className="w-6 h-6 text-gray-600 dark:text-gray-300" />
            )}
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
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
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-400 border border-blue-200 dark:border-blue-800">
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
            <Mail className="w-4 h-4 text-gray-400 dark:text-gray-500" />
            <span className="truncate">{customer.email}</span>
          </div>
        )}
        {customer.phone && (
          <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-300">
            <Phone className="w-4 h-4 text-gray-400 dark:text-gray-500" />
            <span>{customer.phone}</span>
          </div>
        )}
        {customer.location && (
          <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-300">
            <MapPin className="w-4 h-4 text-gray-400 dark:text-gray-500" />
            <span className="truncate">{customer.location}</span>
          </div>
        )}
        {customer.company && (
          <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-300">
            <User className="w-4 h-4 text-gray-400 dark:text-gray-500" />
            <span className="truncate">{customer.company}</span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-3 gap-4 mb-4 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-gray-100 dark:border-gray-600">
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
            {customer.totalMessages}
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400">
            Mensajes
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

      {customer.tags.length > 0 && (
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

      <div className="text-sm text-gray-500 dark:text-gray-400 border-t border-gray-100 dark:border-gray-700 pt-3">
        <div className="flex items-center justify-between">
          <span>Última actividad: {formatDate(customer.lastActivity)}</span>
          <span>Desde: {formatDate(customer.createdAt)}</span>
        </div>
      </div>
    </div>
  );
}
