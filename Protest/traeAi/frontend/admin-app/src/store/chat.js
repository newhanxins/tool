import { defineStore } from 'pinia'
import axios from 'axios'

export const useChatStore = defineStore('chat', {
  state: () => ({
    activeUsers: [],
    allUsers: [],
    currentUser: null,
    messages: [],
    connected: false,
    socket: null,
    loading: false,
    error: null,
    chatList: []
  }),
  
  actions: {
    // 获取活跃用户列表
    async fetchActiveUsers() {
      this.loading = true
      
      try {
        const response = await axios.get('http://localhost:8000/api/admin/active-users', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('admin_token')}`
          }
        })
        
        this.activeUsers = response.data
      } catch (error) {
        this.error = '获取活跃用户失败'
        console.error(error)
      } finally {
        this.loading = false
      }
    },
    
    // 获取所有用户列表
    async fetchAllUsers() {
      this.loading = true
      
      try {
        const response = await axios.get('http://localhost:8000/api/admin/users', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('admin_token')}`
          }
        })
        
        this.allUsers = response.data
      } catch (error) {
        this.error = '获取用户列表失败'
        console.error(error)
      } finally {
        this.loading = false
      }
    },
    
    // 获取聊天列表
    async fetchChatList(search = '') {
      this.loading = true
      
      try {
        const url = search 
          ? `http://localhost:8000/api/admin/chats?search=${encodeURIComponent(search)}`
          : 'http://localhost:8000/api/admin/chats'
          
        const response = await axios.get(url, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('admin_token')}`
          }
        })
        
        this.chatList = response.data
      } catch (error) {
        this.error = '获取聊天列表失败'
        console.error(error)
      } finally {
        this.loading = false
      }
    },
    
    // 更新聊天备注
    async updateChatNote(chatId, note) {
      try {
        await axios.put(`http://localhost:8000/api/chats/${chatId}`, 
          { note },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('admin_token')}`
            }
          }
        )
        
        // 更新本地聊天列表
        const chatIndex = this.chatList.findIndex(chat => chat.id === chatId)
        if (chatIndex !== -1) {
          this.chatList[chatIndex].note = note
        }
        
        return true
      } catch (error) {
        this.error = '更新聊天备注失败'
        console.error(error)
        return false
      }
    },
    
    // 选择当前聊天用户
    selectUser(user) {
      this.currentUser = user
      this.fetchMessages(user.id)
    },
    
    // 获取与特定用户的聊天记录
    async fetchMessages(userId) {
      this.loading = true
      this.messages = []
      
      try {
        const response = await axios.get(`http://localhost:8000/api/admin/messages/${userId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('admin_token')}`
          }
        })
        
        this.messages = response.data
      } catch (error) {
        this.error = '获取聊天记录失败'
        console.error(error)
      } finally {
        this.loading = false
      }
    },
    
    // 连接WebSocket
    connectWebSocket() {
      if (this.socket) {
        this.socket.close()
      }
      
      const token = localStorage.getItem('admin_token')
      this.socket = new WebSocket(`ws://localhost:8000/ws/admin?token=${token}`)
      
      this.socket.onopen = () => {
        this.connected = true
        console.log('WebSocket连接已建立')
      }
      
      this.socket.onmessage = (event) => {
        const data = JSON.parse(event.data)
        
        if (data.type === 'message' && data.user_id === this.currentUser?.id) {
          this.messages.push(data.message)
        } else if (data.type === 'user_active') {
          // 更新活跃用户列表
          this.fetchActiveUsers()
        }
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
    
    // 发送消息
    sendMessage(content) {
      if (!this.connected || !this.currentUser) return
      
      const message = {
        type: 'message',
        user_id: this.currentUser.id,
        content
      }
      
      this.socket.send(JSON.stringify(message))
      
      // 添加到本地消息列表
      this.messages.push({
        content,
        is_from_user: false,
        created_at: new Date().toISOString(),
        user_id: this.currentUser.id
      })
    },
    
    // 断开WebSocket连接
    disconnect() {
      if (this.socket) {
        this.socket.close()
        this.socket = null
      }
      this.connected = false
    },
    
    // 清空消息
    clearMessages() {
      this.messages = []
      this.currentUser = null
    }
  }
})