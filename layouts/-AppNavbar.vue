<template>
  <div class="h-65">
    <LoginModal/>
    <RegistrationModal/>
    <VerificationModal/>
    <navbar
      :fixed-top="true"
      class="user-menu h-65"
    >
      <nuxt-link
        class="navbar-brand"
        slot="brand"
        to="/"
      >
        <img
          :src="$store.state.settings.logo"
          :style="{ margin: $store.state.settings.logo.includes('sentinel') ? '-5px auto' : ''}"
          alt="logo"
          class="responsive mrgnauto"
        >
      </nuxt-link>
      <template slot="collapse">
        <navbar-nav
          left
          v-if="$store.state.auth.loggedIn"
        >
          <li>
            <nuxt-link to="/new-report">New Report</nuxt-link>
          </li>
          <li>
            <nuxt-link to="/report-tracker">Report Tracker</nuxt-link>
          </li>
          <li>
            <nuxt-link to="/report-history">Report History</nuxt-link>
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
              <nuxt-link
                tag="li"
                to="/my-profile"
                v-if="$auth.user.role.name === 'User'"
              >
                <a class="button">My Profile</a>
              </nuxt-link>
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
import LoginModal from "~/components/Modals/LoginModal";
import RegistrationModal from "~/components/Modals/RegistrationModal";
import VerificationModal from "~/components/Modals/VerificationModal";

export default {
  components: {
    LoginModal,
    RegistrationModal,
    VerificationModal
  }
};
</script>

<style scoped>
.h-65 {
  height: 65px;
}
</style>
