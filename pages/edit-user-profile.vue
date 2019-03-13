<template>
<section class="user-profile main-content">
<div class="container">
    <h2 class="title__blue">#UserIDHere Account Details</h2>
    <div class="panel">
        <div class="panel-body">
            <div class="row">
                <div class="col-sm-3">
                    <label for="" class="bluelabel">Firstname</label><br />
                    <input class="form-control" type="text" name="" id="">
                </div>
                <div class="col-sm-3">
                    <label for="" class="bluelabel">Lastname</label><br />
                    <input class="form-control" type="text" name="" id="">
                </div>
                <div class="col-sm-3">
                    <label for="" class="bluelabel">Gender</label><br />
                    <input class="form-control" type="text" name="" id="">
                </div>
                <div class="col-sm-3">
                    <label for="" class="bluelabel">Birthday</label><br />
                    <input class="form-control" type="text" name="" id="">
                </div>
                <div class="col-sm-3">
                    <label for="" class="bluelabel">Email</label><br />
                    <input class="form-control" type="text" name="" id="">
                </div>
                <div class="col-sm-3">
                    <label for="" class="bluelabel">Mobile Number</label><br />
                    <input class="form-control" type="text" name="" id="">
                </div>
                <div class="col-sm-3">
                    <label for="" class="bluelabel">Area</label><br />
                    <input class="form-control" type="text" name="" id="">                    
                </div>
                <div class="col-sm-3">
                    <label for="" class="bluelabel">Address</label><br />
                    <textarea class="form-control" name="" id="" cols="30" rows="5"></textarea>
                </div>
                <div class="col-sm-6">
                    <a href="#" class="btn btnblue">Update Profile</a><br />
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
textarea {
    resize: none;
}
</style>