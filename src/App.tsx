"use client";

import { useEffect, useState } from "react";
import { ThemeProvider } from "./contexts/ThemeContext";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import ConversationsPage from "./pages/ConversationsPage";
import CustomersPage from "./pages/CustomersPage";
import BotsPage from "./pages/BotsPage";
import ChannelsPage from "./pages/ChannelsPage";
import type {
  Bot,
  Conversation,
  Message,
  BotAgent,
  Channel,
  Customer,
  User,
} from "./types";
import socket from "../socket";
import { getConversations } from "./service/conversations/getConversations";

// Datos de ejemplo para bots simples
const mockBots: Bot[] = [
  { id: "1", name: "Bot Soporte", isActive: true },
  { id: "2", name: "Bot Ventas", isActive: true },
  { id: "3", name: "Bot FAQ", isActive: false },
];

// Datos de ejemplo para agentes de bots organizados por vertical
const mockBotAgents: BotAgent[] = [
  // REAL ESTATE
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
  {
    id: "re-2",
    name: "Asistente de Propiedades",
    description:
      "Bot básico para responder preguntas frecuentes sobre propiedades y servicios inmobiliarios.",
    category: "Soporte",
    vertical: "Real Estate",
    features: [
      "FAQ automatizado",
      "Información de propiedades",
      "Horarios de oficina",
      "Contacto con agentes",
    ],
    isActive: false,
    icon: "message",
    color: "bg-blue-600",
    pricing: {
      monthly: 49,
      currency: "USD",
      billingType: "flat_rate",
      freeTrialDays: 7,
    },
    complexity: "basic",
  },

  // RESTAURANTES
  {
    id: "rest-1",
    name: "Maitre Digital",
    description:
      "Gestiona reservas, pedidos y consultas de menú. Perfecto para restaurantes que buscan automatizar la atención.",
    category: "Reservas",
    vertical: "Restaurantes",
    features: [
      "Sistema de reservas",
      "Menú interactivo",
      "Pedidos para llevar",
      "Alergias y preferencias",
      "Promociones especiales",
    ],
    isActive: true,
    icon: "star",
    color: "bg-orange-600",
    pricing: {
      monthly: 89,
      currency: "USD",
      billingType: "per_agent",
      freeTrialDays: 10,
    },
    stats: {
      conversations: 1876,
      responseTime: "< 1s",
      satisfaction: 94,
    },
    tags: ["POS Integration", "Delivery", "Reservations"],
    popularity: "high",
    complexity: "intermediate",
  },
  {
    id: "rest-2",
    name: "Sommelier Virtual",
    description:
      "Especialista en recomendaciones de vinos y maridajes. Ideal para restaurantes gourmet.",
    category: "Especializado",
    vertical: "Restaurantes",
    features: [
      "Recomendaciones de vinos",
      "Maridajes personalizados",
      "Información de bodegas",
      "Precios y disponibilidad",
    ],
    isActive: false,
    icon: "star",
    color: "bg-purple-600",
    pricing: {
      monthly: 199,
      currency: "USD",
      billingType: "per_agent",
      freeTrialDays: 7,
      setupFee: 149,
    },
    complexity: "advanced",
  },

  // E-COMMERCE
  {
    id: "ecom-1",
    name: "Asistente de Compras",
    description:
      "Ayuda a los clientes a encontrar productos, gestiona carritos abandonados y procesa devoluciones.",
    category: "Ventas",
    vertical: "E-commerce",
    features: [
      "Recomendaciones de productos",
      "Recuperación de carritos",
      "Seguimiento de pedidos",
      "Gestión de devoluciones",
      "Cupones y descuentos",
    ],
    isActive: true,
    icon: "bot",
    color: "bg-indigo-600",
    pricing: {
      monthly: 0.05,
      currency: "USD",
      billingType: "per_conversation",
      freeTrialDays: 30,
    },
    stats: {
      conversations: 15420,
      responseTime: "< 1s",
      satisfaction: 89,
    },
    tags: ["Shopify", "WooCommerce", "Abandoned Cart"],
    popularity: "high",
    complexity: "intermediate",
  },
  {
    id: "ecom-2",
    name: "Experto en Productos",
    description:
      "Bot especializado en especificaciones técnicas y comparativas de productos complejos.",
    category: "Soporte",
    vertical: "E-commerce",
    features: [
      "Comparativas detalladas",
      "Especificaciones técnicas",
      "Guías de compra",
      "Compatibilidad de productos",
    ],
    isActive: false,
    icon: "settings",
    color: "bg-gray-600",
    pricing: {
      monthly: 129,
      currency: "USD",
      billingType: "flat_rate",
      freeTrialDays: 14,
    },
    complexity: "advanced",
  },

  // SALUD
  {
    id: "health-1",
    name: "Recepcionista Médico",
    description:
      "Gestiona citas médicas, recordatorios y consultas básicas de salud con total privacidad.",
    category: "Citas",
    vertical: "Salud",
    features: [
      "Agendamiento de citas",
      "Recordatorios automáticos",
      "Triaje básico",
      "Información de seguros",
      "Cumplimiento HIPAA",
    ],
    isActive: false,
    icon: "clock",
    color: "bg-red-600",
    pricing: {
      monthly: 299,
      currency: "USD",
      billingType: "per_agent",
      freeTrialDays: 7,
      setupFee: 199,
    },
    tags: ["HIPAA Compliant", "EMR Integration", "Telemedicine"],
    complexity: "advanced",
  },

  // EDUCACIÓN
  {
    id: "edu-1",
    name: "Tutor Virtual",
    description:
      "Asistente educativo que ayuda con tareas, explica conceptos y programa sesiones de estudio.",
    category: "Educación",
    vertical: "Educación",
    features: [
      "Ayuda con tareas",
      "Explicaciones paso a paso",
      "Programación de estudio",
      "Seguimiento de progreso",
      "Recursos educativos",
    ],
    isActive: false,
    icon: "bot",
    color: "bg-blue-500",
    pricing: {
      monthly: 79,
      currency: "USD",
      billingType: "per_agent",
      freeTrialDays: 21,
    },
    tags: ["LMS Integration", "Progress Tracking", "Multilingual"],
    popularity: "medium",
    complexity: "intermediate",
  },

  // FINANZAS
  {
    id: "fin-1",
    name: "Asesor Financiero",
    description:
      "Proporciona información sobre productos financieros, calcula préstamos y agenda citas con asesores.",
    category: "Finanzas",
    vertical: "Servicios Financieros",
    features: [
      "Calculadoras financieras",
      "Información de productos",
      "Calificación crediticia",
      "Agendamiento de citas",
      "Cumplimiento regulatorio",
    ],
    isActive: false,
    icon: "star",
    color: "bg-green-700",
    pricing: {
      monthly: 249,
      currency: "USD",
      billingType: "per_agent",
      freeTrialDays: 14,
      setupFee: 299,
    },
    tags: ["Compliance", "Credit Scoring", "Banking"],
    complexity: "advanced",
  },

  // TECNOLOGÍA
  {
    id: "tech-1",
    name: "Soporte Técnico L1",
    description:
      "Resuelve problemas técnicos básicos, crea tickets y escala casos complejos al equipo humano.",
    category: "Soporte",
    vertical: "Tecnología",
    features: [
      "Diagnóstico automático",
      "Base de conocimientos",
      "Creación de tickets",
      "Escalamiento inteligente",
      "Métricas de resolución",
    ],
    isActive: true,
    icon: "settings",
    color: "bg-gray-700",
    pricing: {
      monthly: 199,
      currency: "USD",
      billingType: "per_agent",
      freeTrialDays: 14,
    },
    stats: {
      conversations: 3421,
      responseTime: "< 3s",
      satisfaction: 87,
    },
    tags: ["ITSM", "Knowledge Base", "Ticketing"],
    popularity: "high",
    complexity: "intermediate",
  },

  // LEGAL
  {
    id: "legal-1",
    name: "Asistente Legal",
    description:
      "Proporciona información legal básica, agenda consultas y gestiona documentos simples.",
    category: "Legal",
    vertical: "Servicios Legales",
    features: [
      "Información legal básica",
      "Agendamiento de consultas",
      "Gestión de documentos",
      "Seguimiento de casos",
      "Cumplimiento ético",
    ],
    isActive: false,
    icon: "bot",
    color: "bg-indigo-800",
    pricing: {
      monthly: 399,
      currency: "USD",
      billingType: "per_agent",
      freeTrialDays: 7,
      setupFee: 499,
    },
    tags: ["Document Management", "Case Tracking", "Compliance"],
    complexity: "advanced",
  },

  // TURISMO
  {
    id: "travel-1",
    name: "Concierge Virtual",
    description:
      "Asiste con reservas de viajes, recomendaciones locales y gestión de itinerarios.",
    category: "Turismo",
    vertical: "Viajes y Turismo",
    features: [
      "Reservas de vuelos y hoteles",
      "Recomendaciones locales",
      "Itinerarios personalizados",
      "Información meteorológica",
      "Soporte multiidioma",
    ],
    isActive: false,
    icon: "star",
    color: "bg-cyan-600",
    pricing: {
      monthly: 119,
      currency: "USD",
      billingType: "per_agent",
      freeTrialDays: 14,
    },
    tags: ["GDS Integration", "Multilingual", "Weather API"],
    popularity: "medium",
    complexity: "intermediate",
  },
];

// Datos de ejemplo para canales (mantenemos los existentes)
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
  {
    id: "channel-3",
    name: "Instagram Direct",
    description:
      "Gestiona mensajes directos de Instagram desde una sola plataforma.",
    icon: "instagram",
    color: "bg-pink-600",
    isActive: false,
    isConnected: false,
    category: "Redes Sociales",
    features: [
      "Mensajes directos",
      "Comentarios en posts",
      "Stories",
      "Automatización",
    ],
    setupRequired: true,
  },
  {
    id: "channel-4",
    name: "Facebook Messenger",
    description:
      "Integra Facebook Messenger para atender a tu audiencia de Facebook.",
    icon: "facebook",
    color: "bg-blue-700",
    isActive: false,
    isConnected: false,
    category: "Redes Sociales",
    features: [
      "Messenger API",
      "Botones persistentes",
      "Plantillas",
      "Pagos integrados",
    ],
    setupRequired: true,
  },
  {
    id: "channel-5",
    name: "Telegram Bot",
    description: "Crea un bot de Telegram para atención automatizada.",
    icon: "message",
    color: "bg-cyan-600",
    isActive: false,
    isConnected: false,
    category: "Mensajería",
    features: [
      "Bot API",
      "Comandos personalizados",
      "Grupos y canales",
      "Inline keyboards",
    ],
    setupRequired: true,
  },
  {
    id: "channel-6",
    name: "Email Support",
    description: "Gestiona tickets de soporte por email de forma automatizada.",
    icon: "message",
    color: "bg-gray-600",
    isActive: true,
    isConnected: true,
    category: "Email",
    features: [
      "Tickets automáticos",
      "Respuestas predefinidas",
      "Escalamiento",
      "SLA tracking",
    ],
    stats: {
      messages: 456,
      users: 234,
      responseRate: 98,
    },
  },
];

// Datos de ejemplo para customers (mantenemos los existentes)
const mockCustomers: Customer[] = [
  {
    id: "1",
    name: "Juan Pérez",
    email: "juan.perez@email.com",
    phone: "+34 612 345 678",
    location: "Madrid, España",
    company: "Tech Solutions SL",
    tags: ["VIP", "Soporte Técnico", "Empresa"],
    isContact: true,
    createdAt: new Date(2024, 0, 15),
    lastActivity: new Date(Date.now() - 1000 * 60 * 30),
    totalConversations: 12,
    totalMessages: 45,
    averageResponseTime: "2m",
    satisfaction: 94,
    notes:
      "Cliente muy importante, siempre requiere atención prioritaria. Contacto técnico principal de Tech Solutions.",
    source: "Widget Web",
    status: "active",
  },
  {
    id: "2",
    name: "María García",
    email: "maria.garcia@gmail.com",
    phone: "+34 687 654 321",
    location: "Barcelona, España",
    tags: ["Nuevo Cliente", "Ventas"],
    isContact: false,
    createdAt: new Date(2024, 1, 20),
    lastActivity: new Date(Date.now() - 1000 * 60 * 60 * 2),
    totalConversations: 3,
    totalMessages: 8,
    averageResponseTime: "5m",
    satisfaction: 89,
    notes: "Interesada en nuestros servicios premium. Seguimiento pendiente.",
    source: "WhatsApp",
    status: "active",
  },
  {
    id: "3",
    name: "Carlos López",
    email: "carlos.lopez@empresa.com",
    phone: "+34 654 987 321",
    location: "Valencia, España",
    company: "Innovación Digital",
    tags: ["Descuentos", "Mayorista"],
    isContact: true,
    createdAt: new Date(2024, 2, 10),
    lastActivity: new Date(Date.now() - 1000 * 60 * 60 * 5),
    totalConversations: 8,
    totalMessages: 23,
    averageResponseTime: "3m",
    satisfaction: 92,
    notes:
      "Cliente mayorista con descuentos especiales. Contactar mensualmente para ofertas.",
    source: "Instagram",
    status: "active",
  },
  {
    id: "4",
    name: "Ana Martínez",
    email: "ana.martinez@hotmail.com",
    location: "Sevilla, España",
    tags: ["Soporte", "Problema Resuelto"],
    isContact: false,
    createdAt: new Date(2024, 3, 5),
    lastActivity: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7),
    totalConversations: 2,
    totalMessages: 6,
    averageResponseTime: "10m",
    satisfaction: 85,
    notes: "Problema con el producto resuelto satisfactoriamente.",
    source: "Email",
    status: "inactive",
  },
  {
    id: "5",
    name: "Roberto Silva",
    email: "roberto.silva@startup.io",
    phone: "+34 611 222 333",
    location: "Bilbao, España",
    company: "StartupTech",
    tags: ["Startup", "Plan Premium", "Desarrollador"],
    isContact: true,
    createdAt: new Date(2024, 4, 12),
    lastActivity: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2),
    totalConversations: 15,
    totalMessages: 67,
    averageResponseTime: "1m",
    satisfaction: 98,
    notes:
      "CTO de startup tecnológica. Muy activo en la comunidad. Posible caso de estudio.",
    source: "Widget Web",
    status: "active",
  },
];

/*
const mockConversations: Conversation[] = [
  {
    id: "1",
    user: {
      id: "1",
      name: "Juan Pérez",
      email: "juan.perez@email.com",
      phone: "+34 612 345 678",
      location: "Madrid, España",
      tags: ["VIP", "Soporte Técnico", "Empresa"],
      isContact: true,
      totalConversations: 12,
      lastActivity: new Date(Date.now() - 1000 * 60 * 30),
      notes:
        "Cliente muy importante, siempre requiere atención prioritaria. Contacto técnico principal de Tech Solutions.",
      source: "Widget Web",
    },
    lastMessage: {
      id: "1",
      conversationId: "1",
      content: "¿Podrían ayudarme con mi pedido?",
      timestamp: new Date(Date.now() - 1000 * 60 * 30),
      isIncoming: true,
      isRead: false,
    },
    unreadCount: 2,
    isActive: true,
    channel: "Widget Web",
  },
  {
    id: "2",
    user: {
      id: "2",
      name: "María García",
      email: "maria.garcia@gmail.com",
      phone: "+34 687 654 321",
      location: "Barcelona, España",
      tags: ["Nuevo Cliente", "Ventas"],
      isContact: false,
      totalConversations: 3,
      lastActivity: new Date(Date.now() - 1000 * 60 * 60 * 2),
      notes: "Interesada en nuestros servicios premium. Seguimiento pendiente.",
      source: "WhatsApp",
    },
    lastMessage: {
      id: "2",
      conversationId: "2",
      content: "Perfecto, muchas gracias por la información",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
      isIncoming: true,
      isRead: true,
    },
    unreadCount: 0,
    isActive: false,
    channel: "WhatsApp",
  },
  {
    id: "3",
    user: {
      id: "3",
      name: "Carlos López",
      email: "carlos.lopez@empresa.com",
      phone: "+34 654 987 321",
      location: "Valencia, España",
      tags: ["Descuentos", "Mayorista"],
      isContact: true,
      totalConversations: 8,
      lastActivity: new Date(Date.now() - 1000 * 60 * 60 * 5),
      notes:
        "Cliente mayorista con descuentos especiales. Contactar mensualmente para ofertas.",
      source: "Instagram",
    },
    lastMessage: {
      id: "3",
      conversationId: "3",
      content: "¿Tienen descuentos disponibles?",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5),
      isIncoming: true,
      isRead: false,
    },
    unreadCount: 1,
    isActive: true,
    channel: "Instagram",
  },
];

const mockMessages: Message[] = [
  {
    id: "1",
    conversationId: "1",
    content: "Hola, necesito ayuda con mi pedido #12345",
    timestamp: new Date(Date.now() - 1000 * 60 * 45),
    isIncoming: true,
    isRead: true,
  },
  {
    id: "2",
    conversationId: "1",
    content:
      "Hola Juan, claro que sí. ¿Cuál es el problema específico con tu pedido?",
    timestamp: new Date(Date.now() - 1000 * 60 * 40),
    isIncoming: false,
    isRead: true,
  },
  {
    id: "3",
    conversationId: "1",
    content: "¿Podrían ayudarme con mi pedido?",
    timestamp: new Date(Date.now() - 1000 * 60 * 30),
    isIncoming: true,
    isRead: false,
  },
  {
    id: "4",
    conversationId: "2",
    content: "Hola, ¿qué horarios de atención tienen?",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 3),
    isIncoming: true,
    isRead: true,
  },
  {
    id: "5",
    conversationId: "2",
    content: "Nuestro horario es de lunes a viernes de 9:00 a 18:00",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2.5),
    isIncoming: false,
    isRead: true,
  },
  {
    id: "6",
    conversationId: "2",
    content: "Perfecto, muchas gracias por la información",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
    isIncoming: true,
    isRead: true,
  },
];
*/

function AppContent() {
  const [activeSection, setActiveSection] = useState("conversations");
  const [selectedBot, setSelectedBot] = useState<Bot | null>(mockBots[0]);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [botAgents, setBotAgents] = useState(mockBotAgents);
  const [channels, setChannels] = useState(mockChannels);
  const [customers, setCustomers] = useState(mockCustomers);
  const [loadingConversations, setLoadingConversations] = useState(false);

  useEffect(() => {
    async function loadConversations() {
      setLoadingConversations(true);
      const data = await getConversations();
      setConversations(data);
      setLoadingConversations(false);
    }

    loadConversations();
  }, []);

  useEffect(() => {
    socket.on("newMessage", ({ conversationId, message, user, channel }) => {
      setMessages((prevMessages) => [...prevMessages, message]);

      setConversations((prevConversations) => {
        const existingConversation = prevConversations.find(
          (conv) => Number(conv.id) === Number(conversationId)
        );

        if (existingConversation) {
          // Actualiza conversación existente
          return prevConversations.map((conv) =>
            Number(conv.id) === Number(conversationId)
              ? {
                  ...conv,
                  lastMessage: message,
                  unreadCount: conv.unreadCount + 1,
                  isActive: true,
                }
              : conv
          );
        } else {
          // Agrega nueva conversación
          const newConversation: Conversation = {
            id: conversationId,
            user,
            lastMessage: message,
            unreadCount: 1,
            isActive: true,
            channel,
          };
          return [newConversation, ...prevConversations]; // nueva al inicio
        }
      });
    });

    return () => {
      socket.off("newMessage");
    };
  }, []);

  const handleSendMessage = (conversationId: string, content: string) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      conversationId,
      content,
      timestamp: new Date(),
      isIncoming: false,
      isRead: true,
      role: "user",
    };

    setMessages((prev) => [...prev, newMessage]);

    // Actualizar última mensaje en la conversación
    setConversations((prev) =>
      prev.map((conv) =>
        Number(conv.id) === Number(conversationId)
          ? { ...conv, lastMessage: newMessage }
          : conv
      )
    );
  };

  const handleUpdateUser = (userId: string, updates: Partial<User>) => {
    setConversations((prev) =>
      prev.map((conv) =>
        conv.user.id === userId
          ? { ...conv, user: { ...conv.user, ...updates } }
          : conv
      )
    );
  };

  const handleAddToContacts = (userId: string) => {
    setConversations((prev) =>
      prev.map((conv) =>
        conv.user.id === userId
          ? { ...conv, user: { ...conv.user, isContact: true } }
          : conv
      )
    );
  };

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
    // Aquí se abriría un modal de configuración
    console.log("Configurar canal:", channelId);
  };

  const handleViewCustomer = (customer: Customer) => {
    // Aquí se podría abrir un modal detallado del customer o navegar a una vista específica
    console.log("Ver perfil del cliente:", customer);
  };

  const renderContent = () => {
    switch (activeSection) {
      case "conversations":
        return (
          <ConversationsPage
            conversations={conversations}
            messages={messages}
            onSendMessage={handleSendMessage}
            onUpdateUser={handleUpdateUser}
            onAddToContacts={handleAddToContacts}
            loading={loadingConversations}
          />
        );
      case "customers":
        return (
          <CustomersPage
            customers={customers}
            onViewCustomer={handleViewCustomer}
          />
        );
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

  return (
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
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}
