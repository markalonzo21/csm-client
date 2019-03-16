<template>
  <div class="container">
    <h3 class="mt-0 text-center mb-4">Create Area</h3>
    <div
      class="mt-4 mb-4"
      id="map-wrap"
      style="height: 500px; width: 50vw; margin: auto;"
    >
      <no-ssr>
        <l-map
          :center="map.center"
          :maxZoom="map.maxZoom"
          :minZoom="map.minZoom"
          :zoom="map.zoom"
          ref="map"
        >
          <l-tile-layer url="https://{s}.tile.osm.org/{z}/{x}/{y}.png"></l-tile-layer>
        </l-map>
      </no-ssr>
    </div>
    <div class="my-2">
      <a-input
        placeholder="Area Name"
        v-model="form.name"
      />
    </div>
    <div class="my-2">
      <a-input
        placeholder="Department Name"
        v-model="form.department"
      />
    </div>
    <div class="my-2">
      <a-textarea
        :autosize="{ minRows: 2, maxRows: 6 }"
        placeholder="Description"
        v-model="form.description"
      />
    </div>
    <div class="my-4">
      <a-button
        @click.prevent="saveArea"
        class="float-right"
        type="primary"
      >Create</a-button>
    </div>
  </div>
</template>

<script>
function formatNumber(value) {
  value += "";
  const list = value.split(".");
  const prefix = list[0].charAt(0) === "-" ? "-" : "";
  let num = prefix ? list[0].slice(1) : list[0];
  let result = "";
  while (num.length > 3) {
    result = `,${num.slice(-3)}${result}`;
    num = num.slice(0, num.length - 3);
  }
  if (num) {
    result = num + result;
  }
  return `${prefix}${result}${list[1] ? `.${list[1]}` : ""}`;
}

export default {
  layout: "command-center/default",
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
        department: "",
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
    createPolygonFromBounds(latLngBounds) {
      var center = latLngBounds.getCenter();
      var latlngs = [];

      latlngs.push(latLngBounds.getSouthWest()); //bottom left
      latlngs.push({ lat: latLngBounds.getSouth(), lng: center.lng }); //bottom center
      latlngs.push(latLngBounds.getSouthEast()); //bottom right
      latlngs.push({ lat: center.lat, lng: latLngBounds.getEast() }); // center right
      latlngs.push(latLngBounds.getNorthEast()); //top right
      latlngs.push({
        lat: latLngBounds.getNorth(),
        lng: this.$refs.map.mapObject.getCenter().lng
      }); //top center
      latlngs.push(latLngBounds.getNorthWest()); //top left
      latlngs.push({
        lat: this.$refs.map.mapObject.getCenter().lat,
        lng: latLngBounds.getWest()
      }); //center left

      return new L.polygon(latlngs);
    },
    saveArea() {
      const bounds = this.mapObject.getBounds();
      const polygon = this.createPolygonFromBounds(bounds);
      this.form.coordinates = polygon.toGeoJSON().geometry.coordinates;
      this.form.minZoom = this.mapObject.getZoom();
      this.$axios.$post("/api/v1/admin/areas", this.form).then(response => {
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
