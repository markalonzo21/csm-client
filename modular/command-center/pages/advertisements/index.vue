<template>
  <section class="w-full">
    <div class="clearfix">
      <h3 class="float-left">Advertisements</h3>
      <nuxt-link to="/command-center/advertisements/create">
        <a-button
          class="float-right my-6"
          type="primary"
          v-if="$store.getters['auth/hasPermission']('create advertisement')"
        >Create Advertisement</a-button>
      </nuxt-link>
    </div>
    <hr>
    <a-table
      :columns="columns"
      :dataSource="dataSource"
      :loading="loadingGetAdvertisements"
      :scroll="{ x: 900 }"
      bordered
    >
      <template
        slot="link"
        slot-scope="text, record"
      >
        <a
          :href="record.link"
          target="_blank"
          v-if="record.link !== 'undefined'"
          v-text="record.link"
        ></a>
      </template>
      <template
        slot="image"
        slot-scope="text, record"
      >
        <img
          :src="record.image"
          class="max-h-sm max-w-sm"
        >
      </template>
      <template
        slot="actions"
        slot-scope="text, record, index"
        v-if="$store.getters['auth/hasPermission']('delete advertisement') || $store.getters['auth/hasPermission']('update advertisement')"
      >
        <a-button
          type="primary"
          v-if="$store.getters['auth/hasPermission']('update advertisement')"
        >
          <nuxt-link :to="`/command-center/advertisements/${record._id}/edit`">Edit</nuxt-link>
        </a-button>
        <a-popconfirm
          @confirm="removeAdvertisement(record, index)"
          cancelText="No"
          okText="Yes"
          title="Are you sure delete this role?"
          v-if="$store.getters['auth/hasPermission']('delete advertisement')"
        >
          <a-button type="danger">Delete</a-button>
        </a-popconfirm>
      </template>
    </a-table>
  </section>
</template>

<script>
export default {
  layout: "command-center/default",
  asyncData({ store, redirect }) {
    if (!store.getters["auth/hasPermission"]("view advertisements")) {
      return redirect("/");
    }
  },
  data() {
    return {
      loadingGetAdvertisements: true,
      columns: [
        {
          title: "Name",
          dataIndex: "name",
          scopedSlots: { customRender: "name" }
        },
        {
          title: "Link",
          dataIndex: "link",
          scopedSlots: { customRender: "link" }
        },
        {
          title: "Image",
          dataIndex: "image",
          scopedSlots: { customRender: "image" }
        },
        {
          title: "Actions",
          dataIndex: "actions",
          scopedSlots: { customRender: "actions" }
        }
      ],
      dataSource: []
    };
  },
  mounted() {
    this.loadingGetAdvertisements = true;
    this.$axios.$get("/api/v1/admin/advertisements").then(response => {
      this.dataSource = response.data;
      this.loadingGetAdvertisements = false;
    });
  },
  methods: {
    removeAdvertisement(advertisement, index) {
      this.$axios
        .$delete(`/api/v1/admin/advertisements/${advertisement._id}`)
        .then(response => {
          this.dataSource.splice(index, 1);
        })
        .catch(error => {
          console.log(error.response.data);
          alert("Something went wrong. please check your internet connection.");
        });
    }
  }
};
</script>
