<template>
  <section class="auth">
    <navbar class="user-menu">
      <div class="container">
        <a class="navbar-brand" slot="brand" href="#">Brand</a>
        <navbar-nav right>
          <li>
            <btn class="btnsignin text-uppercase" @click="login=true"
              >Sign In</btn
            >
          </li>
          <btn class="btnblue text-uppercase" @click="registration=true"
            >Register</btn
          >
        </navbar-nav>
      </div>
    </navbar>
    <modal v-model="login" size="sm" :footer="false" class="login text-center">
      <span slot="title">Insert Logo</span>
      <form @submit.prevent="login" class="">
        <input type="text" class="form-control mb10" placeholder="Email" />
        <input
          type="password"
          class="form-control mb10"
          placeholder="Enter Password"
        />
        <small
          ><a class="tiny pull-right mb10" href="#">Forgot password</a></small
        >
        <button
          type="submit"
          class="btn btnblue w-100 text-uppercase"
          :disabled="loading"
        >
          {{ loading ? "Logging in..." : "Sign In" }}
        </button>
      </form>
    </modal>
    <modal v-model="registration" size="sm" :footer="false" class="registration text-center">
      <span slot="title" class="text-uppercase">Registration</span>
      <form @submit.prevent="login" class="">
        <div class="row">
          <div class="col-md-6 field">
            <input
              class="form-control mb10"
              type="text"
              name=""
              id=""
              placeholder="First Name*"
            />
          </div>
          <div class="col-md-6 field">
            <input
              class="form-control mb10"
              type="text"
              name=""
              id=""
              placeholder="Last Name*"
            />
          </div>
          <div class="col-md-12 field">
              <input
              class="form-control mb10"
              type="email"
              name=""
              id=""
              placeholder="Email*"
            />
          </div>
          <div class="col-md-12 field">
              <input
              class="form-control mb10"
              type="text"
              name=""
              id=""
              placeholder="Mobile Number*"
            />
          </div>
          <div class="col-md-6 field">
            <multi-select class="w-100 mb10" v-model="gender" :options="genderOptions" :limit="1" placeholder="Gender*"/>
          </div>
          <div class="col-md-6 field">
            <input placeholder="Birthday" class="form-control textbox-n" type="text" onfocus="(this.type='date')"  id="date"> 
          </div>
          <div class="col-md-12 field">
            <textarea class="form-control mb10" name="" id="" cols="10" rows="5" placeholder="Address*"></textarea> 
          </div>
          <div class="col-md-12 field">
            <input type="password" class="form-control mb10" name="" id="" placeholder="Password*">
          </div>
          <div class="col-md-12 field">
            <input type="password" class="form-control mb10" name="" id="" placeholder="Confirm Password*">
          </div>
          <div class="col-md-12 field">
            <p class="basic"><input type="checkbox" class="mb10" value="">Terms and conditions</p>
          </div>
        </div>

        <button
          type="submit"
          class="btn btnblue w-100 text-uppercase mb10"
          :disabled="loading"
        >
          {{ loading ? "Logging in..." : "Sign Up" }}
        </button>
        
      </form>
    </modal>
  </section>
</template>

<script>
  export default {
    layout: "auth",
    data() {
      return {
        login: false,
        registration: false,
        gender:[],
        genderOptions: [
          {value: 1, label:'Male'},
          {value: 2, label:'Female'},
        ]
      }
    }
  };
</script>

<style scoped></style>
