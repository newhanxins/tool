import { defineStore } from 'pinia'
import axios from 'axios'

export const useAdminStore = defineStore('admin', {
  state: () => ({
    token: localStorage.getItem('admin_token') || '',
    admin: null,
    loading: false,
    error: null
  }),
  
  getters: {
    isLoggedIn: (state) => !!state.token,
    adminId: (state) => state.admin ? state.admin.id : null
  },
  
  actions: {
    async login(username, password) {
      this.loading = true
      this.error = null
      
      try {
        const response = await axios.post('http://localhost:8000/api/admin/login', {
          username,
          password
        })
        
        const { token, admin } = response.data
        
        this.token = token
        this.admin = admin
        
        localStorage.setItem('admin_token', token)
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
        
        return true
      } catch (error) {
        this.error = error.response?.data?.detail || '登录失败，请检查用户名和密码'
        return false
      } finally {
        this.loading = false
      }
    },
    
    async fetchAdminInfo() {
      if (!this.token) return
      
      this.loading = true
      
      try {
        const response = await axios.get('http://localhost:8000/api/admin/me', {
          headers: {
            Authorization: `Bearer ${this.token}`
          }
        })
        
        this.admin = response.data
      } catch (error) {
        if (error.response?.status === 401) {
          this.logout()
        }
      } finally {
        this.loading = false
      }
    },
    
    logout() {
      this.token = ''
      this.admin = null
      localStorage.removeItem('admin_token')
      delete axios.defaults.headers.common['Authorization']
    }
  }
})