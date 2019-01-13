<template>
  <div class="panel location">
    <div class="panel-heading">
      <h3 class="text-uppercase">Location</h3>
    </div>
    <div class="panel-body">
      <div style="height: 380px; width: 100%;">
        <l-map
          v-if="map.center.length > 0"
          :center="map.center"
          :zoom="map.zoom"
          :minZoom="map.minZoom"
          :maxZoom="map.maxZoom"
          :maxBounds="map.maxBounds"
          :maxBoundsViscosity="map.maxBoundsViscosity"
          ref="map"
        >
          <l-marker
            :lat-lng="[report.location.coordinates[1], report.location.coordinates[0]]"
            :icon="$utils.getIcon(report.type.category.color)"
          >
            <l-popup :content="showReportContent(report)"></l-popup>
          </l-marker>
          <l-tile-layer url="https://{s}.tile.osm.org/{z}/{x}/{y}.png"></l-tile-layer>
        </l-map>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    report: {
      type: Object,
      required: true
    }
  },
  data() {
    const bounds = [120.89287, 14.63956, 121.07483, 14.5565]
    const lat = this.report.location
      ? this.report.location.coordinates[1]
      : 14.59804
    const lng = this.report.location
      ? this.report.location.coordinates[0]
      : 120.98385

    return {
      map: {
        center: [lat, lng],
        zoom: 13,
        minZoom: 8,
        maxZoom: 18,
        maxBounds: bounds,
        maxBoundsViscosity: 1.0
      }
    }
  },
  methods: {
    showReportContent(report) {
      return `      <table class="table table-striped">
        <tbody>
          <tr>
            <td>Name</td>
            <td>${report.reporter.firstName} ${report.reporter.middleName} ${
        report.reporter.lastName
      }</td>
          </tr>
          <tr>
            <td>Email</td>
            <td>${report.reporter.email}</td>
          </tr>
          <tr>
            <td>Phone</td>
            <td>${report.reporter.mobile}</td>
          </tr>
                    <tr>
            <td>Gender</td>
            <td>${report.reporter.gender}</td>
          </tr>
          <tr>
            <td>Tenant</td>
            <td>${report.reporter.tenant ? 'Yes' : 'No'}</td>
          </tr>
                    <tr>
            <td>Location</td>
            <td>${report.locationName ? report.locationName : 'N/A'}</td>
          </tr>
        </tbody>
      </table>`
    }
  }
}
</script>
