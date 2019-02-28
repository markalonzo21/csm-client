<template>
  <div
    class="panel bgblue"
    v-if="report"
  >
    <div
      class="panel-body"
      style="padding: 100px 30px 30px;"
    >
      <h2
        class="title__white--large text-uppercase mb0 ofwbw"
        v-text="report.type.name"
      ></h2>
      <h3 class="title__white--mid mb20 ofwbw">{{ report.type.category.name }}</h3>
      <nuxt-link
        :to="`/responder/reports/${report._id}`"
        class="btn btnwhite text-uppercase"
      >Respond</nuxt-link>
    </div>
  </div>
  <div
    class="panel bgblue"
    v-else
  >
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

