<template>
  <div
    class="news"
    v-if="articles.length > 0"
  >
    <div class="container">
      <h2 class="title__blue text-uppercase text-center mt0 mb45">Articles</h2>
      <div class="row clrmargin">
        <!--
        <div class="col-md-4 clrpadding item">
          <div class="panel">
            <div class="panel-heading p0">
              <img
                alt
                class="img-responsive mrgnauto"
                src="/img/three central-01.jpg"
              >
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
              <a
                class="btn btnmore pull-right"
                href="#"
              >
                More
                <svg
                  height="30px"
                  id="Layer_1"
                  style="enable-background:new 0 0 17.4 30;"
                  version="1.1"
                  viewBox="0 0 17.4 30"
                  width="17.4px"
                  x="0px"
                  xmlns="https://www.w3.org/2000/svg"
                  xmlns:xlink="https://www.w3.org/1999/xlink"
                  xml:space="preserve"
                  y="0px"
                >
                  <path
                    d="M2.4,30C3,30,3.6,29.8,4,29.3l12.6-12.6c0.4-0.4,0.7-1,0.7-1.7c0-0.6-0.2-1.2-0.7-1.7L4,0.7
                     c-0.9-0.9-2.4-0.9-3.3,0c-0.9,0.9-0.9,2.4,0,3.3l11,11l-11,11c-0.9,0.9-0.9,2.4,0,3.3C1.2,29.8,1.8,30,2.4,30"
                    id="XMLID_4_"
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
                alt
                class="img-responsive mrgnauto"
                src="/img/mckinley-01.jpg"
              >
            </div>
            <div class="panel-body">
              <h2 class="title__black--lato mt0">McKinley</h2>
              <p class="basic">
                Megaworld's largest township development in Metro Manila,
                McKinley Hill.
              </p>
            </div>
            <div class="panel-footer p0">
              <a
                class="btn btnmore pull-right"
                href="#"
              >
                More
                <svg
                  height="30px"
                  id="Layer_1"
                  style="enable-background:new 0 0 17.4 30;"
                  version="1.1"
                  viewBox="0 0 17.4 30"
                  width="17.4px"
                  x="0px"
                  xmlns="https://www.w3.org/2000/svg"
                  xmlns:xlink="https://www.w3.org/1999/xlink"
                  xml:space="preserve"
                  y="0px"
                >
                  <path
                    d="M2.4,30C3,30,3.6,29.8,4,29.3l12.6-12.6c0.4-0.4,0.7-1,0.7-1.7c0-0.6-0.2-1.2-0.7-1.7L4,0.7
                     c-0.9-0.9-2.4-0.9-3.3,0c-0.9,0.9-0.9,2.4,0,3.3l11,11l-11,11c-0.9,0.9-0.9,2.4,0,3.3C1.2,29.8,1.8,30,2.4,30"
                    id="XMLID_4_"
                  ></path>
                </svg>
              </a>
            </div>
          </div>
        </div>-->
        <div
          :key="`article-${article._id}`"
          class="col-md-4 clrpadding item"
          v-for="article in articles"
        >
          <div class="panel">
            <div class="panel-heading p0">
              <img
                :src="$utils.cloudinaryTransform(article.media[0], 'w_300,h_120')"
                alt
                class="img-responsive mrgnauto"
              >
            </div>
            <div class="panel-body">
              <h2 class="title__black--lato mt0">{{ article.title }}</h2>
              <p class="basic">{{ article.description.substring(0, 202) }}</p>
            </div>
            <div class="panel-footer p0">
              <nuxt-link
                :to="`/articles/${article.slug}`"
                class="btn btnmore pull-right"
              >
                More
                <svg
                  height="30px"
                  id="Layer_1"
                  style="enable-background:new 0 0 17.4 30;"
                  version="1.1"
                  viewBox="0 0 17.4 30"
                  width="17.4px"
                  x="0px"
                  xmlns="https://www.w3.org/2000/svg"
                  xmlns:xlink="https://www.w3.org/1999/xlink"
                  xml:space="preserve"
                  y="0px"
                >
                  <path
                    d="M2.4,30C3,30,3.6,29.8,4,29.3l12.6-12.6c0.4-0.4,0.7-1,0.7-1.7c0-0.6-0.2-1.2-0.7-1.7L4,0.7
                     c-0.9-0.9-2.4-0.9-3.3,0c-0.9,0.9-0.9,2.4,0,3.3l11,11l-11,11c-0.9,0.9-0.9,2.4,0,3.3C1.2,29.8,1.8,30,2.4,30"
                    id="XMLID_4_"
                  ></path>
                </svg>
              </nuxt-link>
            </div>
          </div>
        </div>
      </div>
      <!-- <div class="loadmore text-center mt60">
        <a
          class="btn btnblue text-uppercase"
          href="#"
        >Load more</a>
      </div>-->
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      articles: []
    };
  },
  mounted() {
    this.$axios
      .$get("/api/v1/articles")
      .then(response => {
        this.articles = response.data;
      })
      .catch(error => {
        alert("Something went wrong! please reload the page.");
      });
  }
};
</script>

