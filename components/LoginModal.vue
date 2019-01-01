<template>
  <modal v-model="loginModal" size="sm" :footer="false" class="login text-center mt-32">
    <span slot="title">
      <img src="/img/megaworld-logo.png" alt class="img-responsive mrgnauto">
    </span>
    <form @submit.prevent="login" class>
      <input type="text" class="form-control mb20" placeholder="Email" v-model="form.email">
      <input
        type="password"
        class="form-control mb20"
        placeholder="Enter Password"
        v-model="form.password"
      >
      <small>
        <a class="tiny pull-right mb20" href="#">Forgot password</a>
      </small>
      <div class="clearfix"></div>
      <button
        type="submit"
        class="btn btnblue w-100 text-uppercase"
        :disabled="loading"
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

          this.$store.commit("TOGGLE_LOGIN_MODAL");
          this.$notify("Login successful!");
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
