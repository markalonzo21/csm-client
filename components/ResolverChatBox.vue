<template>
  <div
    :class="{ expanded: showChat }"
    class="panel chatbox"
  >
    <div class="panel-heading bgblue">
      <!-- <div class="text-center text-white my-2">Chatbox: {{ reportId }}</div> -->
      <button
        :class="[ activeType === 'responder' ? 'btngreen' : 'btnblue']"
        @click.prevent="switchType('responder')"
        class="btn"
        v-if="showChat"
      >Responder</button>
      <button
        :class="[ activeType === 'user' ? 'btngreen' : 'btnblue']"
        @click.prevent="switchType('user')"
        class="btn"
        v-if="showChat"
      >Reporter</button>
      <div
        @click.prevent="showChat = !showChat"
        class="float-right text-white cursor-pointer select-none"
      >{{ showChat ? 'Hide' : 'Show' }}</div>
      <!-- <span class="pull-right"></span> -->
    </div>
    <div
      class="panel-body chatbody overflow-y-auto"
      ref="messagesContainer"
    >
      <div v-if="loadingGetMessages">Loading messages...</div>
      <template v-else-if="activeType === 'responder'">
        <ResolverChatBoxMessage
          :key="`${index}-${message._id}`"
          :message="message"
          v-for="(message, index) in responderMessages"
        />
      </template>

      <template v-else-if="activeType === 'user'">
        <ResolverChatBoxMessage
          :key="`${index}-${message._id}`"
          :message="message"
          v-for="(message, index) in userMessages"
        />
      </template>
    </div>
    <div class="panel-footer">
      <form
        @submit.prevent="sendMessage"
        class="input-group"
      >
        <input
          :disabled="isResolved"
          class="form-control"
          placeholder="Write something here ..."
          ref="chatMessageInput"
          type="text"
          v-model="message"
        >
        <div class="input-group-btn">
          <button
            :disabled="isResolved || loadingSendMessage"
            class="btn chatsubmit text-uppercase"
            type="submit"
          >{{ loadingSendMessage ? 'Sending...' : 'Send' }}</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import ResolverChatBoxMessage from "./ResolverChatBoxMessage";

export default {
  props: ["reportId", "isResolved"],
  components: {
    ResolverChatBoxMessage
  },
  data() {
    return {
      showChat: true,
      activeType: "user",
      loadingSendMessage: false,
      loadingGetMessages: true,
      responderMessages: [],
      userMessages: [],
      message: ""
    };
  },
  mounted() {
    this.getMessages();
    this.initSocketListener();
  },
  beforeDestroy() {
    this.$socket.off("new-message");
  },
  methods: {
    initSocketListener() {
      this.$socket.on("new-message", message => {
        if (message.report == this.reportId) {
          if (this.messageIsFromUser(message)) {
            const messageExists = this.userMessages.some(
              item => item._id == message._id
            );
            // console.log(messageExists)
            if (messageExists) {
              return;
            }
            this.userMessages.push(message);
          }
          if (this.messageIsFromResponder(message)) {
            const messageExists = this.responderMessages.some(
              item => item._id == message._id
            );
            if (messageExists) {
              return;
            }
            this.responderMessages.push(message);
          }
        }
      });
    },
    switchType(type) {
      this.activeType = type;
      this.scrollToBottom();
    },
    getMessages() {
      this.loadingGetMessages = true;
      this.$axios
        .$get(`/resolver/messages?reportId=${this.reportId}`)
        .then(response => {
          this.userMessages = response.data.filter(message =>
            this.messageIsFromUser(message)
          );
          this.responderMessages = response.data.filter(message =>
            this.messageIsFromResponder(message)
          );
          this.scrollToBottom();
          this.loadingGetMessages = false;
        });
    },
    messageIsFromUser(message) {
      if (message.sentTo === "user" && message.sentAs === "resolver") {
        return true;
      }

      if (message.sentAs === "user" && message.sentTo === "resolver") {
        return true;
      }

      return false;
    },
    messageIsFromResponder(message) {
      if (message.sentTo === "responder" && message.sentAs === "resolver") {
        return true;
      }

      if (message.sentAs === "responder" && message.sentTo === "resolver") {
        return true;
      }

      return false;
    },
    scrollToBottom() {
      this.$nextTick(() => {
        const ul = this.$refs.messagesContainer;
        ul.scrollTop = ul.scrollHeight;
      });
    },
    sendMessage() {
      if (this.message.trim().length === 0) {
        return;
      }

      this.loadingSendMessage = true;
      this.$axios
        .$post("/resolver/messages", {
          content: this.message,
          reportId: this.reportId,
          sentTo: this.activeType
        })
        .then(response => {
          // this.pushMessage(response.data);
          this.message = "";
          this.loadingSendMessage = false;
          this.scrollToBottom();
        })
        .catch(error => {
          this.loadingSendMessage = false;
        });
    },
    pushMessage(message) {
      if (this.messageIsFromUser(message)) {
        this.userMessages.push(message);
      }
      if (this.messageIsFromResponder(message)) {
        this.responderMessages.push(message);
      }
    }
  }
};
</script>
