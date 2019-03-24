<template>
  <section class="w-full">
    <a-button
      @click.prevent="filterIsVisible = true"
      class="pin-r fixed z-10 rounded-none clearfix"
      type="primary"
    >
      <a-icon type="filter"/>
    </a-button>
    <div class="col-md-12">
      <div class="row px-6">
        <h3 class="mt-0">Incident Map</h3>
        <a-checkbox
          :checked="showCluster"
          @change="onChangeMarkerCheckbox"
        >Marker</a-checkbox>
        <a-checkbox
          :checked="showHeatmap"
          @change="onChangeHeatmapCheckbox"
        >Heatmap</a-checkbox>
      </div>
      <br>
      <l-map
        :center="center"
        :maxBounds="maxBounds"
        :maxBoundsViscosity="maxBoundsViscosity"
        :maxZoom="maxZoom"
        :minZoom="minZoom"
        :zoom="zoom"
        ref="map"
        style="height: 69vh;"
        v-if="center.length > 0"
      >
        <div
          class="absolute w-full h-full flex justify-center items-center"
          style="z-index: 999999999;"
          v-if="loadingReports"
        >
          <a-icon
            spin
            style="font-size: 128px;"
            type="loading"
          />
        </div>
        <LeafletHeatmap
          :lat-lng="heats"
          :min-opacity="1"
          :radius="5"
          v-if="showHeatmap"
        ></LeafletHeatmap>
        <l-marker-cluster v-if="showCluster">
          <l-marker
            :icon="$utils.getIcon(report.type.category.color)"
            :key="`incident-${index}`"
            :lat-lng="[report.location.coordinates[1], report.location.coordinates[0]]"
            v-for="(report, index) in reports"
          >
            <l-popup :content="showReportContent(report)"></l-popup>
          </l-marker>
        </l-marker-cluster>
        <l-marker
          :icon="$utils.getHumanIcon(asset.user.category.color)"
          :key="`asset-${index}`"
          :lat-lng="[asset.location.coordinates[1], asset.location.coordinates[0]]"
          v-for="(asset, index) in assetsLocation"
        >
          <l-popup :content="showAssetContent(asset)"></l-popup>
        </l-marker>
        <l-tile-layer url="https://{s}.tile.osm.org/{z}/{x}/{y}.png"></l-tile-layer>
      </l-map>
      <hr>
      <h4>Legends</h4>
      <div class="row">
        <div
          :key="category._id"
          class="col-md-3 flex items-center"
          v-for="category in selectList.categories"
        >
          <span
            :style="{'background-color': category.color}"
            class="marker mx-2 mb-4 mt-2"
          ></span>
          <span>{{category.name}}</span>
        </div>
      </div>
    </div>
    <a-drawer
      :closable="true"
      :visible="filterIsVisible"
      @close="filterIsVisible = false"
      placement="right"
      title="Filter"
      width="350"
      wrapClassName="drawer-filter"
    >
      <a-form
        @submit.prevent="filterReports"
        class="mt-4"
      >
        <a-form-item
          :labelCol="{ span: 24 }"
          :wrapperCol="{ span: 24 }"
          label="Area"
        >
          <a-select
            :value="form.area"
            @change="selectAreaChange"
            placeholder="Select Area"
          >
            <a-select-option value>Any</a-select-option>
            <a-select-option
              :key="`area-${item._id}`"
              :value="item._id"
              v-for="item in selectList.areas"
            >{{ item.name }}</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item
          :labelCol="{ span: 24 }"
          :wrapperCol="{ span: 24 }"
          label="Category"
        >
          <a-select
            :value="form.category"
            @change="selectCategoryChange"
            placeholder="Select a Category"
          >
            <a-select-option value>Any</a-select-option>
            <a-select-option
              :key="`category-${category._id}`"
              :value="category._id"
              v-for="category in selectList.categories"
            >{{ category.name }}</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item
          :labelCol="{ span: 24 }"
          :wrapperCol="{ span: 24 }"
          label="Report ID"
        >
          <a-input
            placeholder="Enter Report ID"
            v-model="form.id"
          />
        </a-form-item>
        <a-form-item
          :labelCol="{ span: 24 }"
          :wrapperCol="{ span: 24 }"
          label="Status"
        >
          <a-select
            :value="form.status"
            @change="selectStatusChange"
            placeholder="Select a Status"
          >
            <a-select-option value>Any</a-select-option>
            <a-select-option
              :key="`status-${status}`"
              :value="status"
              v-for="status in selectList.statuses"
            >{{ status }}</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item
          :labelCol="{ span: 24 }"
          :wrapperCol="{ span: 24 }"
          label="Type"
        >
          <a-select
            :value="form.type"
            @change="selectTypeChange"
            placeholder="Select a Type"
          >
            <a-select-option value>Any</a-select-option>
            <a-select-option
              :key="`type-${type._id}`"
              :value="type._id"
              v-for="type in selectList.types"
            >{{ type.name }}</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item
          :labelCol="{ span: 24 }"
          :wrapperCol="{ span: 24 }"
          label="Reporter"
        >
          <a-input
            placeholder="Enter reporter email"
            v-model="form.reporter"
          />
        </a-form-item>
        <a-form-item
          :labelCol="{ span: 24 }"
          :wrapperCol="{ span: 24 }"
          label="Date Started"
        >
          <a-date-picker
            class="w-full"
            format="MM-DD-YYYY"
            v-model="form.startDate"
          />
        </a-form-item>
        <a-form-item
          :labelCol="{ span: 24 }"
          :wrapperCol="{ span: 24 }"
          label="Date End"
        >
          <a-date-picker
            class="w-full"
            format="MM-DD-YYYY"
            v-model="form.endDate"
          />
        </a-form-item>
        <a-form-item
          :labelCol="{ span: 24 }"
          :wrapperCol="{ span: 24 }"
          label="Responder"
        >
          <a-input
            placeholder="Enter responder email"
            v-model="form.responder"
          />
        </a-form-item>
        <a-form-item
          :labelCol="{ span: 24 }"
          :wrapperCol="{ span: 24 }"
          label="Resolver"
        >
          <a-input
            placeholder="Enter resolver email"
            v-model="form.resolver"
          />
        </a-form-item>
        <a-form-item>
          <a-button
            :disabled="loadingReports"
            @click.prevent="resetFilter"
            class="w-1/8 mr-2"
            type="danger"
          >Reset</a-button>
          <a-button
            :loading="loadingReports"
            class="w-3/4"
            htmlType="submit"
            type="primary"
          >Filter</a-button>
        </a-form-item>
      </a-form>
    </a-drawer>
  </section>
</template>

<script>
import LeafletHeatmap from "./-LeafletHeatmap";
export default {
  layout: "command-center/default",
  components: {
    LeafletHeatmap
  },
  asyncData({ $axios, store, error }) {
    if (!store.getters["auth/hasPermission"]("view maps")) {
      return redirect("/");
    }

    const getCategories = $axios.$get("/api/v1/report-categories");
    const getReports = $axios.$get("/api/v1/admin/reports");
    const getAreas = $axios.$get("/api/v1/areas");

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
          assetsLocation: [],
          // Filter Form
          form: {
            id: "",
            category: "",
            type: "",
            reporter: "",
            responder: "",
            resolver: "",
            status: "",
            type: "",
            area: "",
            startDate: null,
            endDate: null,
            limit: 9999999
          },
          selectList: {
            areas: areas.data,
            categories: categories.data,
            types: [],
            statuses: ["pending", "in-progress", "resolved", "cancelled"]
          },
          showCluster: true,
          showHeatmap: false,
          filterIsVisible: false
        };
      }
    );
  },
  mounted() {
    this.initSocketListeners();
    this.getReports();
  },
  computed: {
    heats() {
      if (this.reports.length > 0) {
        return this.reports
          .filter(report => {
            return report.location.coordinates[0] !== null;
          })
          .map(report => {
            return [
              report.location.coordinates[1],
              report.location.coordinates[0],
              0.1
            ];
          });
      }
      return [];
    }
  },
  methods: {
    initSocketListeners() {
      this.$socket.on("send-location", assetLocation => {
        const index = this.assetsLocation.findIndex(
          asset =>
            asset.user._id.toString() === assetLocation.user._id.toString()
        );

        if (index !== -1) {
          this.assetsLocation.splice(index, 1);
        }

        this.assetsLocation.push(assetLocation);
      });
    },
    getReports() {
      this.loadingReports = true;

      // Loop through query string and assign it to form
      if (this.$route.query) {
        Object.keys(this.$route.query).forEach(key => {
          let value = this.$route.query[key];
          if (value === "null") {
            value = null;
          }

          this.form[key] = value;

          if (key === "category") {
            this.selectCategoryChange(value);
          }
        });
      }

      this.$axios
        .$get("/api/v1/admin/reports", { params: this.form })
        .then(response => {
          // window.history.pushState(
          //   this.form,
          //   'Incident Map',
          //   `/command-center/maps${this.$utils.serialize(this.form)}`
          // )
          this.reports = response.data;
          this.loadingReports = false;
        })
        .catch(err => {
          console.log(err.response.data);
          this.loadingReports = false;
        });
    },
    filterReports() {
      this.loadingReports = true;

      this.form.start = this.form.startDate
        ? this.$moment(this.form.startDate).format("YYYY-MM-DD")
        : null;
      this.form.end = this.form.endDate
        ? this.$moment(this.form.endDate).format("YYYY-MM-DD")
        : null;

      this.$axios
        .$get("/api/v1/admin/reports", { params: this.form })
        .then(response => {
          // window.history.pushState(
          //   this.form,
          //   'Incident Map',
          //   `/command-center/maps${this.$utils.serialize(this.form)}`
          // )
          this.reports = response.data;
          this.loadingReports = false;

          if (this.form.area.length > 0) {
            const geoJSON = L.geoJSON(
              this.selectList.areas.find(
                area => area._id.toString() === this.form.area.toString()
              ).location
            );

            this.geojson = geoJSON.toGeoJSON();
            this.maxBounds = geoJSON.getBounds();
            this.$nextTick(() => {
              this.$refs.map.mapObject.fitBounds(this.maxBounds);
            });
          }
        })
        .catch(err => {
          this.loadingReports = false;
        });
    },
    resetFilter() {
      this.form.id = "";
      this.form.category = "";
      this.form.type = "";
      this.form.reporter = "";
      this.form.responder = "";
      this.form.resolver = "";
      this.form.status = "";
      this.form.type = "";
      this.form.area = "";
      this.form.startDate = null;
      this.form.endDate = null;
      this.form.limit = 999999;
      this.filterReports();
    },
    selectAreaChange(value) {
      this.form.area = value;
    },
    selectCategoryChange(value) {
      const categories = this.selectList.categories.find(
        category => category._id === value
      );
      if (value) {
        this.selectList.types = categories.types;
      }
      this.form.category = value;
      this.form.type = "";
    },
    selectTypeChange(value) {
      this.form.type = value;
    },
    selectStatusChange(value) {
      this.form.status = value;
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
            <td>${report.resolver ? report.resolver.email : "N/A"}</td>
          </tr>
          <tr>
            <td>Responder</td>
            <td>${report.responder ? report.responder.email : "N/A"}</td>
          </tr>
          <tr>
            <td>Status</td>
            <td>${report.status}</td>
          </tr>
          <tr>
            <td>Date Created</td>
            <td>${this.$moment(report.createdAt).format(
              "MMM. DD, YYYY | h:mm A "
            )}</td>
          </tr>
          <tr>
            <td>Last Updated</td>
            <td>${this.$moment(report.updatedAt).format(
              "MMM. DD, YYYY | h:mm A "
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
      </table>`;
    },
    showAssetContent(assetLocation) {
      return `      <table class="table table-striped">
        <tbody>
          <tr>
            <td>Responder</td>
            <td>${assetLocation.user.email}</td>
          </tr>
          <tr>
            <td>Category</td>
            <td>${assetLocation.user.category.name}</td>
          </tr>
          <tr>
            <td>Time Location Sent</td>
            <td>${this.$moment(assetLocation.createdAt).format(
              "MMM. DD, YYYY | h:mm A "
            )}</td>
          </tr>
        </tbody>
      </table>`;
    },
    onChangeMarkerCheckbox(e) {
      this.showCluster = e.target.checked;
    },
    onChangeHeatmapCheckbox(e) {
      this.showHeatmap = e.target.checked;
    }
  }
};
</script>

<style scoped>
@import "~leaflet.markercluster/dist/MarkerCluster.css";
@import "~leaflet.markercluster/dist/MarkerCluster.Default.css";

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
