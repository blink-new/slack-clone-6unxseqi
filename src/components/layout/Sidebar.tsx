import { useState } from 'react'
import { Hash, Plus, ChevronDown, MessageSquare, Users, Settings, Search } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'

interface SidebarProps {
  currentChannel: string
  onChannelSelect: (channelId: string) => void
}

export function Sidebar({ currentChannel, onChannelSelect }: SidebarProps) {
  const [searchQuery, setSearchQuery] = useState('')

  const channels = [
    { id: 'general', name: 'general', unread: 0 },
    { id: 'random', name: 'random', unread: 3 },
    { id: 'announcements', name: 'announcements', unread: 1 },
    { id: 'development', name: 'development', unread: 0 },
    { id: 'design', name: 'design', unread: 2 }
  ]

  const directMessages = [
    { id: 'dm-1', name: 'Alice Johnson', status: 'online', unread: 2 },
    { id: 'dm-2', name: 'Bob Smith', status: 'away', unread: 0 },
    { id: 'dm-3', name: 'Carol Davis', status: 'offline', unread: 1 }
  ]

  return (
    <div className="w-64 bg-primary text-primary-foreground flex flex-col h-full">
      {/* Workspace Header */}
      <div className="p-4 border-b border-primary-foreground/20">
        <div className="flex items-center justify-between">
          <h1 className="text-lg font-semibold">Team Workspace</h1>
          <ChevronDown className="h-4 w-4" />
        </div>
      </div>

      {/* Search */}
      <div className="p-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-primary-foreground/60" />
          <Input
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-primary-foreground/10 border-primary-foreground/20 text-primary-foreground placeholder:text-primary-foreground/60"
          />
        </div>
      </div>

      <ScrollArea className="flex-1">
        {/* Channels Section */}
        <div className="px-3 py-2">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center text-sm font-medium text-primary-foreground/80">
              <ChevronDown className="h-3 w-3 mr-1" />
              Channels
            </div>
            <Button size="sm" variant="ghost" className="h-6 w-6 p-0 text-primary-foreground/60 hover:text-primary-foreground">
              <Plus className="h-3 w-3" />
            </Button>
          </div>
          
          <div className="space-y-1">
            {channels.map((channel) => (
              <button
                key={channel.id}
                onClick={() => onChannelSelect(channel.id)}
                className={`w-full flex items-center justify-between px-2 py-1 rounded text-sm hover:bg-primary-foreground/10 transition-colors ${
                  currentChannel === channel.id ? 'bg-accent text-accent-foreground' : ''
                }`}
              >
                <div className="flex items-center">
                  <Hash className="h-3 w-3 mr-2" />
                  <span>{channel.name}</span>
                </div>
                {channel.unread > 0 && (
                  <Badge variant="destructive" className="h-4 text-xs px-1">
                    {channel.unread}
                  </Badge>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Direct Messages Section */}
        <div className="px-3 py-2">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center text-sm font-medium text-primary-foreground/80">
              <ChevronDown className="h-3 w-3 mr-1" />
              Direct messages
            </div>
            <Button size="sm" variant="ghost" className="h-6 w-6 p-0 text-primary-foreground/60 hover:text-primary-foreground">
              <Plus className="h-3 w-3" />
            </Button>
          </div>
          
          <div className="space-y-1">
            {directMessages.map((dm) => (
              <button
                key={dm.id}
                onClick={() => onChannelSelect(dm.id)}
                className={`w-full flex items-center justify-between px-2 py-1 rounded text-sm hover:bg-primary-foreground/10 transition-colors ${
                  currentChannel === dm.id ? 'bg-accent text-accent-foreground' : ''
                }`}
              >
                <div className="flex items-center">
                  <div className="relative mr-2">
                    <Avatar className="h-4 w-4">
                      <AvatarFallback className="text-xs">{dm.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className={`absolute -bottom-0.5 -right-0.5 h-2 w-2 rounded-full border border-primary ${
                      dm.status === 'online' ? 'bg-green-500' : 
                      dm.status === 'away' ? 'bg-yellow-500' : 'bg-gray-400'
                    }`} />
                  </div>
                  <span className="truncate">{dm.name}</span>
                </div>
                {dm.unread > 0 && (
                  <Badge variant="destructive" className="h-4 text-xs px-1">
                    {dm.unread}
                  </Badge>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Apps Section */}
        <div className="px-3 py-2">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center text-sm font-medium text-primary-foreground/80">
              <ChevronDown className="h-3 w-3 mr-1" />
              Apps
            </div>
            <Button size="sm" variant="ghost" className="h-6 w-6 p-0 text-primary-foreground/60 hover:text-primary-foreground">
              <Plus className="h-3 w-3" />
            </Button>
          </div>
        </div>
      </ScrollArea>

      {/* User Profile */}
      <div className="p-3 border-t border-primary-foreground/20">
        <div className="flex items-center space-x-2">
          <div className="relative">
            <Avatar className="h-8 w-8">
              <AvatarFallback>JD</AvatarFallback>
            </Avatar>
            <div className="absolute -bottom-0.5 -right-0.5 h-3 w-3 bg-green-500 rounded-full border-2 border-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">John Doe</p>
            <p className="text-xs text-primary-foreground/60 truncate">Available</p>
          </div>
          <Button size="sm" variant="ghost" className="h-6 w-6 p-0 text-primary-foreground/60 hover:text-primary-foreground">
            <Settings className="h-3 w-3" />
          </Button>
        </div>
      </div>
    </div>
  )
}