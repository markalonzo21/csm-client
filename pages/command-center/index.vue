<template>
  <div v-if="$auth.loggedIn">
    <AppAdminDashboard/>
    <!-- <AppResolverDashboard v-if="$auth.user.role.slug === 'resolver'"/> -->
  </div>
</template>

<script>
import AppAdminDashboard from "~/components/AppAdminDashboard";
import AppResolverDashboard from "~/components/AppResolverDashboard";
export default {
  layout: "command-center",
  components: {
    AppAdminDashboard,
    AppResolverDashboard
  },
  asyncData({ store, redirect }) {
    if (!store.getters["auth/hasPermission"]("view dashboard")) {
      redirect("/");
    }
  }
};
</script>
