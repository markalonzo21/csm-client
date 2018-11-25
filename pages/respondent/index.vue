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
        <div class="col-md-8">
          <section class="user-dashboard mx-auto">
            <h1 class="title__blue--large mt0">Reports</h1>
            <table class="text-center w-100">
              <thead>
                <tr>
                  <td>Type</td>
                  <td>Location</td>
                  <td>Created At</td>
                  <td>Resolved At</td>
                </tr>
              </thead>
              <tbody>
                <tr
                  class="cursor-pointer"
                  @click.prevent="$router.push(`/respondent/reports/${report._id}`)"
                  v-for="report in reports"
                  :key="report._id"
                >
                  <td>
                    <a
                      class="rowlink btn btnblue"
                      style="width: 100%;"
                      v-text="report.reportType.name"
                    ></a>
                  </td>
                  <td v-html="report.location.coordinates">14.12414, 121,41241</td>
                  <td v-text="report.createdAt">Nov. 11, 2018 10:30 PM</td>
                  <td v-text="report.resolvedAt ? report.resolvedAt : 'Unresolved'"></td>
                </tr>
              </tbody>
            </table>
            <button
              class="btn btn-info m-6"
              :disabled="isReportsLoading"
              v-if="isLoadMoreVisible"
              @click.prevent="loadMoreReports"
            >Load More</button>
          </section>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
export default {
  layout: 'respondent',
  middleware: 'isRespondent',
  asyncData({ $axios, error }) {
    return $axios.$get('/reports').then(response => {
      return {
        reports: response.data,
        isLoadMoreVisible: !(response.data.length < 10),
        isReportsLoading: false
      }
    })
  },
  methods: {
    loadMoreReports() {
      this.isReportsLoading = true
      this.$axios
        .$get(`/reports?skip=${this.reports.length}`)
        .then(response => {
          response.data.forEach(report => {
            this.reports.push(report)
          })
          this.isReportsLoading = false
        })
    }
  }
}
</script>

<style scoped>
</style>




















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

// <script>
// import ChatBox from '~/components/ChatBox'
// export default {
//   layout: 'respondent',
//   middleware: 'isRespondent',
//   components: {
//     ChatBox
//   },
//   asyncData({ $axios, store, params, error }) {
//     return $axios.$get(`/respondent/active-report`).then(response => {
//       return {
//         report: response.data,
//         loadingMarkAsDone: false
//       }
//     })
//   },
//   computed: {
//     isResolved() {
//       if (!this.report) {
//         return true
//       }
//       return (
//         this.report.reportType.milestones.length ===
//         this.report.responses.length
//       )
//     }
//   },
//   mounted() {
//     this.initSocketListeners()
//   },
//   beforeDestroy() {
//     this.$socket.off('respondent-assigned')
//   },
//   methods: {
//     initSocketListeners() {
//       this.$socket.on('respondent-assigned', report => {
//         this.$notify({
//           type: 'info',
//           title: 'You have been assigned!',
//           content: `You're assigned to an incident.`
//         })
//         this.report = report
//       })
//     },
//     isShowMarkButtonVisible(milestoneId, index) {
//       if (this.milestoneIsCompleted(milestoneId)) {
//         return false
//       }

//       if (index === 0) {
//         return true
//       }

//       if (this.isNotYetMarkable(index)) {
//         return false
//       }

//       return true
//     },
//     milestoneIsCompleted(id) {
//       return this.report.responses.includes(id)
//     },
//     isNotYetMarkable(index) {
//       const milestoneBeforeThisMilestone = this.report.reportType.milestones[
//         index - 1
//       ]

//       if (this.milestoneIsCompleted(milestoneBeforeThisMilestone._id)) {
//         return false
//       }

//       return true
//     },
//     markAsDone(id) {
//       this.loadingMarkAsDone = true
//       this.$axios
//         .$post('/respondent/respond', {
//           reportId: this.report._id,
//           milestoneId: id
//         })
//         .then(response => {
//           this.report.responses.push(id)
//           this.loadingMarkAsDone = false

//           if (this.isResolved) {
//             alert('incident is resolved!')
//             this.report = null
//           }
//         })
//         .catch(error => {
//           console.log(error.response.data)
//           this.loadingMarkAsDone = false
//         })
//     }
//   }
// }
// </script>
