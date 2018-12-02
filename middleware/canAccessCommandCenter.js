export default function({ store, redirect }) {
  if (!store.state.auth.loggedIn) {
    redirect('/')
  }

  if (!store.getters['auth/canAccessCommandCenter']) {
    redirect('/')
  }
}
