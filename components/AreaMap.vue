<template>
  <div style="height: 380px; width: 100%;">
    <no-ssr>
      <l-map
        v-if="center.length > 0"
        :center="center"
        :zoom="zoom"
        :minZoom="minZoom"
        :maxZoom="maxZoom"
        :maxBoundsViscosity="maxBoundsViscosity"
        ref="map"
      >
        <l-tile-layer url="https://{s}.tile.osm.org/{z}/{x}/{y}.png"></l-tile-layer>
        <l-marker
          v-if="reports"
          :lat-lng="[report.location.coordinates[1], report.location.coordinates[0]]"
          v-for="report in reports"
          :key="report._id"
        ></l-marker>
          <l-geojson v-if="geojson" :geojson="geojson" :options-style="{fillOpacity: 0 }"></l-geojson>
      </l-map>
    </no-ssr>
  </div>
</template>

<script>
export default {
  props: ["area", "reports"],
  data() {
    return {
      loading: true,
      center: [],
      zoom: 13,
      minZoom: 13,
      maxZoom: 18,
      maxBounds: [],
      maxBoundsViscosity: 1.0,
      geojson: null
    };
  },
  mounted() {
    if (this.area) {
      this.assignInitialValue();
    }
  },
  methods: {
    assignInitialValue() {
      const lIsAvailable = setInterval(() => {
        this.$nextTick(() => {
          if (L && this.$refs.map) {
            this.zoom = this.area.minZoom;
            this.minZoom = this.area.minZoom;
            this.maxZoom = this.area.maxZoom;
            const geoJSON = L.geoJSON(this.area.location);
            this.geojson = geoJSON.toGeoJSON();
            this.maxBounds = geoJSON.getBounds();

            this.center = [
              this.maxBounds.getCenter().lat,
              this.maxBounds.getCenter().lng
            ];
            this.loading = false;

            clearInterval(lIsAvailable);
          }
        });
      }, 100);
    }
  }
};
</script>
