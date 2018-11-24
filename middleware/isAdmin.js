export default function({ store, redirect }) {
  if (!store.state.auth.loggedIn) {
    return
  }

  if (!store.state.auth.user) {
    return
  }

  if (store.state.auth.user.role.slug !== 'administrator') {
    redirect('/')
  }
}
