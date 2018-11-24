<template>
  <div class="container p-2" style="height: 80vh;">
    <h3 class="mb-1">Report: {{ report._id }}</h3>
    <h3 class="mb-1">Report Type: {{ report.reportType.name }}</h3>
    <h3 class="mb-1">Report Description: {{ report.description }}</h3>
    <h3
      class="mb-1"
    >Reported By: {{ report.reportedBy.firstName }} {{ report.reportedBy.lastName }} ({{ report.reportedBy.mobile }})</h3>
    <h3 class="mb-1">Assigned To:
      <template
        v-if="report.assignedTo"
      >{{ report.assignedTo.firstName }} {{ report.assignedTo.lastName }}</template>
      <template v-else>
        <button
          @click.prevent="showAssignModal"
          class="underline cursor-pointer text-blue"
        >Assign Respondent</button>
      </template>
    </h3>
    <h3 class="mb-1">Milestones</h3>
    <div
      class="my-2"
      v-for="(milestone, index) in report.reportType.milestones"
      :key="milestone._id"
    >{{ index + 1}}. {{ milestone.name }} {{ milestoneIsCompleted(milestone._id) ? '- Done' : '' }}</div>
    <modal
      v-model="isAssignModalVisible"
      :class="{ 'pointer-events-none': loadingAssignRespondent }"
    >
      <select required v-model="selectedRespondent" class="form-control">
        <option :value="null">Select Respondent</option>
        <option
          v-for="respondent in availableRespondents"
          :value="respondent._id"
        >{{ respondent.firstName }} {{ respondent.lastName }}</option>
      </select>
      <div slot="footer">
        <button
          @click.prevent="assignRespondent"
          class="btn btn-primary"
          :disabled="!selectedRespondent"
        >Assign</button>
      </div>
    </modal>
  </div>
</template>

<script>
export default {
  layout: 'admin',
  middleware: 'isAdmin',
  asyncData({ $axios, store, params, error }) {
    return $axios.$get(`/admin/reports/${params.id}`).then(response => {
      return {
        report: response.data,
        isAssignModalVisible: false,
        availableRespondents: [],
        selectedRespondent: null,
        loadingAssignRespondent: false
      }
    })
  },
  mounted() {
    this.initSocketListeners()
  },
  methods: {
    initSocketListeners() {
      this.$socket.on('milestone-completed', milestoneId => {
        this.report.responses.push(milestoneId)
      })
    },
    milestoneIsCompleted(id) {
      return this.report.responses.includes(id)
    },
    showAssignModal() {
      this.isAssignModalVisible = true
      this.$axios
        .$get(`/admin/available-respondents?type=${this.report.reportType._id}`)
        .then(response => {
          this.availableRespondents = response.data
        })
    },
    assignRespondent() {
      this.loadingAssignRespondent = true
      this.$axios
        .$post(`admin/assign-respondent`, {
          reportId: this.report._id,
          respondentId: this.selectedRespondent
        })
        .then(response => {
          this.isAssignModalVisible = false
          this.report = response.data
          this.availableRespondents = []
          this.loadingAssignRespondent = false
        })
    }
  }
}
</script>

<style>
.center-div {
  width: 500px;
  height: 300px;
  position: absolute;
  left: 50%;
  top: 30%;
  transform: translate(-50%, -50%);
}
</style>
