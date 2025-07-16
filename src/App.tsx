import { useState, useEffect, useRef } from 'react'
import { blink } from './blink/client'
import { Sidebar } from './components/layout/Sidebar'
import { ChatHeader } from './components/layout/ChatHeader'
import { MessageList } from './components/chat/MessageList'
import { MessageInput } from './components/chat/MessageInput'
import type { RealtimeChannel } from '@blinkdotnew/sdk'

interface User {
  id: string
  email: string
  displayName?: string
}

interface Message {
  id: string
  content: string
  author: {
    id: string
    name: string
    avatar?: string
  }
  timestamp: Date
  channelId: string
  reactions?: { emoji: string; count: number; users: string[] }[]
  replies?: number
}

function App() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [currentChannel, setCurrentChannel] = useState('general')
  const [messages, setMessages] = useState<Record<string, Message[]>>({})
  const [onlineUsers, setOnlineUsers] = useState<any[]>([])
  const channelRef = useRef<RealtimeChannel | null>(null)

  // Welcome messages for empty channels
  const getWelcomeMessages = (channelId: string): Message[] => {
    const welcomeMessages: Record<string, Message[]> = {
      general: [
        {
          id: 'welcome-general-1',
          content: '👋 Welcome to the #general channel! This is where our team comes together for general discussions and updates.',
          author: { id: 'system', name: 'Slack Clone Bot' },
          timestamp: new Date(Date.now() - 1000 * 60 * 60),
          channelId: 'general'
        },
        {
          id: 'welcome-general-2',
          content: 'Feel free to introduce yourself, share updates, or start conversations here. Looking forward to collaborating with everyone! 🚀',
          author: { id: 'system', name: 'Slack Clone Bot' },
          timestamp: new Date(Date.now() - 1000 * 60 * 30),
          channelId: 'general'
        }
      ],
      random: [
        {
          id: 'welcome-random-1',
          content: '🎉 Welcome to #random! This is our space for casual conversations, fun discussions, and everything that doesn\'t fit elsewhere.',
          author: { id: 'system', name: 'Slack Clone Bot' },
          timestamp: new Date(Date.now() - 1000 * 60 * 45),
          channelId: 'random'
        }
      ],
      development: [
        {
          id: 'welcome-dev-1',
          content: '💻 Welcome to #development! Share code snippets, discuss technical challenges, and collaborate on our projects here.',
          author: { id: 'system', name: 'Slack Clone Bot' },
          timestamp: new Date(Date.now() - 1000 * 60 * 60),
          channelId: 'development'
        }
      ],
      design: [
        {
          id: 'welcome-design-1',
          content: '🎨 Welcome to #design! Share your creative work, get feedback, and discuss design trends and ideas.',
          author: { id: 'system', name: 'Slack Clone Bot' },
          timestamp: new Date(Date.now() - 1000 * 60 * 60),
          channelId: 'design'
        }
      ],
      announcements: [
        {
          id: 'welcome-announcements-1',
          content: '📢 Welcome to #announcements! Important team updates and company news will be shared here.',
          author: { id: 'system', name: 'Slack Clone Bot' },
          timestamp: new Date(Date.now() - 1000 * 60 * 60),
          channelId: 'announcements'
        }
      ]
    }

    return welcomeMessages[channelId] || [
      {
        id: `welcome-${channelId}-1`,
        content: `Welcome to #${channelId}! Start the conversation by sending your first message.`,
        author: { id: 'system', name: 'Slack Clone Bot' },
        timestamp: new Date(Date.now() - 1000 * 60 * 30),
        channelId
      }
    ]
  }

  // Auth state management
  useEffect(() => {
    const unsubscribe = blink.auth.onAuthStateChanged((state) => {
      setUser(state.user)
      setLoading(state.isLoading)
    })
    return unsubscribe
  }, [])

  // Real-time channel setup
  useEffect(() => {
    if (!user?.id) return

    let channel: RealtimeChannel | null = null

    const setupRealtime = async () => {
      // Clean up previous channel
      if (channelRef.current) {
        await channelRef.current.unsubscribe()
      }

      // Create new channel for current channel
      channel = blink.realtime.channel(`slack-${currentChannel}`)
      channelRef.current = channel

      await channel.subscribe({
        userId: user.id,
        metadata: {
          displayName: user.displayName || user.email.split('@')[0],
          email: user.email,
          status: 'online'
        }
      })

      // Listen for new messages
      channel.onMessage((message) => {
        if (message.type === 'chat') {
          const newMessage: Message = {
            id: message.id,
            content: message.data.content,
            author: {
              id: message.userId,
              name: message.metadata?.displayName || 'Unknown User'
            },
            timestamp: new Date(message.timestamp),
            channelId: currentChannel
          }

          setMessages(prev => ({
            ...prev,
            [currentChannel]: [...(prev[currentChannel] || []), newMessage]
          }))
        }
      })

      // Listen for presence changes
      channel.onPresence((users) => {
        setOnlineUsers(users.map(u => ({
          id: u.userId,
          name: u.metadata?.displayName || 'Anonymous',
          email: u.metadata?.email,
          status: u.metadata?.status || 'online'
        })))
      })

      // Load recent messages for this channel
      try {
        const recentMessages = await channel.getMessages({ limit: 50 })
        const channelMessages = recentMessages.map(msg => ({
          id: msg.id,
          content: msg.data.content,
          author: {
            id: msg.userId,
            name: msg.metadata?.displayName || 'Unknown User'
          },
          timestamp: new Date(msg.timestamp),
          channelId: currentChannel
        }))

        setMessages(prev => ({
          ...prev,
          [currentChannel]: channelMessages
        }))
      } catch (error) {
        console.log('No previous messages found for channel:', currentChannel)
        
        // Add welcome message for empty channels
        setMessages(prev => {
          if (!prev[currentChannel] || prev[currentChannel].length === 0) {
            const welcomeMessages = getWelcomeMessages(currentChannel)
            return {
              ...prev,
              [currentChannel]: welcomeMessages
            }
          }
          return prev
        })
      }
    }

    setupRealtime().catch(console.error)

    return () => {
      channel?.unsubscribe()
    }
  }, [user?.id, currentChannel, user?.displayName, user?.email])

  // Welcome messages for empty channels
  const getWelcomeMessages = (channelId: string): Message[] => {
    const welcomeMessages: Record<string, Message[]> = {
      general: [
        {
          id: 'welcome-general-1',
          content: '👋 Welcome to the #general channel! This is where our team comes together for general discussions and updates.',
          author: { id: 'system', name: 'Slack Clone Bot' },
          timestamp: new Date(Date.now() - 1000 * 60 * 60),
          channelId: 'general'
        },
        {
          id: 'welcome-general-2',
          content: 'Feel free to introduce yourself, share updates, or start conversations here. Looking forward to collaborating with everyone! 🚀',
          author: { id: 'system', name: 'Slack Clone Bot' },
          timestamp: new Date(Date.now() - 1000 * 60 * 30),
          channelId: 'general'
        }
      ],
      random: [
        {
          id: 'welcome-random-1',
          content: '🎉 Welcome to #random! This is our space for casual conversations, fun discussions, and everything that doesn\'t fit elsewhere.',
          author: { id: 'system', name: 'Slack Clone Bot' },
          timestamp: new Date(Date.now() - 1000 * 60 * 45),
          channelId: 'random'
        }
      ],
      development: [
        {
          id: 'welcome-dev-1',
          content: '💻 Welcome to #development! Share code snippets, discuss technical challenges, and collaborate on our projects here.',
          author: { id: 'system', name: 'Slack Clone Bot' },
          timestamp: new Date(Date.now() - 1000 * 60 * 60),
          channelId: 'development'
        }
      ],
      design: [
        {
          id: 'welcome-design-1',
          content: '🎨 Welcome to #design! Share your creative work, get feedback, and discuss design trends and ideas.',
          author: { id: 'system', name: 'Slack Clone Bot' },
          timestamp: new Date(Date.now() - 1000 * 60 * 60),
          channelId: 'design'
        }
      ],
      announcements: [
        {
          id: 'welcome-announcements-1',
          content: '📢 Welcome to #announcements! Important team updates and company news will be shared here.',
          author: { id: 'system', name: 'Slack Clone Bot' },
          timestamp: new Date(Date.now() - 1000 * 60 * 60),
          channelId: 'announcements'
        }
      ]
    }

    return welcomeMessages[channelId] || [
      {
        id: `welcome-${channelId}-1`,
        content: `Welcome to #${channelId}! Start the conversation by sending your first message.`,
        author: { id: 'system', name: 'Slack Clone Bot' },
        timestamp: new Date(Date.now() - 1000 * 60 * 30),
        channelId
      }
    ]
  }

  // Channel data
  const getChannelInfo = (channelId: string) => {
    const channels = {
      'general': { name: 'general', description: 'General discussion for the team', memberCount: onlineUsers.length },
      'random': { name: 'random', description: 'Random conversations and fun stuff', memberCount: onlineUsers.length },
      'announcements': { name: 'announcements', description: 'Important team announcements', memberCount: onlineUsers.length },
      'development': { name: 'development', description: 'Development discussions', memberCount: onlineUsers.length },
      'design': { name: 'design', description: 'Design feedback and collaboration', memberCount: onlineUsers.length }
    }
    
    const directMessages = {
      'dm-1': { name: 'Alice Johnson', isDirectMessage: true },
      'dm-2': { name: 'Bob Smith', isDirectMessage: true },
      'dm-3': { name: 'Carol Davis', isDirectMessage: true }
    }
    
    return channels[channelId as keyof typeof channels] || directMessages[channelId as keyof typeof directMessages] || { name: channelId }
  }

  const handleSendMessage = async (content: string) => {
    if (!user || !channelRef.current) return

    try {
      // Send message through realtime channel
      await channelRef.current.publish('chat', {
        content,
        timestamp: Date.now()
      }, {
        userId: user.id,
        metadata: {
          displayName: user.displayName || user.email.split('@')[0],
          email: user.email
        }
      })
    } catch (error) {
      console.error('Failed to send message:', error)
    }
  }

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 to-accent/5">
        <div className="text-center max-w-md mx-auto p-8">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-primary mb-2">Welcome to Slack Clone</h1>
            <p className="text-muted-foreground">
              A real-time team communication platform featuring channels, direct messaging, and collaboration tools.
            </p>
          </div>
          <button
            onClick={() => blink.auth.login()}
            className="bg-primary text-primary-foreground px-6 py-3 rounded-lg font-medium hover:bg-primary/90 transition-colors"
          >
            Sign In to Continue
          </button>
        </div>
      </div>
    )
  }

  const channelInfo = getChannelInfo(currentChannel)

  return (
    <div className="h-screen flex bg-background">
      {/* Sidebar */}
      <Sidebar 
        currentChannel={currentChannel}
        onChannelSelect={setCurrentChannel}
        onlineUsers={onlineUsers}
        currentUser={user}
      />
      
      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        <ChatHeader
          channelName={channelInfo.name}
          channelDescription={channelInfo.description}
          memberCount={channelInfo.memberCount}
          isDirectMessage={channelInfo.isDirectMessage}
        />
        
        <MessageList messages={messages[currentChannel] || []} />
        
        <MessageInput
          channelName={channelInfo.name}
          onSendMessage={handleSendMessage}
          placeholder={
            channelInfo.isDirectMessage 
              ? `Message ${channelInfo.name}` 
              : `Message #${channelInfo.name}`
          }
        />
      </div>
    </div>
  )
}

export default App