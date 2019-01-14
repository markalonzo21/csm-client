<template>
  <section class="admin container-fluid">
    <!-- <h1 class="title__black--large">Dashboard</h1> -->
    <h3 style="margin-top: 0;">As of {{ $moment().format('MMM. DD, YYYY') }}</h3>
    <div class="row">
      <div class="col-md-3">
        <TotalReportsCard
          :loading="fetchingDashboardDetails"
          :total="dashboardDetails.reportsCount ? dashboardDetails.reportsCount : 0"
        />
      </div>
      <div class="col-md-3">
        <ResolvedReportsCard
          :loading="fetchingDashboardDetails"
          :total="dashboardDetails.resolvedReportsCount ? dashboardDetails.resolvedReportsCount : 0"
        />
      </div>
      <div class="col-md-3">
        <UnresolvedReportsCard
          :loading="fetchingDashboardDetails"
          :total="dashboardDetails.unresolvedReportsCount ? dashboardDetails.unresolvedReportsCount : 0"
        />
      </div>
      <div class="col-md-3">
        <CancelledReportsCard
          :loading="fetchingDashboardDetails"
          :total="dashboardDetails.cancelledReportsCount ? dashboardDetails.cancelledReportsCount : 0"
        />
      </div>
      <div class="col-md-3">
        <EmergencyReportCards
          :loading="fetchingDashboardDetails"
          :total="dashboardDetails.emergencyReportsCount ? dashboardDetails.emergencyReportsCount : 0"
        />
      </div>
    </div>
    <div class="row mt-5">
      <div class="col-md-12">
        <h3 class="title__gray--small">Graphs</h3>
        <div class="col-md-6 text-center">
          <h4>Reports Per Month</h4>
          <ReportsBarChart
            v-if="reportsPerMonth.labels.length > 0"
            :labels="reportsPerMonth.labels"
            :datasets="reportsPerMonth.datasets"
          />
        </div>
        <div class="col-md-6 text-center">
          <h4>Reports Per Category</h4>
          <ReportsPieChart
            v-if="reportsPerCategory.labels.length > 0"
            :labels="reportsPerCategory.labels"
            :datasets="reportsPerCategory.datasets"
          />
        </div>
      </div>
      <!-- <div class="col-md-12 mt-12">
        <h3 class="title__gray--small">Reports Heat Map</h3>
        <div id="map-wrap" style="height: 500px; width: 100%;">
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
      </div>-->
    </div>
  </section>
</template>

<script>
import TotalReportsCard from '~/components/DashboardCards/TotalReportsCard'
import ResolvedReportsCard from '~/components/DashboardCards/ResolvedReportsCard'
import UnresolvedReportsCard from '~/components/DashboardCards/UnresolvedReportsCard'
import CancelledReportsCard from '~/components/DashboardCards/CancelledReportsCard'
import EmergencyReportCards from '~/components/DashboardCards/EmergencyReportCards'
import ReportsPieChart from '~/components/DashboardCharts/ReportsPieChart'
import ReportsBarChart from '~/components/DashboardCharts/ReportsBarChart'

export default {
  layout: 'command-center',
  components: {
    TotalReportsCard,
    ResolvedReportsCard,
    UnresolvedReportsCard,
    CancelledReportsCard,
    EmergencyReportCards,
    ReportsPieChart,
    ReportsBarChart
  },
  data() {
    return {
      // Details
      dashboardDetails: [],
      reportsPerCategory: {
        labels: [],
        datasets: []
      },
      reportsPerMonth: {
        labels: [],
        datasets: []
      },
      fetchingDashboardDetails: false
    }
  },
  mounted() {
    this.fetchingDashboardDetails = true
    const getDashboardDetails = this.$axios.$get('/admin/dashboard')
    const getreportsPerCategory = this.$axios.$get(
      '/admin/dashboard/reports-per-category'
    )
    const getReportsPerMonth = this.$axios.$get(
      '/admin/dashboard/reports-per-month'
    )

    Promise.all([
      getDashboardDetails,
      getreportsPerCategory,
      getReportsPerMonth
    ]).then(([dashboardDetails, reportsPerCategory, reportsPerMonth]) => {
      this.dashboardDetails = dashboardDetails.data
      this.reportsPerCategory = reportsPerCategory.data
      this.reportsPerMonth = reportsPerMonth.data
      this.fetchingDashboardDetails = false
    })

    this.initSocketListeners()
  },
  beforeDestroy() {
    this.$socket.off('new-report')
  },
  methods: {
    initSocketListeners() {
      this.$socket.on('new-report', report => {
        this.$notification['info']({
          message: `New report received!`,
          description: `You received a ${
            report.type.name
          } report in ${report.type.category.name.toLowerCase()}.`,
          btn: h => {
            return h(
              'a-button',
              {
                props: {
                  type: 'primary',
                  size: 'small'
                },
                on: {
                  click: () => {
                    var win = window.open(
                      `/command-center/reports/${report._id}`,
                      '_blank'
                    )
                    win.focus()
                  }
                }
              },
              'View report details.'
            )
          }
        })
        this.dashboardDetails.reportsCount++
        this.dashboardDetails.unresolvedReportsCount++
        if (report.type.category.name === 'Emergency') {
          this.dashboardDetails.emergencyReportsCount++
        }
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
