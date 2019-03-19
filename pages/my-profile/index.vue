<template>
  <section class="user-profile main-content">
    <EmailChangeModal v-if="$store.state.modals.emailChange"/>
    <div class="container">
      <h2 class="title__blue">USER # {{ $auth.user._id }}</h2>
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
          <div class="row">
            <div class="col-sm-3">
              <label
                class="bluelabel"
                for
              >Current Password</label>
              <br>
              <input
                class="form-control"
                type="password"
                v-model="passwordForm.oldPassword"
              >
              <br>
              <label
                class="bluelabel mt20"
                for
              >New Password</label>
              <br>
              <input
                class="form-control"
                type="password"
                v-model="passwordForm.newPassword"
              >
              <br>
              <label
                class="bluelabel mt20"
                for
              >Verify New Password</label>
              <br>
              <input
                class="form-control"
                type="password"
                v-model="passwordForm.newPasswordConfirmation"
              >
              <br>
            </div>
            <div class="col-sm-12">
              <a
                class="btn btnblue mt20"
                href="edit-user-password"
              >Update Password</a>
              <br>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import EmailChangeModal from "~/components/Modals/EmailChangeModal";

export default {
  components: {
    EmailChangeModal
  },
  data() {
    return {
      passwordForm: {
        oldPassword: "",
        newPassword: "",
        newPasswordConfirmation: ""
      }
    };
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
