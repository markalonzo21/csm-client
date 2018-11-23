<template>
  <div class="container py-4">
  <div class="active-report">
    <h3>Active Report</h3>
    <hr>
    <h4 class="mb-1">Report: {{ activeReport._id }}</h4>
    <h4 class="mb-1">Report Type: {{ activeReport.reportType.name }}</h4>
    <h4 class="mb-1">Report Description: {{ activeReport.description }}</h4>
    <h4 class="mb-1">Reported By: {{  activeReport.reportedBy.firstName }} {{  activeReport.reportedBy.lastName }}</h4>
    <h4 class="mb-1">Milestones</h4>
    <div
      class="my-2 row"
      v-for="(milestone, index) in activeReport.reportType.milestones"
      :key="milestone._id"
    >
     {{ index + 1}}. {{ milestone.name }}  {{ milestoneIsCompleted(milestone._id) ? ' - DONE' : '' }}
      <button
        :disabled="loadingMarkAsDone"
        class="btn btn-primary"
        v-if="!milestoneIsCompleted(milestone._id) && !isNotYetMarkable(index)"
        @click.prevent="markAsDone(milestone._id)"
      >Mark as done
      </button>
    </div>
  </div>

  </div>

</div>

</template>

<script>
export default {
  layout: 'respondent',
  middleware: 'isRespondent',
  asyncData({ $axios, store, params, error }) {
    return $axios.$get(`/respondent/active-report`).then(response => {
      return {
        activeReport: response.data,
        loadingMarkAsDone: false
      }
    })
  },
  methods: {
    milestoneIsCompleted(id) {
      return this.activeReport.responses.includes(id)
    },
    isNotYetMarkable(index) {
      if (index === 0) {
        return true
      }
      const milestoneBeforeThisMilestone = this.activeReport.reportType.milestones[index - 1]

      if (this.milestoneIsCompleted(milestoneBeforeThisMilestone._id)) {
        return false
      }

      return true
    },
    markAsDone(id) {
      this.loadingMarkAsDone = true
      this.$axios.$post('/respondent/respond', {
        reportId: this.activeReport._id,
        milestoneId: id
      }).then(response => {
        this.activeReport.responses.push(id)
        this.loadingMarkAsDone = false
      }).catch(error => {
        console.log(error.response.data)
        this.loadingMarkAsDone = false
      })
    }
  }
}
</script>
