<template>
  <section class="w-full flex flex-col">
    <div class="clearfix">
      <h3 class="float-left">Reports</h3>
      <a-button
        class="float-right invisible my-6"
        type="primary"
      >Hidden</a-button>
    </div>
    <hr>
    <a-table
      :columns="columns"
      :dataSource="reports"
      :loading="loadingReports || loadingFilter"
      :pagination="pagination"
      :rowKey="report => report._id"
      :scroll="{ x: 900 }"
      @change="handleTableChange"
      bordered
    >
      <template
        slot="createdAt"
        slot-scope="createdAt"
      >{{ createdAt ? $moment(createdAt).format('MMM. DD, YYYY | h:mm A ') : '' }}</template>
      <template
        slot="reporter"
        slot-scope="reporter"
      >
        <div
          class="inline-block"
          v-if="reporter"
        >
          <span class="text-black">{{ reporter.email }} &nbsp;</span>
          <a-tooltip>
            <template slot="title">
              <div v-html="hoverInfo(reporter)"></div>
            </template>
            <a-icon
              class="text-blue inline-block"
              type="info-circle"
            />
          </a-tooltip>
        </div>
      </template>
      <template
        slot="resolver"
        slot-scope="resolver"
      >
        <div
          class="inline-block"
          v-if="resolver"
        >
          <span class="text-black">{{ resolver.email }} &nbsp;</span>
          <a-tooltip>
            <template slot="title">
              <div v-html="hoverInfo(resolver)"></div>
            </template>
            <a-icon
              class="text-blue inline-block"
              type="info-circle"
            />
          </a-tooltip>
        </div>
      </template>
      <template
        slot="responder"
        slot-scope="responder"
      >
        <div
          class="inline-block"
          v-if="responder"
        >
          <span class="text-black">{{ responder.email }} &nbsp;</span>
          <a-tooltip>
            <template slot="title">
              <div v-html="hoverInfo(responder)"></div>
            </template>
            <a-icon
              class="text-blue inline-block"
              type="info-circle"
            />
          </a-tooltip>
        </div>
      </template>
      <template
        slot="description"
        slot-scope="description"
      >
        <div
          class="inline-block"
          v-if="description.length > 20"
        >
          <span class="text-black">{{ description.substr(0, 20) }} &nbsp;</span>
          <a-tooltip>
            <template slot="title">{{ description }}</template>
            <a-icon
              class="text-blue inline-block"
              type="info-circle"
            />
          </a-tooltip>
        </div>
        <div v-else>{{ description }}</div>
      </template>
      <template
        slot="actions"
        slot-scope="report"
      >
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
          <a-form-item
            :labelCol="{ span: 4 }"
            :wrapperCol="{ span: 20 }"
            label="Area"
          >
            <a-select
              :value="form.area"
              @change="selectAreaChange"
              placeholder="Select Area"
            >
              <a-select-option value>Any</a-select-option>
              <a-select-option
                :key="`area-${item._id}`"
                :value="item._id"
                v-for="item in selectList.areas"
              >{{ item.name }}</a-select-option>
            </a-select>
          </a-form-item>
          <a-form-item
            :labelCol="{ span: 4 }"
            :wrapperCol="{ span: 20 }"
            label="Category"
          >
            <a-select
              :value="form.category"
              @change="selectCategoryChange"
              placeholder="Select a Category"
            >
              <a-select-option value>Any</a-select-option>
              <a-select-option
                :key="`category-${category._id}`"
                :value="category._id"
                v-for="category in selectList.categories"
              >{{ category.name }}</a-select-option>
            </a-select>
          </a-form-item>
          <a-form-item
            :labelCol="{ span: 4 }"
            :wrapperCol="{ span: 20 }"
            label="Report ID"
          >
            <a-input
              placeholder="Enter Report ID"
              v-model="form.id"
            />
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item
            :labelCol="{ span: 4 }"
            :wrapperCol="{ span: 20 }"
            label="Status"
          >
            <a-select
              :value="form.status"
              @change="selectStatusChange"
              placeholder="Select a Status"
            >
              <a-select-option value>Any</a-select-option>
              <a-select-option
                :key="`status-${status}`"
                :value="status"
                v-for="status in selectList.statuses"
              >{{ status }}</a-select-option>
            </a-select>
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item
            :labelCol="{ span: 4 }"
            :wrapperCol="{ span: 20 }"
            label="Type"
          >
            <a-select
              :value="form.type"
              @change="selectTypeChange"
              placeholder="Select a Type"
            >
              <a-select-option value>Any</a-select-option>
              <a-select-option
                :key="`type-${type._id}`"
                :value="type._id"
                v-for="type in selectList.types"
              >{{ type.name }}</a-select-option>
            </a-select>
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item
            :labelCol="{ span: 4 }"
            :wrapperCol="{ span: 20 }"
            label="Reporter"
          >
            <a-input
              placeholder="Enter reporter email"
              v-model="form.reporter"
            />
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item
            :labelCol="{ span: 4 }"
            :wrapperCol="{ span: 20 }"
            label="Date Started"
          >
            <a-date-picker
              class="w-full"
              format="MM-DD-YYYY"
              v-model="form.start"
            />
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item
            :labelCol="{ span: 4 }"
            :wrapperCol="{ span: 20 }"
            label="Date End"
          >
            <a-date-picker
              class="w-full"
              format="MM-DD-YYYY"
              v-model="form.end"
            />
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item
            :labelCol="{ span: 4 }"
            :wrapperCol="{ span: 20 }"
            label="Responder"
          >
            <a-input
              placeholder="Enter responder email"
              v-model="form.responder"
            />
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item
            :labelCol="{ span: 4 }"
            :wrapperCol="{ span: 20 }"
            label="Resolver"
          >
            <a-input
              placeholder="Enter resolver email"
              v-model="form.resolver"
            />
          </a-form-item>
        </a-col>
        <a-col
          :offset="1"
          :span="22"
        >
          <a-form-item>
            <a-button
              :loading="loadingReports"
              class="float-right w-full"
              htmlType="submit"
              type="primary"
            >Filter</a-button>
          </a-form-item>
        </a-col>
      </a-row>
    </a-form>
  </section>
</template>

<script>
export default {
  layout: "command-center/default",
  asyncData({ $axios, error }) {
    const getCategories = $axios.$get("/report-categories");
    const getAreas = $axios.$get("/areas");

    return Promise.all([getCategories, getAreas]).then(
      ([categories, areas]) => {
        return {
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
              title: "Department",
              dataIndex: "area.department"
            },
            {
              title: "Area",
              dataIndex: "area.name"
            },
            {
              title: "Reporter",
              dataIndex: "reporter",
              scopedSlots: { customRender: "reporter" }
            },
            {
              title: "Resolver",
              dataIndex: "resolver",
              scopedSlots: { customRender: "resolver" }
            },
            {
              title: "Responder",
              dataIndex: "responder",
              scopedSlots: { customRender: "responder" }
            },
            {
              title: "Remarks",
              dataIndex: "description",
              scopedSlots: { customRender: "description" }
            },
            {
              title: "Actions",
              // dataIndex: "actions",
              scopedSlots: { customRender: "actions" }
            }
          ],
          form: {
            id: "",
            category: "",
            type: "",
            reporter: "",
            responder: "",
            resolver: "",
            status: "",
            type: "",
            start: null,
            end: null,
            area: "",
            page: 1,
            results: 10
          },
          selectList: {
            areas: areas.data,
            categories: categories.data,
            types: [],
            statuses: ["pending", "in-progress", "resolved", "cancelled"]
          }
        };
      }
    );
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
    };
  },
  mounted() {
    this.getReports();
    this.initSocketListeners();
  },
  beforeDestroy() {
    this.$socket.off("new-report");
  },
  methods: {
    initSocketListeners() {
      this.$socket.on("new-report", report => {
        this.reports.unshift(report);
      });
    },
    handleTableChange(pagination, filters, sorter) {
      const pager = { ...this.pagination };
      pager.current = pagination.current;
      this.pagination = pager;
      this.filterReports();
    },
    getReports() {
      this.loadingReports = true;

      // Loop through query string and assign it to form
      if (this.$route.query) {
        Object.keys(this.$route.query).forEach(key => {
          let value = this.$route.query[key];

          if (value === "null") {
            value = null;
          }

          if (key === "start" || key === "end") {
            this.form[key] = value ? this.$moment(value) : null;
          } else {
            this.form[key] = value;
          }

          if (key === "page") {
            this.pagination.current = parseInt(value);
          }

          if (key === "category") {
            this.selectCategoryChange(value);
          }
        });
      }

      let formReference = Object.assign({}, this.form);
      formReference.start = formReference.start
        ? this.$moment(formReference.start).format("YYYY-MM-DD")
        : null;
      formReference.end = formReference.end
        ? this.$moment(formReference.end).format("YYYY-MM-DD")
        : null;

      let queryString = this.$utils.serialize(formReference);

      window.history.pushState(
        formReference,
        "Reports",
        `/command-center/reports${queryString}`
      );

      this.$axios
        .$get("/admin/reports", { params: formReference })
        .then(response => {
          this.pagination.total = response.info.total;
          this.reports = response.data;
          this.loadingReports = false;
        })
        .catch(err => {
          console.log(err.response.data);
          this.loadingReports = false;
        });
    },
    filterReports() {
      this.loadingFilter = true;

      this.form.page = this.pagination.current;
      this.form.results = 10;

      let formReference = Object.assign({}, this.form);
      formReference.start = formReference.start
        ? this.$moment(formReference.start).format("YYYY-MM-DD")
        : null;
      formReference.end = formReference.end
        ? this.$moment(formReference.end).format("YYYY-MM-DD")
        : null;

      let queryString = this.$utils.serialize(formReference);
      window.history.pushState(
        formReference,
        "Reports",
        `/command-center/reports${queryString}`
      );
      this.$axios
        .$get("/admin/reports", { params: formReference })
        .then(response => {
          this.pagination.total = response.info.total;
          this.reports = response.data;
          this.loadingFilter = false;
        })
        .catch(err => {
          this.loadingFilter = false;
        });
    },
    selectAreaChange(value) {
      this.form.area = value;
    },
    selectCategoryChange(value) {
      const categories = this.selectList.categories.find(
        category => category._id === value
      );
      if (value) {
        this.selectList.types = categories.types;
      }
      this.form.category = value;
      this.form.type = "";
    },
    selectTypeChange(value) {
      this.form.type = value;
    },
    selectStatusChange(value) {
      this.form.status = value;
    },
    hoverInfo(user) {
      return `<table class="table">
          <tbody>
            <tr>
              <td>
                <span class="bluelabel">Name</span>
              </td>
              <td>
                <span
                  class="basic"
                >${user.firstName} ${user.middleName} ${user.lastName} </span>
              </td>
            </tr>
            <tr>
              <td>
                <span class="bluelabel">Email</span>
              </td>
              <td>
                <span class="basic">${user.email}</span>
              </td>
            </tr>
            <tr>
              <td>
                <span class="bluelabel">Mobile Number</span>
              </td>
              <td>
                <span class="basic">${user.mobile}</span>
              </td>
            </tr>
            <tr>
              <td>
                <span class="bluelabel">Gender</span>
              </td>
              <td>
                <span class="basic">${user.gender}</span>
              </td>
            </tr>
            <tr>
              <td>
                <span class="bluelabel">Tenant</span>
              </td>
              <td>
                <span class="basic">${user.tenant ? "Yes" : "No"}</span>
              </td>
            </tr>
          </tbody>
        </table>`;
    }
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
