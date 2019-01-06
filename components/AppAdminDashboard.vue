<template>
  <section class="admin container-fluid">
    <!-- <h1 class="title__black--large">Dashboard</h1> -->
    <h3 style="margin-top: 0;">As of {{ $moment().format('MMM DD, YYYY') }}</h3>
    <div class="row">
      <div class="col-md-3">
        <TotalReportsCard/>
      </div>
      <div class="col-md-3">
        <ResolvedReportsCard/>
      </div>
      <div class="col-md-3">
        <UnresolvedReportsCard/>
      </div>
      <div class="col-md-3">
        <CancelledReportsCard/>
      </div>
    </div>
    <div class="row mt-5">
      <div class="col-md-12">
        <h3 class="title__gray--small">Graphs</h3>

        <div class="col-md-6">
          <ReportsPieChart/>
        </div>
        <div class="col-md-6">
          <ReportsBarChart/>
        </div>
      </div>
      <div class="col-md-12">
        <h3 class="title__gray--small">INCIDENT HEAT MAP</h3>
        <div id="map-wrap" style="height: 500px; width: 100%;">
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
        <div class="my-4">
          <select v-model="type" required class="p-2">
            <option :value="null">Select Type</option>
            <option v-for="type in types" :key="type._id" :value="type._id" v-text="type.name"></option>
          </select>
          <select v-model="resolvedOrUnresolved" required class="p-2">
            <option value="both">Both</option>
            <option value="resolved">Resolved Only</option>
            <option value="unresolved">Unresolved Only</option>
          </select>
          <span class="ml-2" v-if="loadingHeats">LOADING HEATS</span>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import TotalReportsCard from '~/components/DashboardCards/TotalReportsCard'
import ResolvedReportsCard from '~/components/DashboardCards/ResolvedReportsCard'
import UnresolvedReportsCard from '~/components/DashboardCards/UnresolvedReportsCard'
import CancelledReportsCard from '~/components/DashboardCards/CancelledReportsCard'
import ReportsPieChart from '~/components/DashboardCharts/ReportsPieChart'
import ReportsBarChart from '~/components/DashboardCharts/ReportsBarChart'
export default {
  layout: 'command-center',
  components: {
    TotalReportsCard,
    ResolvedReportsCard,
    UnresolvedReportsCard,
    CancelledReportsCard,
    ReportsPieChart,
    ReportsBarChart
  },
  data() {
    return {
      loadingHeats: true,
      center: [14.56679, 121.02059],
      zoom: 5,
      minZoom: 5,
      maxZoom: 18,
      maxBounds: null,
      maxBoundsViscosity: 1.0,
      // Details
      types: [],
      dashboardDetails: [],
      resolvedOrUnresolved: 'both',
      type: null,
      reports: [],
      columns: [
        {
          title: 'Type',
          dataIndex: 'reportType.name'
        },
        {
          title: 'Responder',
          dataIndex: 'assignedTo.email'
        },
        {
          title: 'Created At',
          dataIndex: 'createdAt',
          scopedSlots: { customRender: 'createdAt' }
        },
        {
          title: 'Operation',
          dataIndex: 'operation',
          scopedSlots: { customRender: 'operation' }
        }
      ]
    }
  },
  computed: {
    heats() {
      if (this.reports.length > 0) {
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
      return []
    }
  },
  mounted() {
    const getReportTypes = this.$axios.$get('/report-types')
    const getDashboardDetails = this.$axios.$get('/admin/dashboard')

    Promise.all([getReportTypes, getDashboardDetails]).then(
      ([types, dashboardDetails]) => {
        this.types = types.data
        this.dashboardDetails = dashboardDetails.data
        this.resolvedOrUnresolved = 'both'
        this.type = null
      }
    )

    this.$nextTick(() => {
      const check = setInterval(() => {
        if (this.$refs.map) {
          this.maxBounds = new L.LatLngBounds(
            new L.LatLng(4.800675384778373, 104.94140625000001),
            new L.LatLng(20.96143961409684, 138.99902343750003)
          )

          this.searchReports(null, 'both')
          clearInterval(check)
        }
      }, 100)
    })

    this.initSocketListeners()
  },
  beforeDestroy() {
    this.$socket.off('new-report')
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
    initSocketListeners() {
      this.$socket.on('new-report', report => {
        this.searchReports(this.type, this.resolvedOrUnresolved)
      })
    },
    searchReports(type, resolvedOrUnresolved) {
      this.loadingHeats = true
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
h3 {
  margin-top: 0;
}
</style>
