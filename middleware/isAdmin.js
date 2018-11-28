export default function ({ store, redirect }) {
  if (!store.state.auth.loggedIn) {
    redirect('/')
  }

  if (!store.getters['auth/isRoleAdmin']) {
    redirect('/')
  }
}
