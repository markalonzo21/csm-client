<template>
  <div class="main-content">
    <div class="container">
      <h1 class="title__black mt0 uppercase">Select a report to track</h1>
      <div v-if="reports.length === 0">
        <div class="panel">
          <div
            class="panel-body border h-32 rounded shadow bg-white flex items-center justify-center"
          >No reports...</div>
        </div>
      </div>
      <no-ssr>
        <ActiveReport :report="report" v-for="report in reports" :key="report._id"/>
      </no-ssr>
    </div>
  </div>
</template>

<script>
import ActiveReport from "~/components/ActiveReport";

export default {
  components: {
    ActiveReport
  },
  asyncData({ $axios }) {
    return $axios.$get("/reports?unresolvedOnly=true").then(response => {
      return {
        reports: response.data
      };
    });
  },
  mounted() {
    this.initSocketListener();
  },
  methods: {
    initSocketListener() {
      this.$socket.on("milestone-confirmed", payload => {
        const reportIndex = this.reports.findIndex(
          report => report._id === payload.reportId
        );

        let responseIndex = this.reports[reportIndex].responses.findIndex(
          response => response._id === payload.response._id
        );

        this.$set(
          this.reports[reportIndex].responses,
          responseIndex,
          payload.response
        );

        this.$notify({
          type: "info",
          title: "Help Update!",
          content: payload.response.name
        });
      });
    }
  }
};
</script>

