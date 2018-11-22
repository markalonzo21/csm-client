export const getters = {
  userDashboardLink(state) {
    if (state.user.role.slug === 'administrator') {
      return '/admin'
    }

    if (state.user.role.slug === 'user') {
      return '/user'
    }

    if (state.user.role.slug === 'respondent') {
      return 'respondent'
    }

    return '/'
  }
}

export const actions = {
  logout() {
    this.$auth.logout().then(() => {
      this.$socket.disconnect()
      this.$router.replace('/login')
    })
  }
}
