<template>
  <div class="login-container">
    <el-card class="login-card">
      <h2 class="login-title">客服管理系统</h2>
      
      <el-form :model="loginForm" :rules="rules" ref="loginFormRef" label-width="0" class="login-form">
        <el-form-item prop="username">
          <el-input v-model="loginForm.username" placeholder="用户名" prefix-icon="el-icon-user"></el-input>
        </el-form-item>
        
        <el-form-item prop="password">
          <el-input v-model="loginForm.password" type="password" placeholder="密码" prefix-icon="el-icon-lock"></el-input>
        </el-form-item>
        
        <el-form-item>
          <el-button type="primary" :loading="adminStore.loading" @click="handleLogin" class="login-button">登录</el-button>
        </el-form-item>
      </el-form>
      
      <p v-if="adminStore.error" class="error-message">{{ adminStore.error }}</p>
    </el-card>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useAdminStore } from '../store/admin'
import { ElMessage } from 'element-plus'

const router = useRouter()
const adminStore = useAdminStore()
const loginFormRef = ref(null)

const loginForm = reactive({
  username: '',
  password: ''
})

const rules = {
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' }
  ]
}

const handleLogin = async () => {
  if (!loginFormRef.value) return
  
  await loginFormRef.value.validate(async (valid) => {
    if (valid) {
      const success = await adminStore.login(loginForm.username, loginForm.password)
      
      if (success) {
        ElMessage.success('登录成功')
        router.push('/dashboard')
      }
    }
  })
}
</script>

<style scoped>
.login-container {
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #f5f7fa;
}

.login-card {
  width: 400px;
  padding: 20px;
}

.login-title {
  text-align: center;
  margin-bottom: 30px;
  color: #409EFF;
}

.login-form {
  margin-top: 20px;
}

.login-button {
  width: 100%;
}

.error-message {
  color: #F56C6C;
  text-align: center;
  margin-top: 10px;
}
</style>