<template>
  <div>
    <navbar class="user-menu navbar-fixed-top">
      <div class="container">
        <router-link class="navbar-brand" slot="brand" to="/">
          <img src="img/insertlogo.png" alt="" class="responsive mrgnauto">
        </router-link>
        <navbar-nav right>
          <li>
            <a
              class="text-blue-light cursor-pointer"
              @click="$store.dispatch('auth/logout')"
            >Log Out</a>
          </li>
        </navbar-nav>
      </div>
    </navbar>
    <div id="wrapper" class="toggled">
      <section class="sidebar-section">
        <div id="sidebar-wrapper">
          <ul class="sidebar-nav">
            <li>
              <nuxt-link to="/admin">
                <b>
                  <!-- <easy-svg icon="dashboard" addClass="sidebar-icon mr-2"></easy-svg> -->
                  <span class="sidebar-text pt-1">Dashboard</span>
                </b>
              </nuxt-link>
            </li>
            <li>
              <nuxt-link to="/admin/reports">
                <b>
                  <!-- <easy-svg icon="dashboard" addClass="sidebar-icon mr-2"></easy-svg> -->
                  <span class="sidebar-text pt-1">Reports</span>
                </b>
              </nuxt-link>
            </li>
            <!-- <router-link to="/users" class="pointer" tag="li"> -->
            <!-- <easy-svg icon="user" addClass="sidebar-icon  mr-2"></easy-svg> -->
            <!-- <span class="sidebar-text">Users</span> -->
            <!-- </router-link> -->
          </ul>
        </div>
      </section>
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
export default {
  middleware: 'isAdmin'
}
</script>
