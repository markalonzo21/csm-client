<template>
  <section class="container select-none">
    <modal v-model="isCreateResponseTypeModalVisible" title="Create Response Type" :footer="false">
      <form @submit.prevent="createResponseType" class="clearfix">
        <div class="form-group">
          <input type="text" class="form-control" placeholder="Name" v-model="form.name" required>
        </div>
        <div class="form-group">
           <textarea type="text" class="form-control" placeholder="Description" v-model="form.description"></textarea>
        </div>

        <button class="btn btn-primary float-right" :disabled="loadingCreateResponseType">{{ loadingCreateResponseType ? 'Loading' : 'Save' }}</button>

      </form>
    </modal>
    <div class="clearfix">
      <h3 class="float-left">Respondents</h3>
      <button class="btn btn-primary float-right my-6" @click.prevent="isCreateResponseTypeModalVisible = true">
        Create Response Type
      </button>
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
        <tr v-for="responseType in responseTypes">
          <td>{{ responseType.name }}</td>
          <td>{{ responseType.description }}</td>
          <td>{{ responseType.createdAt }}</td>
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
    data () {
      return {
        isCreateResponseTypeModalVisible: false,
        loadingCreateResponseType: false,
        responseTypes: [],
        form: {
          name: '',
          description: '',
        }
      }
    },
    mounted() {
      this.getResponseTypes()
      this.generateFakeData()
    },
    methods: {
      generateFakeData() {
        this.form.name = this.$chance.word()
        this.form.description = this.$chance.paragraph()
      },
      getResponseTypes() {
        this.$axios.$get('/response-types').then(response => {
          this.responseTypes = response.data
        })
      },
      createResponseType() {
        this.loadingCreateResponseType = true
        this.$axios.$post('/response-types', this.form).then(response => {
          this.generateFakeData()
          this.responseTypes.push(response.data)
          this.loadingCreateResponseType = false
          this.isCreateResponseTypeModalVisible = false
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
