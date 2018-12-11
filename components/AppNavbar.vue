<template>
  <div class="h-65">
    <navbar class="user-menu h-65" :fixed-top="true">
      <div class="container h-65">
        <router-link class="float-left pt-4 mr-6" slot="brand" to="/">
          <img src="/img/megaworld-logo.png" alt class="responsive mrgnauto">
        </router-link>
        <navbar-nav left v-if="$auth.loggedIn">
          <li v-if="$store.getters['auth/isRoleUser']">
            <router-link class="text-blue-light" to="/new-report">New Report</router-link>
          </li>
          <li v-if="$store.getters['auth/isRoleUser']">
            <router-link class="text-blue-light" to="/report-tracker">Report Tracker</router-link>
          </li>
        </navbar-nav>
        <navbar-nav right v-if="$auth.loggedIn" class="select-none">
          <dropdown tag="li">
            <a class="dropdown-toggle" role="button">
              {{ $auth.user.firstName }} {{ $auth.user.middleName }} {{ $auth.user.lastName }}
              <span
                class="caret"
              ></span>
            </a>
            <template slot="dropdown">
              <!-- <router-link to="/my-profile" tag="li">
                <a class="button">My Profile</a>
              </router-link>-->
              <router-link to="/respondent" tag="li" v-if="$auth.user.role.slug === 'respondent'">
                <a class="button">Dashboard</a>
              </router-link>
              <router-link to="/report-history" tag="li" v-else>
                <a class="button">Report History</a>
              </router-link>
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
import FixedHeader from "vue-fixed-header";

export default {
  components: {
    FixedHeader
  },
  data() {
    return {
      isFixed: false
    };
  }
};
</script>


<style scoped>
.h-65 {
  height: 65px;
}
</style>
