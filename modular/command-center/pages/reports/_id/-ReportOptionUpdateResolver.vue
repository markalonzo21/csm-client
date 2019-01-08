<template>
  <div class="row">
    <div class="col-md-3">
      <label for>Reassign Resolver</label>
    </div>
    <div class="col-md-6">
      <input
        type="text"
        class="form-control"
        :disabled="true"
        :value="report.resolver ? report.resolver.email : 'No resolver'"
      >
    </div>
    <div class="col-md-3">
      <button class="btn btnform" @click.prevent="changeResolver">Change</button>
    </div>
  </div>
</template>

<script>
  export default {
    props: {
      report: {
        type: Object,
        required: true
      }
    },
    data() {
      return {
        currentResolver: this.report.resolver
      }
    },
    methods: {
      changeResolver() {

      }
    }
  }
</script>
