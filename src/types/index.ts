export interface User {
  id: string
  email: string
  displayName?: string
  avatar?: string
  status?: 'online' | 'away' | 'offline'
  statusMessage?: string
}

export interface Channel {
  id: string
  name: string
  description?: string
  isPrivate: boolean
  createdBy: string
  createdAt: string
  memberCount: number
}

export interface Message {
  id: string
  content: string
  userId: string
  channelId: string
  createdAt: string
  updatedAt?: string
  threadId?: string
  reactions?: MessageReaction[]
  attachments?: MessageAttachment[]
}

export interface MessageReaction {
  id: string
  emoji: string
  userId: string
  messageId: string
}

export interface MessageAttachment {
  id: string
  fileName: string
  fileUrl: string
  fileType: string
  fileSize: number
}

export interface DirectMessage {
  id: string
  participants: string[]
  lastMessage?: Message
  lastActivity: string
}