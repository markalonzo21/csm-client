<template>
  <div class="main-content">
    <div class="container">
      <div class="col-md-12">
        <div class="row border rounded bg-white py-6 px-6 mb-2">
          <h4 class="font-bold mt-0 text-blue-darker">Report ID: {{ report._id }}</h4>
          <div class="col-md-3">
            <div class="text-blue-light font-semibold">Date</div>
            <div>{{ $moment(report.createdAt).format('MMM. DD, YYYY | h:mm A') }}</div>
          </div>
          <div class="col-md-3">
            <div class="text-blue-light font-semibold">Type</div>
            <div>{{ report.reportType.name }}</div>
          </div>
          <div class="col-md-3">
            <div class="text-blue-light font-semibold">Responder</div>
            <div>{{ report.assignedTo.firstName }} {{ report.assignedTo.middleName }} {{ report.assignedTo.lastName }}</div>
          </div>
          <div class="col-md-3">
            <div class="text-blue-light font-semibold"></div>
            <button class="btn btnblue capitalize">View Chat History</button>
          </div>
        </div>
        <div class="row border rounded bg-white py-6 px-6" v-if="report.location !== null">
          <h4 class="font-bold mt-0 text-blue-darker">Incident Location</h4>
          <div id="map-wrap" style="height: 300px; width: 100%;" class="mt-4">
            <no-ssr>
              <l-map
                :center="report.map.center"
                :zoom="report.map.zoom"
                :minZoom="report.map.minZoom"
                :maxZoom="report.map.maxZoom"
                ref="map"
              >
                <l-tile-layer url="https://{s}.tile.osm.org/{z}/{x}/{y}.png"></l-tile-layer>
                <l-marker :lat-lng="report.map.center"></l-marker>
              </l-map>
            </no-ssr>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  asyncData({ $axios, params, isServer }) {
    return $axios.$get(`/reports/${params.id}`).then(response => {
      const lat = response.data.location ? response.data.location.coordinates[1] : 14.59804
      const lng = response.data.location ? response.data.location.coordinates[0] : 120.98385

      response.data.map = {
        center: [lat, lng],
        zoom: 13,
        minZoom: 13,
        maxZoom: 18,
        maxBoundsViscosity: 1.0
      }

      return {
        report: response.data
      };
    });
  },
}
</script>
