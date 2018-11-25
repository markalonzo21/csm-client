<template>
  <div>
    <navbar class="user-menu">
      <div class="container">
        <router-link class="navbar-brand" slot="brand" to="/"><img src="img/insertlogo.png" alt="" class="responsive mrgnauto"></router-link>
        <navbar-nav right>
          <li>
            <router-link
              class="text-blue-light"
              to="/respondent"
            >{{ $auth.user.role ? $auth.user.role.name : '' }} Dashboard</router-link>
          </li>
          <li>
            <a
              class="bluetext cursor-pointer"
              @click="$store.dispatch('auth/logout')"
            >Log Out</a>
          </li>
        </navbar-nav>
      </div>
    </navbar>
    <nuxt/>
    <div class="footer bgblue">
      <div class="container">
        <small class="basic">&copy; 2018 Powered by Systems Terasoft Inc</small>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  middleware: 'isRespondent'
}
</script>
