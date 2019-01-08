<template>
  <div class="news ads mt30">
    <div class="container">
      <carousel :indicators="indicators" :controls="controls" :interval="interval" ref="carousel">
        <slide>
          <div class="newsitem">
            <img
              src="/img/megaworld-logo.jpg"
              alt
              class="img-responsive pull-left mr10"
              style="max-width: 200px;"
            >
            <h3 class="title__black--lato mt0">
              <a href="#">Title of the News here</a>
            </h3>
          </div>
        </slide>
        <slide>
          <div class="plugitem">
            <img src="/img/wide-ads.png" alt class="img-responsive mb20">
          </div>
        </slide>
      </carousel>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      interval: 5000,
      indicators: false,
      controls: true
    }
  }
}
</script>
