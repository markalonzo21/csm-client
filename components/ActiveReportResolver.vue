<template>
  <div class="panel shadow">
    <modal
      class="assign-modal"
      :header="false"
      v-model="isAssignModalVisible"
      :class="{ 'pointer-events-none': loadingAssignResponder }"
    >
      <div class="row">
        <div class="col-md-3">
          <label for class="title">Responder</label>
        </div>
        <div class="col-md-9">
          <select required v-model="selectedResponder" class="form-control">
            <option :value="null">Select Responder</option>
            <option
              v-for="responder in availableResponders"
              :value="responder._id"
              :key="responder._id"
            >{{ responder.firstName }} {{ responder.lastName }}</option>
          </select>
        </div>
      </div>
      <div slot="footer" class="text-center">
        <button
          @click.prevent="assignResponder"
          class="btn btn-primary"
          style="width: auto;"
          :disabled="!selectedResponder"
        >Assign Responder</button>
      </div>
    </modal>
    <div class="panel-heading" role="button">
      <table class="table">
        <tr>
          <th class="bluelabel">Report ID</th>
          <th class="bluelabel">Type</th>
          <th class="bluelabel"></th>
          <th class="bluelabel"></th>
        </tr>
        <tr>
          <td>{{ report._id }}</td>
          <td>{{ report.reportType.name }}</td>
          <td class="text-center">
            <button class="btn btnblue chat" @click.prevent="$emit('chatToggled', { reportId: report._id, isResolved: report.resolvedAt !== null })">
              <svgicon name="chat"></svgicon>Chat
            </button>
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
            <th class="bluelabel">Reported by</th>
            <th class="bluelabel">Responder</th>
            <th class="bluelabel">Reported at</th>
          </tr>
          <tr>
            <td>{{ report.description }}</td>
            <td>{{ report.reportedBy.firstName }} {{ report.reportedBy.middleName }} {{ report.reportedBy.lastName}}</td>
            <td
              v-if="report.assignedTo"
            >{{ report.assignedTo.firstName }} {{ report.assignedTo.middleName }} {{ report.assignedTo.lastName}}</td>
            <td v-else>
              <a class="cursor-pointer"
                @click.prevent="showAssignModal"
              >Assign Responder</a>
            </td>
            <td>{{ $moment(report.createdAt).format('MMM. DD, YYYY | h:mm A ') }}</td>
          </tr>
        </table>

        <div v-if="report.photos.length > 0">
          <h3 class="title__blue mt60 mb30">Images</h3>
          <div class="row">
            <div class="col-md-3" v-for="photo in report.photos" :key="photo">
              <img :src="$store.getters['showPhoto'](photo)" alt="photo">
            </div>
          </div>
        </div>
        <h3 class="title__blue mt60 mb30">Milestones</h3>
        <div class="row">
          <div class="col-md-3" v-for="milestone in report.responses" :key="milestone._id">
            <div
              class="box"
              :class="{'checked': milestone && milestone.resolvedAt !== null }"
            >
              <svgicon name="check"></svgicon>
            </div>
            <p class="m-0">
              <a
                class="cursor-pointer"
                @click.prevent="confirmResponse(milestone)"
                v-if="milestone.resolvedAt !== null && milestone.confirmed === false"
              >Click to Confirm</a>
            </p>
            <p class="m-0 text-uppercase bluelabel">{{ milestone.responseType.name }}</p>
            <p
              class="m-0"
              :class="[milestone && milestone.resolvedAt !== null  ? 'visible': 'invisible']"
            >{{ $moment(milestone.resolvedAt).format("MMM. DD, YYYY | h:mm A ") }}</p>
          </div>
        </div>
      </div>
    </collapse>
  </div>
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
    };
  },
  methods: {
    showAssignModal() {
      this.isAssignModalVisible = true;
      this.$axios
        .$get(`/admin/available-responders?type=${this.report.reportType._id}&areaId=${this.$route.params.id}`)
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
    confirmResponse(response) {
      this.loadingConfirmation = true
      this.$axios
        .$post(`/admin/confirm-response`, {
          reportId: this.report._id,
          responseId: response._id
        }).then(response => {
          this.loadingConfirmation = false
        }).catch(error => {
          this.loadingConfirmation = false
        })
    }
  },
  computed: {
    isResolver() {
      return this.$store.getters['auth/hasPermission']('resolve')
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
