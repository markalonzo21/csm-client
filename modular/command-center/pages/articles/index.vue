<template>
  <section class="w-full flex flex-col">
    <CreateArticleModal
      @onClose="hideCreateArticleModal"
      @onCreate="addArticle"
      v-if="createArticleModalVisible"
    />
    <div class="clearfix">
      <h3 class="float-left">Articles</h3>
      <a-button
        @click.prevent="showCreateArticleModal"
        class="float-right my-6"
        type="primary"
        v-if="$store.getters['auth/hasPermission']('create article')"
      >Create Article</a-button>
    </div>
    <hr>
    <a-table
      :columns="columns"
      :dataSource="articles"
      :loading="loadingGetArticles"
      :rowKey="article => article._id"
      :scroll="{ x: 900 }"
      bordered
    >
      <template
        slot="media"
        slot-scope="media"
      >
        <img
          :src="$utils.cloudinaryTransform(media, 'w_300,h_120')"
          alt="article-img"
          class="img-responsive"
          style="max-height: 120px;"
        >
      </template>
      <template
        slot="actions"
        slot-scope="_id"
      >
        <a-popconfirm
          @confirm="deleteArticle(_id)"
          cancelText="No"
          okText="Yes"
          title="Are you sure that you want to perform this action?"
        >
          <a-button type="danger">Delete</a-button>
        </a-popconfirm>
      </template>
    </a-table>
  </section>
</template>

<script>
import CreateArticleModal from "./-CreateArticleModal";
import articleColumns from "./-articleColumns";
export default {
  layout: "command-center/default",
  components: {
    CreateArticleModal
  },
  asyncData({ $axios, store, redirect }) {
    if (!store.getters["auth/hasPermission"]("view articles")) {
      redirect("/");
    }
  },
  data() {
    return {
      loadingGetArticles: false,
      loadingDeleteArticle: false,
      createArticleModalVisible: false,
      columns: articleColumns,
      articles: []
    };
  },
  mounted() {
    this.getArticles();
  },
  methods: {
    getArticles() {
      this.loadingGetArticles = true;
      this.$axios
        .$get("/api/v1/admin/articles")
        .then(response => {
          this.articles = response.data;
          this.loadingGetArticles = false;
        })
        .catch(error => {
          this.loadingGetArticles = false;
          alert("Something went wrong. Please reload the page.");
          console.log(error);
        });
    },
    addArticle(article) {
      this.articles.push(article);
      this.createArticleModalVisible = false;
    },
    deleteArticle(_id) {
      if (!this.$store.getters["auth/hasPermission"]("delete article")) {
        this.$message.error(
          "You don't have the permission to perform this action"
        );
        return;
      }

      this.loadingDeleteArticle = true;
      this.$axios
        .$delete(`/api/v1/admin/articles/${_id}`)
        .then(response => {
          const index = this.articles.findIndex(article => article._id === _id);
          if (index !== -1) this.articles.splice(index, 1);
          this.$message.success("Article has been deleted");
          this.loadingDeleteArticle = false;
        })
        .catch(error => {
          alert("Something went wrong! Please reload the page.");
          console.log(error);
          this.loadingDeleteArticle = false;
        });
    },
    showCreateArticleModal() {
      this.createArticleModalVisible = true;
    },
    hideCreateArticleModal() {
      this.createArticleModalVisible = false;
    }
  }
};
</script>

