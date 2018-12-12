<template>
  <div class="main-content">
    <div class="user-report container">
      <div class="row w-full" v-if="report">
        <div class="col-md-12 flex flex-col items-center border p-12">
          <div class="details">
            <h3 class="title__blue">Report Details</h3>
            <hr>
            <h4 class="mb-1">
              <strong>Report ID:</strong>
              {{ report._id }}
            </h4>
            <h4 class="mb-1">
              <strong>Type:</strong>
              {{ report.reportType.name }}
            </h4>
            <h4 class="mb-1">
              <strong>Notes:</strong>
              {{ report.description }}
            </h4>
            <h4 class="mb-1">
              <strong>Reported By:</strong>
              {{ report.reportedBy.firstName }} {{ report.reportedBy.lastName }} ({{ report.reportedBy.mobile }})
            </h4>
            <h4 class="mb-1">
              <strong>Assigned To:</strong>
              <template
                v-if="report.assignedTo"
              >{{ report.assignedTo.firstName }} {{ report.assignedTo.lastName }}</template>
              <template v-else>None</template>
            </h4>
            <hr>
            <h3 v-if="report.photos.length > 0">Photos</h3>
            <div class="row">
              <div class="col-md-3" v-for="photo in report.photos">
                <div class="panel">
                  <div class="panel-body">
                    <img :src="$store.getters['showPhoto'](photo)" alt="image" class="h-24 w-24">
                  </div>
                </div>
              </div>
            </div>
            <h3 class="title__blue">Milestones</h3>
            <div class="my-2" v-for="(response, index) in report.responses" :key="response._id">
              {{ index + 1 }}. {{ response.responseType.name }}
              <span
                v-if="response.resolvedAt !== null && response.confirmed"
              >- Completed At {{ $moment(response.resolvedAt).format('MMM. DD, YYYY | h:mm A ') }}</span>
            </div>
          </div>
        </div>
        <!-- <div class="col-md-6"> -->
        <ChatBox :reportId="report._id"/>
        <!-- </div> -->
      </div>
    </div>
  </div>
</template>

<script>
import ChatBox from "~/components/ChatBox";
export default {
  components: {
    ChatBox
  },
  asyncData({ $axios, params, isServer }) {
    return $axios.$get(`/reports/${params.id}`).then(response => {
      return {
        report: response.data
      };
    });
  },
  data() {
    return {
      messages: [],
      message: ""
    };
  },
  mounted() {
    this.initSocketListeners();
  },
  beforeDestroy() {
    this.$socket.off("responder-assigned");
    this.$socket.off("milestone-confirmed");
  },
  methods: {
    initSocketListeners() {
      this.$socket.on("responder-assigned", report => {
        this.$notify({
          type: "info",
          title: "Responder Assigned!",
          content: `${report.assignedTo.firstName} ${
            report.assignedTo.lastName
          } is assigned to this incident.`
        });
        this.report = report;
      });

      this.$socket.on("milestone-confirmed", newResponse => {
        let responseIndex = this.report.responses.findIndex(
          response => response._id === newResponse._id
        );

        this.$set(this.report.responses, responseIndex, newResponse);

        this.$notify({
          type: "info",
          title: "Help Update!",
          content: newResponse.name
        });
      });
    }
  }
};
</script>

<style scoped>
strong {
  color: #34c3e5;
}
</style>
