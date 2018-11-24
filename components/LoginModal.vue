<template>
  <modal v-model="loginModal" size="sm" :footer="false" class="login text-center">
    <span slot="title">Insert Logo</span>
    <form @submit.prevent="login" class="">
      <input type="text" class="form-control mb10" placeholder="Email" v-model="form.email">
      <input
        type="password"
        class="form-control mb10"
        placeholder="Enter Password"
        v-model="form.password"
      >
      <small>
        <a class="tiny pull-right mb10" href="#">Forgot password</a>
      </small>
      <button
        type="submit"
        class="btn btnblue w-100 text-uppercase"
        :disabled="loading"
      >{{ loading ? "Logging in..." : "Sign In" }}</button>
    </form>
  </modal>
</template>

<script>
export default {
  computed: {
    loginModal: {
      get() {
        return this.$store.state.modals.login
      },
      set() {
        return this.$store.commit('TOGGLE_LOGIN_MODAL')
      }
    }
  },
  data() {
    return {
      loading: false,
      form: {
        email: 'reporter1@gmail.com',
        password: '123123123'
      }
    }
  },
  methods: {
    login() {
      this.loading = true
      this.$auth
        .loginWith('local', {
          data: {
            email: this.form.email,
            password: this.form.password
          }
        })
        .then(response => {
          this.$nextTick(() => {
            this.$store.commit('TOGGLE_LOGIN_MODAL')
            this.loading = false
            this.socketConnect()

            // window.location.reload()
          })
        })
        .catch(errors => {
          this.loading = false
        })
    },
    socketConnect() {
      this.$socket.query.token = localStorage
        .getItem('auth._token.local')
        .replace('Bearer ', '')
      this.$socket.connect()
    }
  }
}
</script>
