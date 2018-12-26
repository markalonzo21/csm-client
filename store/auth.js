export const getters = {
  hasPermission: state => permissionName => {
    if (permissionName === null) {
      return true
    }

    return state.user.role.permissions.some(
      permission => permission.name === permissionName
    )
  },
  hasSpecificArea (state) {
    if (state.user) {
      return state.user.role.permissions.some(permission => {
        return permission.category === 'specific area management'
      })
    }
  }
}

export const actions = {
  logout ({ commit }) {
    // commit('LOGOUT_USER')
    this.$auth.logout().then(() => {
      window.location.href = '/'
      this.$socket.disconnect()
      // this.$router.replace('/')
    })
  }
}

export const mutations = {
  LOGOUT_USER (state) {
    // state.strategy = 'local'
    window.location.href = '/'
  },
  SET_USER (state, user) {
    console.log(user)
    state.user = user
  },
  ADD_AREA (state, area) {
    state.user.areas.push(area)
  }
}
