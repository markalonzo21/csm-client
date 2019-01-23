<template>
  <section class="w-full">
    <div class="col-md-7">
      <div class="row px-6">
        <h3 class="mt-0">Maps</h3>
        <a-checkbox @change="onChangeMarkerCheckbox" :checked="showCluster">Marker</a-checkbox>
        <a-checkbox @change="onChangeHeatmapCheckbox" :checked="showHeatmap">Heatmap</a-checkbox>
      </div>
      <br>
      <l-map
        style="height: 69vh;"
        v-if="center.length > 0"
        :center="center"
        :zoom="zoom"
        :minZoom="minZoom"
        :maxZoom="maxZoom"
        :maxBounds="maxBounds"
        :maxBoundsViscosity="maxBoundsViscosity"
        ref="map"
      >
        <div
          class="absolute w-full h-full flex justify-center items-center"
          style="z-index: 999999999;"
          v-if="loadingReports"
        >
          <a-icon type="loading" style="font-size: 128px;" spin/>
        </div>
        <LeafletHeatmap
          v-if="showHeatmap"
          :lat-lng="heats"
          :radius="15"
          :min-opacity="0.75"
          :blur="15"
        ></LeafletHeatmap>
        <l-marker-cluster v-if="showCluster">
          <l-marker
            v-for="(report, index) in reports"
            :lat-lng="[report.location.coordinates[1], report.location.coordinates[0]]"
            :key="`incident-${index}`"
            :icon="$utils.getIcon(report.type.category.color)"
          >
            <l-popup :content="showReportContent(report)"></l-popup>
          </l-marker>
        </l-marker-cluster>
        <l-tile-layer url="https://{s}.tile.osm.org/{z}/{x}/{y}.png"></l-tile-layer>
      </l-map>
      <hr>
      <h4>Legends</h4>
      <div class="row">
        <div
          v-for="category in selectList.categories"
          :key="category._id"
          class="col-md-3 flex items-center"
        >
          <span class="marker mx-2 mb-4 mt-2" :style="{'background-color': category.color}"></span>
          <span>{{category.name}}</span>
        </div>
      </div>
    </div>
    <div class="col-md-5">
      <a-form @submit.prevent="filterReports">
        <h3 class="text-center">Filter</h3>
        <a-row :gutter="24">
          <a-col :span="24">
            <a-form-item label="Area" :labelCol="{ span: 4 }" :wrapperCol="{ span: 20 }">
              <a-select :value="form.area" @change="selectAreaChange" placeholder="Select Area">
                <a-select-option value>Any</a-select-option>
                <a-select-option
                  v-for="item in selectList.areas"
                  :value="item._id"
                  :key="`area-${item._id}`"
                >{{ item.name }}</a-select-option>
              </a-select>
            </a-form-item>
            <a-form-item label="Category" :labelCol="{ span: 4 }" :wrapperCol="{ span: 20 }">
              <a-select
                :value="form.category"
                @change="selectCategoryChange"
                placeholder="Select a Category"
              >
                <a-select-option value>Any</a-select-option>
                <a-select-option
                  v-for="category in selectList.categories"
                  :value="category._id"
                  :key="`category-${category._id}`"
                >{{ category.name }}</a-select-option>
              </a-select>
            </a-form-item>
            <a-form-item label="Report ID" :labelCol="{ span: 4 }" :wrapperCol="{ span: 20 }">
              <a-input placeholder="Enter Report ID" v-model="form.id"/>
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item label="Status" :labelCol="{ span: 4 }" :wrapperCol="{ span: 20 }">
              <a-select
                :value="form.status"
                @change="selectStatusChange"
                placeholder="Select a Status"
              >
                <a-select-option value>Any</a-select-option>
                <a-select-option
                  v-for="status in selectList.statuses"
                  :value="status"
                  :key="`status-${status}`"
                >{{ status }}</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item label="Type" :labelCol="{ span: 4 }" :wrapperCol="{ span: 20 }">
              <a-select :value="form.type" @change="selectTypeChange" placeholder="Select a Type">
                <a-select-option value>Any</a-select-option>
                <a-select-option
                  v-for="type in selectList.types"
                  :value="type._id"
                  :key="`type-${type._id}`"
                >{{ type.name }}</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item label="Reporter" :labelCol="{ span: 4 }" :wrapperCol="{ span: 20 }">
              <a-input placeholder="Enter reporter email" v-model="form.reporter"/>
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item label="Date Started" :labelCol="{ span: 4 }" :wrapperCol="{ span: 20 }">
              <a-date-picker format="MM-DD-YYYY" class="w-full" v-model="form.startDate"/>
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item label="Date End" :labelCol="{ span: 4 }" :wrapperCol="{ span: 20 }">
              <a-date-picker format="MM-DD-YYYY" class="w-full" v-model="form.endDate"/>
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item label="Responder" :labelCol="{ span: 4 }" :wrapperCol="{ span: 20 }">
              <a-input placeholder="Enter responder email" v-model="form.responder"/>
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item label="Resolver" :labelCol="{ span: 4 }" :wrapperCol="{ span: 20 }">
              <a-input placeholder="Enter resolver email" v-model="form.resolver"/>
            </a-form-item>
          </a-col>
          <a-col :span="12" :offset="12">
            <a-form-item>
              <a-button
                class="float-right w-full"
                type="primary"
                htmlType="submit"
                :loading="loadingReports"
              >Filter</a-button>
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
    </div>
  </section>
</template>

<script>
export default {
  layout: 'command-center/default',
  asyncData({ $axios, error }) {
    const getCategories = $axios.$get('/report-categories')
    const getReports = $axios.$get('/admin/reports')
    const getAreas = $axios.$get('/areas')

    return Promise.all([getCategories, getReports, getAreas]).then(
      ([categories, reports, areas]) => {
        return {
          center: [14.56679, 121.02059],
          zoom: 5,
          minZoom: 5,
          maxZoom: 18,
          maxBounds: null,
          maxBoundsViscosity: 1.0,
          area: null,
          loadingReports: false,
          reports: [],
          // Filter Form
          form: {
            id: '',
            category: '',
            type: '',
            reporter: '',
            responder: '',
            resolver: '',
            status: '',
            type: '',
            area: '',
            startDate: null,
            endDate: null,
            limit: 9999999
          },
          selectList: {
            areas: areas.data,
            categories: categories.data,
            types: [],
            statuses: ['pending', 'in-progress', 'resolved', 'cancelled']
          },
          showCluster: true,
          showHeatmap: false
        }
      }
    )
  },
  mounted() {
    this.getReports()
  },
  computed: {
    heats() {
      if (this.reports.length > 0) {
        return this.reports
          .filter(report => {
            return report.location.coordinates[0] !== null
          })
          .map(report => {
            return [
              report.location.coordinates[1],
              report.location.coordinates[0]
            ]
          })
      }
      return []
    }
  },
  methods: {
    getReports() {
      this.loadingReports = true

      // Loop through query string and assign it to form
      if (this.$route.query) {
        Object.keys(this.$route.query).forEach(key => {
          let value = this.$route.query[key]
          if (value === 'null') {
            value = null
          }

          this.form[key] = value

          if (key === 'category') {
            this.selectCategoryChange(value)
          }
        })
      }

      this.$axios
        .$get('/admin/reports', { params: this.form })
        .then(response => {
          window.history.pushState(
            this.form,
            'Incident Map',
            `/command-center/incident-map${this.$utils.serialize(this.form)}`
          )
          this.reports = response.data
          this.loadingReports = false
        })
        .catch(err => {
          console.log(err.response.data)
          this.loadingReports = false
        })
    },
    filterReports() {
      this.loadingReports = true

      this.form.start = this.form.startDate
        ? this.$moment(this.form.startDate).format('YYYY-MM-DD')
        : null
      this.form.end = this.form.endDate
        ? this.$moment(this.form.endDate).format('YYYY-MM-DD')
        : null

      this.$axios
        .$get('/admin/reports', { params: this.form })
        .then(response => {
          window.history.pushState(
            this.form,
            'Incident Map',
            `/command-center/incident-map${this.$utils.serialize(this.form)}`
          )
          this.reports = response.data
          this.loadingReports = false

          if (this.form.area.length > 0) {
            const geoJSON = L.geoJSON(
              this.selectList.areas.find(
                area => area._id.toString() === this.form.area.toString()
              ).location
            )

            this.geojson = geoJSON.toGeoJSON()
            this.maxBounds = geoJSON.getBounds()
            this.$nextTick(() => {
              this.$refs.map.mapObject.fitBounds(this.maxBounds)
            })
          }
        })
        .catch(err => {
          this.loadingReports = false
        })
    },
    selectAreaChange(value) {
      this.form.area = value
    },
    selectCategoryChange(value) {
      const categories = this.selectList.categories.find(
        category => category._id === value
      )
      if (value) {
        this.selectList.types = categories.types
      }
      this.form.category = value
      this.form.type = ''
    },
    selectTypeChange(value) {
      this.form.type = value
    },
    selectStatusChange(value) {
      this.form.status = value
    },
    showReportContent(report) {
      return `      <table class="table table-striped">
        <tbody>
          <tr>
            <td>ID</td>
            <td>${report._id}</td>
          </tr>
          <tr>
            <td>Reporter</td>
            <td>${report.reporter.email}</td>
          </tr>
          <tr>
            <td>Resolver</td>
            <td>${report.resolver ? report.resolver.email : 'N/A'}</td>
          </tr>
          <tr>
            <td>Responder</td>
            <td>${report.responder ? report.responder.email : 'N/A'}</td>
          </tr>
          <tr>
            <td>Status</td>
            <td>${report.status}</td>
          </tr>
          <tr>
            <td>Date Created</td>
            <td>${this.$moment(report.createdAt).format(
              'MMM. DD, YYYY | h:mm A '
            )}</td>
          </tr>
          <tr>
            <td>Last Updated</td>
            <td>${this.$moment(report.updatedAt).format(
              'MMM. DD, YYYY | h:mm A '
            )}</td>
          </tr>
          <tr>
            <td>Category</td>
            <td>${report.type.category.name}</td>
          </tr>
          <tr>
            <td>Type</td>
            <td>${report.type.name}</td>
          </tr>
        </tbody>
      </table>`
    },
    onChangeMarkerCheckbox(e) {
      this.showCluster = e.target.checked
    },
    onChangeHeatmapCheckbox(e) {
      this.showHeatmap = e.target.checked
    }
  }
}
</script>

<style scoped>
@import '~leaflet.markercluster/dist/MarkerCluster.css';
@import '~leaflet.markercluster/dist/MarkerCluster.Default.css';

.marker {
  width: 3rem;
  height: 3rem;
  display: block;
  position: relative;
  border-radius: 3rem 3rem 0;
  transform: rotate(45deg);
  border: 1px solid #ffffff;
}
</style>
