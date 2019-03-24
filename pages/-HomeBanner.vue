<template>
  <carousel
    :controls="controls"
    :indicators="indicators"
    :interval="interval"
    ref="carousel"
    v-if="banners.length > 0"
  >
    <slide
      :key="`${banner}-${index}`"
      v-for="(banner, index) in banners"
    >
      <img
        :src="banner.image"
        alt
        class="img-responsive"
      >
    </slide>
  </carousel>
</template>

<script>
export default {
  data() {
    return {
      interval: 5000,
      indicators: false,
      controls: true,
      banners: []
    };
  },
  mounted() {
    this.$axios
      .$get("/api/v1/banners")
      .then(response => {
        this.banners = response.data;
      })
      .catch(error => {
        alert("Something went wrong! please reload the page.");
      });
  }
};
</script>
