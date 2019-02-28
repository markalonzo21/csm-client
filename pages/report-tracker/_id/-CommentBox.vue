<template>
  <div
    class="panel panel-comment"
    style="margin-bottom: 0;"
  >
    <div
      class="panel-body"
      ref="messagesContainer"
    >
      <CommentBoxMessage
        :key="`message-${message._id}`"
        :message="message"
        v-for="message in messages"
      />
      <div v-if="!loadingGetMessages && messages.length === 0">No Messages...</div>
    </div>
    <div class="panel-footer mt10">
      <form
        @submit.prevent="sendMessage"
        class="input-group"
      >
        <input
          :disabled="report.resolvedAt !== null"
          class="form-control"
          placeholder="Write something here ..."
          ref="chatMessageInput"
          type="text"
          v-model="message"
        >
        <div class="input-group-btn">
          <button
            :disabled="report.resolvedAt !== null || loadingSendMessage"
            class="btn bluelabel text-uppercase"
            type="submit"
          >{{ loadingSendMessage ? 'Sending...' : 'Send' }}</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import CommentBoxMessage from "~/components/CommentBoxMessage";

export default {
  props: {
    report: {
      type: Object,
      default: () => null
    },
    role: {
      type: String,
      default: "User"
    }
  },
  components: {
    CommentBoxMessage
  },
  data() {
    return {
      loadingSendMessage: false,
      loadingGetMessages: true,
      messages: [],
      message: ""
    };
  },
  mounted() {
    this.initSocketListeners();
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
    initSocketListeners() {
      this.$socket.on("new-message", message => {
        if (message.report === this.report._id) {
          this.addMessage(message);
        }
      });
    },
    getMessages() {
      this.loadingGetMessages = true;
      this.$axios
        .$get(`/messages?reportId=${this.report._id}`)
        .then(response => {
          this.messages = response.data;
          this.loadingGetMessages = false;
        });
    },
    addMessage(newMessage) {
      this.$nextTick(() => {
        const alreadyExists = this.messages.some(message => {
          return message._id.toString() === newMessage._id.toString();
        });
        // console.log(alreadyExists);

        if (alreadyExists) {
          this.loadingSendMessage = false;
          return;
        }

        this.messages.push(newMessage);
        this.loadingSendMessage = false;
      });
    },
    sendMessage() {
      if (this.message.trim().length === 0) {
        return;
      }

      this.loadingSendMessage = true;
      this.$axios
        .$post("/messages", {
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

<style scoped>
.panel-body {
  min-height: 300px;
  max-height: 300px;
  overflow-y: auto;
}
.panel-body::-webkit-scrollbar-track {
  -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
  border-radius: 10px;
  background-color: #f5f5f5;
}

.panel-body::-webkit-scrollbar {
  width: 8px;
  background-color: #f5f5f5;
}

.panel-body::-webkit-scrollbar-thumb {
  border-radius: 10px;
  -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
  background-color: #555;
}

.panel-footer {
  margin-top: 10px;
  background-color: #fff;
}
.bluelabel {
  color: #34c3e5;
  font-weight: 700;
}
.tiny {
  color: #ccc;
}
</style>
