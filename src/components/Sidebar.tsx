"use client";

import {
  Bot,
  MessageCircle,
  Settings,
  BarChart3,
  Users,
  Radio,
  UserCheck,
} from "lucide-react";

interface SidebarProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
}

export default function Sidebar({
  activeSection,
  onSectionChange,
}: SidebarProps) {
  const menuItems = [
    { id: "conversations", icon: MessageCircle, label: "Conversaciones" },
    { id: "customers", icon: UserCheck, label: "Clientes" },
    { id: "bots", icon: Bot, label: "Bots" },
    { id: "agents", icon: Settings, label: "Agentes" },
    { id: "channels", icon: Radio, label: "Canales" },
    { id: "analytics", icon: BarChart3, label: "Analíticas" },
    { id: "users", icon: Users, label: "Usuarios" },
    { id: "settings", icon: Settings, label: "Configuración" },
  ];

  return (
    <div className="w-20 bg-gray-900 dark:bg-gray-950 flex flex-col items-center py-4 space-y-4">
      <div className="w-12 h-12 bg-blue-600 dark:bg-blue-500 rounded-lg flex items-center justify-center">
        <Bot className="w-8 h-8 text-white" />
      </div>

      <div className="flex-1 flex flex-col space-y-3">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => onSectionChange(item.id)}
              className={`w-12 h-12 rounded-lg flex items-center justify-center transition-colors ${
                activeSection === item.id
                  ? "bg-blue-600 dark:bg-blue-500 text-white"
                  : "text-gray-400 dark:text-gray-500 hover:text-white hover:bg-gray-800 dark:hover:bg-gray-800"
              }`}
              title={item.label}
            >
              <Icon className="w-8 h-8" />
            </button>
          );
        })}
      </div>
    </div>
  );
}
