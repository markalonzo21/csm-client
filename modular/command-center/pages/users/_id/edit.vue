<template>
  <div>
    <a-form
      @submit.prevent="updateUser"
      class="container clearfix"
    >
      <h3 class="mt-0 mb-12 text-center">Edit User</h3>

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
          :defaultValue="form.role"
          @change="handleFormRoleChange"
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
          :selectedAreas="form.areas"
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
          :selectedCanRespondTo="form.canRespondTo"
          @mergeCanRespondTo="(canRespondTo) => form.canRespondTo = canRespondTo"
          v-if="canRespondTo.length > 0"
        />
        <span v-else>No Response Types Available</span>
      </a-form-item>

      <a-form-item :wrapperCol="{offset: 20}">
        <a-button
          :loading="loadingUpdateUser"
          htmlType="submit"
          type="primary"
        >Update</a-button>
      </a-form-item>
    </a-form>
    <a-form
      @submit.prevent="updateUserPassword"
      class="container clearfix"
    >
      <h4>New Password</h4>
      <a-form-item
        :labelCol="{span: 4}"
        :validateStatus="passwordForm.errors.has('password') ? 'error' : null"
        :wrapperCol="{span: 18}"
        label="* Password"
      >
        <a-input
          type="password"
          v-model="passwordForm.password"
        />
        <div class="ant-form-explain">{{ passwordForm.errors.first('password') }}</div>
      </a-form-item>

      <a-form-item
        :labelCol="{span: 4}"
        :validateStatus="passwordForm.errors.has('password_confirmation') ? 'error' : null"
        :wrapperCol="{span: 18}"
        label="* Password Confirmation"
      >
        <a-input
          type="password"
          v-model="passwordForm.password_confirmation"
        />
        <div class="ant-form-explain">{{ passwordForm.errors.first('password_confirmation') }}</div>
      </a-form-item>

      <a-form-item :wrapperCol="{offset: 20}">
        <a-button
          :loading="loadingUpdateUserPassword"
          htmlType="submit"
          type="primary"
        >Update</a-button>
      </a-form-item>
    </a-form>
  </div>
</template>

<script>
import FormItemArea from "../-FormItemArea";
import FormItemResponseTypes from "../-FormItemResponseTypes";
import Form from "@/utils/Form";

export default {
  layout: "command-center/default",
  components: {
    FormItemArea,
    FormItemResponseTypes
  },
  async asyncData({ $axios, store, error, params }) {
    if (!store.getters["auth/hasPermission"]("update user")) {
      return redirect("/");
    }

    const getRoles = $axios.get("/api/v1/admin/roles");
    const getAreas = $axios.get("/api/v1/admin/areas");
    const getCategories = $axios.get("/api/v1/report-categories");
    const getUser = $axios.get(`/api/v1/admin/users/${params.id}`);

    const [roles, areas, categories, userResponse] = await Promise.all([
      getRoles,
      getAreas,
      getCategories,
      getUser
    ]);

    const user = userResponse.data.data;
    return {
      roles: roles.data.data,
      areas: areas.data.data,
      categories: categories.data.data,
      form: new Form({
        firstName: user.firstName,
        middleName: user.middleName,
        lastName: user.lastName,
        email: user.email,
        mobile: user.mobile,
        gender: user.gender,
        role: user.role.slug,
        category: user.category,
        canRespondTo: user.canRespondTo.map(type => type._id),
        areas: user.areas.map(area => area._id)
      }),
      passwordForm: new Form({
        password: "",
        password_confirmation: ""
      })
    };
  },
  data() {
    return {
      loadingUpdateUser: false,
      loadingUpdateUserPassword: false
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
    updateUser() {
      this.loadingUpdateUser = true;

      const form = { ...this.form };
      form.role = this.roles.find(role => role.slug === this.form.role)._id;

      this.$axios
        .$patch(`/api/v1/admin/users/${this.$route.params.id}`, form)
        .then(response => {
          this.form.errors.clear();
          this.loadingUpdateUser = false;
          this.$message.info("User details has been updated!");
        })
        .catch(error => {
          this.form.errors.record(error.response.data.errors);
          this.loadingUpdateUser = false;
        });
    },
    updateUserPassword() {
      this.loadingUpdateUserPassword = true;

      const form = { ...this.passwordForm };

      this.$axios
        .$patch(`/api/v1/admin/users/${this.$route.params.id}/password`, form)
        .then(response => {
          this.passwordForm.reset();
          this.passwordForm.errors.clear();
          this.loadingUpdateUserPassword = false;
          this.$message.info("User password has been updated!");
        })
        .catch(error => {
          this.passwordForm.errors.record(error.response.data.errors);
          this.loadingUpdateUserPassword = false;
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
