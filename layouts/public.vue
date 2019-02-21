<template>
  <section>
    <AppNavbar/>
    <nuxt/>
    <!-- <AppFooter/> -->
  </section>
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

<style scoped></style>
