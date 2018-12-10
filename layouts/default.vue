<template>
  <div class="bg-grey-lighter">
    <AppNavbar/>
    <nuxt/>
    <AppFooter/>
  </div>
</template>

<script>
import AppNavbar from "~/components/AppNavbar";
import AppFooter from "~/components/AppFooter";

export default {
  components: {
    AppNavbar,
    AppFooter
  }
};
</script>
