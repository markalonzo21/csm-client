<template>
  <section class="user-profile main-content">
    <EmailChangeModal v-if="$store.state.modals.emailChange"/>
    <div class="container">
      <!-- <h2 class="title__blue">USER # {{ $auth.user._id }}</h2> -->
      <h2 class="title__blue">Profile</h2>
      <div class="panel">
        <div class="panel-body">
          <div class="row">
            <div class="col-sm-3">
              <label
                class="bluelabel"
                for
              >First Name</label>
              <br>
              <input
                :disabled="true"
                class="form-control"
                name="firstName"
                type="text"
                v-model="$store.state.auth.user.firstName"
              >
            </div>
            <div class="col-sm-3">
              <label class="bluelabel">Middle Name</label>
              <br>
              <input
                :disabled="true"
                class="form-control"
                name="middleName"
                type="text"
                v-model="$store.state.auth.user.middleName"
              >
            </div>
            <div class="col-sm-3">
              <label class="bluelabel">Last Name</label>
              <br>
              <input
                :disabled="true"
                class="form-control"
                name="lastName"
                type="text"
                v-model="$store.state.auth.user.lastName"
              >
            </div>
            <div class="col-sm-3">
              <label class="bluelabel">Gender</label>
              <br>
              <select
                :disabled="true"
                class="form-control"
                v-model="$store.state.auth.user.gender"
              >
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
            </div>

            <div class="col-sm-3 mt-4">
              <label
                class="bluelabel"
                for
              >Email</label>
              <br>
              <input
                :disabled="true"
                class="form-control mb-2"
                name="email"
                type="email"
                v-model="$store.state.auth.user.email"
              >

              <a
                @click.prevent="$store.commit('TOGGLE_EMAIL_CHANGE_MODAL')"
                class="my-4"
              >Change Email</a>
            </div>
            <div class="col-sm-3 mt-4">
              <label class="bluelabel">Mobile Number</label>
              <br>
              <div class="input-group">
                <span class="input-group-addon">+63</span>
                <input
                  class="form-control"
                  disabled
                  name="mobile"
                  type="text"
                  v-model="$store.state.auth.user.mobile"
                >
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="panel">
        <div class="panel-body">
          <form
            @keydown="passwordForm.errors.clear($event.target.name)"
            @submit.prevent="submitUpdatePassword"
            class="row"
          >
            <div class="col-sm-3">
              <label class="bluelabel">Current Password</label>
              <div
                :class="{'has-error': passwordForm.errors.has('current_password')}"
                class="form-group"
              >
                <input
                  class="form-control"
                  name="current_password"
                  type="password"
                  v-model="passwordForm.current_password"
                >
                <span
                  class="help-block"
                  style="margin: 0"
                  v-if="passwordForm.errors.has('current_password')"
                  v-text="passwordForm.errors.first('current_password')"
                ></span>
              </div>

              <label
                class="bluelabel"
                for
              >New Password</label>
              <div
                :class="{'has-error': passwordForm.errors.has('password')}"
                class="form-group"
              >
                <input
                  class="form-control"
                  name="password"
                  type="password"
                  v-model="passwordForm.password"
                >
                <span
                  class="help-block"
                  style="margin: 0"
                  v-if="passwordForm.errors.has('password')"
                  v-text="passwordForm.errors.first('password')"
                ></span>
              </div>

              <label
                class="bluelabel"
                for
              >Password Confirmation</label>
              <div
                :class="{'has-error': passwordForm.errors.has('password_confirmation')}"
                class="form-group"
              >
                <input
                  class="form-control"
                  name="password_confirmation"
                  type="password"
                  v-model="passwordForm.password_confirmation"
                >
                <span
                  class="help-block"
                  style="margin: 0"
                  v-if="passwordForm.errors.has('password_confirmation')"
                  v-text="passwordForm.errors.first('password_confirmation')"
                ></span>
              </div>
            </div>
            <div class="col-sm-12">
              <button
                class="btn btnblue mt20"
                type="submit"
              >Update Password</button>
              <br>
            </div>
          </form>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import EmailChangeModal from "~/components/Modals/EmailChangeModal";
import Form from "@/utils/Form";

export default {
  components: {
    EmailChangeModal
  },
  data() {
    return {
      loadingUpdatePassword: false,
      passwordForm: new Form({
        current_password: "",
        password: "",
        password_confirmation: ""
      })
    };
  },
  methods: {
    submitUpdatePassword() {
      this.loadingUpdatePassword = true;
      this.$axios
        .$patch("/api/v1/profile/update-password", this.passwordForm)
        .then(response => {
          this.$message.success("Password has been updated successfully");
          this.passwordForm.current_password = "";
          this.passwordForm.password = "";
          this.passwordForm.password_confirmation = "";
          this.loadingUpdatePassword = false;
        })
        .catch(error => {
          this.passwordForm.errors.record(error.response.data.errors);
          this.loadingUpdatePassword = false;
        });
    }
  }
};
</script>

<style scoped>
.panel {
  box-shadow: 0px 1px 5px 0px rgba(0, 0, 0, 0.75);
}
.panel-heading {
  background-color: #fff;
}
.table {
  margin-bottom: 0;
}
.bluelabel {
  color: #34c3e5;
}

.title__blue {
  font-weight: 700;
}
textarea {
  resize: none;
}
</style>
