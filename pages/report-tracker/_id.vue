<template>
  <div class="main-content">
    <section class="report">
      <div class="container text-center">
        <h1 class="title__blue text-uppercase">Track your report status</h1>
        <div class="mw300 mrgnauto">
          <p class="basic__dark">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Quasi
            dolorum nihil illo temporibus harum voluptate molestias tenetur
            reiciendis? Rem, id.
          </p>
        </div>
        <hr class="mb45">
        <div class="row report-status">
          <div class="col-md-3 item">
            <TrackDocument :milestone="null" :report="report"/>
          </div>
          <div class="col-md-3 item" v-for="milestone in report.responses" :key="milestone._id">
            <TrackDocument :milestone="milestone"/>
          </div>
        </div>
      </div>
      <modal v-model="status" :header="false" size="sm" class="modal-status">
        <h3 class="title__black--lato">Your report has been submitted.</h3>
        <p class="basic__dark">Please wait while we process your report.</p>
        <div slot="footer">
          <a href class="btn btnblue text-uppercase w-100">Okay</a>
        </div>
      </modal>
    </section>

    <ChatBox :reportId="report._id"/>
  </div>
</template>

<script>
import TrackDocument from "~/components/TrackDocument";
import ChatBox from "~/components/ChatBox";
export default {
  components: {
    TrackDocument,
    ChatBox
  },
  asyncData({ $axios, error, params }) {
    return $axios
      .$get(`/reports/${params.id}`)
      .then(response => {
        return {
          report: response.data
        };
      })
      .catch(err => {
        error({ status: 404, message: "Report not found!" });
      });
  }
};
</script>
