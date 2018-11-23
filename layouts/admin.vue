<template>
  <div>
    <nav class="flex items-center justify-between flex-wrap bg-green p-4">
      <div class="container mx-auto">
        <div class="flex items-center justify-between flex-no-shrink text-white mr-6">
          <nuxt-link
            class="font-semibold text-xl tracking-tight cursor-pointer text-white no-underline"
            to="/"
          >COMMAND CENTER</nuxt-link>
          <router-link class="no-underline text-white" to="/admin">Dashboard</router-link>
          <router-link class="no-underline text-white" to="/admin/reports">Reports</router-link>
          <button
            type="button"
            @click.prevent="$store.dispatch('auth/logout')"
            class="no-underline text-white"
          >Logout</button>
        </div>
      </div>
    </nav>
    <nuxt/>
  </div>
</template>

<script>
export default {
  middleware: 'isAdmin'
}
</script>
