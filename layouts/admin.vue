<template>
  <div>
    <navbar class="user-menu navbar-fixed-top">
      <div class="container">
        <router-link class="navbar-brand" slot="brand" to="/">
          <img src="/img/megaworld-logo.png" alt="" class="responsive mrgnauto">
        </router-link>
        <navbar-nav right>
          <li>
            <a
              class="bluetext cursor-pointer"
              @click="$store.dispatch('auth/logout')"
            >Log Out</a>
          </li>
        </navbar-nav>
      </div>
    </navbar>
    <div id="wrapper" class="toggled">
      <AppAdminSidebar/>
      <div id="page-content-wrapper" class="main-content">
        <nuxt/>
      </div>
    </div>
    <!-- <div class="footer bgblue">
      <div class="container">
        <small class="basic">&copy; 2018 Powered by Systems Terasoft Inc</small>
      </div>
    </div> -->
  </div>
</template>


<script>
import AppAdminSidebar from '~/components/AppAdminSidebar'
export default {
  middleware: 'isAdmin',
  components: {
    AppAdminSidebar
  }
}
</script>
