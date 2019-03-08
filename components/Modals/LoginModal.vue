<template>
  <modal
    :footer="false"
    class="login text-center mt-32"
    size="sm"
    v-model="loginModal"
  >
    <span slot="title">
      <img
        :src="$store.state.settings.logo"
        alt
        class="img-responsive mrgnauto"
      >
    </span>
    <form
      @submit.prevent="login"
      class
    >
      <input
        class="form-control mb20"
        placeholder="Email"
        type="text"
        v-model="form.email"
      >
      <input
        class="form-control mb20"
        placeholder="Enter Password"
        type="password"
        v-model="form.password"
      >
      <small>
        <a
          class="tiny pull-right mb20"
          href="#"
        >Forgot password</a>
      </small>
      <div class="clearfix"></div>
      <button
        :disabled="loading"
        class="btn btnblue w-100 text-uppercase"
        type="submit"
      >{{ loading ? "Logging in..." : "Sign In" }}</button>
    </form>
  </modal>
</template>

<script>
export default {
  computed: {
    loginModal: {
      get() {
        return this.$store.state.modals.login;
      },
      set() {
        return this.$store.commit("TOGGLE_LOGIN_MODAL");
      }
    }
  },
  data() {
    return {
      loading: false,
      form: {
        email: "admin@gmail.com",
        password: "123123123"
      }
    };
  },
  methods: {
    login() {
      this.loading = true;
      this.$auth
        .loginWith("local", {
          data: {
            email: this.form.email,
            password: this.form.password
          }
        })
        .then(() => {
          this.loading = false;
          const permissions = this.$store.state.auth.user.role.permissions;
          let redirectToHome = true;
          this.$store.commit("TOGGLE_LOGIN_MODAL");

          this.socketConnect();

          for (let index = 0; index < permissions.length; index++) {
            const permission = permissions[index];

            if (permission.name === "view command center") {
              redirectToHome = false;
              this.$router.push(`/command-center`);
              break;
            }

            if (permission.name === "resolve") {
              redirectToHome = false;
              this.$router.push("/resolver");
              break;
            }

            if (permission.name === "respond") {
              redirectToHome = false;
              this.$router.push("/responder");
              break;
            }
          }

          if (redirectToHome) {
            this.$router.push("/");
          }

          this.$message.success("Login successful!", 2);
        })
        .catch(errors => {
          console.log(errors.response.data);
          alert("Invalid Credentials!");
          this.loading = false;
        });
    },
    socketConnect() {
      this.$socket.query.token = localStorage
        .getItem("auth._token.local")
        .replace("Bearer ", "");
      this.$socket.connect();
    }
  }
};
</script>
