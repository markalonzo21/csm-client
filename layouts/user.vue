<template>
  <div>
    <nav class="flex items-center justify-between flex-wrap bg-grey p-4">
      <div class="container mx-auto">
        <div class="flex items-center justify-between flex-no-shrink text-white mr-6">
          <nuxt-link
            class="font-semibold text-xl tracking-tight cursor-pointer text-white no-underline"
            to="/"
          >LOGO</nuxt-link>
          <router-link to="/create-report" class="no-underline text-white">Create Report</router-link>
          <router-link class="no-underline text-white" to="/user">Dashboard</router-link>
          <button type="button" @click.prevent="logout" class="no-underline text-white">Logout</button>
        </div>
      </div>
    </nav>
    <nuxt/>
  </div>
</template>

<script>
export default {
  middleware: 'user',
  methods: {
    logout() {
      this.$auth.logout().then(() => {
        this.$router.push('/login')
      })
    }
  }
}
</script>
