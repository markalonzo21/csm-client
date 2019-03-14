<template>
  <div class="panel">
    <div class="panel-heading text-white">Chatbox</div>
    <div
      class="panel-body chatbody overflow-y-auto"
      id="chatbox"
      ref="messagesContainer"
      style="max-height: 295px;"
    >
      <div v-if="loadingGetMessages">Loading messages...</div>
      <div v-else-if="messages.length === 0">No messages...</div>
      <ReportChatboxMessage
        :key="`${index}-${message._id}`"
        :message="message"
        v-else
        v-for="(message, index) in messages"
      />
    </div>
    <!-- <div class="panel-footer">
      <form class="input-group" @submit.prevent="sendMessage">
        <input
          type="text"
          ref="chatMessageInput"
          class="form-control"
          placeholder="Write something here ..."
          v-model="message"
          :disabled="report.resolvedAt"
        >
        <div class="input-group-btn">
          <button
            type="submit"
            class="btn chatsubmit text-uppercase"
            :disabled="report.resolvedAt || loadingSendMessage"
          >{{ loadingSendMessage ? 'Sending...' : 'Send' }}</button>
        </div>
      </form>
    </div>-->
  </div>
</template>

<script>
import ReportChatboxMessage from "./-ReportChatboxMessage";

export default {
  props: {
    report: {
      type: Object,
      required: true
    }
  },
  components: {
    ReportChatboxMessage
  },
  data() {
    return {
      showChat: true,
      loadingSendMessage: false,
      loadingGetMessages: true,
      messages: [],
      message: ""
    };
  },
  mounted() {
    this.getMessages();
  },
  beforeDestroy() {
    this.$socket.off("new-message");
  },
  watch: {
    messages() {
      this.$nextTick(() => {
        const ul = this.$refs.messagesContainer;
        ul.scrollTop = ul.scrollHeight;
      });
    }
  },
  methods: {
    getMessages() {
      this.loadingGetMessages = true;
      this.$axios
        .$get(`/api/v1/admin/messages?reportId=${this.report._id}`)
        .then(response => {
          this.messages = response.data;
          this.loadingGetMessages = false;
        });

      this.$socket.on("new-message", message => {
        if (message.report === this.report._id) {
          this.addMessage(message);
        }
      });
    },
    addMessage(message) {
      this.$nextTick(() => {
        const alreadyExists = this.messages.find(
          item => item._id === message._id
        );

        if (alreadyExists) {
          this.loadingSendMessage = false;
          return;
        }

        setTimeout(() => {
          this.messages.push(message);
          this.loadingSendMessage = false;
        }, 500);
      });
    },
    sendMessage() {
      if (this.message.trim().length === 0) {
        return;
      }

      this.loadingSendMessage = true;
      this.$axios
        .$post("/api/v1/admin/messages", {
          content: this.message,
          reportId: this.report._id
        })
        .then(response => {
          this.message = "";
        })
        .catch(error => {
          this.loadingSendMessage = false;
        });
    }
  }
};
</script>

