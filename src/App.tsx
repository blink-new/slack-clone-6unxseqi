import { useState, useEffect } from 'react'
import { blink } from './blink/client'
import { Sidebar } from './components/layout/Sidebar'
import { ChatHeader } from './components/layout/ChatHeader'
import { MessageList } from './components/chat/MessageList'
import { MessageInput } from './components/chat/MessageInput'

interface User {
  id: string
  email: string
  displayName?: string
}

function App() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [currentChannel, setCurrentChannel] = useState('general')
  const [messages, setMessages] = useState<any[]>([])

  // Auth state management
  useEffect(() => {
    const unsubscribe = blink.auth.onAuthStateChanged((state) => {
      setUser(state.user)
      setLoading(state.isLoading)
    })
    return unsubscribe
  }, [])

  // Channel data
  const getChannelInfo = (channelId: string) => {
    const channels = {
      'general': { name: 'general', description: 'General discussion for the team', memberCount: 12 },
      'random': { name: 'random', description: 'Random conversations and fun stuff', memberCount: 8 },
      'announcements': { name: 'announcements', description: 'Important team announcements', memberCount: 15 },
      'development': { name: 'development', description: 'Development discussions', memberCount: 6 },
      'design': { name: 'design', description: 'Design feedback and collaboration', memberCount: 4 }
    }
    
    const directMessages = {
      'dm-1': { name: 'Alice Johnson', isDirectMessage: true },
      'dm-2': { name: 'Bob Smith', isDirectMessage: true },
      'dm-3': { name: 'Carol Davis', isDirectMessage: true }
    }
    
    return channels[channelId as keyof typeof channels] || directMessages[channelId as keyof typeof directMessages] || { name: channelId }
  }

  const handleSendMessage = async (content: string) => {
    if (!user) return

    // Optimistic update
    const newMessage = {
      id: Date.now().toString(),
      content,
      author: {
        id: user.id,
        name: user.displayName || user.email.split('@')[0]
      },
      timestamp: new Date()
    }
    
    setMessages(prev => [...prev, newMessage])

    // Here you would normally send to the backend
    // For now, we'll just keep it in local state
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
      />
      
      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        <ChatHeader
          channelName={channelInfo.name}
          channelDescription={channelInfo.description}
          memberCount={channelInfo.memberCount}
          isDirectMessage={channelInfo.isDirectMessage}
        />
        
        <MessageList messages={messages} />
        
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