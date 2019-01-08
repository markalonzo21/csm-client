<template>
        <div class="panel ticket-details">
          <div class="panel-heading">
            <h3 class="text-uppercase" style="visibility: hidden;">Priority number:</h3>
          </div>
          <div class="panel-body">
            <div class="row basic-details">
              <div class="col-md-4">
                <label for>Date</label>
                <br>
                <span
                  class="basic"
                >{{ $moment(report.createdAt).format('MMM. DD, YYYY | h:mm A ') }}</span>
              </div>
              <div class="col-md-4">
                <label for>Name of Reporter</label>
                <br>
                <span
                  class="basic"
                >{{ report.reporter.firstName }} {{ report.reporter.middleName }} {{ report.reporter.lastName }}</span>
              </div>
              <div class="col-md-4 text-right">
                <a href class="btn btnblue" @click.prevent="printChatHistory">Print Chat History</a>
              </div>
            </div>
            <div class="row notes">
              <div class="col-md-4">
                <label for>Notes</label>
                <br>
                <span class="basic">{{ report.description }}</span>
              </div>
            </div>
            <div class="row images" v-if="report.media.length > 0">
              <div class="col-md-12">
                <label for>Media</label>
                <br>
                <div class="col-md-3" v-for="media in report.media" :key="media">
                  <img
                    class="image-responsive"
                    :src="media"
                    alt="image-media"
                    v-if="$utils.isImage(media)"
                  >
                  <video width="300" controls v-else>
                    <source :src="media" type="video/mp4">
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
  export default {
    props: {
      report: {
        type: Object,
        required: true
      }
    }
  }
</script>
