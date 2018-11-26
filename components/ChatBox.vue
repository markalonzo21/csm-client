<template>
  <div class="my-4 chatbox">
    <div
      class="chatbody border w-full bg-white relative overflow-y-auto"
      style="height: 350px; max-height: 350px;"
      ref="messagesContainer"
    >
      <div  class="text-center">
        Chatbox
      </div>
      <ChatBoxMessage  v-for="(message, index) in messages" :key="`${index}-${message._id}`" :message="message" />
    </div>
    <form class="input-group" @submit.prevent="sendMessage">
      <input type="text" class="form-control" v-model="message" :disabled="isResolved || loadingSendMessage">
      <div class="input-group-btn">
        <button type="submit" class="btn btnblue" :disabled="isResolved || loadingSendMessage">{{ loadingSendMessage ? 'Sending...' : 'Send' }}</button>
      </div>
    </form>
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
          this.addMessage(message)
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
          // this.addMessage(response.data)
        })
        .catch(error => {
          this.loadingSendMessage = false
        })
    }
  }
}
</script>

