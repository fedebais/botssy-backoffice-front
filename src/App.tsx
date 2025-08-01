"use client";

import { useState } from "react";
import { ThemeProvider } from "./contexts/ThemeContext";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import ConversationsPage from "./pages/ConversationsPage";
import CustomersPage from "./pages/CustomersPage";
import BotsPage from "./pages/BotsPage";
import ChannelsPage from "./pages/ChannelsPage";
import type { Bot, BotAgent, Channel, Customer } from "./types";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import AuthPage from "./pages/AuthPage";
import ProtectedRoute from "./components/ProtectedRoute";

// MOCKS BOT SIMPLES
const mockBots: Bot[] = [
  { id: "1", name: "Bot Soporte", isActive: true },
  { id: "2", name: "Bot Ventas", isActive: true },
  { id: "3", name: "Bot FAQ", isActive: false },
];

// MOCKS AGENTES BOT (verticales, categorías, etc)
const mockBotAgents: BotAgent[] = [
  {
    id: "re-1",
    name: "Agente Inmobiliario Virtual",
    description:
      "Especialista en calificar leads inmobiliarios, agendar visitas y responder consultas sobre propiedades.",
    category: "Ventas",
    vertical: "Real Estate",
    features: [
      "Calificación automática de leads",
      "Agendamiento de visitas",
      "Calculadora de hipotecas",
      "Búsqueda de propiedades",
      "Seguimiento de interesados",
    ],
    isActive: false,
    icon: "bot",
    color: "bg-green-600",
    pricing: {
      monthly: 149,
      currency: "USD",
      billingType: "per_agent",
      freeTrialDays: 14,
      setupFee: 99,
    },
    stats: {
      conversations: 2341,
      responseTime: "< 2s",
      satisfaction: 92,
    },
    tags: ["CRM Integration", "Lead Scoring", "MLS"],
    popularity: "high",
    complexity: "intermediate",
  },
  // ... (puedes completar con el resto de mockBotAgents como en tu ejemplo)
];

// MOCKS CANALES
const mockChannels: Channel[] = [
  {
    id: "channel-1",
    name: "Widget Web",
    description:
      "Chat integrado en tu sitio web para atención inmediata a visitantes.",
    icon: "globe",
    color: "bg-blue-600",
    isActive: true,
    isConnected: true,
    category: "Web",
    features: [
      "Integración fácil",
      "Personalización completa",
      "Historial de conversaciones",
      "Métricas en tiempo real",
    ],
    stats: {
      messages: 2847,
      users: 1205,
      responseRate: 94,
    },
  },
  {
    id: "channel-2",
    name: "WhatsApp Business",
    description: "Conecta con tus clientes a través de WhatsApp Business API.",
    icon: "whatsapp",
    color: "bg-green-600",
    isActive: true,
    isConnected: false,
    category: "Mensajería",
    features: [
      "API oficial",
      "Mensajes multimedia",
      "Plantillas aprobadas",
      "Webhooks",
    ],
    setupRequired: true,
    stats: {
      messages: 1523,
      users: 892,
      responseRate: 87,
    },
  },
];

function AppContent() {
  const { isAuthenticated, isLoading } = useAuth();
  const [activeSection, setActiveSection] = useState("conversations");
  const [selectedBot, setSelectedBot] = useState<Bot | null>(mockBots[0]);
  const [botAgents, setBotAgents] = useState(mockBotAgents);
  const [channels, setChannels] = useState(mockChannels);

  const handleActivateBot = (botId: string) => {
    setBotAgents((prev) =>
      prev.map((bot) => (bot.id === botId ? { ...bot, isActive: true } : bot))
    );
  };

  const handleCreateBot = (botData: Omit<BotAgent, "id">) => {
    const newBot: BotAgent = {
      ...botData,
      id: `custom-${Date.now()}`,
      pricing: {
        monthly: 99,
        currency: "USD",
        billingType: "per_agent",
        freeTrialDays: 14,
      },
    };
    setBotAgents((prev) => [...prev, newBot]);
  };

  const handleToggleChannel = (channelId: string) => {
    setChannels((prev) =>
      prev.map((channel) =>
        channel.id === channelId
          ? { ...channel, isActive: !channel.isActive }
          : channel
      )
    );
  };

  const handleConfigureChannel = (channelId: string) => {
    console.log("Configurar canal:", channelId);
  };

  const handleViewCustomer = (customer: Customer) => {
    console.log("Ver perfil del cliente:", customer);
  };

  const renderContent = () => {
    switch (activeSection) {
      case "conversations":
        return <ConversationsPage />;
      case "customers":
        return <CustomersPage onViewCustomer={handleViewCustomer} />;
      case "bots":
        return (
          <BotsPage
            bots={botAgents}
            onActivateBot={handleActivateBot}
            onCreateBot={handleCreateBot}
          />
        );
      case "channels":
        return (
          <ChannelsPage
            channels={channels}
            onToggleChannel={handleToggleChannel}
            onConfigureChannel={handleConfigureChannel}
          />
        );
      default:
        return (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">
                {activeSection.charAt(0).toUpperCase() + activeSection.slice(1)}
              </h2>
              <p className="text-gray-500 dark:text-gray-400">
                Esta sección está en desarrollo
              </p>
            </div>
          </div>
        );
    }
  };

  const getSectionTitle = () => {
    switch (activeSection) {
      case "conversations":
        return "Conversaciones";
      case "customers":
        return "Gestión de Clientes";
      case "bots":
        return "Marketplace de Agentes IA";
      case "channels":
        return "Canales de Comunicación";
      default:
        return activeSection.charAt(0).toUpperCase() + activeSection.slice(1);
    }
  };

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
    return <AuthPage />;
  }

  return (
    <ProtectedRoute>
      <div className="h-screen flex bg-gray-100 dark:bg-gray-900">
        <Sidebar
          activeSection={activeSection}
          onSectionChange={setActiveSection}
        />

        <div className="flex-1 flex flex-col">
          <Header
            title={getSectionTitle()}
            selectedBot={selectedBot}
            bots={mockBots}
            onBotChange={setSelectedBot}
          />

          <div className="flex-1 overflow-hidden">{renderContent()}</div>
        </div>
      </div>
    </ProtectedRoute>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </ThemeProvider>
  );
}
