<template>
  <div class="main-content">
    <div class="container">
      <h1 class="title__black mt0 uppercase mb-10">{{article.title}}</h1>
      <img
        :src="article.media"
        alt
        class="img-responsive pull-left mr20 mb20"
        srcset
      >
      <p class="basic whitespace-pre-wrap">{{article.description}}</p>
    </div>
  </div>
</template>

<script>
export default {
  auth: false,
  asyncData({ $axios, params, error }) {
    return $axios
      .$get(`/api/v1/articles/${params.slug}`)
      .then(response => {
        return {
          article: response.data
        };
      })
      .catch(err => {
        error({ status: err.response.status, message: "Article not found!" });
      });
  }
};
</script>
