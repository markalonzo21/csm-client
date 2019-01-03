<template>
  <div>
    <h4>{{ area.name }}</h4>
    <div class="row">
      <div class="col-md-3">
        <TotalReportsCard/>
      </div>
      <div class="col-md-3">
        <ResolvedReportsCard/>
      </div>
      <div class="col-md-3">
        <UnresolvedReportsCard/>
      </div>
      <div class="col-md-3">
        <CancelledReportsCard/>
      </div>
    </div>
    <div class="col-md-6">
      <div style="height: 380px; width: 100%;">
        <no-ssr>
          <l-map
            v-if="center.length > 0"
            :center="center"
            :zoom="zoom"
            :minZoom="minZoom"
            :maxZoom="maxZoom"
            :maxBounds="maxBounds"
            :maxBoundsViscosity="maxBoundsViscosity"
            ref="map"
          >
            <l-geojson v-if="geojson" :geojson="geojson" :options-style="{fillOpacity: 0 }"></l-geojson>
            <l-tile-layer url="https://{s}.tile.osm.org/{z}/{x}/{y}.png"></l-tile-layer>
          </l-map>
        </no-ssr>
      </div>
    </div>
    <a-modal title="Add Area User" v-model="isAddModalVisible" @ok="handleSave">
      <a-form :layout="'vertical'">
        <a-form-item label="Role">
          <a-select placeholder="Select a role" v-model="form.role" required>
            <a-select-option value="resolver">Resolver</a-select-option>
            <a-select-option value="responder">Responder</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="User">
          <a-select v-model="form.user" required>
            <a-select-option value>Select a user</a-select-option>
            <a-select-option
              v-for="user in filteredUsers"
              :key="user._id"
              :value="user._id"
            >{{ user.email }}</a-select-option>
          </a-select>
        </a-form-item>
      </a-form>
    </a-modal>
    <div class="col-md-6">
      <h4>Details
        <a-button
          type="primary"
          @click="isAddModalVisible = true"
          class="float-right"
          v-if="$store.getters['auth/hasPermission']('update area')"
        >Add Area User</a-button>
      </h4>
      <hr>
      <h5>Resolvers</h5>
      <a-table :columns="columns" :dataSource="resolvers">
        <a slot="firstName" slot-scope="text" href="javascript:;">{{text}}</a>
        <a slot="lastName" slot-scope="text" href="javascript:;">{{text}}</a>
        <a slot="email" slot-scope="text" href="javascript:;">{{text}}</a>
      </a-table>
      <h5>Responders</h5>
      <a-table :columns="columns" :dataSource="responders">
        <a slot="firstName" slot-scope="text" href="javascript:;">{{text}}</a>
        <a slot="lastName" slot-scope="text" href="javascript:;">{{text}}</a>
        <a slot="email" slot-scope="text" href="javascript:;">{{text}}</a>
      </a-table>
    </div>
  </div>
</template>

<script>
import TotalReportsCard from "~/components/DashboardCards/TotalReportsCard";
import ResolvedReportsCard from "~/components/DashboardCards/ResolvedReportsCard";
import UnresolvedReportsCard from "~/components/DashboardCards/UnresolvedReportsCard";
import CancelledReportsCard from "~/components/DashboardCards/CancelledReportsCard";
export default {
  layout: "command-center",
  components: {
    TotalReportsCard,
    ResolvedReportsCard,
    UnresolvedReportsCard,
    CancelledReportsCard
  },
  asyncData({ $axios, store, redirect, params }) {
    const hasAccessToThisArea = store.state.auth.user.role.permissions.some(
      permission => permission.name === params.name
    );

    if (store.getters["auth/hasPermission"]("view areas")) {
      return $axios.$get(`/admin/areas/${params.name}`).then(response => {
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
      return $axios.$get(`/admin/areas/${params.name}`).then(response => {
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
      }
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
    assignInitialValue() {
      const lIsAvailable = setInterval(() => {
        if (L && this.$refs.map) {
          this.zoom = this.area.minZoom;
          this.minZoom = this.area.minZoom;
          this.maxZoom = this.area.maxZoom;

          const geoJSON = L.geoJSON(this.area.location);
          this.geojson = geoJSON.toGeoJSON();
          this.maxBounds = geoJSON.getBounds();
          this.$nextTick(() => {
            this.$refs.map.mapObject.fitBounds(this.maxBounds)
          })
          this.center = [
            this.maxBounds.getCenter().lat,
            this.maxBounds.getCenter().lng
          ];
          this.loading = false;

          clearInterval(lIsAvailable);
        }
      }, 100);
    },
    handleSave() {
      if (this.form.user && this.form.role) {
        this.$axios.$post("/admin/areas/add-user", this.form).then(response => {
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
    }
  }
};
</script>
