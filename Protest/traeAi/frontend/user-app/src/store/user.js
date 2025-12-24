import { defineStore } from 'pinia'
import axios from 'axios'

const API_URL = 'http://localhost:8000/api/v1'
const api = axios.create({
  baseURL: '/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
})
export const useUserStore = defineStore('user', {
  state: () => ({
    token: localStorage.getItem('token') || '',
    user: JSON.parse(localStorage.getItem('user') || '{}'),
    loading: false,
    error: null
  }),
  
  getters: {
    isLoggedIn: (state) => !!state.token,
    userId: (state) => state.user.id
  },
  
  actions: {
    async login(username, password) {
      this.loading = true
      this.error = null
      
      try {
        const formData = new FormData()
        formData.append('username', username)
        formData.append('password', password)
        
        const response = await axios.post(`${API_URL}/auth/login`, formData)

        const token = response.data.access_token
        localStorage.setItem('token', token)
        this.token = token
        
        // 获取用户信息
        await this.fetchUserInfo()
        
        return true
      } catch (error) {
        this.error = error.response?.data?.detail || '登录失败'
        return false
      } finally {
        this.loading = false
      }
    },
    
    async register(username, email, password) {
      this.loading = true
      this.error = null
      
      try {
        const response = await axios.post(`${API_URL}/auth/register`, {
          username,
          email,
          password,
          is_cs: false
        })
        
        return true
      } catch (error) {
        this.error = error.response?.data?.detail || '注册失败'
        return false
      } finally {
        this.loading = false
      }
    },
    
    async fetchUserInfo() {
      try {
        const response = await axios.get(`${API_URL}/users/me`, {
          headers: { Authorization: `Bearer ${this.token}` }
        })
        
        this.user = response.data
        localStorage.setItem('user', JSON.stringify(response.data))
      } catch (error) {
        console.error('获取用户信息失败', error)
      }
    },
    
    logout() {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      this.token = ''
      this.user = {}
    }
  }
})