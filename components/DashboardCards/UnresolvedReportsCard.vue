<template>
  <div class="panel">
    <div class="panel-body">
      <h2 class="title__white--large" v-text="total"></h2>
      <span class="title__white--mid">UNRESOLVED REPORTS</span>
    </div>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        total: 0
      }
    },
    mounted() {

    }
  }
</script>

<style scoped>
  .panel-body {
    background-image: linear-gradient(to right, #354fa3, #34c3e5);
    color: white;
    border-radius: 0.5rem;
  }
  .invert-gradient {
    background-image: linear-gradient(to right, #34c3e5, #354fa3) !important;
  }
  .panel-footer {
    border: none;
    background-image: inherit;
    font-weight: bold;
  }
</style>
