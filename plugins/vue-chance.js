export default function (ctx, inject) {
  // Load Chance
  var Chance = require('chance')

  // Instantiate Chance so it can be used
  var chance = new Chance()

  ctx.$chance = chance
  inject('chance', chance)
}
