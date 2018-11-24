<template>
  <div class="container py-4">
    <div class="active-report" v-if="report">
      <h3>Active Report</h3>
      <hr>
      <h4 class="mb-1">Report: {{ report._id }}</h4>
      <h4 class="mb-1">Report Type: {{ report.reportType.name }}</h4>
      <h4 class="mb-1">Report Description: {{ report.description }}</h4>
      <h4
        class="mb-1"
      >Reported By: {{ report.reportedBy.firstName }} {{ report.reportedBy.lastName }} ({{ report.reportedBy.mobile }})</h4>
      <hr>
      <h3 class="mb-1">Milestones</h3>
      <div
        class="my-2"
        v-for="(milestone, index) in report.reportType.milestones"
        :key="milestone._id"
      >
        {{ index + 1 }}. {{ milestone.name }} {{ milestoneIsCompleted(milestone._id) ? ' - DONE' : '' }}
        <button
          :disabled="loadingMarkAsDone"
          class="btn btn-primary"
          v-if="isShowMarkButtonVisible(milestone._id, index)"
          @click.prevent="markAsDone(milestone._id)"
        >Mark as done</button>
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
        report: response.data,
        loadingMarkAsDone: false
      }
    })
  },
  computed: {
    isResolved() {
      if (!this.report) {
        return true
      }
      return (
        this.report.reportType.milestones.length ===
        this.report.responses.length
      )
    }
  },
  mounted() {
    this.initSocketListeners()
  },
  methods: {
    initSocketListeners() {
      this.$socket.on('respondent-assigned', report => {
        this.report = report
      })
    },
    isShowMarkButtonVisible(milestoneId, index) {
      if (this.milestoneIsCompleted(milestoneId)) {
        return false
      }

      if (index === 0) {
        return true
      }

      if (this.isNotYetMarkable(index)) {
        return false
      }

      return true
    },
    milestoneIsCompleted(id) {
      return this.report.responses.includes(id)
    },
    isNotYetMarkable(index) {
      const milestoneBeforeThisMilestone = this.report.reportType.milestones[
        index - 1
      ]

      if (this.milestoneIsCompleted(milestoneBeforeThisMilestone._id)) {
        return false
      }

      return true
    },
    markAsDone(id) {
      this.loadingMarkAsDone = true
      this.$axios
        .$post('/respondent/respond', {
          reportId: this.report._id,
          milestoneId: id
        })
        .then(response => {
          this.report.responses.push(id)
          this.loadingMarkAsDone = false

          if (this.isResolved) {
            alert('incident is resolved!')
            this.report = null
          }
        })
        .catch(error => {
          console.log(error.response.data)
          this.loadingMarkAsDone = false
        })
    }
  }
}
</script>
