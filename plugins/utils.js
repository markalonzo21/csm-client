const hasPermission = (user, permissionName) => {
  if (!user) {
    return false
  }

  if (permissionName === null) {
    return true
  }

  return user.role.permissions.some(
    permission => permission.name === permissionName
  )
}

const hasSpecificArea = user => {
  if (!user) {
    return false
  }

  return user.role.permissions.some(permission => {
    return permission.category === 'specific area management'
  })
}

export default function(ctx, inject) {
  ctx.$utils = {
    hasPermission,
    hasSpecificArea
  }

  inject('utils', {
    hasPermission,
    hasSpecificArea
  })
}
