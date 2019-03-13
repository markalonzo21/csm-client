<template>
  <modal
    :footer="false"
    class="login text-center mt-32"
    size="sm"
    v-model="verificationModal"
  >
    <span
      class="text-uppercase"
      slot="title"
    >
      Please Verify Your {{ $store.getters['verification/emailOrMobile'] }}
      <br>
      <small>Demo Verification Code: 000000</small>
    </span>
    <form
      @submit.prevent="verify"
      class
    >
      <input
        class="form-control mb20"
        disabled="true"
        type="text"
        v-model="emailOrMobile"
      >
      <input
        class="form-control"
        placeholder="Enter Verification Code"
        type="text"
        v-model="verificationCode"
      >
      <small class="mt-2 text-red">{{ showError }}</small>
      <div class="clearfix mb20"></div>
      <button
        :disabled="loading"
        class="btn btnblue w-100 text-uppercase"
        type="submit"
      >{{ loading ? "Verifying..." : "Submit" }}</button>
    </form>
  </modal>
</template>

<script>
export default {
  computed: {
    verificationModal: {
      get() {
        return this.$store.state.modals.verify;
      },
      set() {
        return this.$store.commit("TOGGLE_VERIFICATION_MODAL");
      }
    },
    emailOrMobile: {
      get() {
        return this.$store.state.verification.form.emailOrMobile;
      },
      set(value) {
        return this.$store.commit("verification/SET_EMAIL_OR_MOBILE", value);
      }
    },
    verificationCode: {
      get() {
        return this.$store.state.verification.form.verificationCode;
      },
      set(value) {
        return this.$store.commit("verification/SET_VERIFICATION_CODE", value);
      }
    }
  },
  data() {
    return {
      loading: false,
      showError: ""
    };
  },
  watch: {
    verificationCode() {
      this.showError = "";
    },
    emailOrMobile() {
      this.showError = "";
      this.$store.commit("verification/SET_VERIFICATION_CODE", "");
    }
  },
  methods: {
    verify() {
      this.loading = true;
      const form = {
        verificationCode: this.verificationCode
      };

      if (
        this.$store.getters["verification/emailOrMobileSlug"] ===
        "mobile-number"
      ) {
        form.mobile = this.emailOrMobile;
      } else {
        form.email = this.emailOrMobile;
      }

      this.$axios
        .$post(
          `/auth/verify-${
            this.$store.getters["verification/emailOrMobileSlug"]
          }`,
          form
        )
        .then(response => {
          this.$store.commit("TOGGLE_VERIFICATION_MODAL");
          this.$message.success(
            "Verification successful. Please wait for your accounts confirmation before you can login.",
            20
          );

          this.showError = "";
          this.loading = false;
        })
        .catch(error => {
          this.loading = false;
          this.showError = "Verification code is invalid.";
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
