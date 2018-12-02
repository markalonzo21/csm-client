<template>
  <section class="admin-dashboard container mx-auto row">
    <!-- <tabs class="tabular-view">
      <tab title="All Categories">
        <div class="search pull-right">
          <form class="form-inline">
            <div class="form-group">
              <label class="sr-only" for="exampleInputEmail3">Email address</label>
              <div class="input-group">
                <input type="email" class="form-control" id="exampleInputEmail3" placeholder="Email">
                <span class="input-group-addon p0" id="basic-addon2"><button class="btn btnblueplain">Search</button></span>
              </div>
            </div>
          </form>
        </div>
        <div class="clearfix"></div>
        <table class="table">
          <tr>
            <th>Category</th>
            <th>Type</th>
            <th>Location</th>
            <th>Created at</th>
            <th>Assigned to</th>
            <th>Resolved at</th>
            <th>Actions</th>
          </tr>
          <tr>
            <td>Security Management</td>
            <td>Theft</td>
            <td>Lorem ipsum, dolor sit amet consectetur adipisicing elit. Voluptatem, aut.</td>
            <td>2018-11-28 10:25AM</td>
            <td class="redtext">Unassigned</td>
            <td class="redtext">Waiting</td>
            <td><a href="#">View</a><a href="#">Delete</a></td>
          </tr>
          <tr>
            <td>Property Management</td>
            <td>Bus Traffic Light</td>
            <td>Lorem ipsum, dolor sit amet consectetur adipisicing elit. Voluptatem, aut.</td>
            <td>2018-11-28 10:25AM</td>
            <td>The Responder</td>
            <td>On-going</td>
            <td><a href="#">View</a><a href="#">Delete</a></td>
          </tr>
        </table>
      </tab>
      <tab title="Security Management">
        <p>Food truck fixie locavore, accusamus mcsweeney's marfa nulla single-origin coffee squid. Exercitation +1 labore velit, blog sartorial PBR leggings next level wes anderson artisan four loko farm-to-table craft beer twee. Qui photo booth letterpress, commodo enim craft beer mlkshk aliquip jean shorts ullamco ad vinyl cillum PBR. Homo nostrud organic, assumenda labore aesthetic magna delectus mollit. Keytar helvetica VHS salvia yr, vero magna velit sapiente labore stumptown. Vegan fanny pack odio cillum wes anderson 8-bit, sustainable jean shorts beard ut DIY ethical culpa terry richardson biodiesel. Art party scenester stumptown, tumblr butcher vero sint qui sapiente accusamus tattooed echo park.</p>
      </tab>
      <tab title="Property Management">
        <p>Food truck fixie locavore, accusamus mcsweeney's marfa nulla single-origin coffee squid. Exercitation +1 labore velit, blog sartorial PBR leggings next level wes anderson artisan four loko farm-to-table craft beer twee. Qui photo booth letterpress, commodo enim craft beer mlkshk aliquip jean shorts ullamco ad vinyl cillum PBR. Homo nostrud organic, assumenda labore aesthetic magna delectus mollit. Keytar helvetica VHS salvia yr, vero magna velit sapiente labore stumptown. Vegan fanny pack odio cillum wes anderson 8-bit, sustainable jean shorts beard ut DIY ethical culpa terry richardson biodiesel. Art party scenester stumptown, tumblr butcher vero sint qui sapiente accusamus tattooed echo park.</p>
      </tab>
      <tab title="Emergency Management">
        <p>Food truck fixie locavore, accusamus mcsweeney's marfa nulla single-origin coffee squid. Exercitation +1 labore velit, blog sartorial PBR leggings next level wes anderson artisan four loko farm-to-table craft beer twee. Qui photo booth letterpress, commodo enim craft beer mlkshk aliquip jean shorts ullamco ad vinyl cillum PBR. Homo nostrud organic, assumenda labore aesthetic magna delectus mollit. Keytar helvetica VHS salvia yr, vero magna velit sapiente labore stumptown. Vegan fanny pack odio cillum wes anderson 8-bit, sustainable jean shorts beard ut DIY ethical culpa terry richardson biodiesel. Art party scenester stumptown, tumblr butcher vero sint qui sapiente accusamus tattooed echo park.</p>
      </tab>
    </tabs>-->
    <!-- <h1 class="title__black--large">Reports</h1>
    <table class="text-center w-100">
      <thead>
        <tr>
          <td>Type</td>
          <td>Location</td>
          <td>Assigned To</td>
          <td>Created At</td>
          <td>Resolved At</td>
        </tr>
      </thead>
      <tbody>
        <tr
          class="cursor-pointer"
          v-for="report in reports"
          :key="report._id"
          @click.prevent="$router.push(`/command-center/reports/${report._id}`)"
        >
          <td>
            <a class="btn btnblue" style="width: 100%;" v-text="report.reportType.name"></a>
          </td>
          <td v-html="report.location.coordinates">14.12414, 121,41241</td>
          <td
            v-text="report.assignedTo ? `${report.assignedTo.firstName} ${report.assignedTo.lastName}` : 'Unassigned'"
          >Some Name</td>
          <td v-text="report.createdAt">Nov. 11, 2018 10:30 PM</td>
          <td v-text="report.resolvedAt ? report.resolvedAt : 'Unresolved'"></td>
        </tr>
      </tbody>
    </table>
    <button
      class="btn btn-info m-6"
      :disabled="isReportsLoading"
      v-if="isLoadMoreVisible"
      @click.prevent="loadMoreReports"
    >Load More</button>-->

    <div class="clearfix">
      <h3 class="float-left">Reports</h3>
    </div>
    <a-table bordered :dataSource="reports" :columns="columns">
      <template slot="operation" slot-scope="text, record">
        <a-button type="primary">
          <router-link :to="`/command-center/reports/${record._id}`">Show</router-link>
        </a-button>
        <a-button type="danger" disabled>Cancel</a-button>
      </template>
    </a-table>
  </section>
</template>

<script>
export default {
  layout: 'command-center',
  middleware: 'isAdmin',
  asyncData({ $axios, error }) {
    return $axios.$get('/admin/reports').then(response => {
      return {
        reports: response.data,
        columns: [
          {
            title: 'Type',
            dataIndex: 'reportType.name'
          },
          {
            title: 'Assigned To',
            dataIndex: 'assignedTo.email'
          },
          {
            title: 'Created At',
            dataIndex: 'createdAt'
          },
          {
            title: 'Operation',
            dataIndex: 'operation',
            scopedSlots: { customRender: 'operation' }
          }
        ],
        isLoadMoreVisible: !(response.data.length < 10),
        isReportsLoading: false
      }
    })
  },
  mounted() {
    this.initSocketListeners()
  },
  methods: {
    initSocketListeners() {
      this.$socket.on('new-report', report => {
        this.reports.unshift(report)
      })
    },
    loadMoreReports() {
      this.isReportsLoading = true
      this.$axios
        .$get(`/admin/reports?command-center=${this.reports.length}`)
        .then(response => {
          response.data.forEach(report => {
            this.reports.push(report)
          })
          this.isLoadMoreVisible = !(response.data.length < 10)
          this.isReportsLoading = false
        })
    }
  }
}
</script>

<style scoped>
table {
  position: relative;
  border-collapse: separate;
  border-spacing: 15px 15px;
}

.rowlink::before {
  content: '';
  display: block;
  position: absolute;
  left: 0;
  width: 100%;
  height: 1.5em; /* don't forget to set the height! */
}
</style>
