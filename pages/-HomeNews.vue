<template>
  <div class="news ads mt30">
    <div class="container">
      <uiv-carousel
        :controls="controls"
        :indicators="indicators"
        :interval="interval"
        ref="carousel"
        v-if="news.length > 0"
      >
        <uiv-slide>
          <div class="newsitem">
            <!-- <img
              src="/img/megaworld-logo.jpg"
              alt
              class="img-responsive pull-left mr10"
              style="max-width: 200px;"
            >-->
            <h3 class="title__black--lato mt0">
              <a href="#">Title of the News here</a>
            </h3>
          </div>
        </uiv-slide>
        <uiv-slide>
          <div class="plugitem">
            <img
              alt
              class="img-responsive mb20"
              src="/img/wide-ads.png"
            >
          </div>
        </uiv-slide>
      </uiv-carousel>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      interval: 5000,
      indicators: false,
      controls: true,
      news: []
    };
  }
};
</script>
