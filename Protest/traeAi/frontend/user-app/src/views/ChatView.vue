<template>
  <div class="chat-container">
    <div class="chat-header">
      <van-nav-bar
        title="客服聊天"
        left-text="返回"
        left-arrow
        @click-left="goBack"
      >
        <template #right>
          <van-popover
            v-model:show="showActions"
            placement="bottom-end"
            :actions="actions"
            @select="onActionSelect"
          >
            <template #reference>
              <van-icon name="ellipsis" size="24" />
            </template>
          </van-popover>
        </template>
      </van-nav-bar>
    </div>
    
    <div class="chat-messages" ref="messagesContainer">
      <div v-if="loading" class="loading-messages">
        <van-loading type="spinner" />
      </div>
      <div v-else-if="error" class="error-messages">
        {{ error }}
      </div>
      <template v-else>
        <div 
          v-for="(message, index) in messages" 
          :key="message.id || index" 
          :class="['message', message.is_from_user ? 'user-message' : 'admin-message']"
          @contextmenu.prevent="showMessageActions(message)"
        >
          <div v-if="message.is_recalled" class="message-recalled">
            <van-icon name="close" /> 消息已撤回
          </div>
          <template v-else>
            <!-- 文本消息 -->
            <div v-if="message.message_type === 'TEXT'" class="message-content">
              <span v-if="message.mentioned_user_id" class="mention">@管理员 </span>
              {{ message.content }}
            </div>
            
            <!-- 图片消息 -->
            <div v-else-if="message.message_type === 'IMAGE'" class="message-media">
              <img :src="message.media_url" @click="previewImage(message.media_url)" />
            </div>
            
            <!-- 视频消息 -->
            <div v-else-if="message.message_type === 'VIDEO'" class="message-media">
              <video controls :src="message.media_url"></video>
            </div>
          </template>
          
          <div class="message-footer">
            <span class="message-time">{{ formatTime(message.created_at) }}</span>
            <span v-if="message.is_from_user && message.status" class="message-status">
              {{ messageStatusText[message.status] || '' }}
            </span>
          </div>
        </div>
      </template>
    </div>
    
    <div class="chat-input">
      <van-field
        v-model="newMessage"
        placeholder="输入消息..."
        :disabled="!connected"
        @keypress.enter="sendMessage"
      >
        <template #button>
          <van-button 
            icon="smile-o" 
            @click="showMediaOptions = true"
          />
        </template>
      </van-field>
      <van-button 
        type="primary" 
        @click="sendMessage" 
        :disabled="!connected || !newMessage.trim()"
      >
        发送
      </van-button>
    </div>
    
    <!-- 媒体选项弹出层 -->
    <van-action-sheet
      v-model:show="showMediaOptions"
      :actions="mediaActions"
      @select="onMediaActionSelect"
      cancel-text="取消"
    />
    
    <!-- 消息操作弹出层 -->
    <van-action-sheet
      v-model:show="showMessageMenu"
      :actions="messageActions"
      @select="onMessageActionSelect"
      cancel-text="取消"
    />
    
    <!-- 图片预览 -->
    <van-image-preview
      v-model:show="showImagePreview"
      :images="[previewImageUrl]"
      v-if="previewImageUrl"
    />
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, nextTick, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useChatStore } from '../store/chat'
import { useUserStore } from '../store/user'
import { Toast } from 'vant'

const router = useRouter()
const chatStore = useChatStore()
const userStore = useUserStore()

const messageText = ref('')
const messagesContainer = ref(null)
const refreshing = ref(false)

// 格式化时间
const formatTime = (timestamp) => {
  const date = new Date(timestamp)
  return `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`
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

// 下拉刷新
const onRefresh = async () => {
  await chatStore.fetchHistory()
  refreshing.value = false
}

// 返回处理
const handleBack = () => {
  userStore.logout()
  chatStore.disconnect()
  chatStore.clearMessages()
  router.push('/')
}

// 监听消息变化，自动滚动到底部
watch(() => chatStore.messages.length, () => {
  scrollToBottom()
})

onMounted(async () => {
  // 获取历史消息
  await chatStore.fetchHistory()
  
  // 连接WebSocket
  chatStore.connectWebSocket()
  
  // 滚动到底部
  scrollToBottom()
})

onUnmounted(() => {
  // 断开WebSocket连接
  chatStore.disconnect()
})
</script>

<style scoped>
.chat-container {
  height: 100vh;
  display: flex;
  flex-direction: column;
}

.chat-messages {
  flex: 1;
  overflow-y: auto;
  padding: 10px;
  background-color: #f7f8fa;
}

.empty-messages {
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #969799;
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
  align-self: flex-end;
}

.message-cs {
  align-self: flex-start;
}

.message-content {
  padding: 10px 12px;
  border-radius: 8px;
  word-break: break-word;
  line-height: 1.4;
}

.message-user .message-content {
  background-color: #07c160;
  color: white;
  border-top-right-radius: 0;
}

.message-cs .message-content {
  background-color: white;
  color: #323233;
  border-top-left-radius: 0;
}

.message-time {
  font-size: 12px;
  color: #969799;
  margin-top: 4px;
  align-self: flex-end;
}

.message-user .message-time {
  margin-right: 4px;
}

.message-cs .message-time {
  align-self: flex-start;
  margin-left: 4px;
}

.chat-input {
  padding: 10px;
  background-color: white;
  border-top: 1px solid #ebedf0;
}
</style>