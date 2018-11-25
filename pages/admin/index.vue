<template>
  <section class="admin container-fluid">
    <h1 class="title__black--large">Dashboard</h1>
    <h3>Today {{ $moment().format('MMM DD, YYYY') }}</h3>
    <div class="row">
      <div class="col-md-3">
        <div class="panel">
          <div class="panel-body">
            <h2 class="title__white--large">300</h2>
            <span class="title__white--mid">REGISTERED REPORTERS</span>
          </div>
        </div>
      </div>
      <div class="col-md-3">
        <div class="panel">
          <div class="panel-body">
            <h2 class="title__white--large">15</h2>
            <span class="title__white--mid">UNASSIGNED REPORTS</span>
          </div>
        </div>
      </div>
      <div class="col-md-3">
        <div class="panel">
          <div class="panel-body">
            <h2 class="title__white--large">300</h2>
            <span class="title__white--mid">ON GOING REPORTS</span>
          </div>
        </div>
      </div>
      <div class="col-md-3">
        <div class="panel">
          <div class="panel-body">
            <h2 class="title__white--large">300</h2>
            <span class="title__white--mid">AVAILABLE RESPONDENTS</span>
          </div>
        </div>
      </div>
    </div>
    <div class="row mt-5">
      <div class="col-md-12">
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
              <l-tile-layer url="http://{s}.tile.osm.org/{z}/{x}/{y}.png"></l-tile-layer>
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
  layout: 'admin',
  asyncData({ $axios }) {
    return $axios.$get('/report-types').then(response => {
      return {
        reportTypes: response.data,
        type: null,
        resolvedOrUnresolved: 'both'
      }
    })
  },
  data() {
    const bounds = [120.89287, 14.63956, 121.07483, 14.5565]
    return {
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
    this.$nextTick(() => {
      const check = setInterval(() => {
        if (this.$refs.map) {
          this.maxBounds = new L.LatLngBounds(
            new L.LatLng(14.63956, 120.89287),
            new L.LatLng(14.5565, 121.07483)
          )

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
