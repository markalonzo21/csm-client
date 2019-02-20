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

const getHumanIcon = color => {
  const svg = `<svg style="fill: ${color};  width: 3rem;" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M10 20a10 10 0 1 1 0-20 10 10 0 0 1 0 20zM7 6v2a3 3 0 1 0 6 0V6a3 3 0 1 0-6 0zm-3.65 8.44a8 8 0 0 0 13.3 0 15.94 15.94 0 0 0-13.3 0z"/></svg>`
  return L.divIcon({
    className: 'human-pin',
    // iconAnchor: [0, 24],
    // labelAnchor: [-6, 0],
    // popupAnchor: [0, -36],
    html: svg
  })
  // var iconUrl = 'data:image/svg+xml;base64,' + btoa(svg)

  // return L.icon({
  //   iconUrl: iconUrl
  // })
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

const serialize = obj => {
  return (
    '?' +
    Object.keys(obj)
      .reduce(function (a, k) {
        a.push(k + '=' + encodeURIComponent(obj[k]))
        return a
      }, [])
      .join('&')
  )
}
// Refactor this later to dynamically load helpers based on file name
export default function (ctx, inject) {
  ctx.$utils = {
    hasPermission,
    hasSpecificArea,
    isImage,
    getHumanIcon,
    getIcon,
    serialize
  }

  inject('utils', {
    hasPermission,
    hasSpecificArea,
    isImage,
    getHumanIcon,
    getIcon,
    serialize
  })
}
