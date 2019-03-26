<template>
  <section class="w-full flex flex-col">
    <CreateBannerModal
      @onClose="hideCreateBannerModal"
      @onCreate="addBanner"
      v-if="createBannerModalVisible"
    />
    <div class="clearfix">
      <h3 class="float-left">Banners</h3>
      <a-button
        @click.prevent="showCreateBannerModal"
        class="float-right my-6"
        type="primary"
        v-if="$store.getters['auth/hasPermission']('create banner')"
      >Create Banner</a-button>
    </div>
    <hr>
    <a-table
      :columns="columns"
      :dataSource="banners"
      :loading="loadingGetBanners"
      :rowKey="banner => banner._id"
      :scroll="{ x: 900 }"
      bordered
    >
      <template
        slot="image"
        slot-scope="image"
      >
        <img
          :src="$utils.cloudinaryTransform(image, 'w_1920,h_700')"
          alt="banner-img"
          class="img-responsive"
          style="height: 700px"
        >
      </template>
      <template
        slot="actions"
        slot-scope="_id"
      >
        <a-popconfirm
          @confirm="deleteBanner(_id)"
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
import CreateBannerModal from "./-CreateBannerModal";
import bannerColumns from "./-bannerColumns";
export default {
  layout: "command-center/default",
  components: {
    CreateBannerModal
  },
  asyncData({ $axios, store, redirect }) {
    if (!store.getters["auth/hasPermission"]("view banners")) {
      redirect("/");
    }
  },
  data() {
    return {
      loadingGetBanners: false,
      loadingDeleteBanner: false,
      createBannerModalVisible: false,
      columns: bannerColumns,
      banners: []
    };
  },
  mounted() {
    this.getBanners();
  },
  methods: {
    getBanners() {
      this.loadingGetBanners = true;
      this.$axios
        .$get("/api/v1/admin/banners")
        .then(response => {
          this.banners = response.data;
          this.loadingGetBanners = false;
        })
        .catch(error => {
          this.loadingGetBanners = false;
          alert("Something went wrong. Please reload the page.");
          console.log(error);
        });
    },
    addBanner(banner) {
      this.banners.push(banner);
      this.createBannerModalVisible = false;
    },
    deleteBanner(_id) {
      if (!this.$store.getters["auth/hasPermission"]("delete banner")) {
        this.$message.error(
          "You don't have the permission to perform this action"
        );
        return;
      }

      this.loadingDeleteBanner = true;
      this.$axios
        .$delete(`/api/v1/admin/banners/${_id}`)
        .then(response => {
          const index = this.banners.findIndex(banner => banner._id === _id);
          if (index !== -1) this.banners.splice(index, 1);
          this.$message.success("Banner has been deleted");
          this.loadingDeleteBanner = false;
        })
        .catch(error => {
          alert("Something went wrong! Please reload the page.");
          console.log(error);
          this.loadingDeleteBanner = false;
        });
    },
    showCreateBannerModal() {
      this.createBannerModalVisible = true;
    },
    hideCreateBannerModal() {
      this.createBannerModalVisible = false;
    }
  }
};
</script>

