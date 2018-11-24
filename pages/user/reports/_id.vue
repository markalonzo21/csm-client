<template>
  <div class="container mx-auto py-4">
    <div v-if="report">
      <div class="col-md-6">
        <h3>Report Details</h3>
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
      <div class="col-md-6">
        <ChatBox :reportId="report._id"/>
      </div>
    </div>
  </div>
</template>

<script>
import ChatBox from '~/components/ChatBox'
export default {
  layout: 'user',
  components: {
    ChatBox
  },
  asyncData({ $axios, params, isServer }) {
    return $axios.$get(`/reports/${params.id}`).then(response => {
      return {
        report: response.data
      }
    })
  },
  data() {
    return {
      messages: [],
      message: ''
    }
  },
  mounted() {
    this.initSocketListeners()
  },
  methods: {
    initSocketListeners() {
      this.$socket.on('respondent-assigned', report => {
        this.$notify({
          type: 'info',
          title: 'Respondent Assigned!',
          content: `${report.assignedTo.firstName} ${
            report.assignedTo.lastName
          } is assigned to this incident.`
        })
        this.report = report
      })

      this.$socket.on('milestone-completed', milestoneId => {
        const updateName = this.report.reportType.milestones.find(
          milestone => milestone._id === milestoneId
        ).name

        this.$notify({
          type: 'info',
          title: 'Help Update!',
          content: updateName
        })
        this.report.responses.push(milestoneId)
      })
    },
    milestoneIsCompleted(id) {
      return this.report.responses.includes(id)
    }
  }
}
</script>
