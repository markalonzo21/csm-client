<template>
<div class="main-content">
  <div class="container p-2" style="height: 80vh;">
    <div class="row" v-if="report">
      <div class="col-md-6">
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
              class="btn btnblue" style="width: auto;"
            >Assign Respondent</button>
          </template>
        </h3>
        <h3 class="mb-1">Milestones</h3>
        <div
          class="my-2"
          v-for="(milestone, index) in report.reportType.milestones"
          :key="milestone._id"
        >{{ index + 1}}. {{ milestone.name }} {{ milestoneIsCompleted(milestone._id) ? '- Done' : '' }}</div>
      </div>
      <div class="col-md-6">
        <!-- REPORT MAP -->
        <div id="map-wrap" style="height: 300px; width: 100%;" class="mt-4">
          <no-ssr>
            <l-map
              :center="map.center"
              :maxBounds="map.maxBounds"
              :zoom="map.zoom"
              :minZoom="map.minZoom"
              :maxZoom="map.maxZoom"
              :maxBoundsViscosity="map.maxBoundsViscosity"
              ref="map"
            >
              <l-tile-layer url="http://{s}.tile.osm.org/{z}/{x}/{y}.png"></l-tile-layer>
              <l-marker :lat-lng="map.center"></l-marker>
            </l-map>
          </no-ssr>
        </div>
        <hr>
        <ChatBox :reportId="report._id"/>
      </div>
      <modal
        v-model="isAssignModalVisible"
        :class="{ 'pointer-events-none': loadingAssignRespondent }"
      >
        <select required v-model="selectedRespondent" class="form-control">
          <option :value="null">Select Respondent</option>
          <option
            v-for="respondent in availableRespondents"
            :value="respondent._id"
            :key="respondent._id"
          >{{ respondent.firstName }} {{ respondent.lastName }}</option>
        </select>
        <div slot="footer">
          <button
            @click.prevent="assignRespondent"
            class="btn btnblue" style="width: auto;"
            :disabled="!selectedRespondent"
          >Assign</button>
        </div>
      </modal>
    </div>
  </div>
  </div>
</template>

<script>
import ChatBox from '~/components/ChatBox'

export default {
  layout: 'admin',
  middleware: 'isAdmin',
  components: {
    ChatBox
  },
  asyncData({ $axios, store, params, error }) {
    return $axios.$get(`/admin/reports/${params.id}`).then(response => {
      const bounds = [120.89287, 14.63956, 121.07483, 14.5565]
      const lat = response.data.location
        ? response.data.location.coordinates[1]
        : 14.59804
      const lng = response.data.location
        ? response.data.location.coordinates[0]
        : 120.98385

      return {
        report: response.data,
        isAssignModalVisible: false,
        availableRespondents: [],
        selectedRespondent: null,
        loadingAssignRespondent: false,
        map: {
          center: [lat, lng],
          zoom: 13,
          minZoom: 13,
          maxZoom: 18,
          maxBounds: bounds,
          maxBoundsViscosity: 1.0,
          reports: []
        }
      }
    })
  },
  mounted() {
    this.initSocketListeners()
  },
  beoreDestroy() {
    this.$socket.off('milestone-completed')
  },
  methods: {
    initSocketListeners() {
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
