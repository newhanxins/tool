import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '../views/LoginView.vue'
import ChatView from '../views/ChatView.vue'
import ChatListView from '../views/ChatListView.vue'
import { useUserStore } from '../store/user'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'login',
      component: LoginView
    },
    {
      path: '/chats',
      name: 'chatList',
      component: ChatListView,
      meta: { requiresAuth: true }
    },
    {
      path: '/chat/:id?',
      name: 'chat',
      component: ChatView,
      meta: { requiresAuth: true }
    }
  ]
})

// 路由守卫
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token')
  
  if (to.matched.some(record => record.meta.requiresAuth)) {
    // 需要登录的路由
    if (!token) {
      next({ name: 'login' })
    } else {
      next()
    }
  } else {
    // 不需要登录的路由
    if (token && to.name === 'login') {
      next({ name: 'chat' })
    } else {
      next()
    }
  }
})

export default router