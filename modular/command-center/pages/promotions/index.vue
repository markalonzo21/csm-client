<template>
  <section class="w-full flex flex-col">
    <CreatePromotionModal
      @onClose="hideCreatePromotionModal"
      @onCreate="addPromotion"
      v-if="createPromotionModalVisible"
    />
    <div class="clearfix">
      <h3 class="float-left">Promotions</h3>
      <a-button
        @click.prevent="showCreatePromotionModal"
        class="float-right my-6"
        type="primary"
        v-if="$store.getters['auth/hasPermission']('create promotion')"
      >Create Promotion</a-button>
    </div>
    <hr>
    <a-table
      :columns="columns"
      :dataSource="promotions"
      :loading="loadingGetPromotions"
      :rowKey="promotion => promotion._id"
      :scroll="{ x: 900 }"
      bordered
    >
      <template
        slot="image"
        slot-scope="promotion"
      >
        <img
          :src="$utils.cloudinaryTransform(promotion.image, 'w_978,h_125')"
          alt="promotion-img"
          class="img-responsive"
          style="max-height: 125px;"
          v-if="promotion.image && promotion.placement === 'home-page'"
        >
        <img
          :src="$utils.cloudinaryTransform(promotion.image, 'w_260,h_216')"
          alt="promotion-img"
          class="img-responsive"
          style="max-height: 216px;"
          v-else-if="promotion.image && promotion.placement === 'new-report'"
        >
        <span v-else>No Image</span>
      </template>
      <template
        slot="actions"
        slot-scope="_id"
      >
        <a-popconfirm
          @confirm="deletePromotion(_id)"
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
import CreatePromotionModal from "./-CreatePromotionModal";
import promotionColumns from "./-promotionColumns";
export default {
  layout: "command-center/default",
  components: {
    CreatePromotionModal
  },
  asyncData({ $axios, store, redirect }) {
    if (!store.getters["auth/hasPermission"]("view promotions")) {
      redirect("/");
    }
  },
  data() {
    return {
      loadingGetPromotions: false,
      loadingDeletePromotion: false,
      createPromotionModalVisible: false,
      columns: promotionColumns,
      promotions: []
    };
  },
  mounted() {
    this.getPromotions();
  },
  methods: {
    getPromotions() {
      this.loadingGetPromotions = true;
      this.$axios
        .$get("/api/v1/admin/promotions")
        .then(response => {
          this.promotions = response.data;
          this.loadingGetPromotions = false;
        })
        .catch(error => {
          this.loadingGetPromotions = false;
          alert("Something went wrong. Please reload the page.");
          console.log(error);
        });
    },
    addPromotion(promotion) {
      this.promotions.push(promotion);
      this.createPromotionModalVisible = false;
    },
    deletePromotion(_id) {
      if (!this.$store.getters["auth/hasPermission"]("delete promotion")) {
        this.$message.error(
          "You don't have the permission to perform this action"
        );
        return;
      }

      this.loadingDeletePromotion = true;
      this.$axios
        .$delete(`/api/v1/admin/promotions/${_id}`)
        .then(response => {
          const index = this.promotions.findIndex(
            promotion => promotion._id === _id
          );
          if (index !== -1) this.promotions.splice(index, 1);
          this.$message.success("Promotion has been deleted");
          this.loadingDeletePromotion = false;
        })
        .catch(error => {
          alert("Something went wrong! Please reload the page.");
          console.log(error);
          this.loadingDeletePromotion = false;
        });
    },
    showCreatePromotionModal() {
      this.createPromotionModalVisible = true;
    },
    hideCreatePromotionModal() {
      this.createPromotionModalVisible = false;
    }
  }
};
</script>

