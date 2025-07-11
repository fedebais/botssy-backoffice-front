import { useState } from "react";
import { User, Mail, Phone, MapPin, Tag, Plus, X, Save } from "lucide-react";
import type { User as UserType } from "../types";

interface UserProfileProps {
  user: UserType;
  onUpdateUser: (userId: string, updates: Partial<UserType>) => void;
  onAddToContacts: (userId: string) => void;
}

export default function UserProfile({
  user,
  onUpdateUser,
  onAddToContacts,
}: UserProfileProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    notes: user.notes || "",
    tags: user.tags || [],
    newTag: "",
  });

  const handleSave = () => {
    onUpdateUser(user.id, {
      notes: editData.notes,
      tags: editData.tags,
    });
    setIsEditing(false);
  };

  const handleAddTag = () => {
    if (
      editData.newTag.trim() &&
      !editData.tags.includes(editData.newTag.trim())
    ) {
      setEditData((prev) => ({
        ...prev,
        tags: [...prev.tags, prev.newTag.trim()],
        newTag: "",
      }));
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setEditData((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag) => tag !== tagToRemove),
    }));
  };

  const formatDate = (date: Date | undefined) => {
    if (!date) return "N/A";
    return date.toLocaleDateString("es-ES", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  return (
    <div className="w-80 bg-white dark:bg-gray-900 border-l border-gray-200 dark:border-gray-700 flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Perfil del Usuario
          </h3>
          {!user.isContact && (
            <button
              onClick={() => onAddToContacts(user.id)}
              className="text-sm bg-blue-600 dark:bg-blue-500 text-white px-3 py-1 rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600"
            >
              Agregar Contacto
            </button>
          )}
        </div>

        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-gray-300 dark:bg-gray-600 rounded-full flex items-center justify-center">
            {user.avatar ? (
              <img
                src={user.avatar || "/placeholder.svg"}
                alt={user.name}
                className="w-12 h-12 rounded-full"
              />
            ) : (
              <User className="w-6 h-6 text-gray-600 dark:text-gray-300" />
            )}
          </div>
          <div>
            <h4 className="font-medium text-gray-900 dark:text-white">
              {user.name}
            </h4>
            {user.isContact && (
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200">
                Contacto
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Información de contacto */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <h5 className="text-sm font-medium text-gray-900 dark:text-white mb-3">
          Información de Contacto
        </h5>
        <div className="space-y-2">
          {user.email && (
            <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
              <Mail className="w-4 h-4" />
              <span>{user.email}</span>
            </div>
          )}
          {user.phone && (
            <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
              <Phone className="w-4 h-4" />
              <span>{user.phone}</span>
            </div>
          )}
          {user.location && (
            <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
              <MapPin className="w-4 h-4" />
              <span>{user.location}</span>
            </div>
          )}
        </div>
      </div>

      {/* Estadísticas */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <h5 className="text-sm font-medium text-gray-900 dark:text-white mb-3">
          Estadísticas
        </h5>
        <div className="grid grid-cols-2 gap-3">
          <div className="text-center">
            <div className="text-lg font-semibold text-gray-900 dark:text-white">
              {user.totalConversations || 0}
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400">
              Conversaciones
            </div>
          </div>
          <div className="text-center">
            <div className="text-lg font-semibold text-gray-900 dark:text-white">
              {formatDate(user.lastActivity)}
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400">
              Última actividad
            </div>
          </div>
        </div>
      </div>

      {/* Tags */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between mb-3">
          <h5 className="text-sm font-medium text-gray-900 dark:text-white">
            Etiquetas
          </h5>
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
          >
            {isEditing ? "Cancelar" : "Editar"}
          </button>
        </div>

        {isEditing ? (
          <div className="space-y-2">
            <div className="flex flex-wrap gap-1">
              {editData.tags.map((tag, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200"
                >
                  {tag}
                  <button
                    onClick={() => handleRemoveTag(tag)}
                    className="ml-1 text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-200"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
            <div className="flex space-x-1">
              <input
                type="text"
                value={editData.newTag}
                onChange={(e) =>
                  setEditData((prev) => ({ ...prev, newTag: e.target.value }))
                }
                onKeyPress={(e) => e.key === "Enter" && handleAddTag()}
                placeholder="Nueva etiqueta"
                className="flex-1 text-xs border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
              <button
                onClick={handleAddTag}
                className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>
        ) : (
          <div className="flex flex-wrap gap-1">
            {(user.tags || []).map((tag, index) => (
              <span
                key={index}
                className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200"
              >
                <Tag className="w-3 h-3 mr-1" />
                {tag}
              </span>
            ))}
            {(!user.tags || user.tags.length === 0) && (
              <span className="text-sm text-gray-500 dark:text-gray-400">
                Sin etiquetas
              </span>
            )}
          </div>
        )}
      </div>

      {/* Notas */}
      <div className="flex-1 p-4">
        <div className="flex items-center justify-between mb-3">
          <h5 className="text-sm font-medium text-gray-900 dark:text-white">
            Notas
          </h5>
          {isEditing && (
            <button
              onClick={handleSave}
              className="flex items-center space-x-1 text-sm bg-blue-600 dark:bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-700 dark:hover:bg-blue-600"
            >
              <Save className="w-3 h-3" />
              <span>Guardar</span>
            </button>
          )}
        </div>

        {isEditing ? (
          <textarea
            value={editData.notes}
            onChange={(e) =>
              setEditData((prev) => ({ ...prev, notes: e.target.value }))
            }
            placeholder="Agregar notas sobre este usuario..."
            className="w-full h-32 text-sm border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500 resize-none"
          />
        ) : (
          <div className="text-sm text-gray-600 dark:text-gray-400">
            {user.notes || "Sin notas"}
          </div>
        )}
      </div>
    </div>
  );
}
