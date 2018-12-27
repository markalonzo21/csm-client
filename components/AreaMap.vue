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
      maxBoundsViscosity: 1.0
    };
  },
  mounted() {
    this.$nextTick(() => {
      if (this.area) {
        this.assignInitialValue();
      }
    });
  },
  methods: {
    assignInitialValue() {
      const lIsAvailable = setInterval(() => {
        this.$nextTick(() => {
          if (L && this.$refs.map) {
            this.zoom = this.area.minZoom;
            this.minZoom = this.area.minZoom;
            this.maxZoom = this.area.maxZoom;

            this.maxBounds = L.latLngBounds(
              L.latLng(
                this.area.location.coordinates[0][1],
                this.area.location.coordinates[0][0]
              ),
              L.latLng(
                this.area.location.coordinates[1][1],
                this.area.location.coordinates[1][0]
              )
            );

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
