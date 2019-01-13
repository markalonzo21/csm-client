<template>
  <section class="w-full">
    <div class="clearfix">
      <h3 class="float-left">Areas</h3>
      <nuxt-link to="/command-center/areas/create">
        <a-button
          type="primary"
          class="float-right my-6"
          v-if="$store.getters['auth/hasPermission']('create area')"
        >Create Area</a-button>
      </nuxt-link>
    </div>
    <hr>
    <a-table :loading="loadingGetAreas" bordered :scroll="{ x: 900 }" :dataSource="dataSource" :columns="columns">
      <template slot="actions" slot-scope="text, record">
        <a-button type="primary">
          <nuxt-link :to="`/command-center/areas/${record.name}`">Show</nuxt-link>
        </a-button>
      </template>
    </a-table>
  </section>
</template>

<script>
export default {
  layout: 'command-center/default',
  asyncData({ store, redirect }) {
    if (
      store.getters['auth/hasPermission']('view areas') ||
      store.getters['auth/hasSpecificArea']
    ) {
      return
    }
    return redirect('/')
  },
  data() {
    return {
      loadingGetAreas: true,
      columns: [
        {
          title: 'Name',
          dataIndex: 'name',
          scopedSlots: { customRender: 'name' },
          width: '80%'
        },
        // {
        //   title: "Description",
        //   dataIndex: "description",
        //   width: "60%",
        //   scopedSlots: { customRender: "description" }
        // },
        {
          title: 'Actions',
          dataIndex: 'actions',
          scopedSlots: { customRender: 'actions' }
        }
      ],
      dataSource: []
    }
  },
  mounted() {
    this.loadingGetAreas = true
    this.$axios.$get('/admin/areas').then(response => {
      this.dataSource = response.data
      this.loadingGetAreas = false
    })
  }
}
</script>

<!--<script>
import AreaMap from '~/components/AreaMap'
export default {
  layout: 'command-center/default',
  components: {
    AreaMap: AreaMap
  },
  mounted() {
    this.$axios.$get('/admin/areas').then(response => {
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
