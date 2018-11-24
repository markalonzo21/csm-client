<template>
  <div class="container mx-auto py-4">
    <div class="active-report" v-if="report">
      <h3>Active Report</h3>
      <hr>
      <h4 class="mb-1">Report: {{ report._id }}</h4>
      <h4 class="mb-1">Report Type: {{ report.reportType.name }}</h4>
      <h4 class="mb-1">Report Description: {{ report.description }}</h4>
      <h4
        class="mb-1"
      >Reported By: {{ report.reportedBy.firstName }} {{ report.reportedBy.lastName }} ({{ report.reportedBy.mobile }})</h4>
      <h4 class="mb-1">Assigned To:
        <template
          v-if="report.assignedTo"
        >{{ report.assignedTo.firstName }} {{ report.assignedTo.lastName }}</template>
        <template v-else>None</template>
      </h4>
      <hr>
      <h3 class="mb-1">Milestones</h3>
      <div
        class="my-2"
        v-for="(milestone, index) in report.reportType.milestones"
        :key="milestone._id"
      >{{ index + 1 }}. {{ milestone.name }} {{ milestoneIsCompleted(milestone._id) ? ' - DONE' : '' }}</div>
    </div>
  </div>
</template>

<script>
export default {
  layout: 'user',
  asyncData({ $axios, params, isServer }) {
    return $axios.$get(`/reports/${params.id}`).then(response => {
      return {
        report: response.data
      }
    })
  },
  mounted() {
    this.initSocketListeners()
  },
  methods: {
    initSocketListeners() {
      this.$socket.on('respondent-assigned', report => {
        this.report = report
      })
      this.$socket.on('milestone-completed', milestoneId => {
        this.report.responses.push(milestoneId)
      })
    },
    milestoneIsCompleted(id) {
      return this.report.responses.includes(id)
    }
  }
}
</script>
