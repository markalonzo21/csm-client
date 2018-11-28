<template>
  <section class="container select-none" style="width: 100%">
    <modal
      v-model="isCreateReportCategoryModalVisible"
      title="Create Report Category"
      :footer="false"
    >
      <form @submit.prevent="createReportCategory" class="clearfix">
        <div class="form-group">
          <input type="text" class="form-control" placeholder="Name" v-model="form.name" required>
        </div>
        <div class="form-group">
          <textarea
            type="text"
            class="form-control"
            placeholder="Description"
            v-model="form.description"
          ></textarea>
        </div>
        <button
          class="btn btn-primary float-right"
          :disabled="loadingCreateReportCategory"
        >{{ loadingCreateReportCategory ? 'Loading' : 'Save' }}</button>
      </form>
    </modal>
    <div class="clearfix">
      <h3 class="float-left">Report Categories</h3>
      <button
        class="btn btn-primary float-right my-6"
        @click.prevent="isCreateReportCategoryModalVisible = true"
      >Create Report Category</button>
    </div>
    <table class="table-bordered w-full">
      <thead>
        <tr>
          <td>Name</td>
          <td>Description</td>
          <td>Created At</td>
          <td>Actions</td>
        </tr>
      </thead>
      <tbody>
        <tr v-for="reportCategory in reportCategories">
          <td>{{ reportCategory.name }}</td>
          <td>{{ reportCategory.description }}</td>
          <td>{{ reportCategory.createdAt }}</td>
          <td>
            <button class="m-2 btn btn-info" disabled>Edit</button>
            <button class="m-2 btn btn-danger" disabled>Delete</button>
          </td>
        </tr>
      </tbody>
    </table>
  </section>
</template>


<script>
export default {
  layout: 'admin',
  data() {
    return {
      isCreateReportCategoryModalVisible: false,
      loadingCreateReportCategory: false,
      reportCategories: [],
      form: {
        name: '',
        description: ''
      }
    }
  },
  mounted() {
    this.getReportCategories()
    this.generateFakeData()
  },
  methods: {
    generateFakeData() {
      this.form.name = `${this.$chance.word().toUpperCase()} Management`
      this.form.description = this.$chance.paragraph()
    },
    getReportCategories() {
      this.$axios.$get('/report-categories').then(response => {
        this.reportCategories = response.data
      })
    },
    createReportCategory() {
      this.loadingCreateReportCategory = true
      this.$axios.$post('/report-categories', this.form).then(response => {
        this.generateFakeData()
        this.reportCategories.push(response.data)
        this.loadingCreateReportCategory = false
        this.isCreateReportCategoryModalVisible = false
      })
    }
  }
}
</script>

<style scoped>
td {
  padding-right: 20px;
  padding-left: 20px;
  padding-top: 5px;
  padding-bottom: 5px;
}
</style>
