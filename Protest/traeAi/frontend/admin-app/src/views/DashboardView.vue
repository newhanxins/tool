<template>
  <div class="dashboard-container">
    <el-container>
      <!-- 侧边栏 - 用户列表 -->
      <el-aside width="280px" class="user-list-container">
        <div class="header">
          <h3>用户列表</h3>
          <el-button type="primary" size="small" @click="refreshUsers" :loading="chatStore.loading">
            刷新
          </el-button>
        </div>
        
        <!-- 搜索框 -->
        <div class="search-container">
          <el-input
            v-model="searchQuery"
            placeholder="搜索用户"
            prefix-icon="el-icon-search"
            clearable
            @input="searchUsers"
          >
            <template #append>
              <el-button @click="searchUsers">搜索</el-button>
            </template>
          </el-input>
        </div>
        
        <div v-if="filteredUsers.length === 0" class="empty-users">
          <p>暂无用户</p>
        </div>
        
        <el-menu v-else class="user-list" :default-active="activeUserId">
          <el-menu-item 
            v-for="user in filteredUsers" 
            :key="user.id"
            :index="user.id.toString()"
            @click="selectUser(user)"
          >
            <div class="user-item">
              <div class="user-avatar">{{ user.username.charAt(0).toUpperCase() }}</div>
              <div class="user-info">
                <div class="user-name">{{ user.username }}</div>
                <div class="user-status" v-if="isUserActive(user.id)">在线</div>
                <div class="user-note" v-if="user.note">{{ user.note }}</div>
              </div>
            </div>
          </el-menu-item>
        </el-menu>
        
        <div class="admin-info">
          <div class="admin-name">{{ adminStore.admin?.username }}</div>
          <el-button type="danger" size="small" @click="handleLogout">退出登录</el-button>
        </div>
      </el-aside>
      
      <!-- 主内容区 - 聊天窗口 -->
      <el-main class="chat-container">
        <div v-if="!chatStore.currentUser" class="empty-chat">
          <p>请选择一个用户开始聊天</p>
        </div>
        
        <template v-else>
          <div class="chat-header">
            <div class="chat-header-title">
              <h3>与 {{ chatStore.currentUser.username }} 聊天中</h3>
              <el-button type="primary" size="small" @click="openNoteDialog">
                添加备注
              </el-button>
            </div>
            <div v-if="noteText" class="chat-note">
              <span>备注: {{ noteText }}</span>
            </div>
          </div>
          
          <div class="chat-messages" ref="messagesContainer">
            <div v-if="chatStore.messages.length === 0" class="empty-messages">
              <p>暂无消息记录</p>
            </div>
            
            <div v-else class="message-list">
              <div 
                v-for="(message, index) in chatStore.messages" 
                :key="index"
                :class="['message-item', message.is_from_user ? 'message-user' : 'message-admin']"
              >
                <div v-if="message.is_recalled" class="message-recalled">
                  消息已撤回
                </div>
                <div v-else class="message-content" @contextmenu.prevent="recallMessage(message)">
                  {{ message.content }}
                </div>
                <div class="message-time">
                  {{ formatTime(message.created_at) }}
                </div>
              </div>
            </div>
          </div>
          
          <div class="chat-input">
            <el-input
              v-model="messageText"
              placeholder="请输入消息"
              :disabled="!chatStore.connected"
              @keyup.enter="sendMessage"
            >
              <template #append>
                <el-button 
                  type="primary" 
                  :disabled="!messageText || !chatStore.connected"
                  @click="sendMessage"
                >
                  发送
                </el-button>
              </template>
            </el-input>
          </div>
        </template>
      </el-main>
    </el-container>
  </div>

  <!-- 备注对话框 -->
  <el-dialog
    v-model="noteDialogVisible"
    title="添加备注"
    width="30%"
  >
    <el-input
      v-model="noteInput"
      type="textarea"
      :rows="4"
      placeholder="请输入备注信息"
    ></el-input>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="noteDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="saveNote">保存</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref, onMounted, onUnmounted, nextTick, watch, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useChatStore } from '../store/chat'
import { useAdminStore } from '../store/admin'
import { ElMessage, ElMessageBox } from 'element-plus'

const router = useRouter()
const chatStore = useChatStore()
const adminStore = useAdminStore()

const messageText = ref('')
const messagesContainer = ref(null)
const searchQuery = ref('')
const showNoteDialog = ref(false)
const noteText = ref('')
const selectedChatId = ref(null)

const activeUserId = computed(() => {
  return chatStore.currentUser ? chatStore.currentUser.id.toString() : ''
})

// 过滤用户列表
const filteredUsers = computed(() => {
  if (!searchQuery.value) {
    // 如果没有搜索查询，显示所有用户
    return chatStore.allUsers.length > 0 ? chatStore.allUsers : chatStore.activeUsers
  }
  
  // 否则过滤用户
  const query = searchQuery.value.toLowerCase()
  return chatStore.allUsers.filter(user => 
    user.username.toLowerCase().includes(query) || 
    (user.email && user.email.toLowerCase().includes(query))
  )
})

// 检查用户是否在线
const isUserActive = (userId) => {
  return chatStore.activeUsers.some(user => user.id === userId)
}

// 格式化时间
const formatTime = (timestamp) => {
  const date = new Date(timestamp)
  return `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`
}

// 搜索用户
const searchUsers = () => {
  if (searchQuery.value) {
    chatStore.fetchChatList(searchQuery.value)
  } else {
    chatStore.fetchAllUsers()
  }
}

// 刷新用户列表
const refreshUsers = async () => {
  await chatStore.fetchActiveUsers()
  await chatStore.fetchAllUsers()
  await chatStore.fetchChatList()
}

// 选择用户
const selectUser = (user) => {
  chatStore.selectUser(user)
  
  // 查找对应的聊天
  const chat = chatStore.chatList.find(c => c.user_id === user.id)
  if (chat) {
    selectedChatId.value = chat.id
    noteText.value = chat.note || ''
  } else {
    selectedChatId.value = null
    noteText.value = ''
  }
}

// 打开备注对话框
const openNoteDialog = () => {
  if (!chatStore.currentUser) return
  
  const chat = chatStore.chatList.find(c => c.user_id === chatStore.currentUser.id)
  if (chat) {
    selectedChatId.value = chat.id
    noteText.value = chat.note || ''
    showNoteDialog.value = true
  } else {
    ElMessage.warning('请先与该用户建立聊天')
  }
}

// 保存备注
const saveNote = async () => {
  if (!selectedChatId.value) return
  
  const success = await chatStore.updateChatNote(selectedChatId.value, noteText.value)
  if (success) {
    ElMessage.success('备注已保存')
    showNoteDialog.value = false
  } else {
    ElMessage.error('保存备注失败')
  }
}

// 撤回消息
const recallMessage = (message) => {
  if (!message.is_from_user) {
    ElMessageBox.confirm('确定要撤回这条消息吗?', '撤回消息', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }).then(() => {
      chatStore.recallMessage(message.id)
    }).catch(() => {})
  }
}

// 发送消息
const sendMessage = () => {
  if (!messageText.value || !chatStore.connected) return
  
  chatStore.sendMessage(messageText.value)
  messageText.value = ''
  
  // 滚动到底部
  scrollToBottom()
}

// 滚动到底部
const scrollToBottom = () => {
  nextTick(() => {
    if (messagesContainer.value) {
      messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
    }
  })
}

// 退出登录
const handleLogout = () => {
  adminStore.logout()
  chatStore.disconnect()
  chatStore.clearMessages()
  router.push('/')
}

// 监听消息变化，自动滚动到底部
watch(() => chatStore.messages.length, () => {
  scrollToBottom()
})

onMounted(async () => {
  // 获取管理员信息
  if (!adminStore.admin) {
    await adminStore.fetchAdminInfo()
  }
  
  // 获取用户列表和聊天列表
  await chatStore.fetchActiveUsers()
  await chatStore.fetchAllUsers()
  await chatStore.fetchChatList()
  
  // 连接WebSocket
  chatStore.connectWebSocket()
})

onUnmounted(() => {
  // 断开WebSocket连接
  chatStore.disconnect()
})
</script>

<style scoped>
.dashboard-container {
  height: 100vh;
}

.user-list-container {
  border-right: 1px solid #e6e6e6;
  display: flex;
  flex-direction: column;
  height: 100%;
}

.header {
  padding: 15px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #e6e6e6;
}

.user-list {
  flex: 1;
  overflow-y: auto;
}

.user-item {
  display: flex;
  align-items: center;
}

.user-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: #409EFF;
  color: white;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-right: 10px;
}

.user-info {
  display: flex;
  flex-direction: column;
}

.user-name {
  font-weight: bold;
}

.user-status {
  font-size: 12px;
  color: #67C23A;
}

.admin-info {
  padding: 15px;
  border-top: 1px solid #e6e6e6;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.admin-name {
  font-weight: bold;
}

.chat-container {
  padding: 0;
  display: flex;
  flex-direction: column;
  height: 100%;
}

.empty-chat, .empty-users, .empty-messages {
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #909399;
}

.chat-header {
  padding: 15px;
  border-bottom: 1px solid #e6e6e6;
}

.chat-messages {
  flex: 1;
  overflow-y: auto;
  padding: 15px;
  background-color: #f5f7fa;
}

.message-list {
  display: flex;
  flex-direction: column;
}

.message-item {
  max-width: 70%;
  margin-bottom: 15px;
  display: flex;
  flex-direction: column;
}

.message-user {
  align-self: flex-start;
}

.message-admin {
  align-self: flex-end;
}

.message-content {
  padding: 10px 12px;
  border-radius: 8px;
  word-break: break-word;
  line-height: 1.4;
  cursor: pointer;
}

.message-recalled {
  padding: 10px 12px;
  border-radius: 8px;
  word-break: break-word;
  line-height: 1.4;
  color: #999;
  font-style: italic;
}

.message-user .message-content {
  background-color: white;
  color: #303133;
  border-top-left-radius: 0;
}

.message-admin .message-content {
  background-color: #409EFF;
  color: white;
  border-top-right-radius: 0;
}

.message-time {
  font-size: 12px;
  color: #909399;
  margin-top: 4px;
}

.chat-header-title {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.chat-note {
  margin-top: 8px;
  padding: 8px;
  background-color: #f9f9f9;
  border-radius: 4px;
  font-size: 14px;
  color: #666;
}

.message-user .message-time {
  align-self: flex-start;
  margin-left: 4px;
}

.message-admin .message-time {
  align-self: flex-end;
  margin-right: 4px;
}

.chat-input {
  padding: 15px;
  background-color: white;
  border-top: 1px solid #e6e6e6;
}
</style>