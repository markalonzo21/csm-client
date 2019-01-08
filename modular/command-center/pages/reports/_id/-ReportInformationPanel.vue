<template>
  <div class="panel info">
    <div class="panel-heading">
      <h3 class="text-uppercase">Report information</h3>
    </div>
    <div class="panel-body p0">
      <table class="table table-striped">
        <tbody>
          <tr>
            <td>ID</td>
            <td>{{ report._id }}</td>
          </tr>
          <tr>
            <td>Reporter</td>
            <td>{{ report.reporter.email }}</td>
          </tr>
          <tr>
            <td>Resolver</td>
            <td>{{ report.resolver ? report.resolver.email : 'N/A' }}</td>
          </tr>
          <tr>
            <td>Responder</td>
            <td>{{ report.responder ? report.responder.email : 'N/A' }}</td>
          </tr>
          <tr>
            <td>Status</td>
            <td>{{ report.status }}</td>
          </tr>
          <tr>
            <td>Date Created</td>
            <td>{{ $moment(report.createdAt).format('MMM. DD, YYYY | h:mm A ') }}</td>
          </tr>
          <tr>
            <td>Last Updated</td>
            <td>{{ $moment(report.updatedAt).format('MMM. DD, YYYY | h:mm A ') }}</td>
          </tr>
          <tr>
            <td>Category</td>
            <td>{{ report.type.category.name }}</td>
          </tr>
          <tr>
            <td>Type</td>
            <td>{{ report.type.name }}</td>
          </tr>
          <tr>
            <td>Area</td>
            <td>{{ report.area ? report.area.name : 'N/A' }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
  export default {
    props: {
      report: {
        type: Object,
        required: true
      }
    }
  }
</script>
