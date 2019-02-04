<template>
  <div class="container" style="min-height: 88.3vh;" v-if="area">
    <h1 class="text-blue-dark mt-10 uppercase">{{ area.name }}</h1>
    <hr>
    <div class="row">
      <div class="col-md-12" v-if="$store.state.auth.loggedIn">
        <h4>Active Reports</h4>
        <div v-if="loadingGetReports">
          <div class="panel">
            <div class="panel-body h-32 rounded shadow bg-white flex items-center justify-center">
              <a-spin/>
            </div>
          </div>
        </div>
        <div v-else-if="activeReports.length > 0">
          <ActiveReportResolver
            :activeChat="chat"
            :key="report._id"
            :report="report"
            v-for="report in activeReports"
          />
        </div>
        <div v-else>
          <div class="panel">
            <div
              class="panel-body h-32 rounded shadow bg-white flex items-center justify-center"
            >No Active Reports...</div>
          </div>
        </div>

        <h4>New Reports</h4>
        <div v-if="loadingGetReports">
          <div class="panel">
            <div class="panel-body h-32 rounded shadow bg-white flex items-center justify-center">
              <a-spin/>
            </div>
          </div>
        </div>
        <div v-else-if="reports.length > 0">
          <NewReportResolver :key="report._id" :report="report" v-for="report in reports"/>
        </div>
        <div v-else>
          <div class="panel">
            <div
              class="panel-body h-32 rounded shadow bg-white flex items-center justify-center"
            >No New Reports...</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import ActiveReportResolver from '~/components/ActiveReportResolver'
import NewReportResolver from '~/components/NewReportResolver'
import ResolverChatBox from '~/components/ResolverChatBox'

export default {
  components: {
    ActiveReportResolver,
    NewReportResolver,
    ResolverChatBox
  },
  asyncData({ $axios, store, redirect, params }) {
    if (!store.getters['auth/hasPermission']('resolve')) {
      return redirect('/')
    }

    return {
      area: store.state.auth.user.areas.find(area => area.name === params.name)
    }
  },
  data() {
    return {
      activeReports: [],
      reports: [],
      chat: {
        reportId: null,
        isResolved: true
      },
      geojson: null,
      center: [14.53116, 121.04653],
      zoom: 13,
      minZoom: 13,
      maxZoom: 18,
      maxBounds: [],
      maxBoundsViscosity: 1.0,
      loadingGetReports: true
    }
  },
  mounted() {
    this.getReports()
    this.initSocketListener()
  },
  methods: {
    initSocketListener() {
      this.$socket.on('new-report', report => {
        const contains = this.maxBounds.contains(
          L.latLng(
            report.location.coordinates[1],
            report.location.coordinates[0]
          )
        )

        if (contains) {
          if (!report.resolver) {
            this.reports.push(report)
          } else if (
            report.resolver._id.toString() === this.$auth.user._id.toString()
          ) {
            this.activeReports.push(report)
            console.log(this.activeReports.length)
          }
        }
      })

      this.$socket.on('report-updated', payload => {
        const index = this.reports.findIndex(
          report => report._id === payload._id
        )

        if (index !== -1) {
          this.$set(this.reports, index, payload)
        }
      })
    },
    getReports() {
      this.loadingGetReports = true
      const geoJSON = L.geoJSON(this.area.location)
      this.geojson = geoJSON.toGeoJSON()
      this.maxBounds = geoJSON.getBounds()
      // this.$nextTick(() => {
      //   this.$refs.map.mapObject.fitBounds(this.maxBounds);
      // });

      this.$axios
        .$get(`/resolver/areas/${this.$route.params.name}`)
        .then(response => {
          this.activeReports = response.data.activeReports
          this.reports = response.data.reports
          this.loadingGetReports = false
        })
        .catch(err => {
          this.loadingGetReports = false
        })
    },
    setResolverChatBoxData(data) {
      this.chat.reportId = null
      this.$nextTick(() => {
        this.chat.reportId = data.reportId
        this.chat.isResolved = data.isResolved
      })
    }
  }
}
</script>
