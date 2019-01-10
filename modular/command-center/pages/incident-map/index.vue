<template>
  <section class="w-full">
    <h3 class="mt-0">Incident Map</h3>
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
      <l-geojson v-if="area" :geojson="geojson" :options-style="{fillOpacity: 0 }"></l-geojson>
      <l-marker-cluster>
        <l-marker
          v-for="(report, index) in reports"
          :lat-lng="[report.location.coordinates[1], report.location.coordinates[0]]"
          :key="`incident-${index}`"
        >
          <l-popup :content="showReportContent(report)"></l-popup>
        </l-marker>
      </l-marker-cluster>
      <!-- <LeafletHeatmap
        v-if="reports.length > 0 && !loadingHeats"
        :lat-lng="heats"
        :radius="15"
        :min-opacity="0.75"
        :blur="15"
      ></LeafletHeatmap>-->
      <l-tile-layer url="https://{s}.tile.osm.org/{z}/{x}/{y}.png"></l-tile-layer>
    </l-map>
    <a-form @submit.prevent="filterReports">
      <h4>Filter</h4>
      <a-row :gutter="24">
        <a-col :span="12">
          <a-form-item label="Report ID" :labelCol="{ span: 4 }" :wrapperCol="{ span: 20 }">
            <a-input placeholder="Enter Report ID" v-model="form.id"/>
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
                :key="category._id"
              >{{ category.name }}</a-select-option>
            </a-select>
          </a-form-item>
        </a-col>
        <a-col :span="12">
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
                :key="status"
              >{{ status }}</a-select-option>
            </a-select>
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label="Type" :labelCol="{ span: 4 }" :wrapperCol="{ span: 20 }">
            <a-select :value="form.type" @change="selectTypeChange" placeholder="Select a Type">
              <a-select-option value>Any</a-select-option>
              <a-select-option
                v-for="type in selectList.types"
                :value="type._id"
                :key="type._id"
              >{{ type.name }}</a-select-option>
            </a-select>
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label="Date Started" :labelCol="{ span: 4 }" :wrapperCol="{ span: 20 }">
            <a-date-picker format="MM-DD-YYYY" class="w-full" v-model="form.startDate"/>
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label="Date End" :labelCol="{ span: 4 }" :wrapperCol="{ span: 20 }">
            <a-date-picker format="MM-DD-YYYY" class="w-full" v-model="form.endDate"/>
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label="Reporter" :labelCol="{ span: 4 }" :wrapperCol="{ span: 20 }">
            <a-input placeholder="Enter reporter email" v-model="form.reporter"/>
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label="Responder" :labelCol="{ span: 4 }" :wrapperCol="{ span: 20 }">
            <a-input placeholder="Enter responder email" v-model="form.responder"/>
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label="Resolver" :labelCol="{ span: 4 }" :wrapperCol="{ span: 20 }">
            <a-input placeholder="Enter resolver email" v-model="form.resolver"/>
          </a-form-item>
        </a-col>
        <a-col :span="11" :offset="1">
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
  </section>
</template>

<script>
export default {
  layout: 'command-center/default',
  asyncData({ $axios, error }) {
    const getCategories = $axios.$get('/report-categories')
    const getReports = $axios.$get('/admin/reports')

    return Promise.all([getCategories, getReports]).then(
      ([categories, reports]) => {
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
            startDate: null,
            endDate: null
          },
          selectList: {
            categories: categories.data,
            types: [],
            statuses: ['pending', 'in-progress', 'resolved', 'cancelled']
          }
        }
      }
    )
  },
  mounted() {
    this.getReports()
  },
  methods: {
    getReports() {
      this.loadingReports = true
      this.$axios
        .$get('/admin/reports')
        .then(response => {
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
          this.reports = response.data
          this.loadingReports = false
        })
        .catch(err => {
          this.loadingReports = false
        })
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
    }
  }
}
</script>

<style scoped>
@import '~leaflet.markercluster/dist/MarkerCluster.css';
@import '~leaflet.markercluster/dist/MarkerCluster.Default.css';
</style>
