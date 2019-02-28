<template>
  <div class="panel">
    <div class="panel-body flex items-center justify-center" style=" height: 119px;" v-if="loading">
      <a-icon type="loading" style="font-size: 32px;" spin/>
    </div>
    <!-- <a :href="`/command-center/reports?type=${type}`" target="_blank" v-else> -->
    <div class="panel-body" v-else>
      <h2 class="title__white--large" v-text="total"></h2>
      <span class="title__white--mid">EMERGENCY REPORTS</span>
    </div>
    <!-- </a> -->
  </div>
</template>

<script>
export default {
  props: {
    // type: {
    //   type: String,
    //   required: true
    // },
    total: {
      type: Number,
      required: true
    },
    loading: {
      type: Boolean,
      default: false
    }
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
