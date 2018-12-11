export const getters = {
  hasPermission: state => permissionName => {
    if (permissionName === null) {
      return true
    }

    return Boolean(
      state.user.role.permissions.find(
        permission => permission.name === permissionName
      )
    )
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
