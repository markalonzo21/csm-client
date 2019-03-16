<template>
  <div></div>
</template>

<script>
export default {
  layout: "command-center/default",
  asyncData({ redirect }) {
    return redirect("/command-center/report-categories");
  }
};
</script>
