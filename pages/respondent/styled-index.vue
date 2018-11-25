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
              <a href="#" class="btn btnwhite text-uppercase" @click="respondModal=true">Respond</a>
            </div>
          </div>
        </div>
        <div class="col-md-8 right-content">
          <ReportsHistory/>
        </div>
      </div>
    </section>
    <modal v-model="respondModal" size="sm" :footer="false" class="login">
      <span slot="title">
        <h4 class="title__black text-uppercase text-center">Report Details</h4>
      </span>
      <table class="table">
        <tbody>
          <tr>
            <td class="bluetext text-left">Date</td>
            <td class="text-right">11/21/18</td>
          </tr>
          <tr>
            <td class="bluetext text-left">Category</td>
            <td class="text-right">Lorem ipsum dolor sit amet.</td>
          </tr>
          <tr>
            <td class="bluetext text-left">Type</td>
            <td class="text-right">Lorem ipsum dolor sit amet.</td>
          </tr>
          <tr>
            <td class="bluetext text-left">Reporter</td>
            <td class="text-right">Juan Dela Cruz</td>
          </tr>
        </tbody>
      </table>
      <span class="bluetext">Notes</span>
      <br>
      <p class="basic">Lorem ipsum dolor sit amet consectetur adipisicing elit. Nesciunt, et.</p>
      <a href="#" class="btn btnblue text-uppercase" style="width: 100%">Contact Reporter</a>
    </modal>
  </div>
</template>

<script>
import ChatBox from '~/components/ChatBox'
import ReportsHistory from '~/components/ReportsHistory'
export default {
  layout: 'respondent',
  middleware: 'isRespondent',
  data() {
    return {
      respondModal: false
    }
  },
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
          console.log(error.response.data)
          this.loadingMarkAsDone = false
        })
    }
  }
}
</script>
<!--<template>
   <div class="container py-4">
    <div class="active-report">
      <div class="col-md-6">
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
      <div class="col-md-6">
        <ChatBox :reportId="report._id"/>
      </div>
    </div>
  </div>
</template>
