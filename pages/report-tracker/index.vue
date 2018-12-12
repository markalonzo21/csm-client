<template>
  <div class="main-content">
    <div class="container">
      <h1 class="title__black mt0 uppercase">Select a report to track</h1>
      <div class="panel shadow">
        <div class="panel-heading" role="button">
          <table class="table">
            <tr>
              <th class="bluelabel">Report ID</th>
              <th class="bluelabel">Category</th>
              <th class="bluelabel">Type</th>
              <th class="bluelabel"></th>
              <th class="bluelabel"></th>
            </tr>
            <tr>
              <td>somecharacter</td>
              <td>Emergency Management</td>
              <td>Fire</td>
              <td class="text-center">
                <button class="btn btnblue chat">
                  <svg
                    version="1.1"
                    id="Layer_1"
                    xmlns="http://www.w3.org/2000/svg"
                    xmlns:xlink="http://www.w3.org/1999/xlink"
                    x="0px"
                    y="0px"
                    width="30px"
                    height="14px"
                    viewBox="0 0 30 14"
                    style="enable-background:new 0 0 30 14;"
                    xml:space="preserve"
                  >
                    <g>
                      <path
                        class="st0"
                        d="M17.4,19.4c-0.4,0-0.7,0-1-0.1l-0.3,0l-0.6-0.1c-2.4-0.3-4.7-1.3-6.5-2.9L8.7,16c-1.6-1.3-2.6-3.1-3.1-5.1
			c-0.1-0.4-0.2-0.7-0.2-1.1C2.1,11,0,13.6,0,16.4c0,2.1,1.2,4.1,3.2,5.5c0.2,0.1,0.3,0.3,0.3,0.5v4.2l3.2-3
			c0.1-0.1,0.4-0.2,0.6-0.2c0.7,0.1,1.5,0.2,2.2,0.2c3.7,0,7.1-1.7,8.6-4.3L17.4,19.4L17.4,19.4z"
                      />
                    </g>
                    <g>
                      <path
                        class="st0"
                        d="M18.3,0C11.9,0,6.6,4.1,6.6,9.1s5.2,9.1,11.7,9.1c0.9,0,1.8-0.1,2.7-0.2h0.1c0.2,0,0.3,0.1,0.4,0.2l4.2,3.8
			v-5.5c0-0.2,0.1-0.4,0.3-0.5c2.5-1.7,4-4.2,4-6.8C30,4.1,24.8,0,18.3,0z"
                      />
                    </g></svg
                  >Chat
                </button>
              </td>
              <td class="bluelabel">
                <span @click="toggleAccordion(0)">View More</span>
              </td>
            </tr>
          </table>
        </div>
        <collapse v-model="showAccordion[0]">
          <div class="panel-body">
            <table class="table">
              <tr>
                <th class="bluelabel">Notes</th>
                <th class="bluelabel">Reported by</th>
                <th class="bluelabel">Assigned to</th>
              </tr>
              <tr>
                <td>Some text here</td>
                <td>Janno Reyes</td>
                <td>Ceasar Salad</td>
              </tr>
            </table>

            <h3 class="title__blue mt60 mb30">Milestones</h3>
            <div class="row">
              <div class="col-md-3">
                <div class="box checked">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 605.852 541.915"
                  >
                    <defs></defs>
                    <g
                      id="Group_4684"
                      data-name="Group 4684"
                      transform="translate(-1.959 -0.538)"
                    >
                      <path
                        id="Path_507"
                        data-name="Path 507"
                        class="cls-1"
                        d="M386.044,674.887c-17.138.129-38.079-6.588-51.2-18.762L145.973,480.908c-37.712-37.711-16.375-84.943-3.695-98.613a69.849,69.849,0,0,1,98.6-3.7L370.74,499.066,603.41,163.005a69.782,69.782,0,0,1,114.751,79.436s-278.189,401.8-278.5,402.251c-13.215,19.078-31.511,30.025-53.621,30.193ZM170.164,408.168c-12.224,12.214-10.966,33.125,1.674,44.854L360.7,628.24a31.751,31.751,0,0,0,47.687-5.2L686.878,220.788a31.739,31.739,0,0,0-52.195-36.127L389.53,538.77a19.015,19.015,0,0,1-28.579,3.11S215.195,406.664,215.017,406.485c-5.825-5.4-27.9-15.275-44.854,1.684Zm0,0"
                        transform="translate(-122.729 -132.435)"
                      />
                    </g>
                  </svg>
                </div>
                <span class="text-uppercase bluelabel">Help is on the way</span>
              </div>
              <div class="col-md-3">
                <div class="box">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 605.852 541.915"
                  >
                    <defs></defs>
                    <g
                      id="Group_4684"
                      data-name="Group 4684"
                      transform="translate(-1.959 -0.538)"
                    >
                      <path
                        id="Path_507"
                        data-name="Path 507"
                        class="cls-1"
                        d="M386.044,674.887c-17.138.129-38.079-6.588-51.2-18.762L145.973,480.908c-37.712-37.711-16.375-84.943-3.695-98.613a69.849,69.849,0,0,1,98.6-3.7L370.74,499.066,603.41,163.005a69.782,69.782,0,0,1,114.751,79.436s-278.189,401.8-278.5,402.251c-13.215,19.078-31.511,30.025-53.621,30.193ZM170.164,408.168c-12.224,12.214-10.966,33.125,1.674,44.854L360.7,628.24a31.751,31.751,0,0,0,47.687-5.2L686.878,220.788a31.739,31.739,0,0,0-52.195-36.127L389.53,538.77a19.015,19.015,0,0,1-28.579,3.11S215.195,406.664,215.017,406.485c-5.825-5.4-27.9-15.275-44.854,1.684Zm0,0"
                        transform="translate(-122.729 -132.435)"
                      />
                    </g>
                  </svg>
                </div>
                <span class="text-uppercase bluelabel">Help has arrived</span>
              </div>
            </div>
          </div>
        </collapse>
      </div>

      <div v-if="reports.length > 0">
        <div class="panel" style="border: none;" v-for="report in reports">
          <div
            class="panel-body border h-32 rounded shadow bg-white flex items-center"
          >
            <div class="col-sm-3">
              <strong>Date</strong>
              <div>
                {{
                  $moment(report.createdAt).format("hh:mm A - MMM. DD, YYYY")
                }}
              </div>
            </div>
            <div class="col-sm-3">
              <strong>Type</strong>
              <div>{{ report.reportType.name }}</div>
            </div>
            <div class="col-sm-3">
              <strong>Resolved Date</strong>
              <div>
                {{
                  report.resolvedAt
                    ? $moment(report.resolvedAt).format(
                        "hh:mm A - MMM. DD, YYYY"
                      )
                    : "Unresolved"
                }}
              </div>
            </div>
            <button
              type="button"
              class="btn btnblue col-sm-3 outline-none"
              @click.prevent="$router.push(`/report-tracker/${report._id}`)"
            >
              Select
            </button>
          </div>
        </div>
      </div>
      <div v-else>
        <div class="panel">
          <div
            class="panel-body border h-32 rounded shadow bg-white flex items-center justify-center"
          >
            No reports...
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import ReportsHistory from "~/components/ReportsHistory";

  export default {
    components: {
      ReportsHistory
    },
    data() {
      return {
        showAccordion: [false]
      };
    },
    methods: {
      toggleAccordion(index) {
        if (this.showAccordion[index]) {
          this.$set(this.showAccordion, index, false);
        } else {
          this.showAccordion = this.showAccordion.map((v, i) => i === index);
        }
      }
    },
    asyncData({ $axios }) {
      return $axios.$get("/reports?active-only").then(response => {
        return {
          reports: response.data
        };
      });
    }
  };
</script>
<style>
  .panel {
    border-radius: 8px;
    box-shadow: 0px 1px 5px 0px rgba(0,0,0,0.75);
  }
  .panel-heading {
    background-color: #fff;
  }
  .table {
    margin-bottom: 0;
  }
  .bluelabel {
    color: #34c3e5;
  }
  .box {
    height: auto;
    width: 30px;
    margin-left: 20px;
    margin-bottom: 10px;
    padding: 5px;
    border: 1px solid #34c3e5;
    border-radius: 4px;
  }
  .box svg {
    fill: #34c3e5;
    margin-top: -5px;
    margin-right: 0;
  }
  .box.checked {
    background-color: #34c3e5;
  }
  .box.checked svg {
    fill: #fff;
  }
  svg {
    height: 100%;
    width: 20px;
    fill: #fff;
    vertical-align: middle;
    margin-top: -10px;
    margin-right: 5px;
    transition: all ease 300ms;
  }
  .btn.btnblue:hover svg {
    fill: #34c3e5;
  }
  .btn.btnblue.chat {
    width: auto;
  }
  .title__blue {
    font-weight: 700;
  }
</style>
