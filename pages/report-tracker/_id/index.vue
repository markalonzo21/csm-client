<template>
  <div class="responder active-report main-content" v-if="report">
    <div class="container">
      <h1 class="title__black mt0 uppercase">Report ID #</h1>
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
                    <span class="basic">{{$moment(report.createdAt).format("MMM. DD, YYYY | h:mm A ")}}</span>
                  </td>
                  <td>
                    
                  </td>
                </tr>

                <tr>
                  <td>
                    <span class="bluelabel">Date Resolved</span>
                  </td>
                  <td>
                    <span class="basic">{{$moment(report.resolvedAt).format("MMM. DD, YYYY | h:mm A ")}}</span>
                  </td>
                  <td>
                  </td>
                </tr>

                <tr>
                  <td>
                    <span class="bluelabel">Category</span>
                  </td>
                  <td>
                    <span class="basic">{{ report.type.category.name }}</span>                    
                  </td>
                  <td>
                  </td>
                </tr>

                <tr>
                  <td>
                    <span class="bluelabel">Type</span>
                  </td>
                  <td>
                    <span class="basic">{{ report.type.name }}</span>
                  </td>
                  <td>
                  </td>
                </tr>

                <tr>
                  <td>
                    <span class="bluelabel">Reporter</span>
                  </td>
                  <td>
                    <span class="basic" v-if="report.reporter">{{ report.reporter.firstName }} {{ report.reporter.middleName }} {{ report.reporter.lastName }} ({{ report.reporter.mobile }})</span>
                  </td>
                  <td>
                    <span @click="open1=true">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 12.857">
                      <defs>
                        <style>
                          .cls-1 {
                            fill: #0ca4dd;
                          }
                        </style>
                      </defs>
                      <path id="Path_529" data-name="Path 529" class="cls-1" d="M19.777,97.024a11.92,11.92,0,0,0-4.2-4.107,10.792,10.792,0,0,0-11.149,0,11.917,11.917,0,0,0-4.2,4.107,1.44,1.44,0,0,0,0,1.54,11.915,11.915,0,0,0,4.2,4.107,10.81,10.81,0,0,0,11.149.006,11.841,11.841,0,0,0,4.2-4.113,1.44,1.44,0,0,0,0-1.54ZM7.606,93.971a3.266,3.266,0,0,1,2.394-1,.536.536,0,1,1,0,1.071,2.324,2.324,0,0,0-2.321,2.322.536.536,0,1,1-1.072,0A3.266,3.266,0,0,1,7.606,93.971Zm7.244,7.467a9.349,9.349,0,0,1-9.7,0,11.52,11.52,0,0,1-3.722-3.644,10.969,10.969,0,0,1,4.252-3.94A4.877,4.877,0,0,0,5,96.365,4.816,4.816,0,0,0,6.468,99.9,4.815,4.815,0,0,0,10,101.365,4.816,4.816,0,0,0,13.532,99.9,4.814,4.814,0,0,0,15,96.365a4.877,4.877,0,0,0-.681-2.511,10.97,10.97,0,0,1,4.252,3.94A11.517,11.517,0,0,1,14.849,101.438Z" transform="translate(0 -91.365)"/>
                    </svg>
                    </span>
                  </td>
                </tr>

                <tr>
                  <td>
                    <span class="bluelabel">Resolver</span>
                  </td>
                  <td>
                    <span class="basic" v-if="report.resolver">{{ report.resolver.firstName }} {{ report.resolver.middleName }} {{ report.resolver.lastName }} ({{ report.resolver.mobile }})</span>
                    <span class="basic" v-else>None</span>
                  </td>
                  <td>
                  </td>
                </tr>

                <tr>
                  <td>
                    <span class="bluelabel">Responder</span>
                  </td>
                  <td>
                    <span class="basic" v-if="report.responder">{{ report.responder.firstName }} {{ report.responder.middleName }} {{ report.responder.lastName }} ({{ report.responder.mobile }})</span>
                    <span class="basic" v-else>None</span>
                  </td>
                  <td>
                  </td>
                </tr>

                <tr>
                  <td>
                    <span class="bluelabel">Status</span>
                  </td>
                  <td>
                    <span class="basic">{{ report.status}}</span>                    
                  </td>
                  <td>
                  </td>
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
          
          <div class="panel panel-media">
            <div class="panel-body" v-if="report.media.length > 0">
              <div class="font-semibold text-blue-dark">Media</div>
              <div class="col-md-3" v-for="media in report.media" :key="media">
                <img :src="media" alt="image-media" v-if="$utils.isImage(media)">
                <video width="300" controls v-else>
                  <source :src="media" type="video/mp4">
                </video>
              </div>
            </div>
          </div>
        </div>

        <div class="col-md-6 right-content">
          <div class="panel panel-location">
            <div class="panel-body" v-if="report.location !== null">
              <span class="bluelabel">Location Map</span>
              <div id="map-wrap" style="height: 200px; width: 100%;" class="mt-4">
                <no-ssr>
                  <l-map
                    :center="report.map.center"
                    :zoom="report.map.zoom"
                    :minZoom="report.map.minZoom"
                    :maxZoom="report.map.maxZoom"
                    ref="map"
                  >
                    <l-tile-layer url="https://{s}.tile.osm.org/{z}/{x}/{y}.png"></l-tile-layer>
                    <l-marker :lat-lng="report.map.center"></l-marker>
                  </l-map>
                </no-ssr>
              </div>
            </div>
          </div>
          <CommentBox :type="'user'"/>
        </div>
      </div>
      </div>
      
    </div>
    <modal v-model="open1" title="Responder" size="sm" :footer="false">
      <table class="table">
        <tbody>
          <tr>
            <td>
            <span class="bluelabel">Name</span>
            </td>
            <td>
            <span class="basic">Janno Reyes</span>
            </td>
          </tr>
        </tbody>
      </table>
    </modal>
  </div>
</template>


<script>
import CommentBox from "~/components/CommentBox";

export default {
  data () {
    return {
      open1: false,
    }
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
    }
  }
};
</script>

<style scoped>
.table>tbody>tr>td {
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
