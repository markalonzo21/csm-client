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
          <div v-if="loadingGetAvailableResponders">Loading...</div>
          <select required v-model="selectedResponder" class="form-control" v-else>
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
          <td>{{ report.type.name }}</td>
          <td class="text-center">
            <button
              class="btn chat"
              :class="chatIsActive ? 'btngreen' : 'btnblue'"
              @click.prevent="$emit('chatToggled', { reportId: report._id, isResolved: report.resolvedAt !== null })"
            >
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
            <th class="bluelabel">Reporter</th>
            <th class="bluelabel">Responder</th>
            <th class="bluelabel">Status</th>
            <th class="bluelabel">Date Reported</th>
          </tr>
          <tr>
            <td>{{ report.description }}</td>
            <td>{{ report.reporter.firstName }} {{ report.reporter.middleName }} {{ report.reporter.lastName}}</td>
            <td
              v-if="report.responder"
            >{{ report.responder.firstName }} {{ report.responder.middleName }} {{ report.responder.lastName}}</td>
            <td v-else>
              <a class="cursor-pointer" @click.prevent="showAssignModal">Assign Responder</a>
            </td>
            <td class="capitalize">
              <span v-if="!report.responder">{{ report.status }}</span>
              <select class="capitalize" @change="statusChanged" v-else>
                <option
                  v-for="status in ['pending', 'in-progress', 'resolved', 'cancelled']"
                  class="capitalize"
                  :selected="status === form.status"
                >{{ status }}</option>
              </select>
            </td>
            <td>{{ $moment(report.createdAt).format('MMM. DD, YYYY | h:mm A ') }}</td>
          </tr>
        </table>

        <div v-if="report.media.length > 0">
          <h3 class="title__blue mt60 mb30">Images/Videos</h3>
          <div class="row">
            <div class="col-md-3" v-for="media in report.media" :key="media">
              <img :src="media" alt="image-media" v-if="$utils.isImage(media)">
              <video width="300" controls v-else>
                <source :src="media" type="video/mp4">
              </video>
            </div>
          </div>
        </div>
      </div>
    </collapse>
  </div>
</template>


<script>
export default {
  props: ['report', 'activeChat'],
  data() {
    return {
      showAccordion: [false],
      isAssignModalVisible: false,
      availableResponders: [],
      selectedResponder: null,
      loadingAssignResponder: false,
      loadingGetAvailableResponders: false,
      form: {
        status: this.report.status
      }
    }
  },
  computed: {
    isResolver() {
      return this.$store.getters['auth/hasPermission']('resolve')
    },
    chatIsActive() {
      return this.report._id === this.activeChat.reportId
    }
  },
  methods: {
    showAssignModal() {
      this.isAssignModalVisible = true
      this.loadingGetAvailableResponders = true
      this.$axios
        .$get(
          `/admin/available-responders?type=${this.report.type._id}&areaId=${
            this.$route.params.id
          }`
        )
        .then(response => {
          this.loadingGetAvailableResponders = false
          this.availableResponders = response.data
        })
    },
    assignResponder() {
      this.loadingAssignResponder = true
      this.$axios
        .$post(`admin/assign-responder`, {
          reportId: this.report._id,
          responderId: this.selectedResponder
        })
        .then(response => {
          this.isAssignModalVisible = false
          this.report = response.data
          this.availableResponders = []
          this.loadingAssignResponder = false
        })
    },
    toggleAccordion(index) {
      if (this.showAccordion[index]) {
        this.$set(this.showAccordion, index, false)
      } else {
        this.showAccordion = this.showAccordion.map((v, i) => i === index)
      }
    },
    statusChanged(event) {
      var confirmed = confirm('Are you sure you want to update the status?')

      if (confirmed) {
        this.$axios
          .$post('/resolver/update-report', {
            status: event.target.value,
            reportId: this.report._id
          })
          .then(response => {
            alert('Update successful!')
            this.form.status = response.data.status
          })
          .catch(err => {
            alert('Something went wrong!')
            event.target.value = this.form.status
          })
      } else {
        event.target.value = this.form.status
      }
    },
    confirmResponse(response) {
      this.loadingConfirmation = true
      this.$axios
        .$post(`/admin/confirm-response`, {
          reportId: this.report._id,
          responseId: response._id
        })
        .then(response => {
          this.loadingConfirmation = false
        })
        .catch(error => {
          this.loadingConfirmation = false
        })
    }
  }
}
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
