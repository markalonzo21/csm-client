<template>
  <div class="container p-2" style="height: 80vh; width: 100%;">
    <div class="row" v-if="report">
      <div class="col-md-6">
        <h3 class="mb-1">ID: {{ report._id }}</h3>
        <h3 class="mb-1">Type: {{ report.reportType.name }}</h3>
        <h3 class="mb-1">Description: {{ report.description }}</h3>
        <h3
          class="mb-1"
        >Reported By: {{ report.reportedBy.firstName }} {{ report.reportedBy.lastName }} ({{ report.reportedBy.mobile }})</h3>
        <template v-if="report.assignedTo">
          <h3 class="mb-1">
            Assigned To:
            {{ report.assignedTo.firstName }} {{ report.assignedTo.lastName }}
          </h3>
        </template>
        <template v-else>
          <button
            @click.prevent="showAssignModal"
            class="btn btn-primary mt30"
            style="width: auto;"
          >Assign Responder</button>
        </template>
        <h3 v-if="report.photos.length > 0">Photos</h3>
        <div class="row">
          <div class="col-md-3" v-for="photo in report.photos">
            <div class="panel">
              <div class="panel-body">
                <img :src="showPhoto(photo)" alt="image" class="h-24 w-24">
              </div>
            </div>
          </div>
        </div>
        <h3 class="mb-1">Milestones</h3>
        <div class="my-2" v-for="(response, index) in report.responses" :key="response._id">
          {{ index + 1 }}. {{ response.responseType.name }} {{ milestoneIsCompleted(response._id) ? `- Completed at ${$moment(response.resolvedAt).format('hh:mm:ss A - MMM. DD, YYYY')}` : '' }}
          <a
            class="cursor-pointer"
            @click.prevent="confirmResponse(response)"
            v-if="response.resolvedAt !== null && response.confirmed === false"
          >- Click to Confirm</a>
        </div>
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
              <l-tile-layer url="https://{s}.tile.osm.org/{z}/{x}/{y}.png"></l-tile-layer>
              <l-marker :lat-lng="map.center"></l-marker>
            </l-map>
          </no-ssr>
        </div>
        <hr>
        <ChatBox :reportId="report._id"/>
      </div>
      <modal
        class="assign-modal"
        :header="false"
        v-model="isAssignModalVisible"
        :class="{ 'pointer-events-none': loadingAssignResponder }"
      >
        <!-- <table class="table">
          <tbody>
            <tr>
              <td class="title">Order No.</td>
              <td class="details">AA-1234567-2018</td>
            </tr>
            <tr>
              <td class="title">Category</td>
              <td class="details">Security Management</td>
            </tr>
            <tr>
              <td class="title">Type</td>
              <td class="details">Theft</td>
            </tr>
            <tr>
              <td class="title">Reporter</td>
              <td class="details">Andrei Nicolo Francisco</td>
            </tr>
          </tbody>
        </table>-->
        <!-- <div class="location-info mb20">
          <span class="title">Location</span>
          <br>
          <span
            class="details"
          >Lorem ipsum dolor sit amet consectetur adipisicing elit. Eligendi aliquam debitis nostrum labore facilis sit, incidunt recusandae temporibus fuga nihil!</span>
        </div>
        <div class="notes-info mb20">
          <span class="title">Notes</span>
          <br>
          <span
            class="details"
          >Lorem ipsum dolor sit amet consectetur adipisicing elit. Eligendi aliquam debitis nostrum labore facilis sit, incidunt recusandae temporibus fuga nihil!</span>
        </div>-->
        <div class="row">
          <div class="col-md-3">
            <label for class="title">Responder</label>
          </div>
          <div class="col-md-9">
            <select required v-model="selectedResponder" class="form-control">
              <option :value="null">Select Responder</option>
              <option
                v-for="responder in availableResponders"
                :value="responder._id"
                :key="responder._id"
              >{{ responder.firstName }} {{ responder.lastName }}</option>
            </select>
          </div>
        </div>
        <div slot="footer" class="text-center">
          <button
            @click.prevent="assignResponder"
            class="btn btn-primary"
            style="width: auto;"
            :disabled="!selectedResponder"
          >Assign Responder</button>
        </div>
      </modal>
    </div>
  </div>
</template>

<script>
import ChatBox from "~/components/ChatBox";

export default {
  layout: "command-center",
  components: {
    ChatBox
  },

  asyncData({ $axios, store, params, error }) {
    if (!store.getters["auth/hasPermission"]("view reports")) {
 return redirect("/");
    }
    return $axios.$get(`/admin/reports/${params.id}`).then(response => {
      console.log(response.data.location);
      const bounds = [120.89287, 14.63956, 121.07483, 14.5565];
      const lat = response.data.location
        ? response.data.location.coordinates[1]
        : 14.59804;
      const lng = response.data.location
        ? response.data.location.coordinates[0]
        : 120.98385;

      return {
        report: response.data,
        isAssignModalVisible: false,
        availableResponders: [],
        selectedResponder: null,
        loadingAssignResponder: false,
        map: {
          center: [lat, lng],
          zoom: 13,
          minZoom: 13,
          maxZoom: 18,
          maxBounds: bounds,
          maxBoundsViscosity: 1.0,
          reports: []
        }
      };
    });
  },
  mounted() {
    this.initSocketListeners();
  },
  beoreDestroy() {
    this.$socket.off("milestone-completed");
  },
  methods: {
    showPhoto(photo) {
      const baseUrl = process.env.API_URL
        ? process.env.API_URL
        : "https://incident-reporting-api.now.sh";
      return `${baseUrl}/${photo}`;
    },
    initSocketListeners() {
      this.$socket.on("milestone-completed", newResponse => {
        let responseIndex = this.report.responses.findIndex(
          response => response._id === newResponse._id
        );

        this.$set(this.report.responses, responseIndex, newResponse);

        this.$notify({
          type: "info",
          title: "Help Update!",
          content: newResponse.name
        });
      });
    },
    milestoneIsCompleted(response) {
      return response.resolvedAt !== null;
    },
    showAssignModal() {
      this.isAssignModalVisible = true;
      this.$axios
        .$get(`/admin/available-responders?type=${this.report.reportType._id}`)
        .then(response => {
          this.availableResponders = response.data;
        });
    },
    assignResponder() {
      this.loadingAssignResponder = true;
      this.$axios
        .$post(`admin/assign-responder`, {
          reportId: this.report._id,
          responderId: this.selectedResponder
        })
        .then(response => {
          this.isAssignModalVisible = false;
          this.report = response.data;
          this.availableResponders = [];
          this.loadingAssignResponder = false;
        });
    },
    confirmResponse(response) {
      this.$axios
        .$post(`/confirm-response`, {
          reportId: this.report._id,
          responseId: response._id
        })
        .then(response => {
          this.isAssignModalVisible = false;
          this.report = response.data;
          this.availableResponders = [];
          this.loadingAssignResponder = false;
        });
    }
  }
};
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
