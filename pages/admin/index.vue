<template>
  <section>
    <h4>Dashboard</h4>
    <br>
    <h6>Today {{ $moment().format('MMM DD, YYYY') }}</h6>
    <div class="row">
      <div class="col-md-3">
        <div class="panel">
          <div class="panel-body">
            <span>300</span>
          </div>
          <div class="panel-footer">REGISTERED REPORTERS</div>
        </div>
      </div>
      <div class="col-md-3">
        <div class="panel">
          <div class="panel-body">
            <span>15</span>
          </div>
          <div class="panel-footer">UNASSIGNED REPORTS</div>
        </div>
      </div>
      <div class="col-md-3">
        <div class="panel">
          <div class="panel-body">
            <span>300</span>
          </div>
          <div class="panel-footer">ON GOING REPORTS</div>
        </div>
      </div>
      <div class="col-md-3">
        <div class="panel">
          <div class="panel-body">
            <span>300</span>
          </div>
          <div class="panel-footer">AVAILABLE RESPONDENTS</div>
        </div>
      </div>
    </div>
    <div class="row mt-5">
      <div class="col-md-6">
        <h6>RECENT REPORTS</h6>
        <div class="row" style="margin: 0;">
          <!-- HEADING -->
          <div class="col-md-4 border" style="padding: 10px;">
            <strong>Type</strong>
          </div>
          <div class="col-md-4 border-top border-bottom" style="padding: 10px;">
            <strong>Responder</strong>
          </div>
          <div class="col-md-4 border" style="padding: 10px;">
            <strong>Status</strong>
          </div>
        </div>
        <!-- BODY -->
        <div style="max-height: 333px; overflow-y: scroll;">
          <div class="row" style="margin: 0;" v-for="n in 15">
            <div class="col-md-4 border-bottom border-right border-left" style="padding: 10px;">Type</div>
            <div class="col-md-4 border-bottom" style="padding: 10px;">Responder</div>
            <div class="col-md-4 border-bottom border-right border-left">Status</div>
          </div>
        </div>
      </div>
      <div class="col-md-6">
        <h6>HEAT MAP</h6>
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
      return this.reports.map(report => {
        return [report.location.coordinates[1], report.location.coordinates[0]]
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

          // setTimeout(() => {
          //   this.searchReports(null, 'both')
          // }, 3000)
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
.panel span {
  font-size: 52px;
}
.panel-footer {
  border: none;
  background-image: inherit;
  font-weight: bold;
}
</style>
