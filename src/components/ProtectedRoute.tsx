"use client";

import React from "react";
import { useAuth } from "../contexts/AuthContext";

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: string[]; // lista de roles permitidos, ej: ["Tenant", "Admin"]
}

export default function ProtectedRoute({
  children,
  allowedRoles,
}: ProtectedRouteProps) {
  const { user, isLoading, isAuthenticated } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Cargando...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    // Podés redirigir a login acá o devolver null
    return null;
  }

  if (allowedRoles && user) {
    if (!allowedRoles.includes(user.role)) {
      return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Acceso Denegado
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              No tienes permisos para acceder a esta sección.
            </p>
          </div>
        </div>
      );
    }
  }

  return <>{children}</>;
}
