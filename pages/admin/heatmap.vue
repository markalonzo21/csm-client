<template>
  <div class="container mx-auto">
    <div id="map-wrap" style="height: 500px; width: 100%;" class="mt-8">
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
        </l-map>
      </no-ssr>
    </div>
  </div>
</template>
<script>
export default {
  layout: "admin",
  data() {
    const bounds = [120.89287, 14.63956, 121.07483, 14.5565];
    return {
      center: [14.59804, 120.98385],
      zoom: 13,
      minZoom: 13,
      maxZoom: 15,
      maxBounds: bounds,
      maxBoundsViscosity: 1.0
    };
  },
  mounted() {
    this.$nextTick(() => {
      const check = setInterval(() => {
        if (this.$refs.map) {
          this.maxBounds = new L.LatLngBounds(
            new L.LatLng(14.63956, 120.89287),
            new L.LatLng(14.5565, 121.07483)
          );

          this.$refs.map.mapObject.on("drag", () => {
            this.$refs.map.mapObject.panInsideBounds(this.maxBounds, {
              animate: false
            });
          });
          clearInterval(check);
        }
      }, 100);
    });
  }
};
</script>
