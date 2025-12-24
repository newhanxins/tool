<template>
  <div class="chat-list-container">
    <van-nav-bar
      title="聊天列表"
      right-text="刷新"
      @click-right="refreshChats"
    />
    
    <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
      <van-empty v-if="chatStore.chatList.length === 0" description="暂无聊天记录" />
      
      <van-swipe-cell v-for="chat in chatStore.chatList" :key="chat.id">
        <van-cell 
          :class="['chat-item', { 'chat-pinned': chat.is_pinned }]"
          @click="enterChat(chat)"
        >
          <template #title>
            <div class="chat-title">
              <span>客服</span>
              <van-tag v-if="chat.unread_count > 0" type="danger" round>{{ chat.unread_count }}</van-tag>
            </div>
          </template>
          <template #label>
            <div class="chat-preview">{{ chat.last_message }}</div>
            <div class="chat-time">{{ formatTime(chat.last_message_time) }}</div>
          </template>
        </van-cell>
        
        <template #right>
          <van-button 
            square 
            type="primary" 
            class="pin-button" 
            @click="togglePin(chat)"
          >
            {{ chat.is_pinned ? '取消置顶' : '置顶' }}
          </van-button>
          <van-button 
            square 
            type="danger" 
            class="delete-button" 
            @click="deleteChat(chat)"
          >
            删除
          </van-button>
        </template>
      </van-swipe-cell>
    </van-pull-refresh>
    
    <div class="bottom-bar">
      <van-button type="primary" block @click="startNewChat">开始新对话</van-button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useChatStore } from '../store/chat'
import { useUserStore } from '../store/user'
import { Toast } from 'vant'

const router = useRouter()
const chatStore = useChatStore()
const userStore = useUserStore()
const refreshing = ref(false)

// 格式化时间
const formatTime = (timestamp) => {
  if (!timestamp) return ''
  const date = new Date(timestamp)
  const now = new Date()
  
  // 如果是今天的消息，只显示时间
  if (date.toDateString() === now.toDateString()) {
    return `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`
  }
  
  // 如果是昨天的消息
  const yesterday = new Date(now)
  yesterday.setDate(now.getDate() - 1)
  if (date.toDateString() === yesterday.toDateString()) {
    return '昨天'
  }
  
  // 其他日期显示月日
  return `${date.getMonth() + 1}月${date.getDate()}日`
}

// 刷新聊天列表
const refreshChats = async () => {
  await chatStore.fetchChatList()
  Toast.success('刷新成功')
}

// 下拉刷新
const onRefresh = async () => {
  await chatStore.fetchChatList()
  refreshing.value = false
}

// 进入聊天
const enterChat = (chat) => {
  chatStore.currentChatId = chat.id
  router.push('/chat')
}

// 开始新对话
const startNewChat = () => {
  chatStore.currentChatId = null
  router.push('/chat')
}

// 置顶/取消置顶
const togglePin = async (chat) => {
  await chatStore.updateChat(chat.id, { is_pinned: !chat.is_pinned })
  Toast.success(chat.is_pinned ? '已取消置顶' : '已置顶')
}

// 删除聊天
const deleteChat = async (chat) => {
  await chatStore.updateChat(chat.id, { is_deleted: true })
  Toast.success('已删除')
  await chatStore.fetchChatList()
}

onMounted(async () => {
  // 检查登录状态
  if (!userStore.isLoggedIn) {
    router.push('/login')
    return
  }
  
  // 获取聊天列表
  await chatStore.fetchChatList()
})
</script>

<style scoped>
.chat-list-container {
  height: 100vh;
  display: flex;
  flex-direction: column;
}

.chat-item {
  position: relative;
}

.chat-pinned {
  background-color: #f7f8fa;
}

.chat-pinned::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 4px;
  height: 100%;
  background-color: #1989fa;
}

.chat-title {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.chat-preview {
  color: #646566;
  font-size: 13px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  max-width: 80%;
}

.chat-time {
  position: absolute;
  top: 16px;
  right: 16px;
  font-size: 12px;
  color: #969799;
}

.pin-button, .delete-button {
  height: 100%;
}

.pin-button {
  width: 80px;
}

.delete-button {
  width: 60px;
}

.bottom-bar {
  padding: 16px;
  background-color: #fff;
  border-top: 1px solid #ebedf0;
}
</style>