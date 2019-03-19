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
        @submit.prevent="submitUpdateEmail"
        class
      >
        <label
          class="float-left"
          for="email"
        >Email</label>
        <input
          class="form-control mb20"
          id="email"
          placeholder="Enter new email"
          type="text"
          v-model="form.email"
        >
        <button
          :disabled="loading"
          class="btn btnblue w-100 text-uppercase"
          type="submit"
        >{{ loading ? "Loading..." : "Update" }}</button>
      </form>
    </template>
    <template v-if="step === 2">
      <span slot="title">Enter Verification Code</span>
      <form
        @submit.prevent="submitEmailVerificationCode"
        class
      >
        <label
          class="float-left"
          for="verificationCode"
        >Verification Code</label>
        <input
          class="form-control mb20"
          id="verificationCode"
          placeholder="Enter verification code"
          type="text"
          v-model="form.verificationCode"
        >
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
      form: {
        email: "",
        verificationCode: ""
      }
    };
  },
  methods: {
    submitUpdateEmail() {
      this.loading = true;
      this.$axios
        .$post("/api/v1/update-email", { email: this.form.email })
        .then(response => {
          this.step++;
          this.loading = false;
        })
        .catch(error => {
          this.loading = false;
        });
    },
    submitEmailVerificationCode() {
      this.loading = true;
      this.$axios
        .$patch("/api/v1/update-email", {
          verificationCode: this.form.verificationCode
        })
        .then(response => {
          this.step++;
          this.$auth.fetchUser();
          this.$store.commit("TOGGLE_EMAIL_CHANGE_MODAL");
        })
        .catch(error => {
          this.loading = false;
        });
    }
  }
};
</script>
