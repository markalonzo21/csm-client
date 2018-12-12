<template>
  <div class="panel shadow">
    <div class="panel-heading" role="button">
      <table class="table">
        <tr>
          <th class="bluelabel">Report ID</th>
          <th class="bluelabel">Type</th>
          <th class="bluelabel"></th>
          <th class="bluelabel"></th>
        </tr>
        <tr>
          <td>{{ report._id }}</td>
          <td>{{ report.reportType.name }}</td>
          <td class="text-center">
            <button class="btn btnblue chat">
              <svgicon name="chat"></svgicon>Chat
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
            <td>{{ report.description }}</td>
            <td>{{ report.reportedBy.firstName }} {{ report.reportedBy.middleName }} {{ report.reportedBy.lastName}}</td>
            <td
              v-if="report.assignedto"
            >{{ report.assignedTo.firstName }} {{ report.assignedTo.middleName }} {{ report.assignedTo.lastName}}</td>
            <td v-else>None</td>
          </tr>
        </table>

        <h3 class="title__blue mt60 mb30">Milestones</h3>
        <div class="row">
          <div class="col-md-3" v-for="milestone in report.responses" :key="milestone._id">
            <Milestone :milestone="milestone"/>
            <span class="text-uppercase bluelabel">{{ milestone.responseType.name }}</span>
          </div>
          <!-- <div class="col-md-3">
            <div class="box">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 605.852 541.915">
                <defs></defs>
                <g id="Group_4684" data-name="Group 4684" transform="translate(-1.959 -0.538)">
                  <path
                    id="Path_507"
                    data-name="Path 507"
                    class="cls-1"
                    d="M386.044,674.887c-17.138.129-38.079-6.588-51.2-18.762L145.973,480.908c-37.712-37.711-16.375-84.943-3.695-98.613a69.849,69.849,0,0,1,98.6-3.7L370.74,499.066,603.41,163.005a69.782,69.782,0,0,1,114.751,79.436s-278.189,401.8-278.5,402.251c-13.215,19.078-31.511,30.025-53.621,30.193ZM170.164,408.168c-12.224,12.214-10.966,33.125,1.674,44.854L360.7,628.24a31.751,31.751,0,0,0,47.687-5.2L686.878,220.788a31.739,31.739,0,0,0-52.195-36.127L389.53,538.77a19.015,19.015,0,0,1-28.579,3.11S215.195,406.664,215.017,406.485c-5.825-5.4-27.9-15.275-44.854,1.684Zm0,0"
                    transform="translate(-122.729 -132.435)"
                  ></path>
                </g>
              </svg>
            </div>
            <span class="text-uppercase bluelabel">Help has arrived</span>
          </div>-->
        </div>
      </div>
    </collapse>
  </div>
</template>


<script>
import Milestone from "~/components/Milestone";
export default {
  props: ["report"],
  components: {
    Milestone
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
  }
};
</script>


<style scoped>
.panel {
  border-radius: 8px;
  box-shadow: 0px 1px 5px 0px rgba(0, 0, 0, 0.75);
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