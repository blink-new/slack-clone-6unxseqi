import { useState } from 'react'
import { formatDistanceToNow } from 'date-fns'
import { MoreHorizontal, Reply, Smile, Share } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Badge } from '@/components/ui/badge'

interface Message {
  id: string
  content: string
  author: {
    id: string
    name: string
    avatar?: string
  }
  timestamp: Date
  reactions?: { emoji: string; count: number; users: string[] }[]
  replies?: number
}

interface MessageListProps {
  messages: Message[]
}

export function MessageList({ messages }: MessageListProps) {
  const [hoveredMessage, setHoveredMessage] = useState<string | null>(null)

  const mockMessages: Message[] = [
    {
      id: '1',
      content: 'Hey everyone! Welcome to our new Slack workspace. Feel free to introduce yourselves here.',
      author: { id: '1', name: 'Alice Johnson' },
      timestamp: new Date(Date.now() - 1000 * 60 * 30),
      reactions: [
        { emoji: '👋', count: 5, users: ['user1', 'user2'] },
        { emoji: '🎉', count: 3, users: ['user3'] }
      ]
    },
    {
      id: '2',
      content: 'Thanks Alice! Excited to be part of the team. Looking forward to collaborating with everyone.',
      author: { id: '2', name: 'Bob Smith' },
      timestamp: new Date(Date.now() - 1000 * 60 * 25),
      replies: 2
    },
    {
      id: '3',
      content: 'Hello team! 👋 I\'m Carol, the new designer. Can\'t wait to work on some amazing projects together!',
      author: { id: '3', name: 'Carol Davis' },
      timestamp: new Date(Date.now() - 1000 * 60 * 20),
      reactions: [
        { emoji: '🎨', count: 4, users: ['user1', 'user2'] }
      ]
    },
    {
      id: '4',
      content: 'Welcome Carol! We\'re thrilled to have you on board. Your portfolio looks incredible.',
      author: { id: '1', name: 'Alice Johnson' },
      timestamp: new Date(Date.now() - 1000 * 60 * 15)
    },
    {
      id: '5',
      content: 'Quick reminder: We have our weekly standup tomorrow at 10 AM. Please prepare your updates!',
      author: { id: '4', name: 'David Wilson' },
      timestamp: new Date(Date.now() - 1000 * 60 * 10),
      reactions: [
        { emoji: '✅', count: 8, users: ['user1', 'user2'] }
      ]
    }
  ]

  const displayMessages = messages.length > 0 ? messages : mockMessages

  return (
    <ScrollArea className="flex-1 p-4">
      <div className="space-y-4">
        {displayMessages.map((message) => (
          <div
            key={message.id}
            className="group relative"
            onMouseEnter={() => setHoveredMessage(message.id)}
            onMouseLeave={() => setHoveredMessage(null)}
          >
            <div className="flex space-x-3">
              <Avatar className="h-9 w-9 mt-0.5">
                <AvatarImage src={message.author.avatar} />
                <AvatarFallback>{message.author.name.charAt(0)}</AvatarFallback>
              </Avatar>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-baseline space-x-2">
                  <span className="font-semibold text-sm">{message.author.name}</span>
                  <span className="text-xs text-muted-foreground">
                    {formatDistanceToNow(message.timestamp, { addSuffix: true })}
                  </span>
                </div>
                
                <div className="mt-1 text-sm leading-relaxed">
                  {message.content}
                </div>
                
                {/* Reactions */}
                {message.reactions && message.reactions.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {message.reactions.map((reaction, index) => (
                      <Button
                        key={index}
                        variant="outline"
                        size="sm"
                        className="h-6 px-2 text-xs hover:bg-accent"
                      >
                        <span className="mr-1">{reaction.emoji}</span>
                        <span>{reaction.count}</span>
                      </Button>
                    ))}
                  </div>
                )}
                
                {/* Thread replies */}
                {message.replies && message.replies > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="mt-2 h-6 px-2 text-xs text-accent hover:text-accent-foreground hover:bg-accent/10"
                  >
                    <Reply className="h-3 w-3 mr-1" />
                    {message.replies} {message.replies === 1 ? 'reply' : 'replies'}
                  </Button>
                )}
              </div>
            </div>
            
            {/* Message actions */}
            {hoveredMessage === message.id && (
              <div className="absolute top-0 right-0 flex items-center space-x-1 bg-background border rounded-md shadow-sm p-1">
                <Button size="sm" variant="ghost" className="h-6 w-6 p-0">
                  <Smile className="h-3 w-3" />
                </Button>
                <Button size="sm" variant="ghost" className="h-6 w-6 p-0">
                  <Reply className="h-3 w-3" />
                </Button>
                <Button size="sm" variant="ghost" className="h-6 w-6 p-0">
                  <Share className="h-3 w-3" />
                </Button>
                <Button size="sm" variant="ghost" className="h-6 w-6 p-0">
                  <MoreHorizontal className="h-3 w-3" />
                </Button>
              </div>
            )}
          </div>
        ))}
      </div>
    </ScrollArea>
  )
}