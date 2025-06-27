"use client"

import { useState } from "react"
import ConversationList from "../components/ConversationList"
import ChatWindow from "../components/ChatWindow"
import type { Conversation, Message, User } from "../types"

interface ConversationsPageProps {
  conversations: Conversation[]
  messages: Message[]
  onSendMessage: (conversationId: string, content: string) => void
  onUpdateUser: (userId: string, updates: Partial<User>) => void
  onAddToContacts: (userId: string) => void
}

export default function ConversationsPage({
  conversations,
  messages,
  onSendMessage,
  onUpdateUser,
  onAddToContacts,
}: ConversationsPageProps) {
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null)
  const [showUserProfile, setShowUserProfile] = useState(false)

  const conversationMessages = selectedConversation
    ? messages.filter((m) => m.conversationId === selectedConversation.id)
    : []

  const handleSendMessage = (content: string) => {
    if (selectedConversation) {
      onSendMessage(selectedConversation.id, content)
    }
  }

  return (
    <div className="flex h-full bg-gray-50 dark:bg-gray-900">
      <ConversationList
        conversations={conversations}
        selectedConversation={selectedConversation}
        onConversationSelect={(conversation) => {
          setSelectedConversation(conversation)
          setShowUserProfile(false) // Reset profile view when switching conversations
        }}
      />
      <ChatWindow
        conversation={selectedConversation}
        messages={conversationMessages}
        onSendMessage={handleSendMessage}
        onUpdateUser={onUpdateUser}
        onAddToContacts={onAddToContacts}
        showUserProfile={showUserProfile}
        onToggleUserProfile={() => setShowUserProfile(!showUserProfile)}
      />
    </div>
  )
}
