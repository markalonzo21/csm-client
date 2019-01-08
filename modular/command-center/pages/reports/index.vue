<template>
  <section class="w-full">
    <div class="clearfix">
      <h3 class="float-left">Reports</h3>
      <a-button type="primary" class="float-right invisible my-6">Hidden</a-button>
    </div>
    <hr>
    <a-table :loading="loadingGetReports || loadingFilter" bordered :pagination="false" :dataSource="reports" :columns="columns">
      <template
        slot="createdAt"
        slot-scope="text, report"
      >{{ report.createdAt ? $moment(report.createdAt).format('MMM. DD, YYYY | h:mm A ') : '' }}</template>
      <template slot="operation" slot-scope="text, report">
        <a-button type="primary">
          <router-link :to="`/command-center/reports/${report._id}`">Show</router-link>
        </a-button>
      </template>
    </a-table>
    <hr>
    <a-form @submit.prevent="filterReports">
      <h4>Filter</h4>
       <a-row :gutter="24">
         <a-col :span="12">
          <a-form-item
           label='Report ID'
           :labelCol="{ span: 4 }"
           :wrapperCol="{ span: 20 }"
          >
              <a-input placeholder="Enter Report ID" v-model="form.id"/>
          </a-form-item>
           <a-form-item
            label='Category'
            :labelCol="{ span: 4 }"
            :wrapperCol="{ span: 20 }"
           >
               <a-select :value="form.category" @change="selectCategoryChange" placeholder="Select a Category">
                 <a-select-option value="">Any</a-select-option>
                 <a-select-option v-for="category in selectList.categories" :value="category._id" :key="category._id">{{ category.name }}</a-select-option>
               </a-select>
           </a-form-item>
         </a-col>
         <a-col :span="12">
           <a-form-item
            label='Status'
            :labelCol="{ span: 4 }"
            :wrapperCol="{ span: 20 }"
           >
             <a-select :value="form.status" @change="selectStatusChange" placeholder="Select a Status">
               <a-select-option value="">Any</a-select-option>
               <a-select-option v-for="status in selectList.statuses" :value="status" :key="status">{{ status }}</a-select-option>
             </a-select>
           </a-form-item>
         </a-col>
         <a-col :span="12">
           <a-form-item
            label='Type'
            :labelCol="{ span: 4 }"
            :wrapperCol="{ span: 20 }"
           >
           <a-select :value="form.type" @change="selectTypeChange" placeholder="Select a Type">
             <a-select-option value="">Any</a-select-option>
             <a-select-option v-for="type in selectList.types" :value="type._id" :key="type._id">{{ type.name }}</a-select-option>
           </a-select>
           </a-form-item>
         </a-col>
        <a-col :span="12">
          <a-form-item
           label='Date Started'
           :labelCol="{ span: 4 }"
           :wrapperCol="{ span: 20 }"
          >
            <a-date-picker format="MM-DD-YYYY" class="w-full" v-model="form.startDate" />
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item
           label='Date End'
           :labelCol="{ span: 4 }"
           :wrapperCol="{ span: 20 }"
          >
            <a-date-picker format="MM-DD-YYYY" class="w-full" v-model="form.endDate" />
          </a-form-item>
        </a-col>
         <a-col :span="12">
           <a-form-item
            label='Reporter'
            :labelCol="{ span: 4 }"
            :wrapperCol="{ span: 20 }"
           >
               <a-input placeholder="Enter reporter email" v-model="form.reporter"/>
           </a-form-item>
         </a-col>
         <a-col :span="12">
           <a-form-item
            label='Responder'
            :labelCol="{ span: 4 }"
            :wrapperCol="{ span: 20 }"
           >
               <a-input placeholder="Enter responder email" v-model="form.responder"/>
           </a-form-item>
         </a-col>
         <a-col :span="12">
           <a-form-item
            label='Resolver'
            :labelCol="{ span: 4 }"
            :wrapperCol="{ span: 20 }"
           >
               <a-input placeholder="Enter resolver email" v-model="form.resolver"/>
           </a-form-item>
         </a-col>
         <a-col :span="11" :offset="1">
           <a-form-item
           >
             <a-button class="float-right w-full" type='primary' htmlType='submit' :loading="loadingFilter">
               Filter
             </a-button>
           </a-form-item>
         </a-col>
       </a-row>
     </a-form>
    </div>
  </section>
</template>

<script>
import moment from 'moment'
export default {
  layout: 'command-center/default',
  asyncData({ $axios, error }) {
    const getCategories = $axios.$get("/report-categories")
    const getReports = $axios.$get("/admin/reports")

    return Promise.all([getCategories, getReports]).then(([categories, reports]) => {
      return {
        reports: reports.data,
        isLoadMoreVisible: !(reports.data.length < 10),
        loadingGetReports: false,
        loadingFilter: false,
        selectList: {
          categories: categories.data,
          types: [],
          statuses: ['pending', 'in-progress', 'resolved', 'cancelled'],
        },
        columns: [
          {
            title: "Report ID",
            dataIndex: "_id"
          },
          {
            title: "Category",
            dataIndex: "type.category.name"
          },
          {
            title: "Type",
            dataIndex: "type.name"
          },
          {
            title: "Status",
            dataIndex: "status"
          },
          {
            title: "Date Reported",
            dataIndex: "createdAt",
            scopedSlots: { customRender: "createdAt" }
          },
          {
            title: "Reporter",
            dataIndex: "reporter.email"
          },
          {
            title: "Resolver",
            dataIndex: "resolver.email"
          },
          {
            title: "Responder",
            dataIndex: "responder.email"
          },
          {
            title: "Remarks",
            dataIndex: "remarks"
          },
          {
            title: "Operation",
            dataIndex: "operation",
            scopedSlots: { customRender: "operation" }
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
          endDate: null
        }
      };
    })
  },
  mounted() {
    this.initSocketListeners();
  },
  beforeDestroy() {
    this.$socket.off("new-report")
  },
  methods: {
    initSocketListeners() {
      this.$socket.on("new-report", report => {
        this.reports.unshift(report);
      });
    },
    filterReports() {
      this.loadingFilter = true

      this.form.start = this.form.startDate ? this.$moment(this.form.startDate).format('YYYY-MM-DD') : null
      this.form.end = this.form.endDate ? this.$moment(this.form.endDate).format('YYYY-MM-DD') : null
      this.$axios.$get('/admin/reports', { params: this.form }).then(response => {
        this.reports = response.data
        this.loadingFilter = false
      }).catch(err => {
        this.loadingFilter = false
      })
    },
    loadMoreReports() {
      this.loadingGetReports = true;
      this.$axios
        .$get(`/admin/reports?skip=${this.reports.length}`)
        .then(response => {
          response.data.forEach(report => {
            this.reports.push(report);
          });
          this.isLoadMoreVisible = !(response.data.length < 10);
          this.loadingGetReports = false;
        });
    },
    selectCategoryChange(value) {
      const categories = this.selectList.categories.find(category => category._id === value)
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
    },
  }
};
</script>

<style scoped>
table {
  position: relative;
  border-collapse: separate;
  border-spacing: 15px 15px;
}

.rowlink::before {
  content: "";
  display: block;
  position: absolute;
  left: 0;
  width: 100%;
  height: 1.5em; /* don't forget to set the height! */
}
</style>
