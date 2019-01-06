<template>
  <div>
    <section class="banner">
      <carousel
        :indicators="indicators"
        :controls="controls"
        :interval="interval"
        ref="carousel"
      >
        <slide>
          <img src="/img/banner.jpg" alt="" class="img-responsive" />
        </slide>
        <slide>
            <img src="/img/banner-ads.png" alt="" class="img-responsive" />
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
          </div> -->
        </slide>
      </carousel>
      <div class="actionbtn">
          <div class="forreport mb10">
            <a href="#" class="btn text-uppercase">
              Report now!</small>
            </a>
          </div>
          <div class="forreg">
            <a href="#" class="btn text-uppercase">
              Register now!</small>
            </a>
          </div>
        </div>
    </section>
    <div class="news ads mt30">
      <div class="container">
        <carousel
          :indicators="indicators"
          :controls="controls"
          :interval="interval"
          ref="carousel"
        >
          <slide>
            <div class="newsitem">
                <img src="/img/megaworld-logo.jpg" alt="" class="img-responsive pull-left mr10" style="max-width: 200px;">
                <h3 class="title__black--lato mt0"><a href="#">Title of the News here</a></h3>
            </div>
          </slide>
          <slide>
            <div class="adsitem">
                <img src="/img/wide-ads.png" alt="" class="img-responsive mb20" />
            </div>
          </slide>
        </carousel>
      </div>
    </div>
    <section class="main-content">
      <div class="news">
        <div class="container">
          <h2 class="title__blue text-uppercase text-center mt0 mb45">
            News &amp; announcenement
          </h2>
          <div class="row clrmargin">
            <div class="col-md-4 clrpadding item">
              <div class="panel">
                <div class="panel-heading p0">
                  <img
                    src="/img/townships-01.jpg"
                    alt
                    class="img-responsive mrgnauto"
                  />
                </div>
                <div class="panel-body">
                  <h2 class="title__black--lato mt0">Townships</h2>
                  <p class="basic">
                    This 72-hectare township is envishione to be "the next
                    central busines district in Iloilo.
                  </p>
                </div>
                <div class="panel-footer p0">
                  <a href="#" class="btn btnmore pull-right">
                    More
                    <svg
                      version="1.1"
                      id="Layer_1"
                      xmlns="https://www.w3.org/2000/svg"
                      xmlns:xlink="https://www.w3.org/1999/xlink"
                      x="0px"
                      y="0px"
                      width="17.4px"
                      height="30px"
                      viewBox="0 0 17.4 30"
                      style="enable-background:new 0 0 17.4 30;"
                      xml:space="preserve"
                    >
                      <path
                        id="XMLID_4_"
                        d="M2.4,30C3,30,3.6,29.8,4,29.3l12.6-12.6c0.4-0.4,0.7-1,0.7-1.7c0-0.6-0.2-1.2-0.7-1.7L4,0.7
                     c-0.9-0.9-2.4-0.9-3.3,0c-0.9,0.9-0.9,2.4,0,3.3l11,11l-11,11c-0.9,0.9-0.9,2.4,0,3.3C1.2,29.8,1.8,30,2.4,30"
                      ></path>
                    </svg>
                  </a>
                </div>
              </div>
            </div>
            <div class="col-md-4 clrpadding item">
              <div class="panel">
                <div class="panel-heading p0">
                  <img
                    src="/img/stmortiz-01.jpg"
                    alt
                    class="img-responsive mrgnauto"
                  />
                </div>
                <div class="panel-body">
                  <h2 class="title__black--lato mt0">
                    St. Moritz Private Estate
                  </h2>
                  <p class="basic">
                    With a residential scheme that brings out the spirit of
                    glittering elegance known only to exist for the privileged.
                  </p>
                </div>
                <div class="panel-footer p0">
                  <a href="#" class="btn btnmore pull-right">
                    More
                    <svg
                      version="1.1"
                      id="Layer_1"
                      xmlns="https://www.w3.org/2000/svg"
                      xmlns:xlink="https://www.w3.org/1999/xlink"
                      x="0px"
                      y="0px"
                      width="17.4px"
                      height="30px"
                      viewBox="0 0 17.4 30"
                      style="enable-background:new 0 0 17.4 30;"
                      xml:space="preserve"
                    >
                      <path
                        id="XMLID_4_"
                        d="M2.4,30C3,30,3.6,29.8,4,29.3l12.6-12.6c0.4-0.4,0.7-1,0.7-1.7c0-0.6-0.2-1.2-0.7-1.7L4,0.7
                     c-0.9-0.9-2.4-0.9-3.3,0c-0.9,0.9-0.9,2.4,0,3.3l11,11l-11,11c-0.9,0.9-0.9,2.4,0,3.3C1.2,29.8,1.8,30,2.4,30"
                      ></path>
                    </svg>
                  </a>
                </div>
              </div>
            </div>
            <div class="col-md-4 clrpadding item">
              <div class="panel">
                <div class="panel-heading p0">
                  <img
                    src="/img/event.jpg"
                    alt
                    class="img-responsive mrgnauto"
                  />
                </div>
                <div class="panel-body">
                  <h2 class="title__black--lato mt0">Sample Title</h2>
                  <p class="basic">
                    Lorem ipsum dolor sit amet consectetur adipisicing elit.
                    Expedita, quia rem quibusdam veniam minus.
                  </p>
                </div>
                <div class="panel-footer p0">
                  <a href="#" class="btn btnmore pull-right">
                    More
                    <svg
                      version="1.1"
                      id="Layer_1"
                      xmlns="https://www.w3.org/2000/svg"
                      xmlns:xlink="https://www.w3.org/1999/xlink"
                      x="0px"
                      y="0px"
                      width="17.4px"
                      height="30px"
                      viewBox="0 0 17.4 30"
                      style="enable-background:new 0 0 17.4 30;"
                      xml:space="preserve"
                    >
                      <path
                        id="XMLID_4_"
                        d="M2.4,30C3,30,3.6,29.8,4,29.3l12.6-12.6c0.4-0.4,0.7-1,0.7-1.7c0-0.6-0.2-1.2-0.7-1.7L4,0.7
                     c-0.9-0.9-2.4-0.9-3.3,0c-0.9,0.9-0.9,2.4,0,3.3l11,11l-11,11c-0.9,0.9-0.9,2.4,0,3.3C1.2,29.8,1.8,30,2.4,30"
                      ></path>
                    </svg>
                  </a>
                </div>
              </div>
            </div>
            <div class="col-md-4 clrpadding item">
              <div class="panel">
                <div class="panel-heading p0">
                  <img
                    src="/img/three central-01.jpg"
                    alt
                    class="img-responsive mrgnauto"
                  />
                </div>
                <div class="panel-body">
                  <h2 class="title__black--lato mt0">Three Central</h2>
                  <p class="basic">
                    Megaworld’s Three Central is an important residential
                    condominium project located on the financial side of Ayala
                    Avenue in Salcedo Village.
                  </p>
                </div>
                <div class="panel-footer p0">
                  <a href="#" class="btn btnmore pull-right">
                    More
                    <svg
                      version="1.1"
                      id="Layer_1"
                      xmlns="https://www.w3.org/2000/svg"
                      xmlns:xlink="https://www.w3.org/1999/xlink"
                      x="0px"
                      y="0px"
                      width="17.4px"
                      height="30px"
                      viewBox="0 0 17.4 30"
                      style="enable-background:new 0 0 17.4 30;"
                      xml:space="preserve"
                    >
                      <path
                        id="XMLID_4_"
                        d="M2.4,30C3,30,3.6,29.8,4,29.3l12.6-12.6c0.4-0.4,0.7-1,0.7-1.7c0-0.6-0.2-1.2-0.7-1.7L4,0.7
                     c-0.9-0.9-2.4-0.9-3.3,0c-0.9,0.9-0.9,2.4,0,3.3l11,11l-11,11c-0.9,0.9-0.9,2.4,0,3.3C1.2,29.8,1.8,30,2.4,30"
                      ></path>
                    </svg>
                  </a>
                </div>
              </div>
            </div>
            <div class="col-md-4 clrpadding item">
              <div class="panel">
                <div class="panel-heading p0">
                  <img
                    src="/img/mckinley-01.jpg"
                    alt
                    class="img-responsive mrgnauto"
                  />
                </div>
                <div class="panel-body">
                  <h2 class="title__black--lato mt0">McKinley</h2>
                  <p class="basic">
                    Megaworld's largest township development in Metro Manila,
                    McKinley Hill.
                  </p>
                </div>
                <div class="panel-footer p0">
                  <a href="#" class="btn btnmore pull-right">
                    More
                    <svg
                      version="1.1"
                      id="Layer_1"
                      xmlns="https://www.w3.org/2000/svg"
                      xmlns:xlink="https://www.w3.org/1999/xlink"
                      x="0px"
                      y="0px"
                      width="17.4px"
                      height="30px"
                      viewBox="0 0 17.4 30"
                      style="enable-background:new 0 0 17.4 30;"
                      xml:space="preserve"
                    >
                      <path
                        id="XMLID_4_"
                        d="M2.4,30C3,30,3.6,29.8,4,29.3l12.6-12.6c0.4-0.4,0.7-1,0.7-1.7c0-0.6-0.2-1.2-0.7-1.7L4,0.7
                     c-0.9-0.9-2.4-0.9-3.3,0c-0.9,0.9-0.9,2.4,0,3.3l11,11l-11,11c-0.9,0.9-0.9,2.4,0,3.3C1.2,29.8,1.8,30,2.4,30"
                      ></path>
                    </svg>
                  </a>
                </div>
              </div>
            </div>
            <div class="col-md-4 clrpadding item">
              <div class="panel">
                <div class="panel-heading p0">
                  <img
                    src="/img/security-01.jpg"
                    alt
                    class="img-responsive mrgnauto"
                  />
                </div>
                <div class="panel-body">
                  <h2 class="title__black--lato mt0">
                    Security Force is Important
                  </h2>
                  <p class="basic">
                    Your security force is your eyes and ears during the busiest
                    times of the day to when the world is asleep and you need a
                    trustworthy sentry to make sure you’re protected.
                  </p>
                </div>
                <div class="panel-footer p0">
                  <a href="#" class="btn btnmore pull-right">
                    More
                    <svg
                      version="1.1"
                      id="Layer_1"
                      xmlns="https://www.w3.org/2000/svg"
                      xmlns:xlink="https://www.w3.org/1999/xlink"
                      x="0px"
                      y="0px"
                      width="17.4px"
                      height="30px"
                      viewBox="0 0 17.4 30"
                      style="enable-background:new 0 0 17.4 30;"
                      xml:space="preserve"
                    >
                      <path
                        id="XMLID_4_"
                        d="M2.4,30C3,30,3.6,29.8,4,29.3l12.6-12.6c0.4-0.4,0.7-1,0.7-1.7c0-0.6-0.2-1.2-0.7-1.7L4,0.7
                     c-0.9-0.9-2.4-0.9-3.3,0c-0.9,0.9-0.9,2.4,0,3.3l11,11l-11,11c-0.9,0.9-0.9,2.4,0,3.3C1.2,29.8,1.8,30,2.4,30"
                      ></path>
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          </div>
          <div class="loadmore text-center mt60">
            <a href="#" class="btn btnblue text-uppercase">Load more</a>
          </div>
        </div>
      </div>
      <!-- <div class="ads mt30">
        <div class="container">
          <div class="row">
            <div
              class="col-md-4 item"
              v-for="advertisement in advertisements"
              :key="`ad-${advertisement._id}`"
            >
              <div class="panel">
                <div class="panel-heading">
                  <a
                    :href="advertisement.link"
                    target="_blank"
                    :class="[advertisement.link ? 'cursor-pointer':  'pointer-events-none' ]"
                  >
                    <img
                      :src="advertisement.image"
                      alt
                      class="img-responsive mrgnauto"
                    />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div> -->
    </section>

    <section class="container-bottom">
      <div class="container">
        <div class="row">
          <div class="col-md-6 left-content">
            <div class="panel">
              <div class="panel-body">
                <h3 class="title__blue--large text-uppercase">
                  Command center
                </h3>
                <p class="basic">
                  Lorem ipsum dolor sit, amet consectetur adipisicing elit.
                  Sapiente, quod, error quae dolore officiis autem officia iure
                  quibusdam aliquid, fugiat laboriosam maiores earum sint odio
                  quisquam harum deserunt. Aliquam, magnam.
                </p>
                <a href="#" class="btn btnblue">button</a>
              </div>
            </div>
          </div>
          <div class="col-md-6 right-content">
            <div class="panel">
              <div class="panel-body">
                <h3 class="title__blue--large text-uppercase">
                  Help us improve our site
                </h3>
                <textarea
                  name=""
                  id=""
                  cols="30"
                  rows="6"
                  class="form-control mb20"
                ></textarea>
                <a href="#" class="btn btnblue">Submit</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
    <div class="ads ptpb40">
      <img src="/img/wide-ads.png" alt="" class="img-responsive mrgnauto" />
    </div>
  </div>
</template>
<script>
  export default {
    auth: false,
    layout: "public",
    asyncData({ $axios }) {
      return $axios.$get("/advertisements").then(response => {
        return {
          advertisements: response.data
        };
      });
    },
    data() {
      return {
        interval: 5000,
        indicators: false,
        controls: true
      };
    }
  };
</script>
<style>
  .ptpb40 {
    padding: 40px 0;
  }

  .actionbtn {
        position: fixed;
    bottom: 5px;
    right: 0;
    z-index: 2;
  }
  .carousel-control.right,
  .carousel-control.left {
    background: transparent;
  }
  .banner .left.carousel-control {
    left: 15px;
  }
  .banner .right.carousel-control {
    right: 15px;
  }
  .banner .carousel-control,
  .ads .carousel-control {
    width: 0;
    opacity: 1;
  }
  .ads .carousel-control .glyphicon:before {
    color: #344fa0;
  }
  .ads .left.carousel-control {
    left: -15px;
  }
  .ads .right.carousel-control {
    right: -15px;
  }
  .news.ads .item {
    height: 150px;
  }
  .news.ads a {
    font-size: 36px;
    font-weight: 700;
    color: #5f6772;
    text-decoration: none;
  }
  .news.ads .newsitem {
    display: flex;
    align-items: center;
    justify-content: center;
  }
</style>
