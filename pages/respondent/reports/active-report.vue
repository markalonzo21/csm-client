<template>
<div class="respondent active-report main-content">
  <div class="container">
    <div class="active-report">
      <div class="col-md-6">
        <h3>Active Report</h3>
        <hr>
        <h4 class="mb-1"><span class="bluetext mr20">Report:</span> {{ report._id }}</h4>
        <h4 class="mb-1"><span class="bluetext mr20">Report Type:</span> {{ report.reportType.name }}</h4>
        <h4 class="mb-1"><span class="bluetext mr20">Report Description:</span> {{ report.description }}</h4>
        <h4
          class="mb-1"
        ><span class="bluetext mr20">Reported By:</span> {{ report.reportedBy.firstName }} {{ report.reportedBy.lastName }} ({{ report.reportedBy.mobile }})</h4>
        <h4
          class="mb-1"
        ><span class="bluetext mr20">Notes:</span> Lorem ipsum dolor sit, amet consectetur adipisicing elit. Temporibus, ipsam?</h4>
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
            @click.prevent="$store.dispatch('respondent/markAsDone', milestone._id)"
          >Mark as done</button>
        </div>
      </div>
      <div class="col-md-6">
        <tabs class="tabular-view">
          <tab title="On-going">
            <h3 class="bluetext text-center mb20">Location of Incident</h3>
            <div class="panel">
              <div class="panel-body text-center">
                <p class="title__black">Sample Location St. Sample Block, Sample City.</p>
              </div>
            </div>
            <a href="" class="btn btnblue text-uppercase">Go to the location</a>
          </tab>
          <tab title="Arrived">
            <div class="panel-body mt20">
              <p class="basic">Lorem ipsum dolor sit amet consectetur adipisicing elit. Labore excepturi veniam voluptatibus eaque dolor enim itaque. Id repellendus voluptate tempora?</p>
              <a href="" class="btn btnblue text-uppercase">Arrived at the location</a>
            </div>
          </tab>
          <tab title="Investigate">
            <div class="panel-body mt20">
              <p class="basic">Lorem ipsum dolor sit amet consectetur adipisicing elit. Labore excepturi veniam voluptatibus eaque dolor enim itaque. Id repellendus voluptate tempora?</p>
              <a href="" class="btn btnblue text-uppercase">Investigate</a>
            </div>
          </tab>
          <tab title="Resolved">
            <div class="panel-body mt20">
              <p class="basic">Lorem ipsum dolor sit amet consectetur adipisicing elit. Labore excepturi veniam voluptatibus eaque dolor enim itaque. Id repellendus voluptate tempora?</p>
              <a href="" class="btn btnblue text-uppercase">Resolved</a>
            </div>
          </tab>
        </tabs>
      </div>
        <ChatBox :reportId="report._id"/>
    </div>
  </div>
</div>
</template>


<script>
import ChatBox from '~/components/ChatBox'

export default {
  middleware: 'isRespondent',
  components: {
    ChatBox
  },
  async fetch ({ store, params }) {
    await store.dispatch('respondent/getActiveReport');
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

