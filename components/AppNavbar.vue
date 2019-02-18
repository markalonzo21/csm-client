<template>
  <div class="h-65">
    <LoginModal/>
    <RegistrationModal/>
    <navbar
      :fixed-top="true"
      class="user-menu h-65"
    >
      <a
        class="navbar-brand"
        href="/"
        slot="brand"
      >
        <img
          alt
          class="responsive mrgnauto"
          src="/img/megaworld-logo.png"
        >
      </a>
      <template slot="collapse">
        <navbar-nav
          left
          v-if="$store.state.auth.loggedIn"
        >
          <li>
            <nuxt-link
              class="text-blue-light"
              to="/new-report"
            >New Report</nuxt-link>
          </li>
          <li>
            <nuxt-link
              class="text-blue-light"
              to="/report-tracker"
            >Report Tracker</nuxt-link>
          </li>
          <li>
            <nuxt-link
              class="text-blue-light"
              to="/report-history"
            >Report History</nuxt-link>
          </li>
        </navbar-nav>
        <navbar-nav
          class="select-none"
          right
          v-if="$store.state.auth.loggedIn"
        >
          <dropdown tag="li">
            <a
              class="dropdown-toggle"
              role="button"
            >
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
                tag="li"
                to="/command-center"
                v-if="$store.getters['auth/hasPermission']('view command center')"
              >
                <a class="button">Command Center</a>
              </nuxt-link>
              <nuxt-link
                tag="li"
                to="/resolver"
                v-if="$store.getters['auth/hasPermission']('resolve') && $route.path !== '/resolver'"
              >
                <a class="button">Resolver Dashboard</a>
              </nuxt-link>
              <nuxt-link
                tag="li"
                to="/responder"
                v-if="$store.getters['auth/hasPermission']('respond') && $route.path !== '/responder'"
              >
                <a class="button">Responder Dashboard</a>
              </nuxt-link>
              <li>
                <a
                  @click.prevent="$store.dispatch('auth/logout')"
                  role="button"
                >Log Out</a>
              </li>
            </template>
          </dropdown>
        </navbar-nav>
        <navbar-nav
          right
          v-else
        >
          <li>
            <btn
              @click="$store.commit('TOGGLE_LOGIN_MODAL')"
              class="btnsignin text-uppercase"
            >Sign In</btn>
          </li>
          <btn
            @click="$store.commit('TOGGLE_REGISTRATION_MODAL')"
            class="btnblue text-uppercase"
          >Register</btn>
        </navbar-nav>
      </template>
    </navbar>
  </div>
</template>

<script>
import LoginModal from "~/components/LoginModal";
import RegistrationModal from "~/components/RegistrationModal";

export default {
  components: {
    LoginModal,
    RegistrationModal
  }
};
</script>

<style scoped>
.h-65 {
  height: 65px;
}
</style>
