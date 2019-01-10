<template>
  <section class="w-full">
    <h3 class="mt-0">Incident Map</h3>
    <l-map
      style="height: 69vh;"
      v-if="center.length > 0"
      :center="center"
      :zoom="zoom"
      :minZoom="minZoom"
      :maxZoom="maxZoom"
      :maxBounds="maxBounds"
      :maxBoundsViscosity="maxBoundsViscosity"
      ref="map"
    >
      <div
        class="absolute w-full h-full flex justify-center items-center"
        style="z-index: 999999999;"
        v-if="loadingReports"
      >
        <a-icon type="loading" style="font-size: 128px;" spin/>
      </div>
      <l-geojson v-if="area" :geojson="geojson" :options-style="{fillOpacity: 0 }"></l-geojson>
      <l-marker-cluster>
        <l-marker
          v-for="(report, index) in reports"
          :lat-lng="[report.location.coordinates[1], report.location.coordinates[0]]"
          :key="`incident-${index}`"
        >
          <l-popup :content="showReportContent(report)"></l-popup>
        </l-marker>
      </l-marker-cluster>
      <!-- <LeafletHeatmap
        v-if="reports.length > 0 && !loadingHeats"
        :lat-lng="heats"
        :radius="15"
        :min-opacity="0.75"
        :blur="15"
      ></LeafletHeatmap>-->
      <l-tile-layer url="https://{s}.tile.osm.org/{z}/{x}/{y}.png"></l-tile-layer>
    </l-map>
  </section>
</template>

<script>
export default {
  layout: 'command-center/default',
  data() {
    return {
      center: [14.56679, 121.02059],
      zoom: 5,
      minZoom: 5,
      maxZoom: 18,
      maxBounds: null,
      maxBoundsViscosity: 1.0,
      area: null,
      loadingReports: false,
      reports: []
    }
  },
  mounted() {
    this.getReports()
  },
  methods: {
    getReports() {
      this.loadingReports = true
      this.$axios
        .$get('/admin/reports')
        .then(response => {
          this.reports = response.data
          this.loadingReports = false
        })
        .catch(err => {
          console.log(err.response.data)
          this.loadingReports = false
        })
    },
    showReportContent(report) {
      return `      <table class="table table-striped">
        <tbody>
          <tr>
            <td>ID</td>
            <td>${report._id}</td>
          </tr>
          <tr>
            <td>Reporter</td>
            <td>${report.reporter.email}</td>
          </tr>
          <tr>
            <td>Resolver</td>
            <td>${report.resolver ? report.resolver.email : 'N/A'}</td>
          </tr>
          <tr>
            <td>Responder</td>
            <td>${report.responder ? report.responder.email : 'N/A'}</td>
          </tr>
          <tr>
            <td>Status</td>
            <td>${report.status}</td>
          </tr>
          <tr>
            <td>Date Created</td>
            <td>${this.$moment(report.createdAt).format(
              'MMM. DD, YYYY | h:mm A '
            )}</td>
          </tr>
          <tr>
            <td>Last Updated</td>
            <td>${this.$moment(report.updatedAt).format(
              'MMM. DD, YYYY | h:mm A '
            )}</td>
          </tr>
          <tr>
            <td>Category</td>
            <td>${report.type.category.name}</td>
          </tr>
          <tr>
            <td>Type</td>
            <td>${report.type.name}</td>
          </tr>
        </tbody>
      </table>`
    }
  }
}
</script>

<style scoped>
@import '~leaflet.markercluster/dist/MarkerCluster.css';
@import '~leaflet.markercluster/dist/MarkerCluster.Default.css';
</style>
