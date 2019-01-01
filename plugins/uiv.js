// main.js
// import 'bootstrap/dist/css/bootstrap.min.css'

import Vue from 'vue'
import * as uiv from 'uiv'

Vue.use(uiv)

export default function(ctx, inject) {
  ctx.$notify = uiv.Notification.notify
  inject('notify', uiv.Notification.notify)
}
