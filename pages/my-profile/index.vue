<template>
  <section class="user-profile main-content">
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
                class="form-control"
                name="firstName"
                type="text"
                v-model="form.firstName"
              >
            </div>
            <div class="col-sm-3">
              <label class="bluelabel">Middle Name</label>
              <br>
              <input
                class="form-control"
                name="middleName"
                type="text"
                v-model="form.middleName"
              >
            </div>
            <div class="col-sm-3">
              <label class="bluelabel">Last Name</label>
              <br>
              <input
                class="form-control"
                name="lastName"
                type="text"
                v-model="form.lastName"
              >
            </div>
            <div class="col-sm-3">
              <label class="bluelabel">Gender</label>
              <br>
              <select
                class="form-control"
                v-model="form.gender"
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
                class="form-control"
                name="email"
                type="email"
                v-model="form.email"
              >
            </div>
            <div class="col-sm-3 mt-4">
              <label class="bluelabel">Mobile Number</label>
              <br>
              <input
                class="form-control"
                name="mobile"
                type="text"
                v-model="form.mobile"
              >
            </div>

            <div class="col-md-12 mt-12">
              <a
                class="btn btnblue"
                href="#"
              >Update Profile</a>
              <br>
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
              >Old Password</label>
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
              >Confirm New Password</label>
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
export default {
  data() {
    return {
      form: {
        firstName: this.$auth.user.firstName,
        middleName: this.$auth.user.middleName,
        lastName: this.$auth.user.lastName,
        gender: this.$auth.user.gender,
        email: this.$auth.user.email,
        mobile: this.$auth.user.mobile
      },
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
