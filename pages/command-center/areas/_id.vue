<template>
  <div v-if="!loading && area">
    <div class="col-md-6">
      <h4>{{ area.name }}</h4>
      <AreaMap :area="area"/>
    </div>
    <a-modal title="Add Area User" v-model="isAddModalVisible" @ok="handleSave">
      <a-form :layout="'vertical'">
        <a-form-item label="Role">
          <a-select placeholder="Select a role" v-model="form.role" required>
            <a-select-option value="resolver">Resolver</a-select-option>
            <a-select-option value="responder">Responder</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="User">
          <a-select v-model="form.user" required>
            <a-select-option value>Select a user</a-select-option>
            <a-select-option
              v-for="user in filteredUsers"
              :key="user._id"
              :value="user._id"
            >{{ user.email }}</a-select-option>
          </a-select>
        </a-form-item>
      </a-form>
    </a-modal>
    <div class="col-md-6">
      <h4>Details
        <a-button
          type="primary"
          @click="isAddModalVisible = true"
          class="float-right"
          v-if="$store.getters['auth/hasPermission']('update area')"
        >Add Area User</a-button>
      </h4>
      <hr>
      <h5>Resolvers</h5>
      <a-table :columns="columns" :dataSource="resolvers">
        <a slot="firstName" slot-scope="text" href="javascript:;">{{text}}</a>
        <a slot="lastName" slot-scope="text" href="javascript:;">{{text}}</a>
        <a slot="email" slot-scope="text" href="javascript:;">{{text}}</a>
      </a-table>
      <h5>Responders</h5>
      <a-table :columns="columns" :dataSource="responders">
        <a slot="firstName" slot-scope="text" href="javascript:;">{{text}}</a>
        <a slot="lastName" slot-scope="text" href="javascript:;">{{text}}</a>
        <a slot="email" slot-scope="text" href="javascript:;">{{text}}</a>
      </a-table>
    </div>
  </div>
</template>

<script>
import AreaMap from "~/components/AreaMap";
export default {
  layout: "command-center",
  components: {
    AreaMap: AreaMap
  },
  asyncData({ store, redirect }) {
    if (!store.getters["auth/hasPermission"]("view areas")) {
      return redirect("/");
    }
  },
  mounted() {
    this.$axios.$get(`/admin/areas/${this.$route.params.id}`).then(response => {
      this.area = response.data.area;
      this.resolvers = response.data.resolvers;
      this.responders = response.data.responders;
      this.allAvailableUsers = response.data.allAvailableUsers;
      this.form.area = this.$route.params.id;
    });

    this.$nextTick(() => {
      this.assignInitialValue();
    });
  },
  data() {
    return {
      loading: true,
      area: null,
      isAddModalVisible: false,
      columns: [
        {
          title: "First Name",
          dataIndex: "firstName",
          key: "firstName"
        },
        {
          title: "Last Name",
          dataIndex: "lastName",
          key: "lastName"
        },
        {
          title: "Email",
          dataIndex: "email",
          key: "email"
        }
      ],
      allAvailableUsers: [],
      resolvers: [],
      responders: [],
      form: {
        role: "resolver",
        user: "",
        area: null
      }
    };
  },
  watch: {
    "form.role"(value) {
      this.form.user = "";
    }
  },
  computed: {
    filteredUsers() {
      if (!this.loading) {
        const permissionNameToFind = this.form.role === "resolver" ? "resolve" : "respond"
        return this.allAvailableUsers.filter(user => {
          return user.role.permissions.some(permission => permission.name === permissionNameToFind);
        });
      }
      return [];
    }
  },
  methods: {
    assignInitialValue() {
      const lIsAvailable = setInterval(() => {
        if (L) {
          this.loading = false;
        }
      }, 100);
    },
    handleSave() {
      if (this.form.user && this.form.role) {
        this.$axios.$post("/admin/areas/add-user", this.form).then(response => {
          const index = this.allAvailableUsers.findIndex(
            user => user._id === this.form.user
          );

          this.allAvailableUsers.splice(index, 1);

          if (this.form.role === "resolver") {
            this.resolvers.push(response.data);
          } else {
            this.responders.push(response.data);
          }

          this.form.role = "resolver"
          this.form.user = ""
          this.form.area = null

          this.isAddModalVisible = false;
        });
      }
    }
  }
};
</script>
