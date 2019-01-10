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
      <l-geojson v-if="area" :geojson="geojson" :options-style="{fillOpacity: 0 }"></l-geojson>
      <l-marker-cluster>
        <l-marker
          v-for="(report, index) in reports"
          :lat-lng="[report.location.coordinates[1], report.location.coordinates[0]]"
          :key="`incident-${index}`"
        >
          <l-popup :content="report.description"></l-popup>
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
    }
  }
}
</script>

<style scoped>
@import '~leaflet.markercluster/dist/MarkerCluster.css';
@import '~leaflet.markercluster/dist/MarkerCluster.Default.css';
</style>
