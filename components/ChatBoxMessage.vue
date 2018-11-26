<template>
  <div>
  <div class="me" :class="isSender ? 'me' : 'chatmate'">
    <p class="basic"><strong v-if="!isSender">{{ message.user.role.name }}:&nbsp;</strong> {{ message.content }}</p>
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
      isSender () {
        return this.message.user._id === this.$auth.user._id
      }
    },
  }
</script>
