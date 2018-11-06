;(L.HeatLayer = (L.Layer ? L.Layer : L.Class).extend({
  initialize: function(t, i) {
    ;(this._latlngs = t), L.setOptions(this, i)
  },
  setLatLngs: function(t) {
    return (this._latlngs = t), this.redraw()
  },
  addLatLng: function(t) {
    return this._latlngs.push(t), this.redraw()
  },
  setOptions: function(t) {
    return (
      L.setOptions(this, t), this._heat && this._updateOptions(), this.redraw()
    )
  },
  redraw: function() {
    return (
      !this._heat ||
        this._frame ||
        this._map._animating ||
        (this._frame = L.Util.requestAnimFrame(this._redraw, this)),
      this
    )
  },
  onAdd: function(t) {
    ;(this._map = t),
      this._canvas || this._initCanvas(),
      t._panes.overlayPane.appendChild(this._canvas),
      t.on('moveend', this._reset, this),
      t.options.zoomAnimation &&
        L.Browser.any3d &&
        t.on('zoomanim', this._animateZoom, this),
      this._reset()
  },
  onRemove: function(t) {
    t.getPanes().overlayPane.removeChild(this._canvas),
      t.off('moveend', this._reset, this),
      t.options.zoomAnimation && t.off('zoomanim', this._animateZoom, this)
  },
  addTo: function(t) {
    return t.addLayer(this), this
  },
  _initCanvas: function() {
    var t = (this._canvas = L.DomUtil.create(
        'canvas',
        'leaflet-heatmap-layer leaflet-layer'
      )),
      i = L.DomUtil.testProp([
        'transformOrigin',
        'WebkitTransformOrigin',
        'msTransformOrigin',
      ])
    t.style[i] = '50% 50%'
    var a = this._map.getSize()
    ;(t.width = a.x), (t.height = a.y)
    var s = this._map.options.zoomAnimation && L.Browser.any3d
    L.DomUtil.addClass(t, 'leaflet-zoom-' + (s ? 'animated' : 'hide')),
      (this._heat = simpleheat(t)),
      this._updateOptions()
  },
  _updateOptions: function() {
    this._heat.radius(
      this.options.radius || this._heat.defaultRadius,
      this.options.blur
    ),
      this.options.gradient && this._heat.gradient(this.options.gradient),
      this.options.max && this._heat.max(this.options.max)
  },
  _reset: function() {
    var t = this._map.containerPointToLayerPoint([0, 0])
    L.DomUtil.setPosition(this._canvas, t)
    var i = this._map.getSize()
    this._heat._width !== i.x && (this._canvas.width = this._heat._width = i.x),
      this._heat._height !== i.y &&
        (this._canvas.height = this._heat._height = i.y),
      this._redraw()
  },
  _redraw: function() {
    var t,
      i,
      a,
      s,
      e,
      n,
      h,
      o,
      r,
      d = [],
      _ = this._heat._r,
      l = this._map.getSize(),
      m = new L.Bounds(L.point([-_, -_]), l.add([_, _])),
      c = void 0 === this.options.max ? 1 : this.options.max,
      u =
        void 0 === this.options.maxZoom
          ? this._map.getMaxZoom()
          : this.options.maxZoom,
      f = 1 / Math.pow(2, Math.max(0, Math.min(u - this._map.getZoom(), 12))),
      g = _ / 2,
      p = [],
      v = this._map._getMapPanePos(),
      w = v.x % g,
      y = v.y % g
    for (t = 0, i = this._latlngs.length; i > t; t++)
      if (
        ((a = this._map.latLngToContainerPoint(this._latlngs[t])),
        m.contains(a))
      ) {
        ;(e = Math.floor((a.x - w) / g) + 2),
          (n = Math.floor((a.y - y) / g) + 2)
        var x =
          void 0 !== this._latlngs[t].alt
            ? this._latlngs[t].alt
            : void 0 !== this._latlngs[t][2]
              ? +this._latlngs[t][2]
              : 1
        ;(r = x * f),
          (p[n] = p[n] || []),
          (s = p[n][e]),
          s
            ? ((s[0] = (s[0] * s[2] + a.x * r) / (s[2] + r)),
              (s[1] = (s[1] * s[2] + a.y * r) / (s[2] + r)),
              (s[2] += r))
            : (p[n][e] = [a.x, a.y, r])
      }
    for (t = 0, i = p.length; i > t; t++)
      if (p[t])
        for (h = 0, o = p[t].length; o > h; h++)
          (s = p[t][h]),
            s && d.push([Math.round(s[0]), Math.round(s[1]), Math.min(s[2], c)])
    this._heat.data(d).draw(this.options.minOpacity), (this._frame = null)
  },
  _animateZoom: function(t) {
    var i = this._map.getZoomScale(t.zoom),
      a = this._map
        ._getCenterOffset(t.center)
        ._multiplyBy(-i)
        .subtract(this._map._getMapPanePos())
    L.DomUtil.setTransform
      ? L.DomUtil.setTransform(this._canvas, a, i)
      : (this._canvas.style[L.DomUtil.TRANSFORM] =
          L.DomUtil.getTranslateString(a) + ' scale(' + i + ')')
  },
})),
  (L.heatLayer = function(t, i) {
    return new L.HeatLayer(t, i)
  })
