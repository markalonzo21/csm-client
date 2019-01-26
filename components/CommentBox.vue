<template>
<div class="panel panel-comment">
  <div class="panel-body">
    <div class="comment-item" v-for="i in 5">
      <div class="avatar">
        <a href="#">
          <img alt="avatar" class="media-object" src="/img/avatar.jpg">
        </a>
      </div>
      <div class="media-body">
        <label class="label-name" for="">Responder's Name</label>
        <span class="tiny pull-right">21 mins ago</span>
        <small class="basic">
          Cras sit amet nibh libero, in gravida nulla. Nulla vel metus scelerisque ante sollicitudin commodo. Cras purus odio, vestibulum in vulputate at, tempus viverra turpis. Fusce condimentum nunc ac nisi vulputate fringilla. Donec lacinia congue felis in faucibus. 
        </small>
      </div>
    </div>
  </div>
  <div class="panel-footer mt10">
    <form class="input-group">
        <input
          type="text"
          class="form-control"
          placeholder="Write something here ..."
        >
        <div class="input-group-btn">
          <button
            type="submit"
            class="btn bluelabel text-uppercase"
          >Send</button>
        </div>
      </form>
  </div>
</div>

</template>

<script>
export default {
  props: ['type'],
  mounted() {
    this.getComments()
  },
  methods: {
    getComments() {}
  }
}
</script>
<style>
  .panel-comment .panel-body {
    max-height: 300px;
    overflow-y: auto;
  }
  .panel-comment .panel-body::-webkit-scrollbar-track
{
	-webkit-box-shadow: inset 0 0 6px rgba(0,0,0,0.3);
	border-radius: 10px;
	background-color: #F5F5F5;
}

.panel-comment .panel-body::-webkit-scrollbar
{
	width: 8px;
	background-color: #F5F5F5;
}

.panel-comment .panel-body::-webkit-scrollbar-thumb
{
	border-radius: 10px;
	-webkit-box-shadow: inset 0 0 6px rgba(0,0,0,.3);
	background-color: #555;
}
  .avatar {
    float: left;
    margin-right: 10px;
  }
  small.basic {
    display: inline-block;
  }
  .comment-item {
    margin-bottom: 10px;
  }
  .avatar img {
    border-radius: 50%;
    object-fit: cover;
    height: 50px;
    width: 50px;
  }

  .panel-comment .panel-footer {
    margin-top: 10px;
    background-color: #fff;
  }
  .bluelabel {
  color: #34c3e5;
  font-weight: 700;
}
.tiny {
  color: #ccc;
}
</style>

