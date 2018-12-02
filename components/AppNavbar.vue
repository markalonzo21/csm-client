<template>
  <div style="height: 68px;">
    <fixed-header :fixed.sync="isFixed">
      <navbar class="user-menu" :fixed-top="isFixed" style="height: 68px;">
        <div class="container">
          <router-link class="navbar-brand" slot="brand" to="/">
            <img src="/img/megaworld-logo.png" alt="" class="responsive mrgnauto">
          </router-link>
          <navbar-nav right v-if="!$auth.loggedIn">
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
          <navbar-nav right v-else>
            <li v-if="$store.getters['auth/isRoleUser']">
              <router-link class="text-blue-light" to="/user/create-report">Create Report</router-link>
            </li>
            <li v-if="$store.getters['auth/isRoleUser']">
              <router-link class="text-blue-light" to="/user/track-report">Track Report</router-link>
            </li>
            <li>
              <router-link
                class="text-blue-light"
                :to="$store.getters['auth/dashboardLink']"
              >{{ $auth.user ? $auth.user.role.name : '' }} Dashboard</router-link>
            </li>
            <li>
              <a class="bluetext cursor-pointer" @click="$store.dispatch('auth/logout')">Log Out</a>
            </li>
          </navbar-nav>
        </div>
      </navbar>
    </fixed-header>
  </div>
</template>

<script>
import FixedHeader from 'vue-fixed-header'

export default {
  components: {
    FixedHeader
  },
  data() {
    return {
      isFixed: false
    }
  }
}
</script>
