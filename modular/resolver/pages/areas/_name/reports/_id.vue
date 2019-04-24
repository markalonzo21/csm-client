<template>
  <div
    class="responder active-report main-content"
    v-if="report"
  >
    <!-- MODAL -->
    <modal
      :class="{ 'pointer-events-none': loadingAssignResponder }"
      :header="false"
      class="assign-modal"
      v-model="updateModalVisible"
    >
      <div class="row text-center">
        <h3 class="mt-0 mb-6">Update Responder</h3>
      </div>
      <div class="row">
        <div class="col-md-12">
          <div v-if="loadingGetAvailableResponders">Loading...</div>
          <select
            class="form-control"
            required
            v-else
            v-model="selectedResponder"
          >
            <option :value="null">Select Responder</option>
            <option
              :key="responder._id"
              :value="responder._id"
              v-for="responder in availableResponders"
            >{{ responder.firstName }} {{ responder.lastName }}</option>
          </select>
        </div>
      </div>
      <div
        class="text-center"
        slot="footer"
      >
        <button
          :disabled="!selectedResponder"
          @click.prevent="updateResponder"
          class="btn btn-primary float-right"
          style="width: auto;"
        >Save</button>
      </div>
    </modal>
    <div class="container">
      <div class="active-report">
        <div class="col-md-5">
          <div class="border rounded bg-white py-6 px-6">
            <div class="clearfix">
              <span class="font-semibold text-blue-dark float-left">Date</span>
              <span
                class="float-right"
              >{{$moment(report.createdAt).format("MMM. DD, YYYY | h:mm A ")}}</span>
            </div>
            <div
              class="clearfix"
              v-if="report.resolvedAt"
            >
              <span class="font-semibold text-blue-dark float-left">Date Resolved</span>
              <span
                class="float-right"
              >{{$moment(report.resolvedAt).format("MMM. DD, YYYY | h:mm A ")}}</span>
            </div>
            <div class="clearfix">
              <span class="font-semibold text-blue-dark float-left">Category</span>
              <span class="float-right">{{ report.type.category.name }}</span>
            </div>
            <div class="clearfix">
              <span class="font-semibold text-blue-dark float-left">Type</span>
              <span class="float-right">{{ report.type.name }}</span>
            </div>
            <div class="clearfix">
              <span class="font-semibold text-blue-dark float-left">Reporter</span>
              <span
                class="float-right"
              >{{ report.reporter.firstName }} {{ report.reporter.middleName }} {{ report.reporter.lastName }} ({{ report.reporter.mobile }})</span>
            </div>
            <div class="clearfix">
              <span class="font-semibold text-blue-dark float-left">Resolver</span>
              <span
                class="float-right"
                v-if="report.resolver"
              >{{ report.resolver.firstName }} {{ report.resolver.middleName }} {{ report.resolver.lastName }} ({{ report.resolver.mobile }})</span>
              <span
                class="float-right"
                v-else
              ></span>
            </div>
            <div class="clearfix">
              <span class="font-semibold text-blue-dark float-left">Responder</span>
              <span
                class="float-right"
                v-if="report.responder"
              >{{ report.responder.firstName }} {{ report.responder.middleName }} {{ report.responder.lastName }} ({{ report.responder.mobile }})</span>
              <span
                class="float-right"
                v-else
              >
                <a @click.prevent="changeResponder">Assign Responder</a>
              </span>
            </div>

            <div class="clearfix">
              <span class="font-semibold text-blue-dark float-left">Status</span>
              <span class="float-right">
                <select
                  @change="statusChanged"
                  class="capitalize form-control"
                >
                  <option
                    :selected="status === currentStatus"
                    class="capitalize"
                    v-for="status in ['pending', 'in progress', 'resolved', 'cancelled']"
                  >{{ status }}</option>
                </select>
              </span>
            </div>

            <div class="border-b w-full my-4"></div>

            <div class="clearfix mt-4">
              <div class="font-semibold text-blue-dark">Notes</div>
              <p class="whitespace-pre-wrap">{{ report.description }}</p>
            </div>
          </div>
          <div
            class="border rounded bg-white py-6 px-6 mt-4 mb-4"
            v-if="report.media.length > 0"
          >
            <h4 class="font-bold mt-0 text-blue-darker">Media</h4>
            <div class="row">
              <div class="col-md-12">
                <div
                  :key="media"
                  class="inline-block mx-2"
                  v-for="media in report.media"
                >
                  <img
                    :src="media"
                    alt="image-media"
                    style="max-width: 80px; max-height: 80px;"
                    v-if="$utils.isImage(media)"
                  >
                  <video
                    controls
                    v-else
                    width="300"
                  >
                    <source
                      :src="media"
                      type="video/mp4"
                    >
                  </video>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="col-md-7">
          <div
            class="row border rounded bg-white py-6 px-6 mb-2"
            v-if="report.location !== null"
          >
            <h4 class="font-bold mt-0 text-blue-darker">Incident Location</h4>
            <div
              class="mt-4"
              id="map-wrap"
              style="height: 300px; width: 100%;"
            >
              <no-ssr>
                <l-map
                  :center="report.map.center"
                  :maxZoom="report.map.maxZoom"
                  :minZoom="report.map.minZoom"
                  :zoom="report.map.zoom"
                  ref="map"
                >
                  <l-tile-layer url="https://{s}.tile.osm.org/{z}/{x}/{y}.png"></l-tile-layer>
                  <l-marker :lat-lng="report.map.center"></l-marker>
                </l-map>
              </no-ssr>
            </div>
          </div>

          <div class="row border rounded mb-0 mt-4">
            <ResolverCommentBox
              :report="report"
              :role="'responder'"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>


<script>
import ResolverCommentBox from "./-ResolverCommentBox";
import Vue from "vue";
if (process.client) {
  const { LMap, LTileLayer, LMarker } = require("vue2-leaflet");

  Vue.component("l-map", LMap);
  Vue.component("l-tile-layer", LTileLayer);
  Vue.component("l-marker", LMarker);
}
export default {
  components: {
    ResolverCommentBox
  },
  async fetch({ store, error, params, redirect }) {
    if (!store.getters["auth/hasPermission"]("resolve")) {
      return redirect("/");
    }
    try {
      await store.dispatch("resolver/getReport", params.id);
    } catch (err) {
      error({ status: err.response.status, message: "Report not found!" });
    }
  },
  computed: {
    report() {
      return this.$store.state.resolver.report;
    }
  },
  mounted() {
    this.initSocketListener();
    this.currentStatus = this.report.status;
  },
  beforeDestroy() {
    this.$socket.off("report-updated");
  },
  data() {
    return {
      selectedResponder: null,
      updateModalVisible: false,
      loadingAssignResponder: false,
      loadingGetAvailableResponders: false,
      availableResponders: [],
      currentStatus: null
    };
  },
  methods: {
    initSocketListener() {
      this.$socket.on("report-updated", report => {
        this.$store.commit("resolver/SET_REPORT", report);
      });
    },
    changeResponder() {
      this.updateModalVisible = true;

      this.loadingGetAvailableResponders = true;
      this.$axios
        .$get(
          `/api/v1/resolver/available-responders?type=${
            this.report.type._id
          }&areaId=${this.$route.params.id}`
        )
        .then(response => {
          this.availableResponders = response.data;
          this.loadingGetAvailableResponders = false;
          this.selectedResponder = this.report.responder
            ? this.report.responder._id
            : null;
          if (response.data.length === 0) {
            alert("No available responders at the moment!");
            this.updateModalVisible = false;
          }
        });
    },
    updateResponder() {
      this.loadingAssignResponder = true;
      this.$axios
        .$post(`/api/v1/resolver/assign-responder`, {
          reportId: this.report._id,
          responderId: this.selectedResponder
        })
        .then(response => {
          this.updateModalVisible = false;
          this.loadingAssignResponder = false;
        });
    },
    statusChanged(event) {
      var confirmed = confirm("Are you sure you want to update the status?");

      if (confirmed) {
        this.$axios
          .$post("/api/v1/resolver/update-report-status", {
            status: event.target.value,
            reportId: this.report._id
          })
          .then(response => {
            alert("Update successful!");
            this.currentStatus = response.data.status;
          })
          .catch(err => {
            alert("Something went wrong!");
            event.target.value = this.currentStatus;
          });
      } else {
        event.target.value = this.currentStatus;
      }
    }
  }
};
</script>

<style scoped>
.rounded {
  border-radius: 1rem;
}
</style>
