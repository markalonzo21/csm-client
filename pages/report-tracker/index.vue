<template>
  <div class="main-content">
    <div class="container">
      <h1 class="title__black mt0 uppercase">Select a report to track</h1>

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
              @click.prevent="$router.push(`/report-tracker/${report._id}`)"
            >Select</button>
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
    </div>
  </div>
</template>

<script>
import ReportsHistory from "~/components/ReportsHistory";

export default {
  components: {
    ReportsHistory
  },
  asyncData({ $axios }) {
    return $axios.$get("/reports?active-only").then(response => {
      return {
        reports: response.data
      };
    });
  }
};
</script>
