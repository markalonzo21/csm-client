<template>
  <div class="bg-grey-lighter">
    <AppNavbar/>
    <nuxt/>
    <AppFooter v-if="$store.state.settings.logo === '/img/megaworld-logo.png'"/>
  </div>
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
