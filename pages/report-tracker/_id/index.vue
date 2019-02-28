<template>
  <div
    class="responder active-report main-content"
    v-if="report"
  >
    <div class="container">
      <h1 class="title__black mt0">REPORT ID #{{ report._id }}</h1>
      <div class="row">
        <div class="active-report">
          <div class="col-md-6">
            <div class="panel">
              <div class="panel-body">
                <table class="table">
                  <tbody>
                    <tr>
                      <td>
                        <span class="bluelabel">Date</span>
                      </td>
                      <td>
                        <span
                          class="basic"
                        >{{$moment(report.createdAt).format("MMM. DD, YYYY | h:mm A ")}}</span>
                      </td>
                      <td></td>
                    </tr>

                    <tr>
                      <td>
                        <span class="bluelabel">Date Resolved</span>
                      </td>
                      <td>
                        <span
                          class="basic"
                        >{{ report.resolvedAt ? $moment(report.resolvedAt).format("MMM. DD, YYYY | h:mm A ") : 'Unresolved' }}</span>
                      </td>
                      <td></td>
                    </tr>

                    <tr>
                      <td>
                        <span class="bluelabel">Category</span>
                      </td>
                      <td>
                        <span class="basic">{{ report.type.category.name }}</span>
                      </td>
                      <td></td>
                    </tr>

                    <tr>
                      <td>
                        <span class="bluelabel">Type</span>
                      </td>
                      <td>
                        <span class="basic">{{ report.type.name }}</span>
                      </td>
                      <td></td>
                    </tr>

                    <tr>
                      <td>
                        <span class="bluelabel">Reporter</span>
                      </td>
                      <td>
                        <span
                          class="basic"
                          v-if="report.reporter"
                        >{{ report.reporter.firstName }} {{ report.reporter.middleName }} {{ report.reporter.lastName }} ({{ report.reporter.mobile }})</span>
                      </td>
                      <td>
                        <span
                          @click="showModal('reporter')"
                          class="text-blue-light"
                        >
                          <svgicon name="eye"></svgicon>
                        </span>
                      </td>
                    </tr>

                    <tr>
                      <td>
                        <span class="bluelabel">Resolver</span>
                      </td>
                      <td>
                        <span
                          class="basic"
                          v-if="report.resolver"
                        >{{ report.resolver.firstName }} {{ report.resolver.middleName }} {{ report.resolver.lastName }} ({{ report.resolver.mobile }})</span>
                        <span
                          class="basic"
                          v-else
                        >None</span>
                      </td>
                      <td v-if="report.resolver">
                        <span
                          @click="showModal('resolver')"
                          class="text-blue-light"
                        >
                          <svgicon name="eye"></svgicon>
                        </span>
                      </td>
                    </tr>

                    <tr>
                      <td>
                        <span class="bluelabel">Responder</span>
                      </td>
                      <td>
                        <span
                          class="basic"
                          v-if="report.responder"
                        >{{ report.responder.firstName }} {{ report.responder.middleName }} {{ report.responder.lastName }} ({{ report.responder.mobile }})</span>
                        <span
                          class="basic"
                          v-else
                        >None</span>
                      </td>
                      <td v-if="report.responder">
                        <span
                          @click="showModal('responder')"
                          class="text-blue-light"
                        >
                          <svgicon name="eye"></svgicon>
                        </span>
                      </td>
                    </tr>

                    <tr>
                      <td>
                        <span class="bluelabel">Status</span>
                      </td>
                      <td>
                        <span class="basic">{{ report.status}}</span>
                      </td>
                      <td></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
            <div class="panel panel-notes">
              <div class="panel-body">
                <div class="bluelabel">Notes</div>
                <p class="basic">{{ report.description }}</p>
              </div>
            </div>

            <div
              class="panel panel-media"
              v-if="report.media.length > 0"
            >
              <div class="panel-body">
                <div class="font-semibold text-blue-dark">Media</div>
                <div
                  :key="media"
                  class="col-md-3"
                  v-for="media in report.media"
                >
                  <img
                    :src="media"
                    alt="image-media"
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

          <div class="col-md-6 right-content">
            <div class="panel panel-location">
              <div
                class="panel-body"
                v-if="report.location !== null"
              >
                <span class="bluelabel">Location Map</span>
                <div
                  class="mt-4"
                  id="map-wrap"
                  style="height: 200px; width: 100%;"
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
            </div>
            <CommentBox
              :report="report"
              :role="'user'"
            />
          </div>
        </div>
      </div>
    </div>
    <modal
      :footer="false"
      :title="shownRole.toUpperCase()"
      size="sm"
      v-model="modalIsVisible"
    >
      <table class="table">
        <tbody>
          <tr>
            <td>
              <span class="bluelabel">Name</span>
            </td>
            <td>
              <span
                class="basic"
              >{{ report[shownRole].firstName }} {{ report[shownRole].middleName }} {{ report[shownRole].lastName }}</span>
            </td>
          </tr>
          <tr>
            <td>
              <span class="bluelabel">Email</span>
            </td>
            <td>
              <span class="basic">{{ report[shownRole].email }}</span>
            </td>
          </tr>
          <tr>
            <td>
              <span class="bluelabel">Mobile Number</span>
            </td>
            <td>
              <span class="basic">{{ report[shownRole].mobile }}</span>
            </td>
          </tr>
          <tr>
            <td>
              <span class="bluelabel">Gender</span>
            </td>
            <td>
              <span class="basic">{{ report[shownRole].gender }}</span>
            </td>
          </tr>
          <tr>
            <td>
              <span class="bluelabel">Tenant</span>
            </td>
            <td>
              <span class="basic">{{ report[shownRole].tenant ? 'Yes' : 'No' }}</span>
            </td>
          </tr>
        </tbody>
      </table>
    </modal>
  </div>
</template>


<script>
import CommentBox from "./-CommentBox";

export default {
  data() {
    return {
      modalIsVisible: false,
      shownRole: "reporter"
    };
  },
  components: {
    CommentBox
  },
  async asyncData({ store, error, params, redirect }) {
    try {
      await store.dispatch("user/getReport", params.id);
    } catch (err) {
      error({ status: err.response.status, message: "Report not found!" });
    }
  },
  computed: {
    report() {
      return this.$store.state.user.report;
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
    },
    showModal(role) {
      this.shownRole = role;
      this.modalIsVisible = true;
    }
  }
};
</script>

<style scoped>
.table > tbody > tr > td {
  border: none;
}
.rounded {
  border-radius: 1rem;
}
.bluelabel {
  color: #34c3e5;
  font-weight: 700;
}
svg {
  height: 10px;
  cursor: pointer;
}
</style>
