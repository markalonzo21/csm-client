<template>
  <div class="panel shadow">
    <div class="panel-heading h-32" role="button">
      <div class="col-sm-3">
        <span class="bluelabel">Report ID</span>
        <br>
        {{ report._id }}
      </div>
      <div class="col-sm-3">
        <span class="bluelabel">Type</span>
        <br>
        {{ report.type.name }}
      </div>
      <div class="col-sm-3">
        <button
          class="btn btnblue chat"
          @click.prevent="$emit('chatToggled', { reportId: report._id, isResolved: report.resolvedAt !== null })"
        >
          <svgicon name="chat"></svgicon>Chat
        </button>
      </div>
      <div class="col-sm-3 bluelabel mt-3 select-none">
        <span @click="toggleAccordion(0)">{{ showAccordion[0] ? 'View Less' : 'View More' }}</span>
      </div>
    </div>
    <collapse v-model="showAccordion[0]">
      <div class="panel-body">
        <div class="col-md-3">
          <span class="bluelabel">Notes</span>
          <br>
          {{ report.description }}
        </div>
        <div class="col-md-3">
          <span class="bluelabel">Reporter</span>
          <br>
          {{ report.reporter.firstName }} {{ report.reporter.middleName }} {{ report.reporter.lastName}}
        </div>
        <div class="col-md-3">
          <span class="bluelabel">Responder</span>
          <br>
          <span
            v-if="report.responder"
          >{{ report.responder.firstName }} {{ report.responder.middleName }} {{ report.responder.lastName}}</span>
          <span v-else>None</span>
        </div>
        <div class="col-md-3">
          <span class="bluelabel">Status</span>
          <br>
          <span class="capitalize">{{ report.status }}</span>
        </div>
        <div class="col-md-3 mt-6">
          <span class="bluelabel">Date Reported</span>
          <br>
          {{ $moment(report.createdAt).format('MMM. DD, YYYY | h:mm A ') }}
        </div>

        <div v-if="report.media.length > 0">
          <h3 class="title__blue mt60 mb30">Images/Videos</h3>
          <div class="row">
            <div class="col-md-3" v-for="media in report.media" :key="media">
              <img :src="media" alt="image-media" v-if="isImage(media)">
              <video width="300" controls v-else>
                <source :src="media" type="video/mp4">
              </video>
            </div>
          </div>
        </div>
        <!-- <h3 class="title__blue mt60 mb30">Milestones</h3>
        <div class="row">
          <div class="col-md-3" v-for="milestone in report.responses" :key="milestone._id">
            <div
              class="box"
              :class="{'checked': milestone.confirmed && milestone.resolvedAt !== null }"
            >
              <svgicon name="check"></svgicon>
            </div>
            <p class="m-0 text-uppercase bluelabel">{{ milestone.responseType.name }}</p>
            <p
              class="m-0"
              :class="[milestone.confirmed && milestone.resolvedAt !== null  ? 'visible': 'invisible']"
            >{{ $moment(milestone.resolvedAt).format("MMM. DD, YYYY | h:mm A ") }}</p>
          </div>
        </div>-->
      </div>
    </collapse>
  </div>
</template>


<script>
export default {
  props: ["report"],
  data() {
    return {
      showAccordion: [false]
    };
  },
  methods: {
    toggleAccordion(index) {
      if (this.showAccordion[index]) {
        this.$set(this.showAccordion, index, false);
      } else {
        this.showAccordion = this.showAccordion.map((v, i) => i === index);
      }
    },
    isImage(src) {
      if ([".jpg", ".png"].includes(src)) {
        return true;
      }
      return false;
    }
  }
};
</script>


<style scoped>
.panel {
  border-radius: 8px;
  box-shadow: 0px 1px 5px 0px rgba(0, 0, 0, 0.75);
}
.panel-heading {
  background-color: #fff;
}
.table {
  margin-bottom: 0;
}
.bluelabel {
  color: #34c3e5;
}
.chat svg {
  height: 100%;
  width: 20px;
  fill: #fff;
  vertical-align: middle;
  margin-top: -10px;
  margin-right: 5px;
  transition: all ease 300ms;
}
.btn.btnblue:hover svg {
  fill: #34c3e5;
}
.btn.btnblue.chat {
  width: auto;
}
.title__blue {
  font-weight: 700;
}
</style>
