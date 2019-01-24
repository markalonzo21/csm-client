<template>
  <div class="responder active-report main-content" v-if="report">
    <div class="container">
      <div class="active-report">
        <div class="col-md-6">
          <div class="border rounded bg-white py-6 px-6">
            <div class="clearfix">
              <span class="font-semibold text-blue-dark float-left">Date</span>
              <span
                class="float-right"
              >{{$moment(report.createdAt).format("MMM. DD, YYYY | h:mm A ")}}</span>
            </div>
            <div class="clearfix" v-if="report.resolvedAt">
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
              >{{ report.resolver.firstName }} {{ report.resolver.middleName }} {{ report.resolver.lastName }} ({{ report.resolver.mobile }})</span>
            </div>
            <div class="clearfix">
              <span class="font-semibold text-blue-dark float-left">Responder</span>
              <span
                class="float-right"
                v-if="report.responder"
              >{{ report.responder.firstName }} {{ report.responder.middleName }} {{ report.responder.lastName }} ({{ report.responder.mobile }})</span>
              <span v-else>None</span>
            </div>

            <div class="clearfix">
              <span class="font-semibold text-blue-dark float-left">Status</span>
              <span class="float-right">{{ report.status}}</span>
            </div>
          </div>
          <div class="border rounded bg-white py-6 px-6 mt-8">
            <div class="clearfix mt-4">
              <div class="font-semibold text-blue-dark">Notes</div>
              <p>{{ report.description }}</p>
            </div>
          </div>
          <div class="border rounded bg-white py-6 px-6 mt-8" v-if="report.media.length > 0">
            <div class="font-semibold text-blue-dark">Media</div>
            <div class="col-md-3" v-for="media in report.media" :key="media">
              <img :src="media" alt="image-media" v-if="$utils.isImage(media)">
              <video width="300" controls v-else>
                <source :src="media" type="video/mp4">
              </video>
            </div>
          </div>
        </div>

        <div class="col-md-6">
          <div class="border rounded bg-white py-6 px-6" v-if="report.location !== null">
            <h4 class="font-bold mt-0 text-blue-darker">Incident Location</h4>
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

          <div class="border rounded bg-white py-6 px-6 mt-8">
            <CommentBox :type="'user'"/>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>


<script>
import CommentBox from '~/components/CommentBox'

export default {
  components: {
    CommentBox
  },
  async asyncData({ store, error, params, redirect }) {
    try {
      await store.dispatch('user/getReport', params.id)
    } catch (err) {
      error({ status: err.response.status, message: 'Report not found!' })
    }
  },
  computed: {
    report() {
      return this.$store.state.user.report
    }
  },
  mounted() {
    this.initSocketListener()
  },
  beforeDestroy() {
    this.$socket.off('report-updated')
  },
  methods: {
    initSocketListener() {
      this.$socket.on('report-updated', report => {
        this.$store.commit('responder/SET_REPORT', report)
      })
    }
  }
}
</script>

<style scoped>
.rounded {
  border-radius: 1rem;
}
</style>
