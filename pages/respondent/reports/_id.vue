<template>
<div class="main-content">
  <div class="container mx-auto py-4" v-if="report">
    <div class="col-md-12 flex flex-col items-center">
      <div>
      <h3 class="title__blue">Report Details</h3>
      <hr>
      <h4 class="mb-1"><strong>Report ID:</strong> {{ report._id }}</h4>
      <h4 class="mb-1"><strong>Type:</strong> {{ report.reportType.name }}</h4>
      <h4 class="mb-1"><strong>Description:</strong> {{ report.description }}</h4>
      <h4
        class="mb-1"
      ><strong>Reported By:</strong> {{ report.reportedBy.firstName }} {{ report.reportedBy.lastName }} ({{ report.reportedBy.mobile }})</h4>
      <h4 class="mb-1"><strong>Assigned To:</strong>
        <template
          v-if="report.assignedTo"
        >{{ report.assignedTo.firstName }} {{ report.assignedTo.lastName }}</template>
        <template v-else>None</template>
      </h4>
      <hr>
      <h4 v-if="report.photos.length > 0">Photos</h4>
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
        {{ index + 1 }}. {{ milestone.name }} {{ milestoneIsCompleted(milestone._id) ? ' - COMPLETED' : '' }}
        <a class="cursor-pointer"
          v-if="isShowMarkButtonVisible(milestone._id, index)"
          @click.prevent="$store.dispatch('respondent/markAsDone', milestone._id)"
        >- Click to Mark as Completed</a>
      </div>
    </div>
      </div>

    <ChatBox :reportId="report._id" :isResolved="report.resolvedAt"/>
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


<style scoped>
  strong {
    color: #34c3e5;
  }
</style>
