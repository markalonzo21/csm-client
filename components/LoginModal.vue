<template>
  <modal v-model="loginModal" size="sm" :footer="false" class="login text-center mt-32">
    <span slot="title">
      <img src="/img/megaworld-logo.png" alt="" class="img-responsive mrgnauto">
    </span>
    <form @submit.prevent="login" class="">
      <input type="text" class="form-control mb20" placeholder="Email" v-model="form.email">
      <input
        type="password"
        class="form-control mb20"
        placeholder="Enter Password"
        v-model="form.password"
      >
      <small>
        <a class="tiny pull-right mb20" href="#">Forgot password</a>
      </small>
      <div class="clearfix"></div>
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
          this.loading = false

          // this.$store.commit('auth/SET_USER', response.data.user)
          // this.socketConnect()

          if (this.$store.getters['auth/canAccessCommandCenter']) {
            window.location.href = `/command-center`
            // this.$router.push('/command-center')
          } else {
            window.location.href = `/${this.$auth.user.role.slug.replace(
              'istrator',
              ''
            )}`
            // this.$router.replace(
            //   `/${this.$auth.user.role.slug.replace('istrator', '')}`
            // )
          }
          // this.$store.commit('TOGGLE_LOGIN_MODAL')
        })
        .catch(errors => {
          alert("Invalid Credentials!")
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
