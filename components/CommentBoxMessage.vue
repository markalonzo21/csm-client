<template>
  <div class="comment-item">
    <!-- <div class="avatar">
      <a href="#">
        <img
          alt="avatar"
          class="media-object"
          src="/img/avatar.jpg"
        >
      </a>
    </div>-->
    <div
      class="media-body text-center"
      v-if="message.isSystemMessage"
    >
      <a-tooltip :title="$moment(message.createdAt).format('MMM. DD, YYYY | h:mm A ')">
        <strong class="basic">{{ message.user.email }} {{ message.content.toLowerCase() }}</strong>
      </a-tooltip>
    </div>
    <div
      class="media-body"
      v-else
    >
      <label class="label-name pull-left">
        {{ message.user.firstName }} {{ message.user.middleName }} {{ message.user.lastName }}
        <small>({{ message.sentAs === 'user' ? 'reporter' : message.sentAs }} to {{ message.sentTo === 'user' ? 'reporter' : message.sentTo }})</small>:
      </label>
      <span class="tiny pull-right">{{ $moment(message.createdAt).fromNow() }}</span>
      <small
        class="basic"
        style="white-space: pre-wrap;"
      >{{ message.content }}</small>
    </div>
  </div>
</template>

<script>
import Vue from "vue";
import Tooltip from "ant-design-vue/lib/tooltip";
Vue.component(Tooltip.name, Tooltip);
if (process.client) {
  require("ant-design-vue/lib/tooltip/style/css");
}
export default {
  props: {
    message: {
      type: Object,
      required: true
    }
  },
  computed: {
    isSender() {
      const isUser =
        this.$route.path.includes("report-tracker") ||
        this.$route.path.includes("report-history");
      return this.message.sentAs === "user" && isUser;
    }
  }
};
</script>

<style scoped>
.comment-item {
  margin-bottom: 10px;
}
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
.avatar {
  float: left;
  margin-right: 10px;
}
small.basic {
  display: inline-block;
}

.avatar img {
  border-radius: 50%;
  object-fit: cover;
  height: 50px;
  width: 50px;
}

.bluelabel {
  color: #34c3e5;
  font-weight: 700;
}
.tiny {
  color: #ccc;
}
</style>
