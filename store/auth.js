export const getters = {
  hasPermission: state => permissionName => {
    if (!state.user) {
      return false
    }

    if (permissionName === null) {
      return true
    }

    return state.user.role.permissions.some(
      permission => permission.name === permissionName
    )
  },
  hasSpecificArea(state) {
    if (state.user) {
      return state.user.role.permissions.some(permission => {
        return permission.category === 'specific area management'
      })
    }
  }
}

export const actions = {
  logout({ commit }) {
    this.$auth.logout().then(() => {
      this.$router.replace('/')
      this.$notify('Logout successful!')
      this.$socket.disconnect()
    })
  }
}

export const mutations = {
  ADD_AREA(state, area) {
    state.user.areas.push(area)
  }
}
