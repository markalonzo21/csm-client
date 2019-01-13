<template>
  <section class="w-full select-none" style="width: 100%">
    <modal v-model="isCreateResolversModalVisible" title="Create Resolvers" :footer="false">
      <form @submit.prevent="createResolvers" class="clearfix">
        <div class="form-group">
          <input
            type="text"
            class="form-control"
            placeholder="first name"
            v-model="form.firstName"
            required
          >
        </div>
        <div class="form-group">
          <input
            type="text"
            class="form-control"
            placeholder="middle name"
            v-model="form.middleName"
          >
        </div>
        <div class="form-group">
          <input
            type="text"
            class="form-control"
            placeholder="last name"
            v-model="form.lastName"
            required
          >
        </div>
        <div class="form-group">
          <input
            type="email"
            class="form-control"
            placeholder="email"
            v-model="form.email"
            required
          >
        </div>
        <div class="form-group">
          <div class="input-group">
            <span class="input-group-addon">+63</span>
            <input
              type="text"
              class="form-control"
              pattern="\d*"
              maxlength="10"
              placeholder="mobile"
              v-model="form.mobile"
              required
            >
          </div>
        </div>
        <div class="form-group">
          <input
            type="password"
            class="form-control"
            placeholder="password"
            v-model="form.password"
            required
          >
        </div>
        <div class="form-group">
          <input
            type="password"
            class="form-control"
            placeholder="password confirmation"
            v-model="form.password_confirmation"
            required
          >
        </div>
        <button
          class="btn btn-primary float-right"
          :disabled="loadingCreateUser"
        >{{ loadingCreateUser ? 'Loading' : 'Save' }}</button>
      </form>
    </modal>
    <div class="clearfix">
      <h3 class="float-left">Resolvers</h3>
      <a-button type="primary"
        class="float-right my-6"
        @click.prevent="isCreateResolversModalVisible = true"
      >Create Resolvers</a-button>
    </div>
    <hr>
    <a-table bordered :scroll="{ x: 900 }" :dataSource="resolvers" :columns="columns">
      <template slot="createdAt" slot-scope="text, resolver">
        {{  resolver.createdAt ? $moment(resolver.createdAt).format('MMM. DD, YYYY | h:mm A ') : '' }}
      </template>
      <template slot="actions" slot-scope="text, resolver">
        <a-button type="primary" disabled>Edit</a-button>
        <a-button type="danger" disabled>Delete</a-button>
      </template>
    </a-table>
    <!-- <table class="table-bordered :scroll="{ x: 900 }" w-full">
      <thead>
        <tr>
          <td>First Name</td>
          <td>Middle Name</td>
          <td>Last Name</td>
          <td>Email</td>
          <td>Mobile</td>
          <td>Created At</td>
          <td>Actions</td>
        </tr>
      </thead>
      <tbody>
        <tr v-for="resolver in resolvers">
          <td>{{ resolver.firstName }}</td>
          <td>{{ resolver.middleName }}</td>
          <td>{{ resolver.lastName }}</td>
          <td>{{ resolver.email }}</td>
          <td>{{ resolver.mobile }}</td>
          <td>{{ resolver.createdAt }}</td>
          <td>
            <button class="m-2 btn btn-info" disabled>Edit</button>
            <button class="m-2 btn btn-danger" disabled>Delete</button>
          </td>
        </tr>
      </tbody>
    </table>-->
  </section>
</template>


<script>
export default {
  layout: 'command-center/default',
  data() {
    return {
      isCreateResolversModalVisible: false,
      loadingGetResolvers: false,
      resolvers: [],
      reportCategories: [],
      loadingCreateUser: false,
      columns: [
        {
          title: 'First Name',
          dataIndex: 'firstName'
        },
        // {
        //   title: 'Middle Name',
        //   dataIndex: 'middleName'
        // },
        {
          title: 'Last Name',
          dataIndex: 'lastName'
        },
        {
          title: 'Email',
          dataIndex: 'email'
        },
        {
          title: 'Mobile',
          dataIndex: 'mobile'
        },
        {
          title: 'Created At',
          dataIndex: 'createdAt',
          scopedSlots: { customRender: 'createdAt' }
        },
        {
          title: 'Actions',
          dataIndex: 'actions',
          scopedSlots: { customRender: 'actions' }
        }
      ],
      form: {
        firstName: '',
        middleName: '',
        lastName: '',
        email: '',
        mobile: '',
        types: []
      }
    }
  },
  mounted() {
    this.getReportTypes()
    this.getResolvers()
    this.generateFakeData()
  },
  methods: {
    generateFakeData() {
      this.form.firstName = this.$chance.first()
      this.form.lastName = this.$chance.last()
      this.form.email = this.$chance.email()
      this.form.mobile = `92${new Date()
        .getTime()
        .toString()
        .substr(5)}`
      this.form.password = '123123123'
      this.form.password_confirmation = '123123123'
      this.form.types = []
    },
    getReportTypes() {
      this.$axios.$get('/report-categories').then(response => {
        this.reportCategories = response.data
      })
    },
    getResolvers() {
      this.loadingGetResolvers = true
      this.$axios.$get('/admin/resolvers').then(response => {
        this.resolvers = response.data
        this.loadingGetResolvers = false
      })
    },
    createResolvers() {
      this.loadingCreateUser = true
      this.form.mobile = `0${this.form.mobile}`
      this.$axios.$post('/admin/resolvers', this.form).then(response => {
        this.generateFakeData()
        this.resolvers.push(response.data)
        this.loadingCreateUser = false
        this.isCreateResolversModalVisible = false
      })
    }
  }
}
</script>

<style scoped>
td {
  padding-right: 20px;
  padding-left: 20px;
  padding-top: 5px;
  padding-bottom: 5px;
}
</style>
