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
            <div>{{ report.type.name }}</div>
          </div>
          <div class="col-md-3">
            <div class="text-blue-light font-semibold">Status</div>
            <div>{{ report.status }}</div>
          </div>
          <div class="col-md-3">
            <div class="text-blue-light font-semibold"></div>
            <button
              class="btn btnblue capitalize"
              @click.prevent="showChatHistory = !showChatHistory"
            >View Chat History</button>
          </div>
          <div class="col-md-3 mt-4">
            <div class="text-blue-light font-semibold">Reporter</div>
            <div>{{ report.reporter.firstName }} {{ report.reporter.middleName }} {{ report.reporter.lastName }}</div>
          </div>
          <div class="col-md-3 mt-4">
            <div class="text-blue-light font-semibold">Resolver</div>
            <div>{{ report.resolver.firstName }} {{ report.resolver.middleName }} {{ report.resolver.lastName }}</div>
          </div>
          <div class="col-md-3 mt-4">
            <div class="text-blue-light font-semibold">Responder</div>
            <div>{{ report.responder.firstName }} {{ report.responder.middleName }} {{ report.responder.lastName }}</div>
          </div>
          <div class="col-md-3 mt-4">
            <div class="text-blue-light font-semibold">Resolved Date</div>
            <div>{{ $moment(report.resolvedAt).format('MMM. DD, YYYY | h:mm A') }}</div>
          </div>
          <div class="col-md-12" v-if="report.media.length > 0">
            <h3 class="title__blue mb30">Media</h3>
            <div class="row">
              <div class="col-md-3" v-for="media in report.media" :key="media">
                <img :src="media" alt="image-media" v-if="$utils.isImage(media)">
                <video width="300" controls v-else>
                  <source :src="media" type="video/mp4">
                </video>
              </div>
            </div>
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
    <ChatBox
      v-if="showChatHistory"
      :reportId="report._id"
      :isResolved="report.resolvedAt !== null"
    />
  </div>
</template>

<script>
import ChatBox from "~/components/ChatBox";
export default {
  components: {
    ChatBox
  },
  asyncData({ $axios, params, isServer }) {
    return $axios.$get(`/reports/${params.id}`).then(response => {
      const lat = response.data.location
        ? response.data.location.coordinates[1]
        : 14.59804;
      const lng = response.data.location
        ? response.data.location.coordinates[0]
        : 120.98385;

      response.data.map = {
        center: [lat, lng],
        zoom: 13,
        minZoom: 13,
        maxZoom: 18,
        maxBoundsViscosity: 1.0
      };

      return {
        report: response.data,
        showChatHistory: false
      };
    });
  }
};
</script>
