<template>
  <div class="my-4">
    <div
      class="border w-full bg-white relative overflow-y-scroll"
      style="height: 350px; max-height: 350px;"
    >
      <div class="m-2 border p-4" v-for="message in messages" :key="message._id">
        <strong>{{ message.user.role.name }}: &nbsp;</strong>
        {{ message.content }}
      </div>
    </div>
    <form class="input-group" @submit.prevent="sendMessage">
      <input type="text" class="form-control" v-model="message" :disabled="isResolved">
      <div class="input-group-btn">
        <button type="submit" class="btn btn-default" :disabled="isResolved">Send</button>
      </div>
    </form>
  </div>
</template>

<script>
export default {
  props: ['reportId', 'isResolved'],
  data() {
    return {
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
          return
        }

        this.messages.push(message)
      })
    },
    sendMessage() {
      this.$axios
        .$post('/messages', {
          content: this.message,
          reportId: this.reportId
        })
        .then(response => {
          this.message = ''
          this.addMessage(response.data)
        })
        .catch(error => {
          console.log(error)
        })
    }
  }
}
</script>

