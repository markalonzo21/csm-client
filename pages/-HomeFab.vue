<template>
  <div class="actionbtn z-10">
    <div class="forreport mb10">
      <a class="cursor-pointer btn text-uppercase" @click.prevent="reportNow">Report now!</a>
    </div>
    <div class="forreg" v-if="!$store.state.auth.loggedIn">
      <a class="cursor-pointer btn text-uppercase" @click.prevent="registerNow">Register now!</a>
    </div>
  </div>
</template>

<script>
export default {
  methods: {
    reportNow() {
      if (!this.$store.state.auth.loggedIn) {
        this.$store.commit('TOGGLE_LOGIN_MODAL')
        return
      }
      this.$router.push('/new-report')
    },
    registerNow() {
      if (!this.$store.state.auth.loggedIn) {
        this.$store.commit('TOGGLE_REGISTRATION_MODAL')
      }
    }
  }
}
</script>

<style scoped>
.actionbtn {
  position: fixed;
  bottom: 121px;
  right: 0;
}
</style>
