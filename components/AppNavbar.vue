<template>
  <div class="h-65">
    <LoginModal/>
    <RegistrationModal/>
    <navbar class="user-menu h-65" :fixed-top="true">
      <div class="container h-65">
        <nuxt-link class="float-left pt-4 mr-6" slot="brand" to="/">
          <img src="/img/megaworld-logo.png" alt class="responsive mrgnauto">
        </nuxt-link>
        <navbar-nav left v-if="$store.state.auth.loggedIn">
          <li>
            <nuxt-link class="text-blue-light" to="/new-report">New Report</nuxt-link>
          </li>
          <li>
            <nuxt-link class="text-blue-light" to="/report-tracker">Report Tracker</nuxt-link>
          </li>
          <li>
            <nuxt-link class="text-blue-light" to="/report-history">Report History</nuxt-link>
          </li>
        </navbar-nav>
        <navbar-nav right v-if="$store.state.auth.loggedIn" class="select-none">
          <dropdown tag="li">
            <a class="dropdown-toggle" role="button">
              {{ $store.state.auth.user.firstName }} {{ $store.state.auth.user.middleName }} {{ $store.state.auth.user.lastName }}
              <span
                class="caret"
              ></span>
            </a>
            <template slot="dropdown">
              <!-- <nuxt-link to="/my-profile" tag="li">
                <a class="button">My Profile</a>
              </nuxt-link>-->
              <nuxt-link
                to="/command-center"
                tag="li"
                v-if="$store.getters['auth/hasPermission']('view command center')"
              >
                <a class="button">Command Center</a>
              </nuxt-link>
              <nuxt-link
                to="/resolver"
                tag="li"
                v-if="$store.getters['auth/hasPermission']('resolve') && $route.path !== '/resolver'"
              >
                <a class="button">Resolver Dashboard</a>
              </nuxt-link>
              <nuxt-link
                to="/responder"
                tag="li"
                v-if="$store.getters['auth/hasPermission']('respond') && $route.path !== '/responder'"
              >
                <a class="button">Responder Dashboard</a>
              </nuxt-link>
              <li>
                <a role="button" @click.prevent="$store.dispatch('auth/logout')">Log Out</a>
              </li>
            </template>
          </dropdown>
        </navbar-nav>
        <navbar-nav right v-else>
          <li>
            <btn
              class="btnsignin text-uppercase"
              @click="$store.commit('TOGGLE_LOGIN_MODAL')"
            >Sign In</btn>
          </li>
          <btn
            class="btnblue text-uppercase"
            @click="$store.commit('TOGGLE_REGISTRATION_MODAL')"
          >Register</btn>
        </navbar-nav>
      </div>
    </navbar>
  </div>
</template>

<script>
import LoginModal from '~/components/LoginModal'
import RegistrationModal from '~/components/RegistrationModal'

export default {
  components: {
    LoginModal,
    RegistrationModal
  }
}
</script>

<style scoped>
.h-65 {
  height: 65px;
}
</style>
