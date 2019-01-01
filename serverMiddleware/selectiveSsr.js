export default function(req, res, next) {
  if (req.originalUrl.includes('command-center')) {
    res.spa = true
  }
  next()
}
