<template>
  <section class="container select-none" style="width: 100%">
    <modal v-model="isCreateRespondentModalVisible" title="Create Respondent" :footer="false">
      <form @submit.prevent="createRespondent" class="clearfix">
        <div class="form-group">
          <input type="text" class="form-control" placeholder="first name" v-model="form.firstName" required>
        </div>
        <div class="form-group">
          <input type="text" class="form-control" placeholder="middle name" v-model="form.middleName">
        </div>
        <div class="form-group">
          <input type="text" class="form-control" placeholder="last name" v-model="form.lastName" required>
        </div>
        <div class="form-group">
          <input type="email" class="form-control" placeholder="email" v-model="form.email" required>
        </div>
        <div class="form-group">
          <div class="input-group">
            <span class="input-group-addon">+63</span>
            <input type="text" class="form-control" pattern="\d*" maxlength="10" placeholder="mobile" v-model="form.mobile" required>
          </div>

        </div>
        <div class="form-group">
          <input type="password" class="form-control" placeholder="password" v-model="form.password" required>
        </div>
        <div class="form-group">
          <input type="password" class="form-control" placeholder="password confirmation" v-model="form.password_confirmation" required>
        </div>

        <div class="form-group text-center">
          <label for="">Actionable Report Type</label>
          <div v-for="reportCategory in reportCategories">
            <h5 class="font-bold" v-if="reportCategory.reportTypes.length > 0">{{ reportCategory.name }}</h5>
            <div class="checkbox" v-for="reportType in reportCategory.reportTypes">
              <label>
                <input type="checkbox" v-model="form.reportTypes" :value="reportType._id">
                {{  reportType.name }}
              </label>
            </div>
          </div>
        </div>

        <button class="btn btnblue float-right" style="width: auto" :disabled="loadingCreateUser">{{ loadingCreateUser ? 'Loading' : 'Save' }}</button>

      </form>
    </modal>
    <div class="clearfix">
      <h3 class="float-left">Respondents</h3>
      <button class="btn btnblue float-right my-6" style="width: auto" @click.prevent="isCreateRespondentModalVisible = true">
        Create Respondent
      </button>
    </div>
    <table class="table-bordered w-full">
      <thead>
        <tr>
          <td>First Name</td>
          <td>Middle Name</td>
          <td>Last Name</td>
          <td>Email</td>
          <td>Mobile</td>
          <td>Can Respond To</td>
          <td>Created At</td>
          <td>Actions</td>
        </tr>
      </thead>
      <tbody>
        <tr v-for="respondent in respondents">
          <td>{{ respondent.firstName }}</td>
          <td>{{ respondent.middleName }}</td>
          <td>{{ respondent.lastName }}</td>
          <td>{{ respondent.email }}</td>
          <td>{{ respondent.mobile }}</td>
          <td>
            <ul class="list-reset">
              <li v-for="item in respondent.canRespondTo">{{ item.name }}</li>
            </ul>
          </td>
          <td>{{ respondent.createdAt }}</td>
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
        isCreateRespondentModalVisible: false,
        loadingGetRespondents: false,
        respondents: [],
        reportCategories: [],
        loadingCreateUser: false,
        form: {
          firstName: '',
          middleName: '',
          lastName: '',
          email: '',
          mobile: '',
          reportTypes: []
        }
      }
    },
    mounted() {
      this.getReportTypes()
      this.getRespondents()
      this.generateFakeData()
    },
    methods: {
      generateFakeData() {
        this.form.firstName = this.$chance.first()
        this.form.lastName = this.$chance.last()
        this.form.email = this.$chance.email()
        this.form.mobile = `92${(new Date().getTime()).toString().substr(5)}`
        this.form.password = '123123123'
        this.form.password_confirmation = '123123123'
        this.form.reportTypes = []
      },
      getReportTypes() {
        this.$axios.$get('/report-categories').then(response => {
          this.reportCategories = response.data
        })
      },
      getRespondents() {
        this.loadingGetRespondents = true
        this.$axios.$get('/admin/respondents').then(response => {
          this.respondents = response.data
          this.loadingGetRespondents = false
        })
      },
      createRespondent() {
        this.loadingCreateUser = true
        this.form.mobile = `0${this.form.mobile}`
        this.$axios.$post('/admin/respondents', this.form).then(response => {
          this.generateFakeData()
          this.respondents.push(response.data)
          this.loadingCreateUser = false
          this.isCreateRespondentModalVisible = false
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
