<template>
<section class="user-profile main-content">
<div class="container">
    <h2 class="title__blue">#UserIDHere Account Details</h2>
    <div class="panel">
        <div class="panel-body">
            <div class="row">
                <div class="col-sm-3">
                    <label for="" class="bluelabel">Old Password</label><br />
                    <input class="form-control" type="text" name="" id=""><br />  
                    <label for="" class="bluelabel mt20">New Password</label><br />
                    <input class="form-control" type="text" name="" id=""><br />   
                    <label for="" class="bluelabel mt20">Confirm New Password</label><br />
                    <input class="form-control" type="text" name="" id=""><br />                 
                </div>
                <div class="col-sm-12">
                    <a href="edit-user-password" class="btn btnblue mt20">Update Password</a><br />
                </div>
            </div>
        </div>
    </div>
    </div>
</section>
    
    
</template>

<script>
export default {};
</script>

<style scoped>
.panel {
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

.title__blue {
  font-weight: 700;
}
</style>