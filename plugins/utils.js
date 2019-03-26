const cloudinaryTransform = (src, values) => {
  if (!src) {
    return 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6c/No_image_3x4.svg/1280px-No_image_3x4.svg.png'
  }

  if (!src.includes('res.cloudinary.com')) {
    return src
  }

  src = src.split('/')
  src.splice(6, 0, values)
  src = src.join('/')
  return src
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
    cloudinaryTransform,
    isImage,
    getHumanIcon,
    getIcon,
    serialize
  }

  inject('utils', {
    cloudinaryTransform,
    isImage,
    getHumanIcon,
    getIcon,
    serialize
  })
}
