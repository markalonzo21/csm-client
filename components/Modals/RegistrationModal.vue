<template>
  <modal
    :footer="false"
    class="registration text-center mt-32"
    size="sm"
    v-model="registrationModal"
  >
    <span
      class="text-uppercase"
      slot="title"
    >Register</span>
    <form
      @keydown="form.errors.clear($event.target.name)"
      @submit.prevent="register"
    >
      <div class="row">
        <div class="col-md-12 mb-6">
          <div
            :class="{'has-error': form.errors.has('firstName')}"
            class="form-group"
          >
            <input
              class="form-control"
              name="firstName"
              placeholder="First Name*"
              type="text"
              v-model="form.firstName"
            >
            <span
              class="help-block"
              style="margin: 0"
              v-if="form.errors.has('firstName')"
              v-text="form.errors.first('firstName')"
            ></span>
          </div>
        </div>
        <div class="col-md-12 mb-6">
          <div
            :class="{'has-error': form.errors.has('lastName')}"
            class="form-group"
          >
            <input
              class="form-control"
              name="lastName"
              placeholder="Last Name*"
              type="text"
              v-model="form.lastName"
            >
            <span
              class="help-block"
              style="margin: 0"
              v-if="form.errors.has('lastName')"
              v-text="form.errors.first('lastName')"
            ></span>
          </div>
        </div>
        <div class="col-md-12 mb-6">
          <div
            :class="{'has-error': form.errors.has('emailOrMobile')}"
            class="form-group"
          >
            <input
              class="form-control"
              name="emailOrMobile"
              placeholder="Email or Mobile *"
              type="text"
              v-model="form.emailOrMobile"
            >
            <span
              class="help-block"
              style="margin: 0"
              v-if="form.errors.has('emailOrMobile')"
              v-text="form.errors.first('emailOrMobile')"
            ></span>
          </div>
        </div>
        <div class="col-md-6 mb-6">
          <select
            class="w-100 form-control"
            placeholder="Gender*"
            v-model="form.gender"
          >
            <option value="Male">Male</option>
            <option value="Female">Female</option>
          </select>
        </div>
        <div class="col-md-6 mb-6 select-none">
          <div class="checkbox">
            <label>
              <input
                type="checkbox"
                v-model="form.tenant"
              > Tenant
            </label>
          </div>
        </div>
        <div class="col-md-12 mb-6">
          <div
            :class="{'has-error': form.errors.has('password')}"
            class="form-group"
          >
            <input
              class="form-control"
              name="password"
              placeholder="Password*"
              type="password"
              v-model="form.password"
            >
            <span
              class="help-block"
              style="margin: 0"
              v-if="form.errors.has('password')"
              v-text="form.errors.first('password')"
            ></span>
          </div>
        </div>
        <div class="col-md-12 mb-6">
          <div
            :class="{'has-error': form.errors.has('password')}"
            class="form-group"
          >
            <input
              class="form-control"
              name="password_confirmation"
              placeholder="Confirm Password*"
              type="password"
              v-model="form.password_confirmation"
            >
          </div>
        </div>
        <div class="col-md-12 mb-6 select-none">
          <div
            :class="{'has-error': form.errors.has('password')}"
            class="form-group"
          >
            <label>
              <input
                name="term_agreement"
                type="checkbox"
                v-model="form.term_agreement"
              > Terms and Conditions
            </label>
            <span
              class="help-block"
              style="margin: 0"
              v-if="form.errors.has('term_agreement')"
              v-text="form.errors.first('term_agreement')"
            ></span>
          </div>
        </div>
      </div>
      <button
        :disabled="loadingRegister"
        class="btn btnblue w-100 text-uppercase"
        type="submit"
      >{{ loadingRegister ? "Loading..." : "Register" }}</button>
    </form>
  </modal>
</template>

<script>
import Form from "@/utils/Form";

export default {
  computed: {
    registrationModal: {
      get() {
        return this.$store.state.modals.registration;
      },
      set() {
        return this.$store.commit("TOGGLE_REGISTRATION_MODAL");
      }
    }
  },
  data() {
    return {
      loadingRegister: false,
      form: new Form({
        firstName: "",
        lastName: "",
        emailOrMobile: "",
        gender: "Male",
        tenant: false,
        password: "",
        password_confirmation: "",
        term_agreement: false
      })
    };
  },
  methods: {
    register() {
      this.loadingRegister = true;

      const form = { ...this.form };
      form.gender = form.gender.toLowerCase();

      this.$axios
        .$post("/api/v1/auth/register", form)
        .then(response => {
          this.form.reset();
          this.form.gender = "Male";

          this.form.errors.clear();
          this.$store.commit("TOGGLE_REGISTRATION_MODAL");

          this.$store.commit(
            "verification/SET_EMAIL_OR_MOBILE",
            response.data.emailOrMobile
          );
          this.$store.commit("TOGGLE_VERIFICATION_MODAL");
          this.loadingRegister = false;
        })
        .catch(error => {
          this.form.errors.record(error.response.data.errors);
          this.loadingRegister = false;
        });
    }
  }
};
</script>
