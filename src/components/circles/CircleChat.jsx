import React, { useState, useEffect, useRef } from 'react'
import { 
  Send, 
  Smile, 
  PlusCircle, 
  Image, 
  Paperclip,
  Clock,
  User,
  Bot
} from 'lucide-react'
import { format, isToday, isYesterday } from 'date-fns'
import { useCircleStore } from '../../stores/circleStore'
import { useAuthStore } from '../../stores/authStore'
import { usePrivacyStore } from '../../stores/privacyStore'
import { realtimeManager } from '../../utils/RealtimeManager'
import { Button } from '../Button'
import { Input } from '../Input'
import { DailyPrompt } from './DailyPrompt'
import { EmptyState } from '../EmptyState'

export function CircleChat({ circleId, isMember, displayName }) {
  const [message, setMessage] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [typingUsers, setTypingUsers] = useState([])
  const [showEmojiPicker, setShowEmojiPicker] = useState(false)
  const messagesEndRef = useRef(null)
  
  const { user } = useAuthStore()
  const { 
    getCircleMessages, 
    sendMessage,
    getCurrentPrompt,
    addReaction
  } = useCircleStore()
  
  // Get messages for this circle
  const messages = getCircleMessages(circleId)
  
  // Get current prompt
  const currentPrompt = getCurrentPrompt(circleId)
  
  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])
  
  // Subscribe to typing indicators
  useEffect(() => {
    const unsubscribe = realtimeManager.subscribe('typing', (data) => {
      if (data.circleId === circleId) {
        setTypingUsers(data.typingUsers || [])
      }
    })
    
    return () => unsubscribe()
  }, [circleId])
  
  // Handle typing indicator
  useEffect(() => {
    let typingTimer
    
    if (isTyping) {
      // Set typing status
      realtimeManager.setTypingStatus(circleId, user.userId, true)
      
      // Clear typing status after 5 seconds of inactivity
      typingTimer = setTimeout(() => {
        setIsTyping(false)
        realtimeManager.setTypingStatus(circleId, user.userId, false)
      }, 5000)
    }
    
    return () => {
      clearTimeout(typingTimer)
    }
  }, [isTyping, circleId, user.userId])
  
  // Handle message input
  const handleMessageChange = (e) => {
    setMessage(e.target.value)
    
    // Set typing indicator
    if (!isTyping && e.target.value) {
      setIsTyping(true)
    }
  }
  
  // Handle message submit
  const handleSubmit = (e) => {
    e.preventDefault()
    
    if (!message.trim() || !isMember) return
    
    // Send message
    realtimeManager.sendMessage(circleId, user.userId, displayName, message.trim())
    
    // Clear input
    setMessage('')
    setIsTyping(false)
  }
  
  // Handle reaction
  const handleReaction = (messageId, reaction) => {
    if (!isMember) return
    
    realtimeManager.addReaction(messageId, user.userId, reaction)
  }
  
  // Group messages by date
  const groupedMessages = messages.reduce((groups, message) => {
    const date = new Date(message.sentAt)
    const dateStr = format(date, 'yyyy-MM-dd')
    
    if (!groups[dateStr]) {
      groups[dateStr] = []
    }
    
    groups[dateStr].push(message)
    return groups
  }, {})
  
  // Format date for display
  const formatDateHeading = (dateStr) => {
    const date = new Date(dateStr)
    
    if (isToday(date)) {
      return 'Today'
    } else if (isYesterday(date)) {
      return 'Yesterday'
    } else {
      return format(date, 'MMMM d, yyyy')
    }
  }
  
  return (
    <div className="flex flex-col h-full">
      {/* Messages area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Current prompt */}
        {currentPrompt && (
          <DailyPrompt prompt={currentPrompt} />
        )}
        
        {/* Messages */}
        {Object.keys(groupedMessages).length > 0 ? (
          Object.entries(groupedMessages)
            .sort(([dateA], [dateB]) => new Date(dateA) - new Date(dateB))
            .map(([date, dateMessages]) => (
              <div key={date} className="space-y-4">
                {/* Date heading */}
                <div className="flex items-center justify-center">
                  <div className="bg-gray-100 dark:bg-dark-border px-3 py-1 rounded-full text-xs font-medium text-text-secondary dark:text-dark-text-secondary">
                    {formatDateHeading(date)}
                  </div>
                </div>
                
                {/* Messages for this date */}
                {dateMessages.map((msg) => {
                  const isCurrentUser = msg.senderId === user.userId
                  const isAI = msg.isAI
                  
                  return (
                    <div 
                      key={msg.messageId} 
                      className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'}`}
                    >
                      <div 
                        className={`max-w-[80%] rounded-lg px-4 py-2 ${
                          isAI 
                            ? 'bg-accent/10 text-text-primary dark:bg-accent/5 dark:text-dark-text-primary' 
                            : isCurrentUser
                              ? 'bg-primary text-white dark:bg-primary dark:text-white'
                              : 'bg-gray-100 text-text-primary dark:bg-dark-border dark:text-dark-text-primary'
                        }`}
                      >
                        {/* Message header */}
                        <div className="flex items-center mb-1">
                          <span className={`text-xs font-medium ${
                            isAI 
                              ? 'text-accent dark:text-accent/90' 
                              : isCurrentUser
                                ? 'text-white/90 dark:text-white/90'
                                : 'text-text-secondary dark:text-dark-text-secondary'
                          }`}>
                            {isAI ? (
                              <span className="flex items-center">
                                <Bot className="h-3 w-3 mr-1" />
                                {msg.senderName}
                              </span>
                            ) : (
                              <span className="flex items-center">
                                <User className="h-3 w-3 mr-1" />
                                {msg.senderName}
                              </span>
                            )}
                          </span>
                          <span className={`text-xs ml-2 ${
                            isCurrentUser
                              ? 'text-white/70 dark:text-white/70'
                              : 'text-text-tertiary dark:text-dark-text-tertiary'
                          }`}>
                            {format(new Date(msg.sentAt), 'h:mm a')}
                          </span>
                        </div>
                        
                        {/* Message content */}
                        <p className="text-sm whitespace-pre-wrap break-words">
                          {msg.content}
                        </p>
                        
                        {/* Reactions */}
                        {msg.reactions && msg.reactions.length > 0 && (
                          <div className="flex mt-1 space-x-1">
                            {/* Group reactions by type */}
                            {Object.entries(
                              msg.reactions.reduce((acc, reaction) => {
                                if (!acc[reaction.reaction]) {
                                  acc[reaction.reaction] = 0
                                }
                                acc[reaction.reaction]++
                                return acc
                              }, {})
                            ).map(([reaction, count]) => (
                              <span 
                                key={reaction}
                                className="inline-flex items-center px-1.5 py-0.5 rounded-full text-xs bg-white/10 dark:bg-white/5"
                              >
                                {reaction} {count}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            ))
        ) : (
          <EmptyState
            title="No messages yet"
            description={isMember 
              ? "Be the first to start a conversation!" 
              : "Join this circle to start chatting with members"
            }
            icon={<MessageCircle className="w-12 h-12" />}
          />
        )}
        
        {/* Typing indicator */}
        {typingUsers.length > 0 && typingUsers.indexOf(user.userId) === -1 && (
          <div className="flex items-center text-text-tertiary dark:text-dark-text-tertiary text-xs">
            <div className="flex items-center space-x-1 mr-1">
              <div className="w-1.5 h-1.5 bg-text-tertiary dark:bg-dark-text-tertiary rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
              <div className="w-1.5 h-1.5 bg-text-tertiary dark:bg-dark-text-tertiary rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
              <div className="w-1.5 h-1.5 bg-text-tertiary dark:bg-dark-text-tertiary rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
            </div>
            <span>
              {typingUsers.length === 1 
                ? 'Someone is typing...' 
                : `${typingUsers.length} people are typing...`
              }
            </span>
          </div>
        )}
        
        {/* Scroll anchor */}
        <div ref={messagesEndRef} />
      </div>
      
      {/* Message input */}
      <div className="border-t border-border dark:border-dark-border p-4">
        {isMember ? (
          <form onSubmit={handleSubmit} className="flex items-end space-x-2">
            <div className="flex-1 relative">
              <textarea
                value={message}
                onChange={handleMessageChange}
                placeholder="Type a message..."
                className="w-full px-3 py-2 bg-surface dark:bg-dark-surface border border-border dark:border-dark-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50 text-text-primary dark:text-dark-text-primary resize-none"
                rows={1}
                style={{ minHeight: '42px', maxHeight: '120px' }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault()
                    handleSubmit(e)
                  }
                }}
              />
              
              <div className="absolute bottom-2 right-2 flex items-center space-x-1">
                <button
                  type="button"
                  className="text-text-tertiary hover:text-text-secondary dark:text-dark-text-tertiary dark:hover:text-dark-text-secondary"
                  onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                >
                  <Smile className="h-5 w-5" />
                </button>
                
                <button
                  type="button"
                  className="text-text-tertiary hover:text-text-secondary dark:text-dark-text-tertiary dark:hover:text-dark-text-secondary"
                  disabled={true} // Disabled for demo
                >
                  <Image className="h-5 w-5" />
                </button>
                
                <button
                  type="button"
                  className="text-text-tertiary hover:text-text-secondary dark:text-dark-text-tertiary dark:hover:text-dark-text-secondary"
                  disabled={true} // Disabled for demo
                >
                  <Paperclip className="h-5 w-5" />
                </button>
              </div>
              
              {/* Emoji picker (simplified for demo) */}
              {showEmojiPicker && (
                <div className="absolute bottom-12 right-0 bg-surface dark:bg-dark-surface border border-border dark:border-dark-border rounded-md shadow-card p-2 grid grid-cols-8 gap-1">
                  {['😊', '👍', '❤️', '🎉', '🙏', '👏', '🔥', '✨', 
                    '😂', '😍', '🤔', '😢', '😮', '👋', '💪', '🌟'].map(emoji => (
                    <button
                      key={emoji}
                      type="button"
                      className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 dark:hover:bg-dark-border/50 rounded"
                      onClick={() => {
                        setMessage(message + emoji)
                        setShowEmojiPicker(false)
                      }}
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              )}
            </div>
            
            <Button
              type="submit"
              variant="primary"
              disabled={!message.trim()}
            >
              <Send className="h-5 w-5" />
            </Button>
          </form>
        ) : (
          <div className="bg-gray-50 dark:bg-dark-border/50 rounded-md p-3 text-center">
            <p className="text-text-secondary dark:text-dark-text-secondary text-sm">
              Join this circle to participate in the conversation
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

