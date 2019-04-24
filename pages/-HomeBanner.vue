<template>
  <uiv-carousel
    :controls="controls"
    :indicators="indicators"
    :interval="interval"
    ref="carousel"
    v-if="banners.length > 0"
  >
    <uiv-slide
      :key="`${banner}-${index}`"
      v-for="(banner, index) in banners"
    >
      <v-lazy-image
        :src="$utils.cloudinaryTransform(banner.image, 'w_1920,h_700')"
        class="img-responsive"
      />
    </uiv-slide>
  </uiv-carousel>
</template>

<script>
export default {
  props: ["banners"],
  data() {
    return {
      interval: 5000,
      indicators: false,
      controls: true
    };
  }
  // mounted() {
  //   this.$axios
  //     .$get("/api/v1/banners")
  //     .then(response => {
  //       this.banners = response.data;
  //     })
  //     .catch(error => {
  //       alert("Something went wrong! please reload the page.");
  //     });
  // }
};
</script>
