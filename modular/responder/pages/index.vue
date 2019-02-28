<template>
  <div class="main-content">
    <section class="responder-dashboard container">
      <div class="row">
        <div class="col-md-4 left-content">
          <h1 class="title__black mt0 uppercase ml-2">Active Reports</h1>
          <ActiveReportPanel :report="report"/>
        </div>
        <div class="col-md-8 right-content">
          <section class="user-dashboard mx-auto">
            <h1 class="title__black mt0 uppercase">Reports History</h1>
            <div v-if="reports.length > 0">
              <div
                :key="report._id"
                class="panel"
                style="border: none;"
                v-for="report in reports"
              >
                <div class="panel-body border h-32 rounded shadow bg-white flex items-center">
                  <div class="col-sm-3">
                    <strong>Date</strong>
                    <div>{{ $moment(report.createdAt).format('MMM. DD, YYYY | h:mm A ') }}</div>
                  </div>
                  <div class="col-sm-3">
                    <strong>Type</strong>
                    <div>{{ report.type.name }}</div>
                  </div>
                  <div class="col-sm-3">
                    <strong>Resolved Date</strong>
                    <div>{{ report.resolvedAt ? $moment(report.resolvedAt).format('MMM. DD, YYYY | h:mm A ') : 'Unresolved' }}</div>
                  </div>
                  <button
                    @click.prevent="$router.push(`/responder/reports/${report._id}`)"
                    class="btn btnblue col-sm-3 outline-none"
                    type="button"
                  >View More</button>
                </div>
              </div>
            </div>
            <div v-else>
              <div class="panel">
                <div
                  class="panel-body border h-32 rounded shadow bg-white flex items-center justify-center"
                >No reports...</div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import ActiveReportPanel from "./-ActiveReportPanel";
export default {
  components: {
    ActiveReportPanel
  },
  async fetch({ $axios, store, redirect }) {
    if (!store.getters["auth/hasPermission"]("respond")) {
      return redirect("/");
    }

    await store.dispatch("responder/getReports");
  },
  computed: {
    reports() {
      return this.$store.state.responder.reports;
    },
    report() {
      return this.$store.state.responder.report;
    }
  },
  mounted() {
    this.initSocketListeners();
  },
  beforeDestroy() {
    this.$socket.off("responder-assigned");
  },
  methods: {
    initSocketListeners() {
      this.$socket.on("responder-assigned", report => {
        this.$notify({
          type: "info",
          title: "You have been assigned!",
          content: `You're assigned to an incident.`
        });
        this.$store.commit("responder/SET_REPORT", report);
      });
    }
  }
};
</script>

<style scoped>
.rounded {
  border-radius: 12px;
}
</style>
