<template>
  <section class="w-full flex flex-col">
    <CreateAdvertisementModal
      @onClose="hideCreateAdvertisementModal"
      @onCreate="addAdvertisement"
      v-if="createAdvertisementModalVisible"
    />
    <div class="clearfix">
      <h3 class="float-left">Advertisements</h3>
      <a-button
        @click.prevent="showCreateAdvertisementModal"
        class="float-right my-6"
        type="primary"
        v-if="$store.getters['auth/hasPermission']('create advertisement')"
      >Create Advertisement</a-button>
    </div>
    <hr>
    <a-table
      :columns="columns"
      :dataSource="advertisements"
      :loading="loadingGetAdvertisements"
      :rowKey="advertisement => advertisement._id"
      :scroll="{ x: 900 }"
      bordered
    >
      <template
        slot="image"
        slot-scope="advertisement"
      >
        <img
          :src="$utils.cloudinaryTransform(advertisement.image, 'w_978,h_125')"
          alt="advertisement-img"
          class="img-responsive"
          style="max-height: 125px;"
          v-if="advertisement.image && advertisement.placement === 'home-page'"
        >
        <img
          :src="$utils.cloudinaryTransform(advertisement.image, 'w_260,h_216')"
          alt="advertisement-img"
          class="img-responsive"
          style="max-height: 216px;"
          v-else-if="advertisement.image && advertisement.placement === 'new-report'"
        >
        <span v-else>No Image</span>
      </template>
      <template
        slot="actions"
        slot-scope="_id"
      >
        <a-popconfirm
          @confirm="deleteAdvertisement(_id)"
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
import CreateAdvertisementModal from "./-CreateAdvertisementModal";
import advertisementColumns from "./-advertisementColumns";
export default {
  layout: "command-center/default",
  components: {
    CreateAdvertisementModal
  },
  asyncData({ $axios, store, redirect }) {
    if (!store.getters["auth/hasPermission"]("view advertisements")) {
      redirect("/");
    }
  },
  data() {
    return {
      loadingGetAdvertisements: false,
      loadingDeleteAdvertisement: false,
      createAdvertisementModalVisible: false,
      columns: advertisementColumns,
      advertisements: []
    };
  },
  mounted() {
    this.getAdvertisements();
  },
  methods: {
    getAdvertisements() {
      this.loadingGetAdvertisements = true;
      this.$axios
        .$get("/api/v1/admin/advertisements")
        .then(response => {
          this.advertisements = response.data;
          this.loadingGetAdvertisements = false;
        })
        .catch(error => {
          this.loadingGetAdvertisements = false;
          alert("Something went wrong. Please reload the page.");
          console.log(error);
        });
    },
    addAdvertisement(advertisement) {
      this.advertisements.push(advertisement);
      this.createAdvertisementModalVisible = false;
    },
    deleteAdvertisement(_id) {
      if (!this.$store.getters["auth/hasPermission"]("delete advertisement")) {
        this.$message.error(
          "You don't have the permission to perform this action"
        );
        return;
      }

      this.loadingDeleteAdvertisement = true;
      this.$axios
        .$delete(`/api/v1/admin/advertisements/${_id}`)
        .then(response => {
          const index = this.advertisements.findIndex(
            advertisement => advertisement._id === _id
          );
          if (index !== -1) this.advertisements.splice(index, 1);
          this.$message.success("Advertisement has been deleted");
          this.loadingDeleteAdvertisement = false;
        })
        .catch(error => {
          alert("Something went wrong! Please reload the page.");
          console.log(error);
          this.loadingDeleteAdvertisement = false;
        });
    },
    showCreateAdvertisementModal() {
      this.createAdvertisementModalVisible = true;
    },
    hideCreateAdvertisementModal() {
      this.createAdvertisementModalVisible = false;
    }
  }
};
</script>

