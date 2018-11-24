export const getters = {
  userDashboardLink(state) {
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
      this.$socket.disconnect()
      this.$router.replace('/login')
    })
  }
}
