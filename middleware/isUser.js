export default function({ store, redirect }) {
  if (!store.state.auth.loggedIn) {
    redirect('/')
  }

  if (!store.state.auth.user.role) {
    redirect('/')
  }

  if (store.state.auth.user.role.slug !== 'user') {
    redirect('/')
  }
}
