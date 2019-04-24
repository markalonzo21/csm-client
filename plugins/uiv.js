import Vue from 'vue'
import * as uiv from 'uiv'

Vue.use(uiv, { prefix: 'uiv' })

export default function(ctx, inject) {
  ctx.$notify = uiv.Notification.notify
  inject('notify', uiv.Notification.notify)
}
