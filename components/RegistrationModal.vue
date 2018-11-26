<template>
  <modal v-model="registrationModal" size="sm" :footer="false" class="registration text-center mt-32">
    <span slot="title" class="text-uppercase">Register</span>
    <form @submit.prevent="login" class="">
      <div class="row">
        <div class="col-md-6 field">
          <input class="form-control mb20" type="text" placeholder="First Name*">
        </div>
        <div class="col-md-6 field">
          <input class="form-control mb20" type="text" placeholder="Last Name*">
        </div>
        <div class="col-md-12 field">
          <input class="form-control mb20" type="email" placeholder="Email*">
        </div>
        <div class="col-md-12 field">
          <input class="form-control mb20" type="text" placeholder="Mobile Number*">
        </div>
        <div class="col-md-6 field">
          <multi-select
            class="w-100 mb20"
            v-model="gender"
            :options="genderOptions"
            :limit="1"
            placeholder="Gender*"
          />
        </div>
        <div class="col-md-6 field">
          <input
            placeholder="Birthday"
            class="form-control textbox-n"
            type="text"
            onfocus="(this.type='date')"
            id="date"
          >
        </div>
        <div class="col-md-12 field">
          <textarea class="form-control mb20" cols="10" rows="5" placeholder="Address*"></textarea>
        </div>
        <div class="col-md-12 field">
          <input type="password" class="form-control mb20" placeholder="Password*">
        </div>
        <div class="col-md-12 field">
          <input type="password" class="form-control mb20" placeholder="Confirm Password*">
        </div>
        <div class="col-md-12 field">
          <p class="basic">
            <input type="checkbox" class="mb20" value="">Terms and conditions
          </p>
        </div>
      </div>
      <button
        type="submit"
        class="btn btnblue w-100 text-uppercase mb20"
        :disabled="loading"
      >{{ loading ? "Logging in..." : "Sign Up" }}</button>
    </form>
  </modal>
</template>

<script>
export default {
  computed: {
    registrationModal: {
      get() {
        return this.$store.state.modals.registration
      },
      set() {
        return this.$store.commit('TOGGLE_REGISTRATION_MODAL')
      }
    }
  },
  data() {
    return {
      loading: false,
      gender: [],
      genderOptions: [
        { value: 1, label: 'Male' },
        { value: 2, label: 'Female' }
      ]
    }
  }
}
</script>
