<template>
  <div v-if="$store.state.auth.loggedIn">
    <AppAdminDashboard v-if="$store.getters['auth/hasPermission']('view dashboard')"/>
    <div v-else>Nothing to show here...</div>
  </div>
</template>

<script>
import AppAdminDashboard from "~/components/AppAdminDashboard";
export default {
  layout: "command-center",
  components: {
    AppAdminDashboard
  },
  asyncData({ store, redirect }) {
    if (!store.getters["auth/hasPermission"]("view command center")) {
      return redirect("/");
    }
  }
};
</script>
