<template>
  <div>
    <navbar class="bg-white">
      <div class="container">
        <router-link class="navbar-brand" slot="brand" to="/">
          <img src="img/insertlogo.png" alt="" class="responsive mrgnauto">
        </router-link>
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
    <div id="wrapper" :class="$store.state.drawer ? 'toggled' : ''">
      <section class="sidebar-section">
        <div id="sidebar-wrapper">
          <ul class="sidebar-nav">
            <li>
              <nuxt-link to="/">
                <b>
                  <!-- <easy-svg icon="dashboard" addClass="sidebar-icon mr-2"></easy-svg> -->
                  <span class="sidebar-text pt-1">Dashboard</span>
                </b>
              </nuxt-link>
            </li>
            <router-link to="/users" class="pointer" tag="li">
              <!-- <easy-svg icon="user" addClass="sidebar-icon  mr-2"></easy-svg> -->
              <span class="sidebar-text">Users</span>
            </router-link>
          </ul>
        </div>
      </section>
      <div id="page-content-wrapper">
        <nuxt/>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  middleware: 'isAdmin'
}
</script>
