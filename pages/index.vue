<template>
  <div>
    <section class="banner">
      <no-ssr>
        <HomeBannerPlaceholder slot="placeholder"/>
        <HomeBanner :banners="banners"/>
      </no-ssr>
      <HomeFab/>
    </section>
    <HomeNews/>
    <section class="main-content">
      <HomeAnnouncements/>
    </section>

    <!-- <section class="container-bottom">
      <div class="container">
        <div class="row">
          <div class="col-md-6 left-content">
            <div class="panel">
              <div class="panel-body">
                <h3 class="title__blue--large text-uppercase">Command center</h3>
                <p class="basic">
                  Lorem ipsum dolor sit, amet consectetur adipisicing elit.
                  Sapiente, quod, error quae dolore officiis autem officia iure
                  quibusdam aliquid, fugiat laboriosam maiores earum sint odio
                  quisquam harum deserunt. Aliquam, magnam.
                </p>
                <a
                  class="btn btnblue"
                  href="#"
                >button</a>
              </div>
            </div>
          </div>
          <div class="col-md-6 right-content">
            <div class="panel">
              <div class="panel-body">
                <h3 class="title__blue--large text-uppercase">Help us improve our site</h3>
                <textarea
                  class="form-control mb20"
                  cols="30"
                  id
                  name
                  rows="6"
                ></textarea>
                <a
                  class="btn btnblue"
                  href="#"
                >Submit</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>-->
    <div
      class="ads ptpb40"
      v-if="advertisement"
    >
      <a
        :href="advertisement.link"
        target="_blank"
        v-if="advertisement.link"
      >
        <img
          :src="$utils.cloudinaryTransform(advertisement.image, 'w_978,h_125')"
          alt
          class="img-responsive mrgnauto"
          style="max-height: 125px; "
        >
      </a>
      <img
        :src="$utils.cloudinaryTransform(advertisement.image, 'w_978,h_125')"
        alt
        class="img-responsive mrgnauto"
        style="max-height: 125px; "
        v-else
      >
    </div>
  </div>
</template>
<script>
import HomeBanner from "./-HomeBanner";
import HomeBannerPlaceholder from "./-HomeBannerPlaceholder";
import HomeFab from "./-HomeFab";
import HomeAnnouncements from "./-HomeAnnouncements";
import HomeNews from "./-HomeNews";
export default {
  auth: false,
  layout: "public",
  components: {
    HomeBanner,
    HomeBannerPlaceholder,
    HomeFab,
    HomeAnnouncements,
    HomeNews
  },
  asyncData({ $axios }) {
    const getBanners = $axios.$get("/api/v1/banners");
    const getAds = $axios.$get("/api/v1/promotions?placement=home-page");

    return Promise.all([getBanners, getAds]).then(
      ([bannersResponse, adsResponse]) => {
        return {
          banners: bannersResponse.data,
          advertisement: adsResponse.data[0]
        };
      }
    );
  }
};
</script>
<style scoped>
.main-content {
  height: auto;
  min-height: auto;
}
.ptpb40 {
  padding: 40px 0;
}

.actionbtn {
  position: fixed;
  bottom: 5px;
  right: 0;
  z-index: 6;
}
.carousel-control.right,
.carousel-control.left {
  background: transparent;
}
.banner img {
  object-fit: cover;
  height: 700px;
  width: 100%;
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
