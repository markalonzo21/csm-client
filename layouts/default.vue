<template>
  <section>
    <navbar class="user-menu">
      <div class="container">
        <router-link class="navbar-brand" slot="brand" to="/"><img src="img/insertlogo.png" alt="" class="responsive mrgnauto"></router-link>
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
          <li>
            <router-link
              class="text-blue-light"
              :to="$store.getters['auth/userDashboardLink']"
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
    <LoginModal/>
    <RegistrationModal/>
    <nuxt/>
  </section>
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

<style scoped></style>
