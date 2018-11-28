import Vue from 'vue'

export const getters = {
  isRoleUser(state) {
    if (state.loggedIn) {
      return state.user.role.slug === 'user'
    }
    return false
  },
  isRoleRespondent(state) {
    if (state.loggedIn) {
      return state.user.role.slug === 'respondent'
    }
    return false
  },
  isRoleAdmin(state) {
    if (state.loggedIn) {
      return state.user.role.slug === 'administrator'
    }
    return false
  },
  dashboardLink(state) {
    if (!state.loggedIn) {
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
  logout({ commit }) {
    commit('LOGOUT_USER')
    this.$auth.logout().then(() => {
      this.$socket.disconnect()
      this.$router.replace('/')
    })
  }
}

export const mutations = {
  LOGOUT_USER(state) {
    state.strategy = 'local'
  }
}
