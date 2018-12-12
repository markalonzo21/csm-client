<template>
  <div class="panel bgblue" v-if="report">
    <div class="panel-body" style="padding: 100px 30px 30px;">
      <h2
        class="title__white--large text-uppercase mb0 ofwbw"
        v-text="report.reportType.name"
      >Petnapping</h2>
      <h3
        class="title__white--mid mb20 ofwbw"
        v-text="report.reportType.reportCategory.name"
      >Security Management</h3>
      <router-link class="btn btnwhite text-uppercase" :to="`/reports/${report._id}`">Respond</router-link>
    </div>
  </div>
  <div class="panel bgblue" v-else>
    <div class="panel-body">
      <h3 class="title__white--mid mb20">No Active Report</h3>
    </div>
  </div>
</template>

<script>
export default {
  props: ["report"]
};
</script>

