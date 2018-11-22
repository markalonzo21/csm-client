<template>
  <section class="container mx-auto">
    <form @submit.prevent="login" class="p-4 m-4 flex flex-col items-center justify-center">
      <h3>LOGIN PAGE</h3>
      <input type="text" class="my-2 p-2" v-model="form.email" placeholder="Email">
      <input type="password" class="my-2 p-2" v-model="form.password" placeholder="Enter Password">
      <button
        type="submit"
        class="p-2 my-2 border bg-black text-white rounded font-hairline"
        :disabled="loading"
      >{{ loading ? 'Logging in...' : 'Login'}}</button>
    </form>
  </section>
</template>

<script>
export default {
  auth: false,
  layout: 'auth',
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
          this.$router.replace('/')
          this.loading = false
        })
        .catch(errors => {
          this.loading = false
        })
    }
  }
}
</script>
