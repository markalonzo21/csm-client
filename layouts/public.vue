<template>
  <section>
    <AppNavbar/>
    <nuxt/>
    <AppFooter v-if="$store.state.settings.logo === '/img/megaworld-logo.png'"/>
  </section>
</template>

<script>
import AppNavbar from "~/layouts/-AppNavbar";
import AppFooter from "~/layouts/-AppFooter";

export default {
  components: {
    AppNavbar,
    AppFooter
  }
};
</script>

<style scoped></style>
