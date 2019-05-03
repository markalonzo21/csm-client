<template>
  <div>
    <h4 class="capitalize">{{ area.name }}</h4>
    <div class="row">
      <div class="col-md-3">
        <DashboardCard
          :labelValue="dashboardDetails.reportsCount ? dashboardDetails.reportsCount : 0"
          :loading="fetchingDashboardDetails"
          label="total no. of reports"
        />
      </div>
      <div class="col-md-3">
        <DashboardCard
          :labelValue="dashboardDetails.resolvedReportsCount ? dashboardDetails.resolvedReportsCount : 0"
          :loading="fetchingDashboardDetails"
          label="resolved reports"
        />
      </div>
      <div class="col-md-3">
        <DashboardCard
          :labelValue="dashboardDetails.unresolvedReportsCount ? dashboardDetails.unresolvedReportsCount : 0"
          :loading="fetchingDashboardDetails"
          label="unresolved reports"
        />
      </div>
      <div class="col-md-3">
        <DashboardCard
          :labelValue="dashboardDetails.cancelledReportsCount ? dashboardDetails.cancelledReportsCount : 0"
          :loading="fetchingDashboardDetails"
          label="cancelled reports"
        />
      </div>
      <div class="col-md-3">
        <DashboardCard
          :labelValue="dashboardDetails.emergencyReportsCount ? dashboardDetails.emergencyReportsCount : 0"
          :loading="fetchingDashboardDetails"
          label="emergency reports"
        />
      </div>
      <div class="col-md-3">
        <AverageReportResolvedCard :area="$route.params.name"/>
      </div>
    </div>
    <div class="row">
      <div class="col-md-12">
        <h4 class="title__gray--small">Graphs</h4>
        <hr>
        <div class="col-md-6 text-center">
          <h4>Reports Per Month</h4>
          <ReportsBarChart
            :datasets="reportsPerMonth.datasets"
            :labels="reportsPerMonth.labels"
            v-if="reportsPerMonth.labels.length > 0"
          />
        </div>
        <div class="col-md-6 text-center">
          <h4>Reports Per Category</h4>
          <ReportsPieChart
            :datasets="reportsPerCategory.datasets"
            :labels="reportsPerCategory.labels"
            v-if="reportsPerCategory.labels.length > 0"
          />
        </div>
      </div>
    </div>
    <div class="row mt-12">
      <div class="col-md-12">
        <h4>
          Details
          <a-button
            @click="isAddModalVisible = true"
            class="float-right"
            type="primary"
            v-if="$store.getters['auth/hasPermission']('update area')"
          >Add Area User</a-button>
        </h4>
        <hr>
        <h5>Resolvers</h5>
        <a-table
          :columns="columns"
          :dataSource="resolvers"
          :rowKey="user => user._id"
        >
          <a
            href="javascript:;"
            slot="firstName"
            slot-scope="text"
          >{{text}}</a>
          <a
            href="javascript:;"
            slot="lastName"
            slot-scope="text"
          >{{text}}</a>
          <a
            href="javascript:;"
            slot="email"
            slot-scope="text"
          >{{text}}</a>
        </a-table>
        <h5>Responders</h5>
        <a-table
          :columns="columns"
          :dataSource="responders"
          :rowKey="user => user._id"
        >
          <a
            href="javascript:;"
            slot="firstName"
            slot-scope="text"
          >{{text}}</a>
          <a
            href="javascript:;"
            slot="lastName"
            slot-scope="text"
          >{{text}}</a>
          <a
            href="javascript:;"
            slot="email"
            slot-scope="text"
          >{{text}}</a>
        </a-table>
      </div>
    </div>
    <a-modal
      @ok="handleSave"
      title="Add Area User"
      v-model="isAddModalVisible"
    >
      <a-form :layout="'vertical'">
        <a-form-item label="Role">
          <a-select
            placeholder="Select a role"
            required
            v-model="form.role"
          >
            <a-select-option value="resolver">Resolver</a-select-option>
            <a-select-option value="responder">Responder</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="User">
          <a-select
            required
            v-model="form.user"
          >
            <a-select-option value>Select a user</a-select-option>
            <a-select-option
              :key="user._id"
              :value="user._id"
              v-for="user in filteredUsers"
            >{{ user.email }}</a-select-option>
          </a-select>
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script>
import DashboardCard from "~/modular/command-center/components/DashboardCard";
import AverageReportResolvedCard from "~/modular/command-center/components/AverageReportResolvedCard";
import ReportsPieChart from "~/modular/command-center/components/DashboardCharts/ReportsPieChart";
import ReportsBarChart from "~/modular/command-center/components/DashboardCharts/ReportsBarChart";
import L from "leaflet";

export default {
  layout: "command-center/default",
  components: {
    DashboardCard,
    AverageReportResolvedCard,
    ReportsPieChart,
    ReportsBarChart
  },
  asyncData({ $axios, store, redirect, params }) {
    const hasAccessToThisArea = store.state.auth.user.role.permissions.some(
      permission => permission.name === params.name
    );

    if (store.getters["auth/hasPermission"]("view areas")) {
      return $axios
        .$get(`/api/v1/admin/areas/${params.name}`)
        .then(response => {
          return {
            area: response.data.area,
            resolvers: response.data.resolvers,
            responders: response.data.responders,
            allAvailableUsers: response.data.allAvailableUsers,
            form: {
              areaName: params.name,
              user: "",
              role: "resolver"
            },
            geojson: null,
            center: [14.53116, 121.04653],
            zoom: 13,
            minZoom: 13,
            maxZoom: 18,
            maxBounds: [],
            maxBoundsViscosity: 1.0
          };
        });
    }

    if (hasAccessToThisArea) {
      return $axios
        .$get(`/api/v1/admin/areas/${params.name}`)
        .then(response => {
          return {
            area: response.data.area,
            resolvers: response.data.resolvers,
            responders: response.data.responders,
            allAvailableUsers: response.data.allAvailableUsers,
            form: {
              area: params.name
            },
            center: [14.53116, 121.04653],
            zoom: 13,
            geojson: null,
            minZoom: 13,
            maxZoom: 18,
            maxBounds: [],
            maxBoundsViscosity: 1.0
          };
        });
    }

    return redirect("/");
  },
  mounted() {
    this.$nextTick(() => {
      this.assignInitialValue();
    });

    this.initSocketListeners();
    this.getGraphsData();
  },
  beforeDestroy() {
    this.$socket.off("new-report");
  },
  data() {
    return {
      loading: true,
      area: null,
      isAddModalVisible: false,
      columns: [
        {
          title: "First Name",
          dataIndex: "firstName",
          key: "firstName"
        },
        {
          title: "Last Name",
          dataIndex: "lastName",
          key: "lastName"
        },
        {
          title: "Email",
          dataIndex: "email",
          key: "email"
        }
      ],
      allAvailableUsers: [],
      resolvers: [],
      responders: [],
      form: {
        role: "resolver",
        user: "",
        area: null
      },
      dashboardDetails: [],
      reportsPerCategory: {
        labels: [],
        datasets: []
      },
      reportsPerMonth: {
        labels: [],
        datasets: []
      },
      fetchingDashboardDetails: false
    };
  },
  watch: {
    "form.role"(value) {
      this.form.user = "";
    }
  },
  computed: {
    filteredUsers() {
      if (!this.loading) {
        const permissionNameToFind =
          this.form.role === "resolver" ? "resolve" : "respond";
        return this.allAvailableUsers.filter(user => {
          return user.role.permissions.some(
            permission => permission.name === permissionNameToFind
          );
        });
      }
      return [];
    }
  },
  methods: {
    initSocketListeners() {
      this.$socket.on("new-report", report => {
        const contains = this.maxBounds.contains(
          L.latLng(
            report.location.coordinates[1],
            report.location.coordinates[0]
          )
        );

        if (contains) {
          this.$notification["info"]({
            message: `New report received!`,
            description: `You received a ${
              report.type.name
            } report in ${report.type.category.name.toLowerCase()}.`,
            btn: h => {
              return h(
                "a-button",
                {
                  props: {
                    type: "primary",
                    size: "small"
                  },
                  on: {
                    click: () => {
                      var win = window.open(
                        `/command-center/reports/${report._id}`,
                        "_blank"
                      );
                      win.focus();
                    }
                  }
                },
                "View report details."
              );
            }
          });
          this.dashboardDetails.reportsCount++;
          this.dashboardDetails.unresolvedReportsCount++;
          if (report.type.category.name === "Emergency") {
            this.dashboardDetails.emergencyReportsCount++;
          }
        }
      });
    },
    assignInitialValue() {
      const lIsAvailable = setInterval(() => {
        if (L) {
          this.zoom = this.area.minZoom;
          this.minZoom = this.area.minZoom;
          this.maxZoom = this.area.maxZoom;

          const geoJSON = L.geoJSON(this.area.location);
          this.geojson = geoJSON.toGeoJSON();
          this.maxBounds = geoJSON.getBounds();
          this.loading = false;

          clearInterval(lIsAvailable);
        }
      }, 100);
    },
    handleSave() {
      if (this.form.user && this.form.role) {
        this.$axios
          .$post("/api/v1/admin/areas/add-user", this.form)
          .then(response => {
            const index = this.allAvailableUsers.findIndex(
              user => user._id === this.form.user
            );

            const user = this.allAvailableUsers[index];
            const canResolve = user.role.permissions.find(
              permission => permission.name === "resolve"
            );
            const canRespond = user.role.permissions.find(
              permission => permission.name === "respond"
            );
            const selectedUserIsYou =
              user._id === this.$store.state.auth.user._id;
            if (canResolve) {
              this.resolvers.push(response.data);
            }
            if (canRespond) {
              this.responders.push(response.data);
            }
            if (selectedUserIsYou) {
              this.$store.commit("auth/ADD_AREA", this.area);
            }

            this.allAvailableUsers.splice(index, 1);

            this.form.role = "resolver";
            this.form.user = "";
            this.form.areaId = null;

            this.isAddModalVisible = false;
          });
      }
    },
    getGraphsData() {
      this.fetchingDashboardDetails = true;
      const getDashboardDetails = this.$axios.$get(
        `/api/v1/admin/areas/${this.area._id}/dashboard`
      );
      const getreportsPerCategory = this.$axios.$get(
        `/api/v1/admin/areas/${this.area._id}/dashboard/reports-per-category`
      );
      const getReportsPerMonth = this.$axios.$get(
        `/api/v1/admin/areas/${this.area._id}/dashboard/reports-per-month`
      );

      Promise.all([
        getDashboardDetails,
        getreportsPerCategory,
        getReportsPerMonth
      ]).then(([dashboardDetails, reportsPerCategory, reportsPerMonth]) => {
        // Others
        this.dashboardDetails = dashboardDetails.data;
        this.reportsPerCategory = reportsPerCategory.data;
        this.reportsPerMonth = reportsPerMonth.data;
        this.fetchingDashboardDetails = false;
      });
    }
  }
};
</script>
