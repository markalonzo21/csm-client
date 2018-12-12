<template>
  <section class="w-full" v-if="!loading">
    <div class="clearfix">
      <h3 class="float-left">Areas</h3>
      <a-button type="primary" class="float-right my-6" disabled>Create Area</a-button>
    </div>
    <hr>
    <a-table bordered :dataSource="dataSource" :columns="columns">
      <template slot="operation" slot-scope="text, record">
        <a-button type="primary">
          <router-link :to="`/command-center/areas/${record._id}`">Show</router-link>
        </a-button>
      </template>
    </a-table>
  </section>
</template>

<script>
export default {
  layout: "command-center",
  asyncData({ store, redirect }) {
    if (!store.getters["auth/hasPermission"]("view areas")) {
      redirect("/");
    }
  },
  data() {
    return {
      loading: true,
      columns: [
        {
          title: "Name",
          dataIndex: "name",
          width: "80%",
          scopedSlots: { customRender: "name" }
        },
        {
          title: "Operation",
          dataIndex: "operation",
          scopedSlots: { customRender: "operation" }
        }
      ],
      dataSource: []
    };
  },
  mounted() {
    this.$axios.$get("/areas").then(response => {
      this.dataSource = response.data;
      this.loading = false;
    });
  }
};
</script>
<style>
.editable-cell {
  position: relative;
}

.editable-cell-input-wrapper,
.editable-cell-text-wrapper {
  padding-right: 24px;
}

.editable-cell-text-wrapper {
  padding: 5px 24px 5px 5px;
}

.editable-cell-icon,
.editable-cell-icon-check {
  position: absolute;
  right: 0;
  width: 20px;
  cursor: pointer;
}

.editable-cell-icon {
  line-height: 18px;
  display: none;
}

.editable-cell-icon-check {
  line-height: 28px;
}

.editable-cell:hover .editable-cell-icon {
  display: inline-block;
}

.editable-cell-icon:hover,
.editable-cell-icon-check:hover {
  color: #108ee9;
}

.editable-add-btn {
  margin-bottom: 8px;
}
</style>

<!--<script>
import AreaMap from '~/components/AreaMap'
export default {
  layout: 'command-center',
  components: {
    AreaMap: AreaMap
  },
  mounted() {
    this.$axios.$get('/areas').then(response => {
      this.areas = response.data
    })

    this.$nextTick(() => {
      this.assignInitialValue()
    })
  },
  data() {
    return {
      loading: true,
      areas: []
    }
  },
  methods: {
    assignInitialValue() {
      const lIsAvailable = setInterval(() => {
        if (L) {
          this.loading = false
        }
      }, 100)
    }
  }
}
</script>-->
