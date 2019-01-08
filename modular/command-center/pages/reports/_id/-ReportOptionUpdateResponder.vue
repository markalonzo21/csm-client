<template>
  <div class="row">
    <div class="col-md-3">
      <label for>Reassign Responder</label>
    </div>
    <div class="col-md-6">
      <input
        type="text"
        class="form-control"
        :disabled="true"
        :value="report.responder ? report.responder.email : 'No responder'"
      >
    </div>
    <div class="col-md-3">
      <button class="btn btnform" @click.prevent="changeResponder">Change</button>
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
        currentResponder: this.report.responder
      }
    },
    methods: {
      changeResponder() {

      }
    }
  }
</script>
