<template>
  <div class="main-content">
    <section class="resolver-dashboard container">
      <div class="row">
        <div class="col-md-12">
          <section class="user-dashboard mx-auto" v-if="$store.state.auth.loggedIn">
            <h1 class="title__black mt0 uppercase">Areas</h1>
            <div v-if="areas.length > 0">
              <div class="panel" style="border: none;" v-for="area in areas" :key="area._id">
                <div class="panel-body border h-32 rounded shadow bg-white flex items-center">
                  <div class="col-sm-6">
                    <div>{{ area.name }}</div>
                  </div>
                  <button
                    type="button"
                    class="btn btnblue col-sm-6 outline-none"
                    @click.prevent="$router.push(`/resolver/areas/${area.name}`)"
                  >View Area</button>
                </div>
              </div>
            </div>
            <div v-else>
              <div class="panel">
                <div
                  class="panel-body border h-32 rounded shadow bg-white flex items-center justify-center"
                >No Areas</div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
export default {
  async fetch({ $axios, store, redirect, $utils }) {
    if (!store.getters["auth/hasPermission"]("resolve")) {
      return redirect("/");
    }
    // if (!$utils.hasPermission(store.state.auth.user, "resolve")) {
    //   return redirect("/");
    // }
  },
  computed: {
    areas() {
      return this.$store.state.auth.user.areas;
    }
  }
};
</script>
