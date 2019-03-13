<template>
  <div></div>
</template>

<script>
export default {
  layout: "command-center/default",
  mounted() {
    this.$router.replace("/command-center/users");
  }
};
</script>
