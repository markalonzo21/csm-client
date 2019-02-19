<template>
  <div>
    <div
      :class="isSender ? 'me' : 'chatmate'"
      class
      v-if="!message.isSystemMessage"
    >
      <p class="basic">
        <strong class="capitalize">{{ message.sentAs }}:&nbsp;</strong>
        {{ message.content }}
      </p>
    </div>
    <div
      class="text-center"
      v-else
    >
      <p class="basic">{{ message.user.email }} {{ message.content.toLowerCase() }}</p>
    </div>
    <div class="clearfix"></div>
  </div>
</template>

<script>
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
