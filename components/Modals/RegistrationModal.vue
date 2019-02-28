<template>
  <modal v-model="registrationModal" size="sm" :footer="false" class="registration text-center mt-32">
    <span slot="title" class="text-uppercase">Register</span>
    <form @submit.prevent="register" @keydown="form.errors.clear($event.target.name)">
      <div class="row">
        <div class="col-md-12 mb-6">
          <div class="form-group" :class="{'has-error': form.errors.has('firstName')}">
            <input class="form-control" name="firstName" type="text" placeholder="First Name*" v-model="form.firstName">
            <span class="help-block" style="margin: 0" v-if="form.errors.has('firstName')" v-text="form.errors.first('firstName')"></span>
          </div>
        </div>
        <div class="col-md-12 mb-6">
          <div class="form-group" :class="{'has-error': form.errors.has('lastName')}">
            <input class="form-control" name="lastName" type="text" placeholder="Last Name*" v-model="form.lastName">
            <span class="help-block" style="margin: 0" v-if="form.errors.has('lastName')" v-text="form.errors.first('lastName')"></span>
          </div>
        </div>
        <div class="col-md-12 mb-6">
          <div class="form-group" :class="{'has-error': form.errors.has('email')}">
            <input class="form-control" name="email" type="email" placeholder="Email*" v-model="form.email">
            <span class="help-block" style="margin: 0" v-if="form.errors.has('email')" v-text="form.errors.first('email')"></span>
          </div>
        </div>
        <div class="col-md-12 mb-6">
          <div class="form-group" :class="{'has-error': form.errors.has('mobile')}">
            <input class="form-control" type="text" name="mobile" placeholder="Mobile Number*" v-model="form.mobile">
            <span class="help-block" style="margin: 0" v-if="form.errors.has('mobile')" v-text="form.errors.first('mobile')"></span>
          </div>
        </div>
        <div class="col-md-6 mb-6">
          <select
            class="w-100 form-control"
            placeholder="Gender*" v-model="form.gender">
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
        </div>
        <div class="col-md-6 mb-6 select-none">
          <div class="checkbox">
            <label><input type="checkbox" v-model="form.tenant"> Tenant </label>
          </div>
        </div>
        <div class="col-md-12 mb-6">
          <div class="form-group" :class="{'has-error': form.errors.has('password')}">
            <input type="password" class="form-control" name="password" placeholder="Password*" v-model="form.password">
            <span class="help-block" style="margin: 0" v-if="form.errors.has('password')" v-text="form.errors.first('password')"></span>
          </div>
        </div>
        <div class="col-md-12 mb-6">
          <div class="form-group" :class="{'has-error': form.errors.has('password')}">
            <input type="password" class="form-control" name="password_confirmation" placeholder="Confirm Password*" v-model="form.password_confirmation">
          </div>
        </div>
        <div class="col-md-12 mb-6 select-none">
         <div class="form-group" :class="{'has-error': form.errors.has('password')}">
            <label><input type="checkbox" v-model="form.term_agreement" name="term_agreement"> Terms and Conditions </label>
            <span class="help-block" style="margin: 0" v-if="form.errors.has('term_agreement')" v-text="form.errors.first('term_agreement')"></span>
        </div>
        </div>
      </div>
      <button
        type="submit"
        class="btn btnblue w-100 text-uppercase"
        :disabled="loadingRegister"
      >{{ loadingRegister ? "Loading..." : "Register" }}</button>
    </form>
  </modal>
</template>

<script>
import Form from '@/utils/Form'

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
      loadingRegister: false,
      form: new Form({
        firstName: '',
        lastName: '',
        email: '',
        mobile: '',
        gender: 'male',
        tenant: false,
        password: '',
        password_confirmation: '',
        term_agreement: false
      })
    }
  },
  methods: {
    register() {
      this.loadingRegister = true
      this.$axios
        .$post('/auth/register', this.form)
        .then(response => {
          this.form.reset()
          this.form.errors.clear()
          this.$notify({
            content:
              'Successfully registered!',
            type: 'success',
          })
          this.$store.commit('TOGGLE_REGISTRATION_MODAL')
          this.loadingRegister = false
        })
        .catch(error => {
          this.form.errors.record(error.response.data.errors)
          this.loadingRegister = false
        })
    },
  }
}
</script>
