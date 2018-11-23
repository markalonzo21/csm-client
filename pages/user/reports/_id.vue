<template>
  <div class="container mx-auto py-4">
    <div class="flex mb-4" v-if="report">
      <div class="w-1/2 flex flex-col items-start justify-center p-2">
        <h3 class="mb-1">Report: {{ report._id }}</h3>
        <h3 class="mb-1">Report Type: {{ report.reportType.name }}</h3>
        <h3 class="mb-1">Report Description: {{ report.description }}</h3>
        <h3
          class="mb-1"
        >Reported By: {{ report.reportedBy.firstName }} {{ report.reportedBy.lastName }}</h3>
        <h3 class="mb-1">Assigned To:
          <template
            v-if="report.assignedTo"
          >{{ report.assignedTo.firstName }} {{ report.assignedTo.lastName }}</template>
          <span v-else>None</span>
        </h3>
        <h3 class="my-2">Milestones</h3>
        <div
          class="my-2"
          v-for="(milestone, index) in report.reportType.milestones"
          :key="milestone._id"
        >{{ index + 1}}. {{ milestone.name }} {{ milestoneIsCompleted(milestone._id) ? '- Done' : '' }}</div>
      </div>
      <div class="w-1/2 flex flex-col items-start justify-start border p-2">
        <h3>Chatbox</h3>
      </div>
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
      this.$socket.on('respondent-assigned', data => {
        this.report.assignedTo = data
      })
    },
    milestoneIsCompleted(id) {
      return this.report.responses.includes(id)
    }
  }
}
</script>
