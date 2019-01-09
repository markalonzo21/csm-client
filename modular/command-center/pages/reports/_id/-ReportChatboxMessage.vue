<template>
  <div>
    <div class :class="isSender ? 'me' : 'chatmate'">
      <p class="basic">
        <strong v-if="!isSender" class="capitalize">{{ message.sentAs }}:&nbsp;</strong>
        {{ message.content }}
      </p>
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
        this.$route.path.includes('report-tracker') ||
        this.$route.path.includes('report-history')
      return this.message.sentAs === 'user' && isUser
    }
  }
}
</script>
