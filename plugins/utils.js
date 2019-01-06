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

const isImage = src => {
  if (src.includes('.png') || src.includes('.jpg')) {
    return true
  }
  return false
}

// Refactor this later to dynamically load helpers based on file name
export default function(ctx, inject) {
  ctx.$utils = {
    hasPermission,
    hasSpecificArea,
    isImage
  }

  inject('utils', {
    hasPermission,
    hasSpecificArea,
    isImage
  })
}
