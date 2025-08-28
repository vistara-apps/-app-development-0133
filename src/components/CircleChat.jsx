import React, { useState, useRef, useEffect } from 'react'
import { Card } from './Card'
import { Button } from './Button'
import { useCirclesStore } from '../stores/circlesStore'
import { useAuthStore } from '../stores/authStore'
import { Send, Heart, ThumbsUp, Smile } from 'lucide-react'
import { format } from 'date-fns'

export function CircleChat({ circleId }) {
  const { getCircleMessages, sendMessage } = useCirclesStore()
  const { user } = useAuthStore()
  
  const [messageText, setMessageText] = useState('')
  const messagesEndRef = useRef(null)
  
  const messages = getCircleMessages(circleId)
  
  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])
  
  const handleSendMessage = () => {
    if (!messageText.trim()) return
    
    sendMessage(circleId, messageText)
    setMessageText('')
    
    // Force scroll to top after message is sent
    setTimeout(() => {
      const chatContainer = document.querySelector('[data-chat-container]')
      if (chatContainer) {
        chatContainer.scrollTop = 0
      }
    }, 100)
  }
  
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }
  
  // Group messages by date
  const groupedMessages = messages.reduce((groups, message) => {
    const date = format(new Date(message.createdAt), 'yyyy-MM-dd')
    if (!groups[date]) {
      groups[date] = []
    }
    groups[date].push(message)
    return groups
  }, {})
  
  return (
    <div className="flex flex-col h-[600px]">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto mb-4 space-y-4" data-chat-container>
        {Object.entries(groupedMessages).map(([date, dateMessages]) => (
          <div key={date} className="space-y-4">
            <div className="flex items-center justify-center">
              <div className="text-xs text-text-secondary bg-gray-100 dark:bg-dark-border/50 px-3 py-1 rounded-full">
                {format(new Date(date), 'EEEE, MMMM d, yyyy')}
              </div>
            </div>
            
            {dateMessages.map((message) => {
              const isCurrentUser = message.userId === user.userId
              
              return (
                <div 
                  key={message.messageId} 
                  className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`flex max-w-[80%] ${isCurrentUser ? 'flex-row-reverse' : 'flex-row'}`}>
                    {/* Avatar */}
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-200">
                        {message.user?.avatarUrl ? (
                          <img 
                            src={message.user.avatarUrl} 
                            alt={message.user.username} 
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-primary/20 text-primary font-medium">
                            {message.user?.username.charAt(0)}
                          </div>
                        )}
                      </div>
                    </div>
                    
                    {/* Message content */}
                    <div 
                      className={`mx-2 px-4 py-2 rounded-lg ${
                        isCurrentUser 
                          ? 'bg-primary text-white' 
                          : 'bg-gray-100 dark:bg-dark-border/50 text-text-primary dark:text-dark-text-primary'
                      }`}
                    >
                      {!isCurrentUser && (
                        <div className="text-xs font-medium mb-1">
                          {message.user?.username}
                        </div>
                      )}
                      <div className="whitespace-pre-wrap">{message.content}</div>
                      <div className="text-xs opacity-70 mt-1 text-right">
                        {format(new Date(message.createdAt), 'h:mm a')}
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      
      {/* Message Input */}
      <Card className="p-3 flex items-end">
        <textarea
          value={messageText}
          onChange={(e) => setMessageText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type a message..."
          className="flex-1 p-3 border border-border dark:border-dark-border rounded-md bg-surface dark:bg-dark-surface focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
          rows={2}
        />
        <Button 
          className="ml-3 h-10 w-10 p-0 flex items-center justify-center"
          onClick={handleSendMessage}
          disabled={!messageText.trim()}
        >
          <Send className="w-5 h-5" />
        </Button>
      </Card>
    </div>
  )
}

