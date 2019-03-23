<template>
  <modal
    :footer="false"
    class="login text-center mt-32"
    size="sm"
    v-model="emailChangeModalVisible"
  >
    <template v-if="step === 1">
      <span slot="title">Update Email</span>
      <form
        @keydown="form.errors.clear($event.target.name)"
        @submit.prevent="submitUpdateEmail"
        class
      >
        <div
          :class="{'has-error': form.errors.has('email')}"
          class="form-group"
        >
          <input
            :disabled="loading"
            class="form-control"
            name="email"
            placeholder="Email *"
            type="email"
            v-model="form.email"
          >
          <span
            class="help-block"
            style="margin: 0"
            v-if="form.errors.has('email')"
            v-text="form.errors.first('email')"
          ></span>
        </div>
        <button
          :disabled="loading"
          class="btn btnblue w-100 text-uppercase"
          type="submit"
        >{{ loading ? "Loading..." : "Update" }}</button>
      </form>
    </template>
    <template v-if="step === 2">
      <span slot="title">Enter Verification Code
        <br>
        <small>Demo Verification Code: 000000</small>
      </span>
      <form
        @keydown="form.errors.clear($event.target.name)"
        @submit.prevent="submitEmailVerificationCode"
        class
      >
        <div
          :class="{'has-error': form.errors.has('verificationCode')}"
          class="form-group"
        >
          <input
            :disabled="loading"
            class="form-control"
            name="verificationCode"
            placeholder="Verification Code *"
            ref="verificationCode"
            type="verificationCode"
            v-model="form.verificationCode"
          >
          <span
            class="help-block"
            style="margin: 0"
            v-if="form.errors.has('verificationCode')"
            v-text="form.errors.first('verificationCode')"
          ></span>
        </div>
        <button
          :disabled="loading"
          class="btn btnblue w-100 text-uppercase"
          type="submit"
        >{{ loading ? "Loading..." : "Submit" }}</button>
      </form>
    </template>
  </modal>
</template>

<script>
import Form from "@/utils/Form";

export default {
  computed: {
    emailChangeModalVisible: {
      get() {
        return this.$store.state.modals.emailChange;
      },
      set() {
        return this.$store.commit("TOGGLE_EMAIL_CHANGE_MODAL");
      }
    }
  },
  data() {
    return {
      step: 1,
      loading: false,
      form: new Form({
        email: "",
        verificationCode: ""
      })
    };
  },
  methods: {
    submitUpdateEmail() {
      this.loading = true;
      this.$axios
        .$post("/api/v1/profile/update-email", { email: this.form.email })
        .then(response => {
          this.step++;
          this.loading = false;
          this.$message.success("Enter your verification code.", 2);
          this.$nextTick(() => {
            this.$refs.verificationCode.focus();
          });
        })
        .catch(error => {
          this.form.errors.record(error.response.data.errors);
          this.loading = false;
        });
    },
    submitEmailVerificationCode() {
      this.loading = true;
      this.$axios
        .$patch("/api/v1/profile/update-email", {
          verificationCode: this.form.verificationCode
        })
        .then(response => {
          this.step++;
          this.$auth.fetchUser();
          this.$store.commit("TOGGLE_EMAIL_CHANGE_MODAL");
          this.$message.success("You have changed your email successfully.", 5);
        })
        .catch(error => {
          this.form.errors.record(error.response.data.errors);
          this.loading = false;
        });
    }
  }
};
</script>
