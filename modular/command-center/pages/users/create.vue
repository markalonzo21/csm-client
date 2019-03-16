<template>
  <a-form
    @submit.prevent="createUser"
    class="container clearfix"
  >
    <h3 class="mt-0 mb-12 text-center">Create User</h3>

    <a-form-item
      :labelCol="{span: 4}"
      :validateStatus="form.errors.has('firstName') ? 'error' : null"
      :wrapperCol="{span: 18}"
      label="* First Name"
    >
      <a-input v-model="form.firstName"/>
      <div class="ant-form-explain">{{ form.errors.first('firstName') }}</div>
    </a-form-item>

    <a-form-item
      :labelCol="{span: 4}"
      :validateStatus="form.errors.has('middleName') ? 'error' : null"
      :wrapperCol="{span: 18}"
      label="Middle Name"
    >
      <a-input v-model="form.middleName"/>
      <div class="ant-form-explain">{{ form.errors.first('middleName') }}</div>
    </a-form-item>

    <a-form-item
      :labelCol="{span: 4}"
      :validateStatus="form.errors.has('lastName') ? 'error' : null"
      :wrapperCol="{span: 18}"
      label="* Last Name"
    >
      <a-input v-model="form.lastName"/>
      <div class="ant-form-explain">{{ form.errors.first('lastName') }}</div>
    </a-form-item>
    <a-form-item
      :labelCol="{span: 4}"
      :validateStatus="form.errors.has('email') ? 'error' : null"
      :wrapperCol="{span: 18}"
      label="* E-mail"
    >
      <a-input v-model="form.email"/>
      <div class="ant-form-explain">{{ form.errors.first('email') }}</div>
    </a-form-item>

    <a-form-item
      :labelCol="{span: 4}"
      :validateStatus="form.errors.has('mobile') ? 'error' : null"
      :wrapperCol="{span: 18}"
      label="* Mobile Number"
    >
      <a-input
        addonBefore="+63"
        maxlength="10"
        pattern="\d*"
        v-model="form.mobile"
      />
      <div class="ant-form-explain">{{ form.errors.first('mobile') }}</div>
    </a-form-item>

    <a-form-item
      :labelCol="{span: 4}"
      :validateStatus="form.errors.has('password') ? 'error' : null"
      :wrapperCol="{span: 18}"
      label="* Password"
    >
      <a-input
        type="password"
        v-model="form.password"
      />
      <div class="ant-form-explain">{{ form.errors.first('password') }}</div>
    </a-form-item>

    <a-form-item
      :labelCol="{span: 4}"
      :validateStatus="form.errors.has('password_confirmation') ? 'error' : null"
      :wrapperCol="{span: 18}"
      label="* Password Confirmation"
    >
      <a-input
        type="password"
        v-model="form.password_confirmation"
      />
      <div class="ant-form-explain">{{ form.errors.first('password_confirmation') }}</div>
    </a-form-item>

    <a-form-item
      :labelCol="{span: 4}"
      :wrapperCol="{span: 18}"
      label="* Gender"
    >
      <a-select v-model="form.gender">
        <a-select-option value="male">Male</a-select-option>
        <a-select-option value="female">Female</a-select-option>
      </a-select>
    </a-form-item>

    <a-form-item
      :labelCol="{span: 4}"
      :wrapperCol="{span: 18}"
      label="* Role"
    >
      <a-select
        @change="handleFormRoleChange"
        defaultValue="user"
      >
        <a-select-option
          :key="role._id"
          :value="role.slug"
          v-for="role in roles"
        >{{role.name}}</a-select-option>
      </a-select>
    </a-form-item>

    <a-form-item
      :labelCol="{span: 4}"
      :wrapperCol="{span: 18}"
      label="* Areas"
      v-if="roleRequiresArea"
    >
      <FormItemArea
        :areas="areas"
        @mergeAreas="(areas) => form.areas = areas"
      />
    </a-form-item>

    <a-form-item
      :labelCol="{span: 4}"
      :wrapperCol="{span: 18}"
      label="* Category"
      v-if="roleRequiresCategory"
    >
      <a-select
        :defaultValue="categories[0]._id"
        @change="handleFormCategory"
      >
        <a-select-option
          :key="category._id"
          :value="category._id"
          v-for="category in categories"
        >{{category.name}}</a-select-option>
      </a-select>
    </a-form-item>

    <a-form-item
      :labelCol="{span: 4}"
      :wrapperCol="{span: 18}"
      label="Response Types"
      v-if="roleRequiresCategory"
    >
      <FormItemResponseTypes
        :canRespondTo="canRespondTo"
        :key="form.category"
        @mergeCanRespondTo="(canRespondTo) => form.canRespondTo = canRespondTo"
        v-if="canRespondTo.length > 0"
      />
      <span v-else>No Response Types Available</span>
    </a-form-item>

    <a-form-item :wrapperCol="{offset: 20}">
      <a-button
        :loading="loadingCreateUser"
        htmlType="submit"
        type="primary"
      >Create</a-button>
    </a-form-item>
  </a-form>
</template>

<script>
import FormItemArea from "./-FormItemArea";
import FormItemResponseTypes from "./-FormItemResponseTypes";
import Form from "@/utils/Form";

export default {
  layout: "command-center/default",
  components: {
    FormItemArea,
    FormItemResponseTypes
  },
  async asyncData({ $axios, store, error, redirect }) {
    if (!store.getters["auth/hasPermission"]("create user")) {
      return redirect("/");
    }

    const getRoles = $axios.get("/api/v1/admin/roles");
    const getAreas = $axios.get("/api/v1/admin/areas");
    const getCategories = $axios.get("/api/v1/report-categories");

    const [roles, areas, categories] = await Promise.all([
      getRoles,
      getAreas,
      getCategories
    ]);

    return {
      roles: roles.data.data,
      areas: areas.data.data,
      categories: categories.data.data
    };
  },
  data() {
    return {
      loadingCreateUser: false,
      form: new Form({
        firstName: "",
        middleName: "",
        lastName: "",
        email: "",
        mobile: "",
        password: "",
        password_confirmation: "",
        gender: "male",
        role: "user",
        category: "",
        canRespondTo: [],
        areas: []
      })
    };
  },
  computed: {
    roleRequiresArea() {
      return this.roles
        .find(role => {
          return role.slug === this.form.role;
        })
        .permissions.some(permission => {
          return ["resolve", "respond"].includes(permission.name);
        });
    },
    roleRequiresCategory() {
      return this.roles
        .find(role => {
          return role.slug === this.form.role;
        })
        .permissions.some(permission => {
          return ["respond"].includes(permission.name);
        });
    },
    canRespondTo() {
      const category = this.categories.find(
        category => category._id === this.form.category
      );

      if (!category) {
        return [];
      }

      return category.types;
    }
  },
  methods: {
    createUser() {
      this.loadingCreateUser = true;
      const form = { ...this.form };
      form.role = this.roles.find(role => role.slug === this.form.role)._id;

      this.$axios
        .$post(`/api/v1/admin/users`, form)
        .then(response => {
          this.form.reset();
          this.form.errors.clear();
          this.loadingCreateUser = false;
          this.$router.push("/command-center/users");
        })
        .catch(error => {
          this.form.errors.record(error.response.data.errors);
          this.loadingCreateUser = false;
        });
    },
    handleFormRoleChange(value) {
      this.form.areas = [];
      this.form.role = value;
      this.form.category = this.categories[0]._id;
    },
    handleFormCategory(value) {
      this.form.category = value;
    }
  }
};
</script>

