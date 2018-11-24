import Vue from 'vue'

export const getters = {
  userDashboardLink(state) {
    if (!state.user) {
      return '/'
    }

    if (!state.user.role) {
      return '/'
    }

    if (state.user.role.slug === 'administrator') {
      return '/admin'
    }

    if (state.user.role.slug === 'respondent') {
      return '/respondent'
    }

    return '/user'
  }
}

export const actions = {
  logout() {
    this.$auth.logout().then(() => {
      Vue.nextTick(() => {
        this.$socket.disconnect()
        this.$router.replace('/')
      })
    })
  }
}
