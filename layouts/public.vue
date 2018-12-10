<template>
  <section>
    <LoginModal/>
    <RegistrationModal/>
    <AppNavbar/>
    <nuxt/>
    <AppFooter/>
  </section>
</template>

<script>
import LoginModal from "~/components/LoginModal";
import RegistrationModal from "~/components/RegistrationModal";
import AppNavbar from "~/components/AppNavbar";
import AppFooter from "~/components/AppFooter";

export default {
  components: {
    LoginModal,
    RegistrationModal,
    AppNavbar,
    AppFooter
  }
};
</script>

<style scoped></style>
