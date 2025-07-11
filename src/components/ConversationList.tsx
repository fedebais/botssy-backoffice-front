import type { Conversation } from "../types";

interface ConversationListProps {
  conversations: Conversation[];
  selectedConversation: Conversation | null;
  onConversationSelect: (conversation: Conversation) => void;
  loading?: boolean;
}

export default function ConversationList({
  conversations,
  selectedConversation,
  onConversationSelect,
  loading = false,
}: ConversationListProps) {
  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));

    if (hours < 1) {
      const minutes = Math.floor(diff / (1000 * 60));
      return `${minutes}m`;
    } else if (hours < 24) {
      return `${hours}h`;
    } else {
      const days = Math.floor(hours / 24);
      return `${days}d`;
    }
  };

  if (loading) {
    return (
      <div className="w-84 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 flex flex-col">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Conversaciones
          </h2>
        </div>

        <div className="flex-1 flex flex-col items-center justify-center space-y-2">
          <svg
            className="animate-spin h-8 w-8 text-blue-600 dark:text-blue-400"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
            ></path>
          </svg>
          <p className="text-gray-600 dark:text-gray-300 text-sm">
            Cargando conversaciones...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-84 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 flex flex-col">
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
          Conversaciones
        </h2>
      </div>

      <div className="flex-1 overflow-y-auto">
        {conversations.length === 0 ? (
          <p className="p-4 text-center text-gray-500 dark:text-gray-400">
            No hay conversaciones disponibles.
          </p>
        ) : (
          conversations.map((conversation) => (
            <div
              key={conversation.id}
              onClick={() => onConversationSelect(conversation)}
              className={`p-4 border-b border-gray-100 dark:border-gray-800 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 ${
                selectedConversation?.id === conversation.id
                  ? "bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800"
                  : ""
              }`}
            >
              <div className="flex items-start space-x-3">
                <div className="w-10 h-10 bg-gray-300 dark:bg-gray-600 rounded-full flex items-center justify-center">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {/* conversation.user.name.charAt(0).toUpperCase() */}
                  </span>
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-gray-900 dark:text-white truncate flex items-center justify-center">
                      {/* conversation.user.name */} {conversation.userPhone}
                      <span
                        className={`ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium
                          ${
                            conversation.channel === "whatsapp"
                              ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                              : "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                          }
                        `}
                      >
                        {conversation.channel}
                      </span>
                    </p>

                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {formatTime(new Date(conversation.lastMessage.timestamp))}
                    </span>
                  </div>

                  <p className="text-sm text-gray-600 dark:text-gray-400 truncate mt-1">
                    {conversation.lastMessage.content}
                  </p>

                  {conversation.unreadCount > 0 && (
                    <div className="flex items-center justify-between mt-2">
                      <div></div>
                      <span className="inline-flex items-center justify-center w-5 h-5 text-xs font-medium text-white bg-blue-600 dark:bg-blue-500 rounded-full">
                        {conversation.unreadCount}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
