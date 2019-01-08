<template>
  <div class="panel option">
    <div class="panel-heading">
      <h3 class="text-uppercase">Option</h3>
    </div>
    <div class="panel-body p0">
      <form>
        <ReportOptionUpdateType :report="report"/>
        <ReportOptionUpdateResolver :report="report"/>
        <ReportOptionUpdateResponder :report="report"/>
        <ReportOptionUpdateStatus :report="report"/>
      </form>
    </div>
  </div>
</template>

<script>
  import ReportOptionUpdateStatus from './-ReportOptionUpdateStatus'
  import ReportOptionUpdateResolver from './-ReportOptionUpdateResolver'
  import ReportOptionUpdateResponder from './-ReportOptionUpdateResponder'
  import ReportOptionUpdateType from './-ReportOptionUpdateType'
  export default {
    components: {
      ReportOptionUpdateStatus,
      ReportOptionUpdateResolver,
      ReportOptionUpdateResponder,
      ReportOptionUpdateType
    },
    props: {
      report: {
        type: Object,
        required: true
      }
    },
    data() {
      return {
        form: {
          status: this.report.status
        }
      }
    }
  }
</script>
