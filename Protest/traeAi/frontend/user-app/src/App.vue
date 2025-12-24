<script>
import { RouterView, useRouter } from 'vue-router'
import { useUserStore } from './store/user'
import { onMounted } from 'vue'

export default {
  setup() {
    const userStore = useUserStore()
    const router = useRouter()
    
    onMounted(() => {
      // userStore.checkAuth()
      
      // 如果用户已登录且在根路径，重定向到聊天列表
      if (userStore.isLoggedIn && router.currentRoute.value.path === '/') {
        router.push('/chats')
      }
    })
  }
}
</script>

<template>
  <div class="app-container">
    <router-view />
  </div>
</template>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html, body {
  height: 100%;
  width: 100%;
  background-color: #f7f8fa;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen,
    Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
}

.app-container {
  height: 100vh;
  width: 100%;
  max-width: 640px;
  margin: 0 auto;
  background-color: #fff;
}
</style>