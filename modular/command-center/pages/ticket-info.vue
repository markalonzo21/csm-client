<template>
  <div class="container-fluid">
    <section class="main-content ticket-info">
      <div class="row">
        <div class="col-md-4 sidebar">
          <div class="panel info">
            <div class="panel-heading">
              <h3 class="text-uppercase">Ticket information</h3>
            </div>
            <div class="panel-body p0">
              <table class="table table-striped">
                <tbody>
                  <tr>
                    <td>Ticket Number</td>
                    <td>Sample</td>
                  </tr>
                  <tr>
                    <td>Ticket Reporter</td>
                    <td>Sample</td>
                  </tr>
                  <tr>
                    <td>Ticket Status</td>
                    <td>Sample</td>
                  </tr>
                  <tr>
                    <td>Date Created</td>
                    <td>Sample</td>
                  </tr>
                  <tr>
                    <td>Last Updated</td>
                    <td>Sample</td>
                  </tr>
                  <tr>
                    <td>Classification</td>
                    <td>Sample</td>
                  </tr>
                  <tr>
                    <td>Category</td>
                    <td>Sample</td>
                  </tr>
                  <tr>
                    <td>Location</td>
                    <td>Sample</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          <div class="panel location">
            <div class="panel-heading">
              <h3 class="text-uppercase">Location</h3>
            </div>
            <div class="panel-body"></div>
          </div>
          <div class="panel option">
            <div class="panel-heading">
              <h3 class="text-uppercase">Option</h3>
            </div>
            <div class="panel-body p0">
              <form>
                <div class="row">
                  <div class="col-md-3">
                    <label for="">Classification</label>
                  </div>
                  <div class="col-md-6">
                    <input type="text" class="form-control" />
                  </div>
                  <div class="col-md-3">
                    <button class="btn btnform">Change</button>
                  </div>
                </div>
                <div class="row">
                  <div class="col-md-3"><label for="">Reassign To</label></div>
                  <div class="col-md-6">
                    <input type="text" class="form-control" />
                  </div>
                  <div class="col-md-3">
                    <button class="btn btnform">Change</button>
                  </div>
                </div>
                <div class="row">
                  <div class="col-md-3">
                    <label for="">Override Status</label>
                  </div>
                  <div class="col-md-3">
                    <button class="btn btnform">On-hold</button>
                  </div>
                </div>
                <div class="row">
                  <div class="col-md-3"><label for="">Tag as</label></div>
                  <div class="col-md-3">
                    <button class="btn btnform btntag">Junk</button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
        <div class="col-md-8 content">
          <div class="panel ticket-details">
            <div class="panel-heading">
              <h3 class="text-uppercase">Priority number: 12323fdfsea</h3>
            </div>
            <div class="panel-body">
              <div class="row basic-details">
                <div class="col-md-4">
                  <label for="">Date</label><br />
                  <span class="basic">January 1, 2019 7:44:03 PM</span>
                </div>
                <div class="col-md-4">
                  <label for="">Name of Reporter</label><br />
                  <span class="basic">Janno Reyes</span>
                </div>
                <div class="col-md-4 text-right">
                  <a href="" class="btn btnblue">Print Chat History</a>
                </div>
              </div>
              <div class="row notes">
                <div class="col-md-4">
                  <label for="">Notes</label><br />
                  <span class="basic">Nawalan ako ng tubig sa shower</span>
                </div>
              </div>
              <div class="row images">
                <div class="col-md-4">
                  <label for="">Images</label><br />

                </div>
              </div>
              <div class="row resolver">
                <div class="col-md-4">
                  <label for="">Resolver</label><br />
                  <span class="basic">Harold Llames</span>
                </div>
              </div>
            </div>
          </div>
          <div class="panel">
            <div class="panel-body">
              <div class="row comment">
                <div class="col-md-10">
                  <textarea
                    class="form-control"
                    name=""
                    id=""
                    cols="30"
                    rows="2"
                    placeholder="Write something here..."
                  ></textarea>
                </div>
                <div class="col-md-2 text-center">
                  <button class="btn text-uppercase">Send</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
  export default {};
</script>

<style scoped>
  .ticket-info .sidebar .panel-body {
    padding-top: 0;
    padding-bottom: 0;
  }
  .ticket-info .panel-body .row {
    margin-bottom: 10px;
  }
  .ticket-info .panel-heading {
    background-color: #344fa0;
  }
  .ticket-info .panel-heading h3 {
    margin: 0;
    font-size: 20px;
    color: #fff;
  }
  .ticket-info .table {
    margin-bottom: 0;
  }
  .ticket-info .table td {
    font-size: 12px;
    border-color: #f1f1f1;
  }
  .ticket-info .table td:first-child {
    background-color: #f1f1f1;
    width: 120px;
  }
  .ticket-info .panel-body form {
    padding: 10px;
  }
  .ticket-info .panel-body form label {
    font-size: 12px;
    font-weight: normal;
  }
  .btn.btnform {
    width: 80px;
    height: 30px;
    border-radius: 10px;
    background-color: #29abe2;
    font-size: 14px;
    color: #fff;
    line-height: 16px;
  }
  .btn.btntag {
    background-color: #ea9199;
  }

  .ticket-info .content label {
    font-size: 16px;
    font-weight: 700;
    color: #333;
  }
  .ticket-info .row.notes {
    margin-top: 40px;
    margin-bottom: 105px;
  }
  .ticket-info .row.images {
    margin-bottom: 40px;
  }
  .ticket-info .row.comment {
    margin: 0;
  }
  .ticket-info .row.comment .panel-body {
    padding: 10px 0;
  }
  .ticket-info .row.comment .btn {
    font-weight: 700;
    color: #29abe2;
  }
  .ticket-info .content textarea {
    resize: none;
    height: 40px;
    border-radius: 10px;
  }
</style>
