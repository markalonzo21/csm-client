<template>
  <div class="panel ticket-details">
    <div class="panel-heading">
      <h3
        class="text-uppercase"
        style="visibility: hidden;"
      >Priority number:</h3>
    </div>
    <div class="panel-body">
      <div class="row basic-details">
        <div class="col-md-4">
          <label for>Date</label>
          <br>
          <span class="basic">{{ $moment(report.createdAt).format('MMM. DD, YYYY | h:mm A ') }}</span>
        </div>
        <div class="col-md-4">
          <label for>Name of Reporter</label>
          <br>
          <span
            class="basic"
          >{{ report.reporter.firstName }} {{ report.reporter.middleName }} {{ report.reporter.lastName }}</span>
        </div>
        <div class="col-md-4 text-right">
          <a
            @click.prevent="printChatHistory"
            class="btn btnblue"
            href
          >Print Chat History</a>
        </div>
      </div>
      <div class="row notes">
        <div class="col-md-12">
          <label for>Notes</label>
          <br>
          <span class="basic whitespace-pre-wrap">{{ report.description }}</span>
        </div>
      </div>
      <div
        class="row images"
        v-if="report.media.length > 0"
      >
        <div class="col-md-12">
          <label for>Media</label>
          <br>
          <div
            :key="media"
            class="col-md-3"
            v-for="media in report.media"
          >
            <img
              :src="media"
              alt="image-media"
              class="image-responsive"
              v-if="$utils.isImage(media)"
            >
            <video
              controls
              v-else
              width="300"
            >
              <source
                :src="media"
                type="video/mp4"
              >
            </video>
          </div>
        </div>
      </div>
      <div class="row resolver">
        <div class="col-md-4">
          <label for>Resolver</label>
          <br>
          <span
            class="basic"
            v-if="report.resolver"
          >{{ report.resolver.firstName }} {{ report.resolver.middleName }} {{ report.resolver.lastName }}</span>
          <span v-else>N/A</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { Printd } from "printd";

export default {
  props: {
    report: {
      type: Object,
      required: true
    }
  },
  methods: {
    printChatHistory() {
      this.d = new Printd();

      // Print dialog events (v0.0.9+)
      const { contentWindow } = this.d.getIFrame();

      contentWindow.addEventListener("beforeprint", () =>
        console.log("before print event!")
      );
      contentWindow.addEventListener("afterprint", () =>
        console.log("after print event!")
      );

      this.d.print(document.getElementById("chatbox"));
    }
  }
};
</script>
