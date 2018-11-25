<template>
  <div>
    <navbar class="user-menu">
      <div class="container">
        <router-link class="navbar-brand" slot="brand" to="/"><img src="img/insertlogo.png" alt="" class="responsive mrgnauto"></router-link>
        <navbar-nav right>
          <li>
            <router-link class="text-blue-light" to="/admin/reports">Reports</router-link>
          </li>
          <li>
            <router-link
              class="text-blue-light"
              to="/admin"
            >{{ $auth.user.role ? $auth.user.role.name : '' }} Dashboard</router-link>
          </li>
          <li>
            <a
              class="text-blue-light cursor-pointer"
              @click="$store.dispatch('auth/logout')"
            >Log Out</a>
          </li>
        </navbar-nav>
      </div>
    </navbar>
    <nuxt/>
  </div>
</template>

<script>
export default {
  middleware: 'isAdmin'
}
</script>
