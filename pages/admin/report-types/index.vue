<template>
  <section class="container select-none">
    <modal v-model="isCreateReportTypeModalVisible" title="Create Report Type" :footer="false">
      <form @submit.prevent="createReportType" class="clearfix">
        <div class="form-group">
          <input type="text" class="form-control" placeholder="Name" v-model="form.name" required>
        </div>
        <div class="form-group">
          <textarea type="text" class="form-control" placeholder="Description" v-model="form.description"></textarea>
        </div>

        <div class="form-group">
          <select class="form-control" v-model="form.reportCategory" required>
            <option v-for="reportCategory in reportCategories" :value="reportCategory._id" v-text="reportCategory.name"></option>
          </select>
        </div>

        <button class="btn btn-primary float-right" :disabled="loadingCreateReportType">{{ loadingCreateReportType ? 'Loading' : 'Save' }}</button>

      </form>
    </modal>
    <div class="clearfix">
      <h3 class="float-left">Respondents</h3>
      <button class="btn btn-primary float-right my-6" @click.prevent="isCreateReportTypeModalVisible = true">
        Create Report Type
      </button>
    </div>
    <table class="table-bordered w-full">
      <thead>
        <tr>
          <td>Name</td>
          <td>Description</td>
          <td>Category</td>
          <td>Created At</td>
          <td>Actions</td>
        </tr>
      </thead>
      <tbody>
        <tr v-for="reportType in reportTypes">
          <td>{{ reportType.name }}</td>
          <td>{{ reportType.description }}</td>
          <td>{{ reportType.reportCategory.name }}</td>
          <td>{{ reportType.createdAt }}</td>
          <td>
            <button class="m-2 btn btn-primary">Show</button>
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
    data () {
      return {
        isCreateReportTypeModalVisible: false,
        loadingCreateReportType: false,
        reportTypes: [],
        reportCategories: [],
        form: {
          name: '',
          description: '',
          reportCategory: ''
        }
      }
    },
    mounted() {
      this.getReportTypes()
      this.getReportCategories()
      this.generateFakeData()
    },
    methods: {
      generateFakeData() {
        this.form.name = this.$chance.word()
        this.form.description = this.$chance.paragraph()
      },
      getReportTypes() {
        this.$axios.$get('/report-types').then(response => {
          this.reportTypes = response.data
        })
      },
      getReportCategories() {
        this.$axios.$get('/report-categories').then(response => {
          this.reportCategories = response.data
          this.form.reportCategory = response.data[0]._id
        })
      },
      createReportType() {
        this.loadingCreateReportType = true
        this.$axios.$post('/report-types', this.form).then(response => {
          this.generateFakeData()
          this.reportTypes.push(response.data)
          this.loadingCreateReportType = false
          this.isCreateReportTypeModalVisible = false
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
