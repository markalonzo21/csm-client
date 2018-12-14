<template>
  <div class="main-content">
    <section class="responder-dashboard container">
      <div class="row">
        <div class="col-md-4 left-content">
          <h1 class="title__black mt0 uppercase ml-2">Active Reports</h1>
          <ResponderActiveReportPanel :report="report"/>
        </div>
        <div class="col-md-8 right-content">
          <section class="user-dashboard mx-auto">
            <h1 class="title__black mt0 uppercase">Reports History</h1>
            <div v-if="reports.length > 0">
              <div class="panel" style="border: none;" v-for="report in reports" :key="report._id">
                <div class="panel-body border h-32 rounded shadow bg-white flex items-center">
                  <div class="col-sm-3">
                    <strong>Date</strong>
                    <div>{{ $moment(report.createdAt).format('MMM. DD, YYYY | h:mm A ') }}</div>
                  </div>
                  <div class="col-sm-3">
                    <strong>Type</strong>
                    <div>{{ report.reportType.name }}</div>
                  </div>
                  <div class="col-sm-3">
                    <strong>Resolved Date</strong>
                    <div>{{ report.resolvedAt ? $moment(report.resolvedAt).format('MMM. DD, YYYY | h:mm A ') : 'Unresolved' }}</div>
                  </div>
                  <button
                    type="button"
                    class="btn btnblue col-sm-3 outline-none"
                    @click.prevent="$router.push(`/responder/reports/${report._id}`)"
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
import ChatBox from "~/components/ChatBox";
import ResponderActiveReportPanel from "~/components/ResponderActiveReportPanel";
export default {
  components: {
    ChatBox,
    ResponderActiveReportPanel
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
