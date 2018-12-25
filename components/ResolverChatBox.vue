<template>
  <div class="panel chatbox" :class="{ expanded: showChat }">
    <div class="panel-heading bgblue">
      <!-- <div class="text-center text-white my-2">Chatbox: {{ reportId }}</div> -->
      <button
        class="btn"
        :class="[ activeType === 'responder' ? 'btngreen' : 'btnblue']"
        v-if="showChat"
        @click.prevent="switchType('responder')"
      >Responder</button>
      <button
        class="btn"
        :class="[ activeType === 'user' ? 'btngreen' : 'btnblue']"
        v-if="showChat"
        @click.prevent="switchType('user')"
      >Reporter</button>
      <div
        class="float-right text-white cursor-pointer select-none"
        @click.prevent="showChat = !showChat"
      >{{ showChat ? 'Hide' : 'Show' }}</div>
      <!-- <span class="pull-right"></span> -->
    </div>
    <div class="panel-body chatbody overflow-y-auto" ref="messagesContainer">
      <template v-if="activeType === 'responder'">
        <ResolverChatBoxMessage
          v-for="(message, index) in responderMessages"
          :key="`${index}-${message._id}`"
          :message="message"
        />
      </template>

      <template v-if="activeType === 'user'">
        <ResolverChatBoxMessage
          v-for="(message, index) in userMessages"
          :key="`${index}-${message._id}`"
          :message="message"
        />
      </template>
    </div>
    <div class="panel-footer">
      <form class="input-group" @submit.prevent="sendMessage">
        <input
          type="text"
          ref="chatMessageInput"
          class="form-control"
          placeholder="Write something here ..."
          v-model="message"
          :disabled="isResolved"
        >
        <div class="input-group-btn">
          <button
            type="submit"
            class="btn chatsubmit text-uppercase"
            :disabled="isResolved || loadingSendMessage"
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
            console.log(messageExists);
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

