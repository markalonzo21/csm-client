<template>
  <div class="container">
    <a-input v-model="form.name" placeholder="Area Name"/>
    <div id="map-wrap" style="height: 500px; width: 100%;" class="mt-4">
      <no-ssr>
        <l-map
          :center="map.center"
          :zoom="map.zoom"
          :minZoom="map.minZoom"
          :maxZoom="map.maxZoom"
          ref="map"
        >
          <l-tile-layer url="https://{s}.tile.osm.org/{z}/{x}/{y}.png"></l-tile-layer>
        </l-map>
      </no-ssr>
    </div>
    <div class="my-4">
      <a-button type="primary" @click.prevent="saveArea">Save Area</a-button>
    </div>
  </div>
</template>

<script>
export default {
  layout: "command-center",
  asyncData({ store, redirect }) {
    if (!store.getters["auth/hasPermission"]("create area")) {
      return redirect("/");
    }
  },
  data() {
    return {
      mapObject: null,
      map: {
        center: [14.59804, 120.98385],
        zoom: 13,
        minZoom: 13,
        maxZoom: 18,
        maxBoundsViscosity: 1.0
      },
      rectangleDrawer: null,
      rectangle: null,
      form: {
        name: "",
        bounds: []
      }
    };
  },
  mounted() {
    this.initDrawing();
  },
  methods: {
    initDrawing() {
      const checkDrawing = setInterval(() => {
        if (this.$refs.map) {
          this.mapObject = this.$refs.map.mapObject;
        }
      }, 100);
    },
    saveArea() {
      const bounds = this.mapObject.getBounds();
      this.form.bounds = [
        [bounds._northEast.lng, bounds._northEast.lat],
        [bounds._southWest.lng, bounds._southWest.lat]
      ];
      this.$axios.$post("/admin/areas", this.form).then(response => {
        this.$router.push("/command-center/areas");
      });
    }
  }
};
</script>

<!-- THE MIGHT BE UNEEDED DRAWING SHITS -->
 <!--  mounted() {
    this.initDrawing()
  },
  methods: {
    initDrawing() {
      const checkDrawing = setInterval(() => {
        if (L.Draw && this.$refs.map) {
          this.mapObject = this.$refs.map.mapObject
          this.$nextTick(() => {
            this.rectangleDrawer = new L.Draw.Rectangle(this.mapObject)
            this.initializeMapListeners()
            clearInterval(checkDrawing);
          })
        }
      }, 100)
    },
    initializeMapListeners() {
      this.mapObject.on('draw:created', e => {
        this.rectangle = e.layer
      })

      this.mapObject.on('draw:drawstart', e => {
        this.rectangle = null
      })
    },
    startDraw() {
      this.rectangleDrawer.disable()
      this.$nextTick(() => {
        this.rectangleDrawer.enable()
      })
    }
  } -->
