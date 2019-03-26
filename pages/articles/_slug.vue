<template>
  <div>
    <pre>{{ article }}</pre>
  </div>
</template>

<script>
export default {
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
