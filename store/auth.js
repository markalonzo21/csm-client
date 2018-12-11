export const getters = {
  canAccessCommandCenter(state) {
    if (state.loggedIn) {
      if (['administrator', 'resolver'].includes(state.user.role.slug)) {
        return true
      }
    }

    return false
  },
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
      return '/command-center'
    }

    if (state.user.role.slug === 'resolver') {
      return '/command-center'
    }

    if (state.user.role.slug === 'respondent') {
      return '/respondent'
    }

    return '/user'
  }
}

export const actions = {
  logout({ commit }) {
    // commit('LOGOUT_USER')
    this.$auth.logout().then(() => {
      this.$socket.disconnect()
      // this.$router.replace('/')
      window.location.href = '/'
    })
  }
}

export const mutations = {
  LOGOUT_USER(state) {
    // state.strategy = 'local'
    window.location.href = '/'
  },
  SET_USER(state, user) {
    console.log(user)
    state.user = user
  }
}
