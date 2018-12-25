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
      const isResolver = this.$route.path.includes("resolver");
      return this.message.sentAs === "resolver" && isResolver;
    }
  }
};
</script>
