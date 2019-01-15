<template>
  <section class="w-full flex flex-col">
    <div class="clearfix">
      <h3 class="float-left">Reports</h3>
      <a-button type="primary" class="float-right invisible my-6">Hidden</a-button>
    </div>
    <hr>
    <a-table
      :loading="loadingReports || loadingFilter"
      bordered
      :scroll="{ x: 900 }"
      :pagination="pagination"
      :dataSource="reports"
      :columns="columns"
      @change="handleTableChange"
    >
      <template
        slot="createdAt"
        slot-scope="text, report"
      >{{ report.createdAt ? $moment(report.createdAt).format('MMM. DD, YYYY | h:mm A ') : '' }}</template>
      <template slot="actions" slot-scope="text, report">
        <a-button type="primary">
          <nuxt-link :to="`/command-center/reports/${report._id}`">Show</nuxt-link>
        </a-button>
      </template>
    </a-table>
    <hr>
    <a-form @submit.prevent="filterReports">
      <h4>Filter</h4>
      <a-row :gutter="24">
        <a-col :span="12">
          <a-form-item label="Area" :labelCol="{ span: 4 }" :wrapperCol="{ span: 20 }">
            <a-select :value="form.area" @change="selectAreaChange" placeholder="Select Area">
              <a-select-option value>Any</a-select-option>
              <a-select-option
                v-for="item in selectList.areas"
                :value="item._id"
                :key="`area-${item._id}`"
              >{{ item.name }}</a-select-option>
            </a-select>
          </a-form-item>
          <a-form-item label="Category" :labelCol="{ span: 4 }" :wrapperCol="{ span: 20 }">
            <a-select
              :value="form.category"
              @change="selectCategoryChange"
              placeholder="Select a Category"
            >
              <a-select-option value>Any</a-select-option>
              <a-select-option
                v-for="category in selectList.categories"
                :value="category._id"
                :key="`category-${category._id}`"
              >{{ category.name }}</a-select-option>
            </a-select>
          </a-form-item>
          <a-form-item label="Report ID" :labelCol="{ span: 4 }" :wrapperCol="{ span: 20 }">
            <a-input placeholder="Enter Report ID" v-model="form.id"/>
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label="Status" :labelCol="{ span: 4 }" :wrapperCol="{ span: 20 }">
            <a-select
              :value="form.status"
              @change="selectStatusChange"
              placeholder="Select a Status"
            >
              <a-select-option value>Any</a-select-option>
              <a-select-option
                v-for="status in selectList.statuses"
                :value="status"
                :key="`status-${status}`"
              >{{ status }}</a-select-option>
            </a-select>
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label="Type" :labelCol="{ span: 4 }" :wrapperCol="{ span: 20 }">
            <a-select :value="form.type" @change="selectTypeChange" placeholder="Select a Type">
              <a-select-option value>Any</a-select-option>
              <a-select-option
                v-for="type in selectList.types"
                :value="type._id"
                :key="`type-${type._id}`"
              >{{ type.name }}</a-select-option>
            </a-select>
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label="Reporter" :labelCol="{ span: 4 }" :wrapperCol="{ span: 20 }">
            <a-input placeholder="Enter reporter email" v-model="form.reporter"/>
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label="Date Started" :labelCol="{ span: 4 }" :wrapperCol="{ span: 20 }">
            <a-date-picker format="MM-DD-YYYY" class="w-full" v-model="form.startDate"/>
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label="Date End" :labelCol="{ span: 4 }" :wrapperCol="{ span: 20 }">
            <a-date-picker format="MM-DD-YYYY" class="w-full" v-model="form.endDate"/>
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label="Responder" :labelCol="{ span: 4 }" :wrapperCol="{ span: 20 }">
            <a-input placeholder="Enter responder email" v-model="form.responder"/>
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label="Resolver" :labelCol="{ span: 4 }" :wrapperCol="{ span: 20 }">
            <a-input placeholder="Enter resolver email" v-model="form.resolver"/>
          </a-form-item>
        </a-col>
        <a-col :span="22" :offset="1">
          <a-form-item>
            <a-button
              class="float-right w-full"
              type="primary"
              htmlType="submit"
              :loading="loadingReports"
            >Filter</a-button>
          </a-form-item>
        </a-col>
      </a-row>
    </a-form>
  </section>
</template>

<script>
export default {
  layout: 'command-center/default',
  asyncData({ $axios, error }) {
    const getCategories = $axios.$get('/report-categories')
    const getAreas = $axios.$get('/areas')

    return Promise.all([getCategories, getAreas]).then(
      ([categories, areas]) => {
        return {
          columns: [
            {
              title: 'Report ID',
              dataIndex: '_id'
            },
            {
              title: 'Category',
              dataIndex: 'type.category.name'
            },
            {
              title: 'Type',
              dataIndex: 'type.name'
            },
            {
              title: 'Status',
              dataIndex: 'status'
            },
            {
              title: 'Date Reported',
              dataIndex: 'createdAt',
              scopedSlots: { customRender: 'createdAt' }
            },
            {
              title: 'Area',
              dataIndex: 'area.name'
            },
            {
              title: 'Reporter',
              dataIndex: 'reporter.email'
            },
            {
              title: 'Resolver',
              dataIndex: 'resolver.email'
            },
            {
              title: 'Responder',
              dataIndex: 'responder.email'
            },
            {
              title: 'Remarks',
              dataIndex: 'remarks'
            },
            {
              title: 'Actions',
              dataIndex: 'actions',
              scopedSlots: { customRender: 'actions' }
            }
          ],
          form: {
            id: '',
            category: '',
            type: '',
            reporter: '',
            responder: '',
            resolver: '',
            status: '',
            type: '',
            startDate: null,
            endDate: null,
            area: '',
            page: 1,
            results: 10
          },
          selectList: {
            areas: areas.data,
            categories: categories.data,
            types: [],
            statuses: ['pending', 'in-progress', 'resolved', 'cancelled']
          }
        }
      }
    )
  },
  data() {
    return {
      reports: [],
      pagination: {
        current: 1,
        defaultCurrent: 1,
        pageSize: 10,
        total: 0
      },
      loadingFilter: false,
      loadingReports: false
    }
  },
  mounted() {
    this.getReports()
    this.initSocketListeners()
  },
  beforeDestroy() {
    this.$socket.off('new-report')
  },
  methods: {
    initSocketListeners() {
      this.$socket.on('new-report', report => {
        this.reports.unshift(report)
      })
    },
    handleTableChange(pagination, filters, sorter) {
      const pager = { ...this.pagination }
      pager.current = pagination.current
      this.pagination = pager
      this.filterReports()
    },
    getReports() {
      this.loadingReports = true

      // Loop through query string and assign it to form
      if (this.$route.query) {
        Object.keys(this.$route.query).forEach(key => {
          let value = this.$route.query[key]
          if (value === 'null') {
            value = null
          }

          this.form[key] = value

          if (key === 'page') {
            this.pagination.current = parseInt(value)
          }

          if (key === 'category') {
            this.selectCategoryChange(value)
          }
        })
      }

      this.$axios
        .$get('/admin/reports', { params: this.form })
        .then(response => {
          window.history.pushState(
            this.form,
            'Reports',
            `/command-center/reports${this.$utils.serialize(this.form)}`
          )
          this.pagination.total = response.info.total
          this.reports = response.data
          this.loadingReports = false
        })
        .catch(err => {
          console.log(err.response.data)
          this.loadingReports = false
        })
    },
    filterReports() {
      this.loadingFilter = true

      this.form.start = this.form.startDate
        ? this.$moment(this.form.startDate).format('YYYY-MM-DD')
        : null
      this.form.end = this.form.endDate
        ? this.$moment(this.form.endDate).format('YYYY-MM-DD')
        : null

      this.form.page = this.pagination.current
      this.form.results = 10

      this.$axios
        .$get('/admin/reports', { params: this.form })
        .then(response => {
          window.history.pushState(
            this.form,
            'Reports',
            `/command-center/reports${this.$utils.serialize(this.form)}`
          )

          this.pagination.total = response.info.total
          this.reports = response.data
          this.loadingFilter = false
        })
        .catch(err => {
          this.loadingFilter = false
        })
    },
    selectAreaChange(value) {
      this.form.area = value
    },
    selectCategoryChange(value) {
      const categories = this.selectList.categories.find(
        category => category._id === value
      )
      if (value) {
        this.selectList.types = categories.types
      }
      this.form.category = value
      this.form.type = ''
    },
    selectTypeChange(value) {
      this.form.type = value
    },
    selectStatusChange(value) {
      this.form.status = value
    }
  }
}
</script>

<style scoped>
table {
  position: relative;
  border-collapse: separate;
  border-spacing: 15px 15px;
}

.rowlink::before {
  content: '';
  display: block;
  position: absolute;
  left: 0;
  width: 100%;
  height: 1.5em; /* don't forget to set the height! */
}
</style>
