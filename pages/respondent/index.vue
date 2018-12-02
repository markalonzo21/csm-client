<template>
  <div class="main-content">
    <section class="responder-dashboard container">
      <div class="row">
        <div class="col-md-4 left-content">
          <h1 class="title__black mt0">Active Reports</h1>
          <div class="panel bgblue" v-if="report">
            <div class="panel-body" style="padding: 100px 30px 30px;">
              <h2 class="title__white--large text-uppercase mb0 ofwbw" v-text="report.reportType.name">Petnapping</h2>
              <h3 class="title__white--mid mb20 ofwbw" v-text="report.reportType.reportCategory.name">Security Management</h3>
              <router-link class="btn btnwhite text-uppercase" :to="`/respondent/reports/active-report`">Respond</router-link>
            </div>
          </div>
          <div class="panel bgblue" v-else>
            <div class="panel-body">
             <h3 class="title__white--mid mb20">No Active Report</h3>
            </div>
          </div>
        </div>
        <div class="col-md-8 right-content">
          <ReportsHistory/>
        </div>
      </div>
    </section>
<!--     <modal v-model="respondModal" size="sm" :footer="false" class="login">
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
    </modal> -->
  </div>
</template>

<script>
import ChatBox from '~/components/ChatBox'
import ReportsHistory from '~/components/ReportsHistory'
export default {
  middleware: 'isRespondent',
  data() {
    return {
      respondModal: false,
      loadingMarkAsDone: false
    }
  },
  components: {
    ChatBox,
    ReportsHistory
  },
  async fetch ({ store, params }) {
    await store.dispatch('respondent/getActiveReport');
  },
 computed: {
   report() {
     return this.$store.state.respondent.report
   },
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
   },
   markAsDone(id) {
     this.loadingMarkAsDone = true
     this.$axios
       .$post('/respondent/respond', {
         reportId: this.report._id,
         milestoneId: id
       })
       .then(response => {
         this.$store.commit('respondent/NEW_RESPONSE', id)
         this.loadingMarkAsDone = false

         if (this.isResolved) {
           alert('incident is resolved!')
           this.$store.commit('respondent/SET_ACTIVE_REPORT', null)
         }
       })
       .catch(error => {
         this.loadingMarkAsDone = false
       })
   }
  }
}
</script>
