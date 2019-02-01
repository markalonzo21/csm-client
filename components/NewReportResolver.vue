<template>
  <div class="panel shadow">
    <div class="panel-body rounded-md">
      <div class="row">
        <div class="col-sm-3">
          <span class="bluelabel">Report ID</span>
          <br>
          {{ report._id }}
        </div>
        <div class="col-sm-3">
          <span class="bluelabel">Category</span>
          <br>
          {{ report.type.category.name }}
        </div>
        <div class="col-sm-3">
          <span class="bluelabel">Type</span>
          <br>
          {{ report.type.name }}
        </div>
        <div class="col-sm-3">
          <a-button
            :loading="loadingSelectReport"
            @click.prevent="selectReport"
            class="btn btnblue"
          >Start Resolving</a-button>
        </div>
      </div>
      <div class="row mt-4">
        <div class="col-sm-3">
          <span class="bluelabel">Date Reported</span>
          <br>
          <td>{{ $moment(report.createdAt).format('MMM. DD, YYYY | h:mm A ') }}</td>
        </div>

        <div class="col-sm-3">
          <span class="bluelabel">Reporter</span>
          <br>
          <td>{{ report.reporter.firstName }} {{ report.reporter.middleName }} {{ report.reporter.lastName}}</td>
        </div>

        <div class="col-sm-3">
          <span class="bluelabel">Notes</span>
          <br>
          <td>
            <div
              class="inline-block"
              v-if="report.description.length > 20"
            >
              <span class="text-black">{{ report.description.substr(0, 20) }} &nbsp;</span>
              <a-tooltip>
                <template slot="title">{{ report.description }}</template>
                <a-icon
                  class="text-blue inline-block"
                  type="info-circle"
                />
              </a-tooltip>
            </div>
            <div v-else>{{ report.description }}</div>
          </td>
        </div>
      </div>
      <div
        class="row"
        v-if="report.media.length > 0"
      >
        <div class="col-md-12">
          <h4 class="bluelabel">Media</h4>
          <div class="row">
            <div
              :key="media"
              class="col-md-3"
              v-for="media in report.media"
            >
              <img
                :src="media"
                alt="image-media"
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
      </div>
    </div>
  </div>
  <!-- <div class="panel shadow">
    <div
      class="panel-heading"
      role="button"
    >
      <table class="table">
        <tr>
          <th class="bluelabel">Report ID</th>
          <th class="bluelabel">Type</th>
          <th class="bluelabel"></th>
          <th class="bluelabel"></th>
        </tr>
        <tr>
          <td>{{ report._id }}</td>
          <td>{{ report.type.name }}</td>
          <td class="text-center">
            <button
              :disabled="loadingSelectReport"
              @click.prevent="selectReport"
              class="btn chat btnblue"
            >Resolve</button>
          </td>
          <td class="bluelabel select-none">
            <span @click="toggleAccordion(0)">{{ showAccordion[0] ? 'View Less' : 'View More' }}</span>
          </td>
        </tr>
      </table>
    </div>
    <collapse v-model="showAccordion[0]">
      <div class="panel-body">
        <table class="table">
          <tr>
            <th class="bluelabel">Notes</th>
            <th class="bluelabel">Reporter</th>
            <th class="bluelabel">Date Reported</th>
          </tr>
          <tr>
            <td>{{ report.description }}</td>
            <td>{{ report.reporter.firstName }} {{ report.reporter.middleName }} {{ report.reporter.lastName}}</td>

            <td>{{ $moment(report.createdAt).format('MMM. DD, YYYY | h:mm A ') }}</td>
          </tr>
        </table>

        <div v-if="report.media.length > 0">
          <h3 class="title__blue mt60 mb30">Media</h3>
          <div class="row">
            <div
              :key="media"
              class="col-md-3"
              v-for="media in report.media"
            >
              <img
                :src="media"
                alt="image-media"
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
      </div>
    </collapse>
  </div>-->
</template>


<script>
export default {
  props: ["report"],
  data() {
    return {
      showAccordion: [false],
      isAssignModalVisible: false,
      availableResponders: [],
      selectedResponder: null,
      loadingAssignResponder: false,
      loadingSelectReport: false
    };
  },
  computed: {
    isResolver() {
      return this.$store.getters["auth/hasPermission"]("resolve");
    }
  },
  methods: {
    showAssignModal() {
      this.isAssignModalVisible = true;
      this.$axios
        .$get(
          `/admin/available-responders?type=${this.report.type._id}&areaName=${
            this.$route.params.name
          }`
        )
        .then(response => {
          this.availableResponders = response.data;
        });
    },
    assignResponder() {
      this.loadingAssignResponder = true;
      this.$axios
        .$post(`admin/assign-responder`, {
          reportId: this.report._id,
          responderId: this.selectedResponder
        })
        .then(response => {
          this.isAssignModalVisible = false;
          this.report = response.data;
          this.availableResponders = [];
          this.loadingAssignResponder = false;
        });
    },
    toggleAccordion(index) {
      if (this.showAccordion[index]) {
        this.$set(this.showAccordion, index, false);
      } else {
        this.showAccordion = this.showAccordion.map((v, i) => i === index);
      }
    },
    selectReport() {
      this.loadingSelectReport = true;
      this.$axios
        .$post("/resolver/select-report", {
          reportId: this.report._id,
          areaName: this.$route.params.name
        })
        .then(response => {
          this.loadingSelectReport = false;
        })
        .catch(err => {
          alert("Report is already selected!");
          this.loadingSelectReport = false;
        });
    },
    confirmResponse(response) {
      this.loadingConfirmation = true;
      this.$axios
        .$post(`/admin/confirm-response`, {
          reportId: this.report._id,
          responseId: response._id
        })
        .then(response => {
          this.loadingConfirmation = false;
        })
        .catch(error => {
          this.loadingConfirmation = false;
        });
    }
  }
};
</script>


<style scoped>
.panel {
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
