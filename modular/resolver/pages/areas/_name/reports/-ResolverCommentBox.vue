<template>
  <div
    class="panel panel-comment"
    style="margin-bottom: 0;"
  >
    <CannedResponseModal
      :cannedResponses="cannedResponses"
      :loadingCannedResponses="loadingCannedResponses"
      :showCannedResponses="showCannedResponses"
      @closeModal="showCannedResponses = false"
      @responseSelected="responseSelected"
      v-if="showCannedResponses"
    />
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
        <a-textarea
          :autosize="{ minRows: 2, maxRows: 12 }"
          :disabled="report.resolvedAt !== null || loadingGetMessages"
          @pressEnter="enterIsPressed"
          class="form-control"
          placeholder="Write something here ..."
          ref="chatMessageInput"
          type="text"
          v-model="message"
        />
        <div class="input-group-btn">
          <button
            :disabled="report.resolvedAt !== null || loadingSendMessage || loadingGetMessages"
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
import CannedResponseModal from "./-CannedResponseModal";

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
    CommentBoxMessage,
    CannedResponseModal
  },
  data() {
    return {
      loadingSendMessage: false,
      loadingGetMessages: true,
      loadingCannedResponses: false,
      showCannedResponses: false,
      messages: [],
      cannedResponses: [],
      message: ""
    };
  },
  mounted() {
    this.initSocketListeners();
    this.getMessages();
    this.getCannedResponses();
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
        .$get(`/resolver/messages?reportId=${this.report._id}`)
        .then(response => {
          this.messages = response.data;
          this.loadingGetMessages = false;
        });
    },
    getCannedResponses() {
      this.loadingCannedResponses = true;
      this.$axios.$get("/resolver/canned-responses").then(response => {
        this.cannedResponses = response.data;
        this.loadingCannedResponses = false;
      });
    },
    addMessage(newMessage) {
      this.$nextTick(() => {
        const alreadyExists = this.messages.some(message => {
          return message._id.toString() === newMessage._id.toString();
        });

        if (alreadyExists) {
          this.loadingSendMessage = false;
          return;
        }

        this.messages.push(newMessage);
        this.loadingSendMessage = false;
      });
    },
    responseSelected(content) {
      this.showCannedResponses = false;
      this.message = content;
    },
    enterIsPressed(event) {
      if (!event.shiftKey) {
        this.sendMessage();
      }
    },
    sendMessage() {
      if (this.message.trim().length === 0) {
        this.showCannedResponses = true;
        return;
      }

      let sentTo = prompt(
        "Input the number to select where to send. \n [1] Reporter [2] Responder"
      );

      if (sentTo != "1" && sentTo != "2") {
        alert("Input is invalid!");
        return;
      }

      if (sentTo == "1") {
        sentTo = "user";
      } else {
        sentTo = "responder";
      }

      this.loadingSendMessage = true;
      this.$axios
        .$post("/resolver/messages", {
          content: this.message,
          reportId: this.report._id,
          sentTo: sentTo
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

