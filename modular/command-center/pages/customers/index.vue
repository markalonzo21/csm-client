<template>
  <section class="w-full flex flex-col">
    <a-button
      @click.prevent="filterIsVisible = true"
      class="pin-r fixed z-10 rounded-none"
      type="primary"
    >
      <a-icon type="filter"/>
    </a-button>

    <div class="clearfix">
      <h3 class="float-left">Customers</h3>
      <!-- <a-button
        @click.prevent="$router.push('/command-center/customers/create')"
        class="float-right my-6"
        type="primary"
      >Create Customer</a-button>-->
    </div>
    <hr>
    <a-table
      :columns="columns"
      :dataSource="customers"
      :loading="loadingCustomers || loadingFilter"
      :pagination="pagination"
      :rowKey="customer => customer._id"
      :scroll="{ x: 900 }"
      @change="handleTableChange"
      bordered
    >
      <template
        slot="createdAt"
        slot-scope="createdAt"
      >{{ createdAt ? $moment(createdAt).format('MMM. DD, YYYY | h:mm A ') : '' }}</template>
      <template
        slot="emailVerified"
        slot-scope="emailVerified"
      >{{ emailVerified ? 'Yes' : 'No' }}</template>
      <template
        slot="mobileVerified"
        slot-scope="mobileVerified"
      >{{ mobileVerified ? 'Yes' : 'No' }}</template>
      <template
        slot="confirmed"
        slot-scope="confirmed"
      >{{ confirmed ? 'Yes' : 'No' }}</template>

      <template
        slot="actions"
        slot-scope="customer"
      >
        <a-button type="primary">
          <nuxt-link :to="`/command-center/customers/${customer._id}/edit`">Edit</nuxt-link>
        </a-button>
      </template>
    </a-table>
    <hr>
    <a-drawer
      :closable="true"
      :visible="filterIsVisible"
      @close="filterIsVisible = false"
      placement="right"
      title="Filter"
      width="350"
      wrapClassName="drawer-filter"
    >
      <a-form
        @submit.prevent="getCustomers"
        class="mt-4"
      >
        <a-form-item
          :labelCol="{ span: 24 }"
          :wrapperCol="{ span: 24 }"
          class="text-white"
          label="First Name"
        >
          <a-input
            placeholder="Enter customer's first name"
            v-model="form.firstName"
          />
        </a-form-item>
        <a-form-item
          :labelCol="{ span: 24 }"
          :wrapperCol="{ span: 24 }"
          class="text-white"
          label="Middle Name"
        >
          <a-input
            placeholder="Enter customer's middle name"
            v-model="form.middleName"
          />
        </a-form-item>

        <a-form-item
          :labelCol="{ span: 24 }"
          :wrapperCol="{ span: 24 }"
          class="text-white"
          label="Middle Name"
        >
          <a-input
            placeholder="Enter customer's last name"
            v-model="form.lastName"
          />
        </a-form-item>
        <a-form-item
          :labelCol="{ span: 24 }"
          :wrapperCol="{ span: 24 }"
          class="text-white"
          label="Email"
        >
          <a-input
            placeholder="Enter customer's email"
            v-model="form.email"
          />
        </a-form-item>
        <a-form-item
          :labelCol="{ span: 24 }"
          :wrapperCol="{ span: 24 }"
          class="text-white"
          label="Mobile Number"
        >
          <a-input
            placeholder="Enter customer's mobile number"
            v-model="form.mobile"
          />
        </a-form-item>
        <a-form-item
          :labelCol="{ span: 24 }"
          :wrapperCol="{ span: 24 }"
          class="text-white"
          label="Confirmed"
        >
          <a-select
            placeholder="Select Confirmation Status"
            v-model="form.confirmed"
          >
            <a-select-option value>Any</a-select-option>
            <a-select-option :value="true">Yes</a-select-option>
            <a-select-option :value="false">No</a-select-option>
          </a-select>
        </a-form-item>

        <a-form-item>
          <a-button
            :loading="loadingCustomers"
            class="float-right w-full"
            htmlType="submit"
            type="primary"
          >Filter</a-button>
        </a-form-item>
      </a-form>
    </a-drawer>
  </section>
</template>

<script>
export default {
  layout: "command-center/default",
  asyncData({ $axios, store, error }) {
    if (!store.getters["auth/hasPermission"]("view customers")) {
      return redirect("/");
    }

    return {
      columns: [
        {
          title: "First Name",
          dataIndex: "firstName"
        },
        {
          title: "Middle Name",
          dataIndex: "middleName"
        },
        {
          title: "Last Name",
          dataIndex: "lastName"
        },
        {
          title: "Email",
          dataIndex: "email"
        },
        {
          title: "Email Verified",
          dataIndex: "emailVerified",
          scopedSlots: { customRender: "emailVerified" }
        },
        {
          title: "Mobile Number",
          dataIndex: "mobile"
        },
        {
          title: "Mobile Verified",
          dataIndex: "mobileVerified",
          scopedSlots: { customRender: "mobileVerified" }
        },
        {
          title: "Confirmed",
          dataIndex: "confirmed",
          scopedSlots: { customRender: "confirmed" }
        },
        {
          title: "Date Submitted",
          dataIndex: "createdAt",
          scopedSlots: { customRender: "createdAt" }
        },
        {
          title: "Actions",
          fixed: "right",
          scopedSlots: { customRender: "actions" }
        }
      ],
      form: {
        firstName: "",
        middleName: "",
        lastName: "",
        email: "",
        mobile: "",
        confirmed: "",
        page: 1,
        results: 10
      },

      customers: [],
      pagination: {
        current: 1,
        pageSize: 10,
        total: 0
      },
      loadingFilter: false,
      loadingCustomers: false,
      filterIsVisible: false
    };
  },
  mounted() {
    this.assignFormValuesFromQueryString();
    this.getCustomers();
    this.initSocketListeners();
  },
  beforeDestroy() {
    this.$socket.off("new-customer");
  },
  methods: {
    initSocketListeners() {
      this.$socket.emit("joinCustomersRoom");
      this.$socket.on("new-customer", customer => {
        this.$notification["info"]({
          message: `New customer added to the list.`
        });
        this.customers.unshift(customer);
      });
    },
    // Events on pagination
    handleTableChange(pagination, filters, sorter) {
      this.pagination.current = pagination.current;
      this.form.page = this.pagination.current;
      this.getCustomers();
    },

    getCustomers() {
      this.loadingCustomers = true;
      this.filterIsVisible = false;

      // Creates necessary format for query string
      let queryString = this.createQueryStringFromForm();

      // Update url
      window.history.pushState(
        queryString,
        "Customers",
        `/command-center/customers${queryString}`
      );

      // Get the customers
      this.$axios
        .$get(`/api/v1/admin/customers${queryString}`)
        .then(response => {
          this.pagination.total = response.info.total;
          this.customers = response.data;
          this.loadingCustomers = false;
        })
        .catch(err => {
          console.log(err);
          this.loadingCustomers = false;
        });
    },
    assignFormValuesFromQueryString() {
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
        });
      }
    },
    createQueryStringFromForm() {
      let formReference = Object.assign({}, this.form);
      formReference.start = formReference.start
        ? this.$moment(formReference.start).format("YYYY-MM-DD")
        : "";
      formReference.end = formReference.end
        ? this.$moment(formReference.end).format("YYYY-MM-DD")
        : "";

      return this.$utils.serialize(formReference);
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
