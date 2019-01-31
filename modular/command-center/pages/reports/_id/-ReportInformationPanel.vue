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
            <td
              class="inline-block"
              v-if="report.reporter"
            >
              <span class="text-black">{{ report.reporter ? report.reporter.email : 'N/A' }} &nbsp;</span>
              <a-tooltip v-if="report.reporter">
                <template slot="title">
                  <div v-html="hoverInfo(report.reporter)"></div>
                </template>
                <a-icon
                  class="text-blue inline-block"
                  type="info-circle"
                />
              </a-tooltip>
            </td>
          </tr>
          <tr>
            <td>Resolver</td>
            <td class="inline-block">
              <span class="text-black">{{ report.resolver ? report.resolver.email : 'N/A' }} &nbsp;</span>
              <a-tooltip v-if="report.resolver">
                <template slot="title">
                  <div v-html="hoverInfo(report.resolver)"></div>
                </template>
                <a-icon
                  class="text-blue inline-block"
                  type="info-circle"
                />
              </a-tooltip>
            </td>
          </tr>
          <tr>
            <td>Responder</td>
            <td class="inline-block">
              <span
                class="text-black"
              >{{ report.responder ? report.responder.email : 'N/A' }} &nbsp;</span>
              <a-tooltip v-if="report.responder">
                <template slot="title">
                  <div v-html="hoverInfo(report.responder)"></div>
                </template>
                <a-icon
                  class="text-blue inline-block"
                  type="info-circle"
                />
              </a-tooltip>
            </td>
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
  },
  methods: {
    hoverInfo(user) {
      return `<table class="table">
          <tbody>
            <tr>
              <td>
               Name
              </td>
              <td>
                <span
                  class="basic"
                >${user.firstName} ${user.middleName} ${user.lastName}
              </td>
            </tr>
            <tr>
              <td>
               Email
              </td>
              <td>
               ${user.email}
              </td>
            </tr>
            <tr>
              <td>
               Mobile Number
              </td>
              <td>
               ${user.mobile}
              </td>
            </tr>
            <tr>
              <td>
               Gender
              </td>
              <td>
               ${user.gender}
              </td>
            </tr>
            <tr>
              <td>
               Tenant
              </td>
              <td>
               ${user.tenant ? "Yes" : "No"}
              </td>
            </tr>
          </tbody>
        </table>`;
    }
  }
};
</script>
