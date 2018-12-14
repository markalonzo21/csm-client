<template>
  <div class="container h-screen">
    <h1 class="text-blue-dark mt-10 uppercase">{{ area.name }}</h1>
    <hr>
    <div class="row">
      <div class="col-md-4">
        <h4>INCIDENT MAP</h4>

        <div class="border rounded bg-white p-4">
          <AreaMap :area="area" :reports="reports"/>
        </div>
      </div>

      <div class="col-md-8">
        <h4>REPORTS</h4>

        <div v-if="reports.length > 0">
          <ActiveReportResolver :report="report" v-for="report in reports" :key="report._id" @chatToggled="setChatBoxData" />
        </div>
        <div v-else>
          <div class="panel">
            <div
              class="panel-body border h-32 rounded shadow bg-white flex items-center justify-center"
            >No reports...</div>
          </div>
        </div>
      </div>
    </div>
    <ChatBox v-if="chat.reportId !== null" :reportId="chat.reportId" :isResolved="chat.isResolved" />

  </div>
</template>

<script>
  import AreaMap from '~/components/AreaMap'
  import ActiveReportResolver from '~/components/ActiveReportResolver'
  import ChatBox from '~/components/ChatBox'

  export default {
    components: {
      AreaMap,
      ActiveReportResolver,
      ChatBox
    },
    asyncData({ $axios, store, redirect, params }) {
      if (!store.getters["auth/hasPermission"]("resolve")) {
        return redirect("/");
      }

      return {
        area: store.state.auth.user.areas.find(area => area._id === params.id),
      }
    },
    data() {
      return {
        reports: [],
        bounds: null,
        chat: {
          reportId: null,
          isResolved: true
        }
      }
    },
    mounted() {
      this.getReports()
      this.initSocketListener()
    },
    beforeDestroy() {
      this.$socket.off("milestone-completed")
      this.$socket.off("milestone-confirmed")
    },
    methods: {
      initSocketListener() {
        this.$socket.on("new-report", report => {
          const contains = this.bounds.contains(
            L.latLng(
              report.location.coordinates[1],
              report.location.coordinates[0]
            )
          )

          if (contains) {
            this.reports.unshift(report)
          }
        });

        this.$socket.on("milestone-completed", (payload) => {
          const index = this.reports.findIndex(report => report._id === payload._id)

          if (index !== -1) {
            this.$set(this.reports, index, payload)
          }
        })

        this.$socket.on("milestone-confirmed", (payload) => {
          const index = this.reports.findIndex(report => report._id === payload._id)

          if (index !== -1) {
            this.$set(this.reports, index, payload)
          }
        })
      },
      getReports() {
        this.bounds = L.latLngBounds(
          L.latLng(
            this.area.location.coordinates[0][1],
            this.area.location.coordinates[0][0]
          ),
          L.latLng(
            this.area.location.coordinates[1][1],
            this.area.location.coordinates[1][0]
          )
        )

        this.$axios.$get(`/resolver/areas/${this.$route.params.id}`).then(response => {
          response.data.reports.forEach(report => {
            const contains = this.bounds.contains(
              L.latLng(
                report.location.coordinates[1],
                report.location.coordinates[0]
              )
            )

            if (contains) {
              this.reports.push(report)
            }
          })
          this.reports
        })
      },
      setChatBoxData(data) {
        this.chat.reportId = null
        this.$nextTick(() => {
          this.chat.reportId = data.reportId
          this.chat.isResolved = data.isResolved
        })
      }
    }
  }
</script>
