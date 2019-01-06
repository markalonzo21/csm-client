<template>
  <section class="ticket-info">
    <div class="row">
      <div class="col-md-4 sidebar">
        <div class="panel info">
          <div class="panel-heading">
            <h3 class="text-uppercase">Report information</h3>
          </div>
          <div class="panel-body p0">
            <table class="table table-striped">
              <tbody>
                <tr>
                  <td>ID</td>
                  <td>{{ report._id }}</td>
                </tr>
                <tr>
                  <td>Reporter</td>
                  <td>{{ report.reporter.email }}</td>
                </tr>
                <tr>
                  <td>Resolver</td>
                  <td>{{ report.resolver ? report.resolver.email : 'N/A' }}</td>
                </tr>
                <tr>
                  <td>Responder</td>
                  <td>{{ report.responder ? report.responder.email : 'N/A' }}</td>
                </tr>
                <tr>
                  <td>Status</td>
                  <td>{{ report.status }}</td>
                </tr>
                <tr>
                  <td>Date Created</td>
                  <td>{{ $moment(report.createdAt).format('MMM. DD, YYYY | h:mm A ') }}</td>
                </tr>
                <tr>
                  <td>Last Updated</td>
                  <td>{{ $moment(report.updatedAt).format('MMM. DD, YYYY | h:mm A ') }}</td>
                </tr>
                <tr>
                  <td>Category</td>
                  <td>{{ report.type.category.name }}</td>
                </tr>
                <tr>
                  <td>Type</td>
                  <td>{{ report.type.name }}</td>
                </tr>
                <tr>
                  <td>Area</td>
                  <td>{{ report.area ? report.area.name : 'N/A' }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        <div class="panel location">
          <div class="panel-heading">
            <h3 class="text-uppercase">Location</h3>
          </div>
          <div class="panel-body">
            <div style="height: 380px; width: 100%;">
              <l-map
                v-if="map.center.length > 0"
                :center="map.center"
                :zoom="map.zoom"
                :minZoom="map.minZoom"
                :maxZoom="map.maxZoom"
                :maxBounds="map.maxBounds"
                :maxBoundsViscosity="map.maxBoundsViscosity"
                ref="map"
              >
                <l-marker
                  :lat-lng="[report.location.coordinates[1], report.location.coordinates[0]]"
                ></l-marker>
                <l-tile-layer url="https://{s}.tile.osm.org/{z}/{x}/{y}.png"></l-tile-layer>
              </l-map>
            </div>
          </div>
        </div>
        <div class="panel option">
          <div class="panel-heading">
            <h3 class="text-uppercase">Option</h3>
          </div>
          <div class="panel-body p0">
            <form>
              <div class="row">
                <div class="col-md-3">
                  <label for>Type</label>
                </div>
                <div class="col-md-6">
                  <input type="text" class="form-control" :value="report.type.name">
                  <!-- <typeahead v-model="form.type" target="#input-4" :async-src="reportTypesEndpoint" async-key="data" item-key="name"/> -->
                </div>
                <div class="col-md-3">
                  <button class="btn btnform" disabled>Change</button>
                </div>
              </div>
              <div class="row">
                <div class="col-md-3">
                  <label for>Reassign Resolver</label>
                </div>
                <div class="col-md-6">
                  <input
                    type="text"
                    class="form-control"
                    :value="report.resolver ? report.resolver.email : ''"
                  >
                </div>
                <div class="col-md-3">
                  <button class="btn btnform" disabled>Change</button>
                </div>
              </div>
              <div class="row">
                <div class="col-md-3">
                  <label for>Reassign Responder</label>
                </div>
                <div class="col-md-6">
                  <input
                    type="text"
                    class="form-control"
                    :value="report.responder ? report.responder.email : ''"
                  >
                </div>
                <div class="col-md-3">
                  <button class="btn btnform" disabled>Change</button>
                </div>
              </div>
              <div class="row">
                <div class="col-md-3">
                  <label for>Override Status</label>
                </div>
                <div class="col-md-6">
                  <select class="capitalize form-control" @change="statusChanged">
                    <option
                      v-for="status in ['pending', 'in-progress', 'resolved', 'cancelled']"
                      class="capitalize"
                      :selected="status === form.status"
                    >{{ status }}</option>
                  </select>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
      <div class="col-md-8 content">
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
                <label for>Images/Videos</label>
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
        <!--         <div class="panel">
          <div class="panel-body">
            <div class="row comment">
              <div class="col-md-10">
                <textarea
                  class="form-control"
                  name=""
                  id=""
                  cols="30"
                  rows="2"
                  placeholder="Write something here..."
                ></textarea>
              </div>
              <div class="col-md-2 text-center">
                <button class="btn text-uppercase">Send</button>
              </div>
            </div>
          </div>
        </div>-->
      </div>
    </div>
  </section>
</template>

<script>
export default {
  layout: 'command-center',
  asyncData({ $axios, store, params, error }) {
    if (!store.getters['auth/hasPermission']('view reports')) {
      return redirect('/')
    }
    return $axios.$get(`/admin/reports/${params.id}`).then(response => {
      const bounds = [120.89287, 14.63956, 121.07483, 14.5565]
      const lat = response.data.location
        ? response.data.location.coordinates[1]
        : 14.59804
      const lng = response.data.location
        ? response.data.location.coordinates[0]
        : 120.98385

      return {
        report: response.data,
        isAssignModalVisible: false,
        availableResponders: [],
        selectedResponder: null,
        loadingAssignResponder: false,
        map: {
          center: [lat, lng],
          zoom: 13,
          minZoom: 8,
          maxZoom: 18,
          maxBounds: bounds,
          maxBoundsViscosity: 1.0,
          reports: []
        },
        form: {
          type: response.data.type.name,
          status: response.data.status,
          resolver: response.data.resolver,
          responder: response.data.responder
        }
      }
    })
  },
  mounted() {
    this.initSocketListeners()
  },
  beforeDestroy() {
    this.$socket.off('report-updated')
  },
  computed: {
    reportTypesEndpoint() {
      const baseUrl = process.env.API_URL
        ? process.env.API_URL
        : 'https://ireport-api.now.sh'
      return `${baseUrl}/report-types`
    }
  },
  methods: {
    initSocketListeners() {
      this.$socket.on('report-updated', payload => {
        if (this.report._id === payload._id) {
          this.report = payload
        }
      })
    },
    printChatHistory() {
      alert('Not yet working!')
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
            this.report.status = response.data.status
          })
          .catch(err => {
            alert('Something went wrong!')
            event.target.value = this.form.status
          })
      } else {
        event.target.value = this.form.status
      }
    }
  }
}
</script>

<style scoped>
.ticket-info .sidebar .panel-body {
  padding-top: 0;
  padding-bottom: 0;
}
.ticket-info .panel-body .row {
  margin-bottom: 10px;
}
.ticket-info .panel-heading {
  background-color: #344fa0;
}
.ticket-info .panel-heading h3 {
  margin: 0;
  font-size: 20px;
  color: #fff;
}
.ticket-info .table {
  margin-bottom: 0;
}
.ticket-info .table td {
  font-size: 12px;
  border-color: #f1f1f1;
}
.ticket-info .table td:first-child {
  background-color: #f1f1f1;
  width: 120px;
}
.ticket-info .panel-body form {
  padding: 10px;
}
.ticket-info .panel-body form label {
  font-size: 12px;
  font-weight: normal;
}
.btn.btnform {
  width: 80px;
  height: 30px;
  border-radius: 10px;
  background-color: #29abe2;
  font-size: 14px;
  color: #fff;
  line-height: 16px;
}
.btn.btntag {
  background-color: #ea9199;
}

.ticket-info .content label {
  font-size: 16px;
  font-weight: 700;
  color: #333;
}
.ticket-info .row.notes {
  margin-top: 40px;
  margin-bottom: 105px;
}
.ticket-info .row.images {
  margin-bottom: 40px;
}
.ticket-info .row.comment {
  margin: 0;
}
.ticket-info .row.comment .panel-body {
  padding: 10px 0;
}
.ticket-info .row.comment .btn {
  font-weight: 700;
  color: #29abe2;
}
.ticket-info .content textarea {
  resize: none;
  height: 40px;
  border-radius: 10px;
}
</style>
