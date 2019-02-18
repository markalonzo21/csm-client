<template>
  <div
    class="responder active-report main-content"
    v-if="report"
  >
    <div class="container">
      <div class="active-report">
        <div class="col-md-4">
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
              >None</span>
            </div>

            <div class="clearfix">
              <span class="font-semibold text-blue-dark float-left">Status</span>
              <span class="float-right">{{ report.status}}</span>
            </div>

            <div class="border-b w-full my-4"></div>

            <div class="clearfix mt-4">
              <div class="font-semibold text-blue-dark">Notes</div>
              <p>{{ report.description }}</p>
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
        <div class="col-md-8">
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
            <ResponderCommentBox
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
import ResponderCommentBox from "~/components/ResponderCommentBox";
export default {
  components: {
    ResponderCommentBox
  },
  async fetch({ store, error, params, redirect }) {
    if (!store.getters["auth/hasPermission"]("respond")) {
      return redirect("/");
    }
    try {
      await store.dispatch("responder/getReport", params.id);
    } catch (err) {
      error({ status: err.response.status, message: "Report not found!" });
    }
  },
  computed: {
    report() {
      return this.$store.state.responder.report;
    }
  },
  mounted() {
    this.initSocketListener();
  },
  beforeDestroy() {
    this.$socket.off("report-updated");
  },
  methods: {
    initSocketListener() {
      this.$socket.on("report-updated", report => {
        this.$store.commit("responder/SET_REPORT", report);
      });
    }
  }
};
</script>

<style scoped>
.rounded {
  border-radius: 1rem;
}
</style>
