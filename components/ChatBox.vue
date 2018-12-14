<template>
  <div class="panel chatbox" :class="{ expanded: showChat }">
    <div class="panel-heading bgblue" @click="showChat = !showChat">
      <div class="float-left text-white my-2">Chatbox: {{ reportId }}</div>
      <span class="pull-right"></span>
    </div>
    <div class="panel-body chatbody overflow-y-auto" ref="messagesContainer">
      <ChatBoxMessage  v-for="(message, index) in messages" :key="`${index}-${message._id}`" :message="message" />
    </div>
    <div class="panel-footer">
      <form class="input-group" @submit.prevent="sendMessage">
      <input type="text" ref="chatMessageInput" class="form-control" placeholder="Write something here ..." v-model="message" :disabled="isResolved">
      <div class="input-group-btn">
        <button type="submit" class="btn chatsubmit text-uppercase" :disabled="isResolved || loadingSendMessage">{{ loadingSendMessage ? 'Sending...' : 'Send' }}</button>
      </div>
    </form>
    </div>
  </div>
</template>

<script>

import ChatBoxMessage from './ChatBoxMessage'

export default {
  props: ['reportId', 'isResolved'],
  components: {
    ChatBoxMessage
  },
  data() {
    return {
      showChat: true,
      loadingSendMessage: false,
      messages: [],
      message: ''
    }
  },
  mounted() {
    this.getMessages()
  },
  beforeDestroy() {
    this.$socket.off('new-message')
  },
  watch: {
    messages () {
      this.$nextTick(() => {
        const ul = this.$refs.messagesContainer
        ul.scrollTop = ul.scrollHeight
      })
    }
  },
  methods: {
    getMessages() {
      this.$axios.$get(`/messages?reportId=${this.reportId}`).then(response => {
        this.$socket.on('new-message', message => {
          if (message.report === this.reportId) {
            this.addMessage(message)
          }
        })
        this.messages = response.data
      })
    },
    addMessage(message) {
      this.$nextTick(() => {
        const alreadyExists = this.messages.find(
          item => item._id === message._id
        )

        if (alreadyExists) {
          this.loadingSendMessage = false
          return
        }


        setTimeout(() => {
          this.messages.push(message)
          this.loadingSendMessage = false
        }, 500)
      })
    },
    sendMessage() {
      if (this.message.trim().length === 0) {
        return
      }

      this.loadingSendMessage = true
      this.$axios
        .$post('/messages', {
          content: this.message,
          reportId: this.reportId
        })
        .then(response => {
          this.message = ''
        })
        .catch(error => {
          this.loadingSendMessage = false
        })
    }
  }
}
</script>

