export default function({ store, redirect }) {
  if (! store.state.auth.loggedIn) {
    return
  }

  if (store.state.auth.user.role.slug !== 'respondent') {
    redirect('/')
  }
}
