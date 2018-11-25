<template>
  <div>
    <section class="banner">
      <div class="container">
        <div class="row">
          <div class="col-md-4 left-content">
            <h2 class="title__blue--large text-uppercase">Report</h2>
            <div class="intro-text mb30">
              <p class="basic__dark">
                Lorem ipsum dolor sit, amet consectetur adipisicing elit.
                Asperiores quae fugit aspernatur obcaecati odio maxime. Nobis,
                unde adipisci? Voluptas, aliquam.
              </p>
            </div>
            <a href="#" class="btn btnblue text-uppercase">Report</a>
          </div>
          <div class="col-md-8 right-content">
            <img
              src="img/monitor.png"
              alt=""
              class="img-responsive mrgnauto pull-right"
            />
          </div>
        </div>
      </div>
    </section>
    <section class="main-content">
      <div class="news">
        <div class="container">
            <h2 class="title__blue text-uppercase text-center mt0 mb45">News &amp; announcenement</h2>
            <div class="row clrmargin">
              <div class="col-md-4 clrpadding item mb30" v-for="i in 6">
                <div class="panel">
                  <div class="panel-heading p0">
                    <img src="img/event.jpg" alt="" class="img-responsive mrgnauto">
                  </div>
                  <div class="panel-body">
                    <p class="basic">Lorem ipsum dolor sit amet consectetur adipisicing elit. Expedita, quia rem quibusdam veniam minus.</p>
                  </div>
                  <div class="panel-footer">
                    <a href="#" class="btn btnmore pull-right">More <svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
                      width="17.4px" height="30px" viewBox="0 0 17.4 30" style="enable-background:new 0 0 17.4 30;" xml:space="preserve">
                   <path id="XMLID_4_"d="M2.4,30C3,30,3.6,29.8,4,29.3l12.6-12.6c0.4-0.4,0.7-1,0.7-1.7c0-0.6-0.2-1.2-0.7-1.7L4,0.7
                     c-0.9-0.9-2.4-0.9-3.3,0c-0.9,0.9-0.9,2.4,0,3.3l11,11l-11,11c-0.9,0.9-0.9,2.4,0,3.3C1.2,29.8,1.8,30,2.4,30"/>
                   </svg>
                   </a>
                  </div>
                </div>
              </div>
            </div>
            <div class="loadmore text-center mt60">
              <a href="#" class="btn btnblue text-uppercase">Load more</a>
            </div>
        </div>
      </div>
    </section>
  </div>
</template>
<script>
  export default {
    auth: false
  };
</script>
