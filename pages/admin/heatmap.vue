<template>
  <div class="container mx-auto">
    <div class="mt-4">
      <select v-model="type" required class="p-2">
        <option :value="null">Select Type</option>
        <option v-for="type in reportTypes" :key="type._id" :value="type._id" v-text="type.name"></option>
      </select>
      <span class="ml-2" v-if="loadingHeats">LOADING HEATS</span>
    </div>
    <div id="map-wrap" style="height: 500px; width: 100%;" class="mt-4">
      <no-ssr>
        <l-map
          :center="center"
          :maxBounds="maxBounds"
          :zoom="zoom"
          :minZoom="minZoom"
          :maxZoom="maxZoom"
          :maxBoundsViscosity="maxBoundsViscosity"
          ref="map"
        >
          <l-tile-layer url="http://{s}.tile.osm.org/{z}/{x}/{y}.png"></l-tile-layer>
          <LeafletHeatmap
            v-if="reports.length > 0 && !loadingHeats"
            :lat-lng="heats"
            :radius="25"
            :min-opacity=".75"
            :blur="15"
          ></LeafletHeatmap>
        </l-map>
      </no-ssr>
    </div>
  </div>
</template>
<script>
export default {
  layout: "admin",
  asyncData({ $axios }) {
    return $axios.$get("/report-types").then(response => {
      return {
        reportTypes: response.data,
        type: null,
      }
    })
  },
  data() {
    const bounds = [120.89287, 14.63956, 121.07483, 14.5565]
    return {
      center: [14.59804, 120.98385],
      zoom: 13,
      minZoom: 13,
      maxZoom: 15,
      maxBounds: bounds,
      maxBoundsViscosity: 1.0,
      reports: [],
    }
  },
  computed: {
    heats() {
      return this.reports.map(report => {
        return [report.location.coordinates[1], report.location.coordinates[0]]
      })
    },
  },
  mounted() {
    this.$nextTick(() => {
      const check = setInterval(() => {
        if (this.$refs.map) {
          this.maxBounds = new L.LatLngBounds(
            new L.LatLng(14.63956, 120.89287),
            new L.LatLng(14.5565, 121.07483)
          )

          this.$refs.map.mapObject.on("drag", () => {
            this.$refs.map.mapObject.panInsideBounds(this.maxBounds, {
              animate: false,
            })
          })
          clearInterval(check)
        }
      }, 100)
    })
  },
  watch: {
    type(value) {
      if (value === null) {
        return
      }

      this.loadingHeats = true

      this.$axios.$get(`/admin/reports/${value}`).then(response => {
        this.reports = response.data
        this.loadingHeats = false
      })
    },
  },
}
</script>
