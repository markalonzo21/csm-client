// hasPermission: state => permissionName => {
//   if (permissionName === null) {
//     return true
//   }

//   return state.user.role.permissions.some(
//     permission => permission.name === permissionName
//   )
// },
// hasSpecificArea(state) {
//   if (state.user) {
//     return state.user.role.permissions.some(permission => {
//       return permission.category === 'specific area management'
//     })
//   }
// }
