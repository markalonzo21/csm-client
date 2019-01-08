<template>
   <div class="row">
    <div class="col-md-3">
      <label for>Type</label>
    </div>
    <div class="col-md-6">
      <input
        type="text"
        :disabled="true"
        class="form-control"
        :value="report.type.name"
      >
    </div>
    <div class="col-md-3">
      <button class="btn btnform" @click.prevent="alertItsNotWorkingYet">Change</button>
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
        currentType: this.report.type
      }
    },
    methods: {
      alertItsNotWorkingYet() {
        alert('Reassigning type is still under development')
      },
      changeType() {

      }
    }
  }
</script>

