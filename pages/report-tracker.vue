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
        <ActiveReport :report="report" v-for="report in reports" :key="report._id" @chatToggled="setChatBoxData" />
      </no-ssr>
    </div>
    <ChatBox v-if="chat.reportId !== null" :reportId="chat.reportId" :isResolved="chat.isResolved" />
  </div>
</template>

<script>
import ActiveReport from "~/components/ActiveReport";
import ChatBox from "~/components/ChatBox";

export default {
  components: {
    ActiveReport,
    ChatBox
  },
  async fetch({ $axios, store, redirect }) {
    await store.dispatch("user/getUnresolvedReports");
  },
  data() {
    return {
      chat: {
        reportId: null,
        isResolved: true
      }
    }
  },
  computed: {
    reports() {
      return this.$store.state.user.unresolvedReports
    }
  },
  mounted() {
    this.initSocketListener();
  },
  methods: {
    initSocketListener() {
      this.$socket.on("milestone-confirmed", payload => {
        this.$store.commit('user/UPDATE_REPORT_MILESTONE', payload)

        this.$notify({
          type: "info",
          title: "Help Update!",
          content: payload.response.name
        });
      });

      this.$socket.on("report-resolved", report => {
        if (this.chat.reportId === report._id) {
          this.chat.reportId = null
        }

        this.$store.commit('user/REPORT_RESOLVED', report)
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
};
</script>

