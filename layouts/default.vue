<template>
  <div>
    <nav class="flex items-center justify-between flex-wrap bg-grey p-4">
      <div class="container mx-auto">
        <div class="flex items-center justify-between flex-no-shrink text-white mr-6">
          <nuxt-link
            class="font-semibold text-xl tracking-tight cursor-pointer text-white no-underline"
            to="/"
          >LOGO</nuxt-link>
          <div v-if="$auth.loggedIn">
            <router-link
              class="no-underline text-white"
              :to="$store.getters['auth/userDashboardLink']"
            >Dashboard</router-link>
            <button
              type="button"
              @click.prevent="$store.dispatch('auth/logout')"
              class="no-underline text-white"
            >Logout</button>
          </div>
          <div v-else>
            <router-link class="no-underline text-white" to="/login">Login</router-link>
          </div>
        </div>
      </div>
    </nav>
    <nuxt/>
  </div>
</template>

<script>
export default {}
</script>
