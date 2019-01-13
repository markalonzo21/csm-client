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

const getIcon = color => {
  const markerHtmlStyles = `
    background-color: ${color};
    width: 3rem;
    height: 3rem;
    display: block;
    left: -1.5rem;
    top: -1.5rem;
    position: relative;
    border-radius: 3rem 3rem 0;
    transform: rotate(45deg);
    border: 1px solid #FFFFFF`

  return L.divIcon({
    className: 'my-custom-pin',
    iconAnchor: [0, 24],
    labelAnchor: [-6, 0],
    popupAnchor: [0, -36],
    html: `<span style="${markerHtmlStyles}" />`
  })
}

// Refactor this later to dynamically load helpers based on file name
export default function(ctx, inject) {
  ctx.$utils = {
    hasPermission,
    hasSpecificArea,
    isImage,
    getIcon
  }

  inject('utils', {
    hasPermission,
    hasSpecificArea,
    isImage,
    getIcon
  })
}
