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
            :datasets="reportsPerMonth.datasets"
            :labels="reportsPerMonth.labels"
            v-if="reportsPerMonth.labels.length > 0"
          />
        </div>
        <div class="col-md-6 text-center">
          <h4>Reports Per Category</h4>
          <ReportsPieChart
            :datasets="reportsPerCategory.datasets"
            :labels="reportsPerCategory.labels"
            v-if="reportsPerCategory.labels.length > 0"
          />
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import TotalReportsCard from "~/modular/command-center/components/DashboardCards/TotalReportsCard";
import ResolvedReportsCard from "~/modular/command-center/components/DashboardCards/ResolvedReportsCard";
import UnresolvedReportsCard from "~/modular/command-center/components/DashboardCards/UnresolvedReportsCard";
import CancelledReportsCard from "~/modular/command-center/components/DashboardCards/CancelledReportsCard";
import EmergencyReportCards from "~/modular/command-center/components/DashboardCards/EmergencyReportCards";
import ReportsPieChart from "~/modular/command-center/components/DashboardCharts/ReportsPieChart";
import ReportsBarChart from "~/modular/command-center/components/DashboardCharts/ReportsBarChart";

export default {
  layout: "command-center",
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
    };
  },
  mounted() {
    this.fetchingDashboardDetails = true;
    const getDashboardDetails = this.$axios.$get("/admin/dashboard");
    const getreportsPerCategory = this.$axios.$get(
      "/admin/dashboard/reports-per-category"
    );
    const getReportsPerMonth = this.$axios.$get(
      "/admin/dashboard/reports-per-month"
    );

    Promise.all([
      getDashboardDetails,
      getreportsPerCategory,
      getReportsPerMonth
    ]).then(([dashboardDetails, reportsPerCategory, reportsPerMonth]) => {
      this.dashboardDetails = dashboardDetails.data;
      this.reportsPerCategory = reportsPerCategory.data;
      this.reportsPerMonth = reportsPerMonth.data;
      this.fetchingDashboardDetails = false;
    });

    this.initSocketListeners();
  },
  beforeDestroy() {
    this.$socket.off("new-report");
  },
  methods: {
    initSocketListeners() {
      this.$socket.on("new-report", report => {
        this.$notification["info"]({
          message: `New report received!`,
          description: `You received a ${
            report.type.name
          } report in ${report.type.category.name.toLowerCase()}.`,
          btn: h => {
            return h(
              "a-button",
              {
                props: {
                  type: "primary",
                  size: "small"
                },
                on: {
                  click: () => {
                    var win = window.open(
                      `/command-center/reports/${report._id}`,
                      "_blank"
                    );
                    win.focus();
                  }
                }
              },
              "View report details."
            );
          }
        });
        this.dashboardDetails.reportsCount++;
        this.dashboardDetails.unresolvedReportsCount++;
        if (report.type.category.name === "Emergency") {
          this.dashboardDetails.emergencyReportsCount++;
        }
      });
    }
  }
};
</script>

<style scoped>
h3 {
  margin-top: 0;
}
</style>
