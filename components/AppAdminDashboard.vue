<template>
  <section class="admin container-fluid">
    <!-- <h1 class="title__black--large">Dashboard</h1> -->
    <h3 style="margin-top: 0;">Today {{ $moment().format('MMM DD, YYYY') }}</h3>
    <div class="row">
      <div class="col-md-3">
        <div class="panel">
          <div class="panel-body">
            <h2 class="title__white--large" v-text="dashboardDetails.registeredReporters">300</h2>
            <span class="title__white--mid">REGISTERED REPORTERS</span>
          </div>
        </div>
      </div>
      <div class="col-md-3">
        <div class="panel">
          <div class="panel-body">
            <h2 class="title__white--large" v-text="dashboardDetails.unassignedReports">15</h2>
            <span class="title__white--mid">UNASSIGNED REPORTS</span>
          </div>
        </div>
      </div>
      <div class="col-md-3">
        <div class="panel">
          <div class="panel-body">
            <h2 class="title__white--large" v-text="dashboardDetails.ongoingReports">300</h2>
            <span class="title__white--mid">ON GOING REPORTS</span>
          </div>
        </div>
      </div>
      <div class="col-md-3">
        <div class="panel">
          <div class="panel-body">
            <h2 class="title__white--large" v-text="dashboardDetails.availableRespondents">300</h2>
            <span class="title__white--mid">AVAILABLE RESPONDENTS</span>
          </div>
        </div>
      </div>
    </div>
    <div class="row mt-5">
      <div class="col-md-6">
        <h3 class="title__gray--small">HEAT MAP</h3>
        <div class="mt-4">
          <select v-model="type" required class="p-2">
            <option :value="null">Select Type</option>
            <option
              v-for="type in reportTypes"
              :key="type._id"
              :value="type._id"
              v-text="type.name"
            ></option>
          </select>
          <select v-model="resolvedOrUnresolved" required class="p-2">
            <option value="both">Both</option>
            <option value="resolved">Resolved Only</option>
            <option value="unresolved">Unresolved Only</option>
          </select>
          <span class="ml-2" v-if="loadingHeats">LOADING HEATS</span>
        </div>
        <div id="map-wrap" style="height: 380px; width: 100%;">
          <no-ssr>
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
              <LeafletHeatmap
                v-if="reports.length > 0 && !loadingHeats"
                :lat-lng="heats"
                :radius="15"
                :min-opacity="0.75"
                :blur="15"
              ></LeafletHeatmap>
            </l-map>
          </no-ssr>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  layout: 'command-center',
  data() {
    // const bounds = [120.89287, 14.63956, 121.07483, 14.5565]
    const bounds = [97.16309, 23.32208, 143.74512, 2.02107]
    return {
      loadingHeats: true,
      center: [14.59804, 120.98385],
      zoom: 13,
      minZoom: 13,
      maxZoom: 18,
      maxBounds: bounds,
      maxBoundsViscosity: 1.0,
      reports: [],
      // Details
      reportTypes: [],
      dashboardDetails: [],
      resolvedOrUnresolved: 'both',
      type: null
    }
  },
  computed: {
    heats() {
      return this.reports
        .filter(report => {
          return report.location.coordinates[0] !== null
        })
        .map(report => {
          return [
            report.location.coordinates[1],
            report.location.coordinates[0]
          ]
        })
    }
  },
  mounted() {
    const getReportTypes = this.$axios.$get('/report-types')
    const getDashboardDetails = this.$axios.$get('/admin/dashboard')

    Promise.all([getReportTypes, getDashboardDetails]).then(
      ([reportTypes, dashboardDetails]) => {
        this.reportTypes = reportTypes.data
        this.dashboardDetails = dashboardDetails.data
        this.resolvedOrUnresolved = 'both'
        this.type = null
      }
    )

    this.$nextTick(() => {
      const check = setInterval(() => {
        if (this.$refs.map) {
          this.maxBounds = new L.LatLngBounds(
            new L.LatLng(14.63956, 120.89287),
            new L.LatLng(14.5565, 121.07483)
          )
          // this.maxBounds = new L.LatLngBounds(
          //   new L.LatLng(23.32208, 97.16309),
          //   new L.LatLng(2.02107, 143.74512)
          // )

          this.$refs.map.mapObject.on('drag', () => {
            this.$refs.map.mapObject.panInsideBounds(this.maxBounds, {
              animate: false
            })
          })

          this.searchReports(null, 'both')
          clearInterval(check)
        }
      }, 100)
    })
  },
  watch: {
    type(value) {
      if (value === null) {
        return
      }

      this.loadingHeats = true
      this.searchReports(value, this.resolvedOrUnresolved)
    },
    resolvedOrUnresolved(value) {
      if (value === null) {
        return
      }

      this.loadingHeats = true
      this.searchReports(this.type, value)
    }
  },
  methods: {
    searchReports(type, resolvedOrUnresolved) {
      this.$axios
        .$get(`/admin/reports/${type}/${resolvedOrUnresolved}`)
        .then(response => {
          this.reports = response.data
          this.loadingHeats = false
        })
    }
  }
}
</script>

<style scoped>
.panel {
  background-image: linear-gradient(to right, #354fa3, #34c3e5);
  color: white;
}
.panel-footer {
  border: none;
  background-image: inherit;
  font-weight: bold;
}
</style>
