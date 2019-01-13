<template>
  <section class="w-full">
    <div class="clearfix">
      <h3 class="float-left">Advertisements</h3>
      <nuxt-link to="/command-center/advertisements/create">
        <a-button
          type="primary"
          class="float-right my-6"
          v-if="$store.getters['auth/hasPermission']('create advertisement')"
        >Create Advertisement</a-button>
      </nuxt-link>
    </div>
    <hr>
    <a-table
      :loading="loadingGetAdvertisements"
      bordered :scroll="{ x: 900 }"
      :dataSource="dataSource"
      :columns="columns"
    >
      <template slot="link" slot-scope="text, record">
        <a
          :href="record.link"
          target="_blank"
          v-text="record.link"
          v-if="record.link !== 'undefined'"
        ></a>
      </template>
      <template slot="image" slot-scope="text, record">
        <img class="max-h-sm max-w-sm" :src="record.image">
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
          title="Are you sure delete this role?"
          @confirm="removeAdvertisement(record, index)"
          okText="Yes"
          cancelText="No"
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
  layout: 'command-center/default',
  asyncData({ store, redirect }) {
    if (!store.getters['auth/hasPermission']('view advertisements')) {
      return redirect('/')
    }
  },
  data() {
    return {
      loadingGetAdvertisements: true,
      columns: [
        {
          title: 'Name',
          dataIndex: 'name',
          scopedSlots: { customRender: 'name' }
        },
        {
          title: 'Link',
          dataIndex: 'link',
          scopedSlots: { customRender: 'link' }
        },
        {
          title: 'Image',
          dataIndex: 'image',
          scopedSlots: { customRender: 'image' }
        },
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
    this.loadingGetAdvertisements = true
    this.$axios.$get('/admin/advertisements').then(response => {
      this.dataSource = response.data
      this.loadingGetAdvertisements = false
    })
  },
  methods: {
    removeAdvertisement(advertisement, index) {
      this.$axios
        .$delete(`/admin/advertisements/${advertisement._id}`)
        .then(response => {
          this.dataSource.splice(index, 1)
        })
        .catch(error => {
          console.log(error.response.data)
          alert('Something went wrong. please check your internet connection.')
        })
    }
  }
}
</script>
