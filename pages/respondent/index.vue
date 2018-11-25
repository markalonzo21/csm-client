<template>
  <div class="main-content">
    <section class="responder-dashboard container">
      <div class="row">
        <div class="col-md-4 left-content">
          <h1 class="title__black mt0">Active Reports</h1>
          <div class="panel bgblue">
            <div class="panel-body">
              <h2 class="title__white--large text-uppercase mb0">Petnapping</h2>
              <h3 class="title__white--mid mb20">Security Management</h3>
              <a href="#" class="btn btnwhite text-uppercase">Respond</a>
            </div>
          </div>
        </div>
        <div class="col-md-8 right-content">
          <ReportsHistory/>
        </div>
      </div>
    </section>
  </div>
</template>


<script>
import ReportsHistory from '~/components/ReportsHistory'
import ChatBox from '~/components/ChatBox'

export default {
  layout: 'respondent',
  middleware: 'isRespondent',
  components: {
    ChatBox,
    ReportsHistory
  },
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
  beforeDestroy() {
    this.$socket.off('respondent-assigned')
  },
  methods: {
    initSocketListeners() {
      this.$socket.on('respondent-assigned', report => {
        this.$notify({
          type: 'info',
          title: 'You have been assigned!',
          content: `You're assigned to an incident.`
        })
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
          this.loadingMarkAsDone = false
        })
    }
  }
}
</script>




















