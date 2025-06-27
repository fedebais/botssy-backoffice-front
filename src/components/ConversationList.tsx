import type { Conversation } from "../types"

interface ConversationListProps {
  conversations: Conversation[]
  selectedConversation: Conversation | null
  onConversationSelect: (conversation: Conversation) => void
}

export default function ConversationList({
  conversations,
  selectedConversation,
  onConversationSelect,
}: ConversationListProps) {
  const formatTime = (date: Date) => {
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const hours = Math.floor(diff / (1000 * 60 * 60))

    if (hours < 1) {
      const minutes = Math.floor(diff / (1000 * 60))
      return `${minutes}m`
    } else if (hours < 24) {
      return `${hours}h`
    } else {
      const days = Math.floor(hours / 24)
      return `${days}d`
    }
  }

  return (
    <div className="w-84 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 flex flex-col">
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Conversaciones</h2>
      </div>

      <div className="flex-1 overflow-y-auto">
        {conversations.map((conversation) => (
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
                  {conversation.user.name.charAt(0).toUpperCase()}
                </span>
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{conversation.user.name}</p>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {formatTime(conversation.lastMessage.timestamp)}
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
        ))}
      </div>
    </div>
  )
}
