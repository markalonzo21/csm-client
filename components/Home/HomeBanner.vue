<template>
  <carousel :indicators="indicators" :controls="controls" :interval="interval" ref="carousel">
    <slide>
      <img src="/img/banner.jpg" alt class="img-responsive">
    </slide>
    <slide>
      <img src="/img/banner-ads.png" alt class="img-responsive">
      <!-- <div class="container">
            <div class="row">
              <div class="col-md-4 left-content">
                <h2 class="title__blue--large text-uppercase">Report Now!</h2>
                <div class="intro-text mb30">
                  <p class="basic__dark">
                    This website is an Incident Reporting App and Web Software,
                    wherein you can manage and track incidents in a quick and
                    effective way, inform the right people directly and
                    effortlessly in just one click away
                  </p>
                </div>
                <router-link to="/new-report" class="btn btnblue text-uppercase"
                  >Report</router-link
                >
              </div>
              <div class="col-md-8 right-content">
                <img
                  src="/img/monitor.png"
                  alt
                  class="img-responsive mrgnauto pull-right"
                />
              </div>
            </div>
      </div>-->
    </slide>
  </carousel>
</template>

<script>
export default {
  data() {
    return {
      interval: 5000,
      indicators: false,
      controls: true
    };
  }
};
</script>
