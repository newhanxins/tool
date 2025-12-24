<template>
  <div class="login-container">
    <div class="login-header">
      <h1>在线客服系统</h1>
      <p>用户登录</p>
    </div>
    
    <van-cell-group inset>
      <van-field
        v-model="username"
        label="用户名"
        placeholder="请输入用户名"
        :rules="[{ required: true, message: '请填写用户名' }]"
      />
      <van-field
        v-model="password"
        type="password"
        label="密码"
        placeholder="请输入密码"
        :rules="[{ required: true, message: '请填写密码' }]"
      />
    </van-cell-group>
    
    <div class="login-actions">
      <van-button 
        type="primary" 
        block 
        :loading="userStore.loading" 
        @click="handleLogin"
      >
        登录
      </van-button>
      
      <van-button 
        plain 
        block 
        @click="showRegister = true"
        style="margin-top: 10px;"
      >
        注册新账号
      </van-button>
    </div>
    
    <!-- 注册弹窗 -->
    <van-dialog
      v-model:show="showRegister"
      title="注册新账号"
      show-cancel-button
      @confirm="handleRegister"
      :before-close="beforeClose"
    >
      <van-cell-group inset>
        <van-field
          v-model="registerForm.username"
          label="用户名"
          placeholder="请输入用户名"
          :rules="[{ required: true, message: '请填写用户名' }]"
        />
        <van-field
          v-model="registerForm.email"
          label="邮箱"
          placeholder="请输入邮箱"
          :rules="[{ required: true, message: '请填写邮箱' }]"
        />
        <van-field
          v-model="registerForm.password"
          type="password"
          label="密码"
          placeholder="请输入密码"
          :rules="[{ required: true, message: '请填写密码' }]"
        />
      </van-cell-group>
    </van-dialog>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '../store/user'
import { Toast,showToast,showSuccessToast,showFailToast,Dialog as VanDialog } from 'vant'

const router = useRouter()
const userStore = useUserStore()

// 登录表单
const username = ref('admin')
const password = ref('123')

// 注册表单
const showRegister = ref(false)
const registerForm = ref({
  username: '',
  email: '',
  password: ''
})

// 登录处理
const handleLogin = async () => {
  if (!username.value || !password.value) {
    showToast({
      "type":'fail',
      "message":'请输入用户名和密码',
    })
    return
  }
  
  const success = await userStore.login(username.value, password.value)
  if (success) {
    showSuccessToast('登录成功')
    router.push('/chats')
  } else {
    showFailToast(userStore.error || '登录失败')
  }
}

// 注册处理
const handleRegister = async () => {
  if (!registerForm.value.username || !registerForm.value.email || !registerForm.value.password) {
    showFailToast('请填写完整注册信息')
    return false
  }
  
  const success = await userStore.register(
    registerForm.value.username,
    registerForm.value.email,
    registerForm.value.password
  )
  
  if (success) {
    showSuccessToast('注册成功，请登录')
    // 填充登录表单
    username.value = registerForm.value.username
    password.value = registerForm.value.password
    
    // 清空注册表单
    registerForm.value = {
      username: '',
      email: '',
      password: ''
    }
    
    return true
  } else {
    showFailToast(userStore.error || '注册失败')
    return false
  }
}

// 关闭注册弹窗前的处理
const beforeClose = (action, done) => {
  if (action === 'confirm') {
    // 点击确认按钮时，会由handleRegister处理
    done(false)
    handleRegister().then(success => {
      if (success) {
        done(true)
      }
    })
  } else {
    // 点击取消按钮时，直接关闭
    done(true)
  }
}
</script>

<style scoped>
.login-container {
  height: 100vh;
  display: flex;
  flex-direction: column;
  padding: 20px;
}

.login-header {
  text-align: center;
  margin: 40px 0;
}

.login-header h1 {
  font-size: 24px;
  color: #323233;
  margin-bottom: 10px;
}

.login-header p {
  font-size: 14px;
  color: #969799;
}

.login-actions {
  margin-top: 30px;
}
</style>