import { Hash, Users, Star, Info, Phone, Video, Settings } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'

interface ChatHeaderProps {
  channelName: string
  channelDescription?: string
  memberCount?: number
  isDirectMessage?: boolean
}

export function ChatHeader({ channelName, channelDescription, memberCount, isDirectMessage }: ChatHeaderProps) {
  return (
    <div className="h-14 border-b bg-background px-4 flex items-center justify-between">
      <div className="flex items-center space-x-3">
        <div className="flex items-center space-x-2">
          {isDirectMessage ? (
            <Avatar className="h-6 w-6">
              <AvatarFallback className="text-xs">{channelName.charAt(0)}</AvatarFallback>
            </Avatar>
          ) : (
            <Hash className="h-5 w-5 text-muted-foreground" />
          )}
          <h2 className="text-lg font-semibold">{channelName}</h2>
          {!isDirectMessage && (
            <Button size="sm" variant="ghost" className="h-6 w-6 p-0">
              <Star className="h-3 w-3" />
            </Button>
          )}
        </div>
        
        {channelDescription && (
          <div className="hidden md:flex items-center space-x-2 text-sm text-muted-foreground">
            <span>|</span>
            <span>{channelDescription}</span>
          </div>
        )}
      </div>

      <div className="flex items-center space-x-2">
        {isDirectMessage ? (
          <>
            <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
              <Phone className="h-4 w-4" />
            </Button>
            <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
              <Video className="h-4 w-4" />
            </Button>
          </>
        ) : (
          <>
            <div className="flex items-center space-x-1 text-sm text-muted-foreground">
              <Users className="h-4 w-4" />
              <span>{memberCount || 0}</span>
            </div>
            <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
              <Users className="h-4 w-4" />
            </Button>
          </>
        )}
        
        <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
          <Info className="h-4 w-4" />
        </Button>
        
        <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
          <Settings className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}