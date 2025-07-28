"use client";

import { useState } from "react";
import { Bot } from "lucide-react";
import LoginForm from "../components/LoginForm";
import ThemeToggle from "../components/ThemeToggle";
import RegisterForm from "../components/RegisterForm";

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>

      <div className="w-full max-w-md">
        {/* Logo y branding */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 dark:bg-blue-500 rounded-2xl mb-4 shadow-lg">
            <Bot className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Botssy
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Plataforma de Gestión de Conversaciones
          </p>
        </div>

        {/* Formulario */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 border border-gray-200 dark:border-gray-700">
          {isLogin ? (
            <LoginForm onSwitchToRegister={() => setIsLogin(false)} />
          ) : (
            <RegisterForm onSwitchToLogin={() => setIsLogin(true)} />
          )}
        </div>

        {/* Footer */}
        <div className="text-center mt-8 text-sm text-gray-500 dark:text-gray-400">
          <p>&copy; 2024 Botssy. Todos los derechos reservados.</p>
        </div>
      </div>
    </div>
  );
}
