<template>
  <div>New</div>
</template>

<script>
export default {
  layout: "command-center",
  asyncData({ store, redirect }) {
    if (!store.getters["auth/hasPermission"]("create area")) {
      redirect("/");
    }
  }
};
</script>
