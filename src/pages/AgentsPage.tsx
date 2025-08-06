"use client";

import { useEffect, useState } from "react";
import { Search, Sparkles, BookOpen, Zap, Heart, Edit } from "lucide-react";
import PromptCard from "../components/AgentCard";
import PromptEditModal from "../components/AgentEditModal";
import { getAgentTenantId } from "../service/agent/getAgentTenantId";
import { useAuth } from "../contexts/AuthContext";
import type { Agent } from "../types";

export default function AgentsPage() {
  const { user } = useAuth();
  const [agents, setAgents] = useState<Agent[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [editingAgent, setEditingAgent] = useState<Agent | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [loadingAgents, setLoadingAgents] = useState(true);

  useEffect(() => {
    const fetchAgents = async () => {
      try {
        const data = await getAgentTenantId(Number(user?.tenantId));
        setAgents(data);
      } catch (error) {
        console.error("Error al cargar agentes:", error);
      } finally {
        setLoadingAgents(false);
      }
    };

    fetchAgents();
  }, [user?.tenantId]);

  const handleEditAgent = (agent: Agent) => {
    setEditingAgent(agent);
    setShowEditModal(true);
  };

  const handleSaveAgent = (agentId: string, updates: Partial<Agent>) => {
    setAgents((prevAgents) =>
      prevAgents.map((agent) =>
        agent.id === agentId ? { ...agent, ...updates } : agent
      )
    );
    setShowEditModal(false);
    setEditingAgent(null);
  };

  // Filtrar agents según searchTerm (buscando en name, description y promptExtension)
  const filteredAgents = agents.filter((agent) => {
    const lowerSearch = searchTerm.toLowerCase();
    return (
      agent.name.toLowerCase().includes(lowerSearch) ||
      (agent.description &&
        agent.description.toLowerCase().includes(lowerSearch)) ||
      (agent.promptExtension &&
        agent.promptExtension.toLowerCase().includes(lowerSearch))
    );
  });

  const totalAgents = agents.length;
  const activeAgents = agents.filter((agent) => agent.isActive).length;
  const completedAgents = agents.filter(
    (a) =>
      (a.prompt && a.prompt.trim().length > 0) ||
      (a.promptExtension && a.promptExtension.trim().length > 0)
  ).length;

  const emptyAgents = agents.filter(
    (a) =>
      (!a.prompt || a.prompt.trim().length === 0) &&
      (!a.promptExtension || a.promptExtension.trim().length === 0)
  ).length;

  return (
    <div className="p-6 h-full overflow-y-auto bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
      {/* Header Hero */}
      <div className="mb-8">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Mis Agentes Personalizados
            </h1>
            <p className="text-gray-600 dark:text-gray-400 text-lg">
              Completa y personaliza las respuestas automáticas de tu bot
            </p>
          </div>
        </div>
      </div>

      {/* Estadísticas visuales */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {totalAgents}
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                Total Agentes
              </div>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
              <Zap className="w-5 h-5 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                {completedAgents}
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                Completados
              </div>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-orange-100 dark:bg-orange-900/30 rounded-lg flex items-center justify-center">
              <Edit className="w-5 h-5 text-orange-600 dark:text-orange-400" />
            </div>
            <div>
              <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                {emptyAgents}
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                Por Completar
              </div>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
              <Heart className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                {activeAgents}
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                Activos
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mensaje de ayuda si hay prompts vacíos */}
      {emptyAgents > 0 && (
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-6 mb-8">
          <div className="flex items-start space-x-3">
            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
              <Edit className="w-4 h-4 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-2">
                ¡Tienes {emptyAgents} prompt{emptyAgents > 1 ? "s" : ""} por
                completar!
              </h3>
              <p className="text-blue-700 dark:text-blue-300 text-sm">
                Haz clic en "Editar" en cualquier prompt para agregar tu
                contenido personalizado. Los prompts vacíos aparecen con un
                borde naranja para que los identifiques fácilmente.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Filtros intuitivos */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 mb-8 shadow-sm">
        <div className="flex flex-col lg:flex-row gap-6">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 w-5 h-5" />
              <input
                type="text"
                placeholder="🔍 Busca por nombre, descripción o contenido..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition-colors text-lg"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Lista de agentes */}
      {loadingAgents ? (
        <div className="text-center py-20 text-lg font-semibold text-gray-700 dark:text-gray-300">
          Cargando agentes...
        </div>
      ) : filteredAgents.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
          {filteredAgents.map((agent) => (
            <div key={agent.id}>
              <PromptCard agent={agent} onEdit={handleEditAgent} />
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <div className="w-24 h-24 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <Sparkles className="w-12 h-12 text-white" />
          </div>
          <div className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            No encontramos agentes que coincidan
          </div>
          <p className="text-gray-500 dark:text-gray-400 text-lg mb-8 max-w-md mx-auto">
            Intenta cambiar los filtros de búsqueda para encontrar lo que buscas
          </p>
        </div>
      )}

      {/* Modal de edición */}
      <PromptEditModal
        isOpen={showEditModal}
        onClose={() => {
          setShowEditModal(false);
          setEditingAgent(null);
        }}
        onSave={handleSaveAgent}
        agent={editingAgent!}
      />
    </div>
  );
}
