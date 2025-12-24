import { defineStore } from 'pinia'
import axios from 'axios'
import { useUserStore } from './user'

const API_URL = 'http://localhost:8000/api/v1'

export const useChatStore = defineStore('chat', {
  state: () => ({
    messages: [],
    chatList: [],
    currentChatId: null,
    loading: false,
    error: null,
    socket: null,
    connected: false
  }),
  
  actions: {
    async fetchChatList() {
      this.loading = true
      this.error = null
      
      try {
        const userStore = useUserStore()
        const token = userStore.token
        
        const response = await axios.get('/api/user/chats?skip=0&limit=100&include_deleted=false', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })
        
        this.chatList = response.data
      } catch (error) {
        console.error('Error fetching chat list:', error)
        this.error = error.response?.data?.detail || 'Failed to fetch chat list'
      } finally {
        this.loading = false
      }
    },
    
    async updateChat(chatId, updateData) {
      this.loading = true
      this.error = null
      
      try {
        const userStore = useUserStore()
        const token = userStore.token
        
        const response = await axios.put(`/api/chats/${chatId}`, updateData, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })
        
        // 更新本地聊天列表
        const index = this.chatList.findIndex(chat => chat.id === chatId)
        if (index !== -1) {
          this.chatList[index] = { ...this.chatList[index], ...updateData }
        }
        
        return response.data
      } catch (error) {
        console.error('Error updating chat:', error)
        this.error = error.response?.data?.detail || 'Failed to update chat'
        throw error
      } finally {
        this.loading = false
      }
    },
    
    async fetchHistory() {
      this.loading = true
      this.error = null
      
      try {
        const userStore = useUserStore()
        const userId = userStore.userId
        const token = userStore.token
        
        const response = await axios.get(`${API_URL}/messages/history/${userId}`, {
          headers: { Authorization: `Bearer ${token}` }
        })
        
        this.messages = response.data.sort((a, b) => 
          new Date(a.created_at) - new Date(b.created_at)
        )
        
        // 如果有当前聊天，标记为已读
        if (this.currentChatId) {
          this.markChatAsRead(this.currentChatId)
        }
      } catch (error) {
        this.error = error.response?.data?.detail || '获取历史消息失败'
      } finally {
        this.loading = false
      }
    },
    
    async markChatAsRead(chatId) {
      try {
        const userStore = useUserStore()
        const token = userStore.token
        
        await axios.put(`/api/chats/${chatId}/read`, {}, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })
        
        // 更新本地聊天列表中的未读计数
        const index = this.chatList.findIndex(chat => chat.id === chatId)
        if (index !== -1) {
          this.chatList[index].unread_count = 0
        }
      } catch (error) {
        console.error('Error marking chat as read:', error)
      }
    },
    
    connectWebSocket() {
      const userStore = useUserStore()
      const userId = userStore.userId
      const token = userStore.token
      
      if (!userId || !token) return
      
      // 关闭之前的连接
      if (this.socket) {
        this.socket.close()
      }
      
      // 创建新连接
      this.socket = new WebSocket(`ws://localhost:8000/ws/user/${userId}?token=${token}`)
      
      this.socket.onopen = () => {
        this.connected = true
        console.log('WebSocket连接已建立')
      }
      
      this.socket.onmessage = (event) => {
        const message = event.data
        this.messages.push({
          user_id: userId,
          content: message,
          is_from_user: false,
          created_at: new Date().toISOString()
        })
      }
      
      this.socket.onclose = () => {
        this.connected = false
        console.log('WebSocket连接已关闭')
        
        // 尝试重新连接
        setTimeout(() => {
          if (!this.connected) {
            this.connectWebSocket()
          }
        }, 3000)
      }
      
      this.socket.onerror = (error) => {
        console.error('WebSocket错误:', error)
        this.connected = false
      }
    },
    
    sendMessage(content, messageType = 'TEXT', mediaUrl = null, mentionedUserId = null) {
      if (!this.socket || this.socket.readyState !== WebSocket.OPEN) {
        this.connectWebSocket()
        setTimeout(() => this.sendMessage(content, messageType, mediaUrl, mentionedUserId), 1000)
        return
      }
      
      const messageData = {
        content: content,
        message_type: messageType,
        media_url: mediaUrl,
        mentioned_user_id: mentionedUserId
      }
      
      this.socket.send(JSON.stringify(messageData))
      
      const userStore = useUserStore()
      const userId = userStore.userId
      
      // 添加到本地消息列表
      const newMessage = {
        id: `temp-${Date.now()}`, // 临时ID，将在服务器响应后更新
        user_id: userId,
        content: content,
        is_from_user: true,
        created_at: new Date().toISOString(),
        message_type: messageType,
        media_url: mediaUrl,
        mentioned_user_id: mentionedUserId,
        status: 'SENT',
        is_recalled: false
      }
      
      this.messages.push(newMessage)
      return newMessage
    },
    
    async recallMessage(messageId) {
      try {
        const userStore = useUserStore()
        const token = userStore.token
        
        await axios.put(`/api/messages/${messageId}/recall`, {}, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })
        
        // 更新本地消息
        const index = this.messages.findIndex(msg => msg.id === messageId)
        if (index !== -1) {
          this.messages[index].is_recalled = true
        }
        
        return true
      } catch (error) {
        console.error('Error recalling message:', error)
        throw error
      }
    },
    
    async uploadMedia(file) {
      try {
        const userStore = useUserStore()
        const token = userStore.token
        
        const formData = new FormData()
        formData.append('file', file)
        
        const response = await axios.post('/api/upload', formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        })
        
        return response.data.url
      } catch (error) {
        console.error('Error uploading media:', error)
        throw error
      }
    },
    
    disconnect() {
      if (this.socket) {
        this.socket.close()
        this.socket = null
        this.connected = false
      }
    },
    
    clearMessages() {
      this.messages = []
    }
  }
})