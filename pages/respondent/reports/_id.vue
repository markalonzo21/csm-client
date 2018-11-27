<template>
<div class="main-content">
  <div class="container mx-auto py-4">
    <div v-if="report">
      <div class="col-md-6">
        <h3 class="title__blue">Report Details</h3>
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
        <h4>Photos</h4>
        <div class="row">
          <img :src="showPhoto(photo)" alt="image" v-for="photo in report.photos" class="h-24 w-24">
        </div>
        <hr>
        <h3 class="title__blue">Milestones</h3>
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
            @click.prevent="$store.dispatch('respondent/markAsDone', milestone._id)"
          >Mark as done</button>
        </div>
      </div>
      <div class="col-md-6">
        <ChatBox :reportId="report._id" :isResolved="report.resolvedAt"/>
      </div>
    </div>
  </div>
  </div>
</template>

<script>
import ChatBox from '~/components/ChatBox'
export default {
  components: {
    ChatBox
  },
  async fetch ({ $axios, store, params, error }) {
    await $axios.$get(`/reports/${params.id}`).then(response => {
      store.commit('respondent/SET_ACTIVE_REPORT', response.data)
    }).catch(err => {
      error({ status: 404, message: 'Report not found!' })
    })
  },
  data() {
    return {
      loadingMarkAsDone: false
    }
  },
  computed: {
    report() {
      return this.$store.state.respondent.report
    }
  },
  mounted() {
    this.initSocketListeners()
  },
  beforeDestroy() {
    this.$socket.off('respondent-assigned')
  },
  methods: {
    showPhoto(photo) {
      const baseUrl = process.env.API_URL ? process.env.API_URL : 'https://incident-reporting-api.now.sh'
      return `${baseUrl}/${photo}`
    },
    initSocketListeners() {
      this.$socket.on('respondent-assigned', report => {
        this.$notify({
          type: 'info',
          title: 'You have been assigned!',
          content: `You're assigned to an incident.`
        })
        this.$store.commit('respondent/SET_ACTIVE_REPORT', report)
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
    }
  }
}
</script>
