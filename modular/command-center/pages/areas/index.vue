<template>
  <section class="w-full">
    <div class="clearfix">
      <h3 class="float-left">Areas</h3>
      <nuxt-link to="/command-center/areas/create">
        <a-button
          class="float-right my-6"
          type="primary"
          v-if="$store.getters['auth/hasPermission']('create area')"
        >Create Area</a-button>
      </nuxt-link>
    </div>
    <hr>
    <a-table
      :columns="columns"
      :dataSource="dataSource"
      :loading="loadingGetAreas"
      :rowKey="area => area._id"
      :scroll="{ x: 900 }"
      bordered
    >
      <!-- <template slot="description" slot-scope="text">{{ text }}</template> -->
      <template
        slot="actions"
        slot-scope="text, record"
      >
        <a-button type="primary">
          <nuxt-link :to="`/command-center/areas/${record.name}`">Show</nuxt-link>
        </a-button>
      </template>
    </a-table>
  </section>
</template>

<script>
export default {
  layout: "command-center/default",
  asyncData({ store, redirect }) {
    if (
      store.getters["auth/hasPermission"]("view areas") ||
      store.getters["auth/hasSpecificArea"]
    ) {
      return;
    }
    return redirect("/");
  },
  data() {
    return {
      loadingGetAreas: true,
      columns: [
        {
          title: "Name",
          dataIndex: "name",
          scopedSlots: { customRender: "name" }
        },
        {
          title: "Department",
          dataIndex: "department"
        },
        // {
        //   title: 'Description',
        //   dataIndex: 'description',
        //   scopedSlots: { customRender: 'description' }
        // },
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
    this.loadingGetAreas = true;
    this.$axios.$get("/api/v1/admin/areas").then(response => {
      this.dataSource = response.data;
      this.loadingGetAreas = false;
    });
  }
};
</script>
