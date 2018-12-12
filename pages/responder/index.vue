<template>
  <div class="main-content">
    <section class="responder-dashboard container">
      <div class="row">
        <div class="col-md-4 left-content">
          <h1 class="title__black mt0 uppercase ml-2">Active Reports</h1>
          <ResponderActiveReportPanel :report="activeReport"/>
        </div>
        <div class="col-md-8 right-content">
          <section class="user-dashboard mx-auto">
            <h1 class="title__black mt0 uppercase">Reports History</h1>
            <div v-if="reports.length > 0">
              <div class="panel" style="border: none;" v-for="report in reports">
                <div class="panel-body border h-32 rounded shadow bg-white flex items-center">
                  <div class="col-sm-3">
                    <strong>Date</strong>
                    <div>{{ $moment(report.createdAt).format('hh:mm A - MMM. DD, YYYY') }}</div>
                  </div>
                  <div class="col-sm-3">
                    <strong>Type</strong>
                    <div>{{ report.reportType.name }}</div>
                  </div>
                  <div class="col-sm-3">
                    <strong>Resolved Date</strong>
                    <div>{{ report.resolvedAt ? $moment(report.resolvedAt).format('hh:mm A - MMM. DD, YYYY') : 'Unresolved' }}</div>
                  </div>
                  <button
                    type="button"
                    class="btn btnblue col-sm-3 outline-none"
                    @click.prevent="$router.push(`/reports/${report._id}`)"
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
    <!--     <modal v-model="respondModal" size="sm" :footer="false" class="login">
      <span slot="title">
        <h4 class="title__black text-uppercase text-center">Report Details</h4>
      </span>
      <table class="table">
        <tbody>
          <tr>
            <td class="bluetext text-left">Date</td>
            <td class="text-right">11/21/18</td>
          </tr>
          <tr>
            <td class="bluetext text-left">Category</td>
            <td class="text-right">Lorem ipsum dolor sit amet.</td>
          </tr>
          <tr>
            <td class="bluetext text-left">Type</td>
            <td class="text-right">Lorem ipsum dolor sit amet.</td>
          </tr>
          <tr>
            <td class="bluetext text-left">Reporter</td>
            <td class="text-right">Juan Dela Cruz</td>
          </tr>
        </tbody>
      </table>
      <span class="bluetext">Notes</span>
      <br>
      <p class="basic">Lorem ipsum dolor sit amet consectetur adipisicing elit. Nesciunt, et.</p>
      <a href="#" class="btn btnblue text-uppercase" style="width: 100%">Contact Reporter</a>
    </modal>-->
  </div>
</template>

<script>
import ChatBox from "~/components/ChatBox";
import ResponderActiveReportPanel from "~/components/ResponderActiveReportPanel";
export default {
  asyncData({ $axios, store, redirect }) {
    if (!store.getters["auth/hasPermission"]("respond")) {
      return redirect("/");
    }

    return $axios.$get("/responder/reports").then(response => {
      return {
        reports: response.data
      };
    });
  },
  components: {
    ChatBox,
    ResponderActiveReportPanel
  },
  mounted() {
    this.initSocketListeners();
  },
  computed: {
    activeReport() {
      if (this.reports.length > 0) {
        return this.reports.find(report => report.resolvedAt === null);
      }
      return null;
    }
  },
  beforeDestroy() {
    this.$socket.off("respondent-assigned");
  },
  methods: {
    initSocketListeners() {
      this.$socket.on("respondent-assigned", report => {
        this.$notify({
          type: "info",
          title: "You have been assigned!",
          content: `You're assigned to an incident.`
        });
        this.$store.commit("respondent/SET_ACTIVE_REPORT", report);
      });
    }
  }
};
</script>
