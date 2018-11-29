<template>
  <div class="container">
    <div class="row">
      <div class="col-md-12 m-4" v-for="n in 2">
        <div style="height: 380px; width: 100%; ">
          <l-map
            :center="center"
            :maxBounds="maxBounds"
            :zoom="zoom"
            :minZoom="minZoom"
            :maxZoom="maxZoom"
            :maxBoundsViscosity="maxBoundsViscosity"
            ref="map"
          >
            <l-tile-layer url="https://{s}.tile.osm.org/{z}/{x}/{y}.png"></l-tile-layer>
          </l-map>
        </div>
      </div>
    </div>
  </div>
</template>

<script>


export default {
  layout: 'command-center',
  mounted () {
    const getReportTypes = this.$axios.$get('/report-types')
    const getDashboardDetails = this.$axios.$get('/admin/dashboard')

    return Promise.all([getReportTypes, getDashboardDetails]).then(
      ([reportTypes, dashboardDetails]) => {
          this.reportTypes = reportTypes.data
          this.dashboardDetails = dashboardDetails.data
      }
    )
  },
  data() {
    // const bounds = [120.89287, 14.63956, 121.07483, 14.5565]
    const bounds = [97.16309, 23.32208, 143.74512, 2.02107]
    return {
      reportTypes: [],
      dashboardDetails: [],
      resolvedOrUnresolved: 'both',
      type: null,
      loadingHeats: true,
      center: [14.59804, 120.98385],
      zoom: 13,
      minZoom: 13,
      maxZoom: 18,
      maxBounds: bounds,
      maxBoundsViscosity: 1.0,
      reports: []
    }
  },
}
</script>
