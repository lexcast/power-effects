random = require 'lodash.random'
Point = require '../lightning/point'
ClassicNoise = require '../lightning/classic-noise'
SimplexNoise = require '../lightning/simplex-noise'
NoiseLine = require '../lightning/noise-line'
DragPoint = require '../lightning/drag-point'

module.exports =
  DRAG_POINT_NUM: 4
  DRAG_POINT_MAX_NUM: 8
  CHILD_NUM: 2

  H: 195
  S: 100
  L_MAX: 85
  L_MIN: 45

  canvas: null
  context: null
  dragPoints: []
  mouse: new Point()
  baseLine: null
  lightningLine: null

  random: Math.random
  floor: Math.floor

  perlinNoise: null

  color:
    h: 195
    s: 100
    l: 85
    setAlphaToString: (alpha) ->
      if typeof alpha is 'undefined' or alpha is null
        'hsl(' + this.h + ', ' + this.s + '%, ' + this.l + '%)'
      else
        'hsla(' + this.h + ', ' + this.s + '%, ' + this.l + '%, ' + alpha + ')'
    setRgb: (r, g, b) ->
      r /= 255
      g /= 255
      b /= 255

      max = Math.max(r, g, b)
      min = Math.min(r, g, b)
      h = s = l = (max + min) / 2

      if max == min
        h = s = 0
      else
        d = max - min
        if l > 0.5 then s = d / (2 - max - min) else s = d / (max + min)

        switch max
          when r
            h = (g - b) / d + (g < b ? 6 : 0)
            break
          when g
            h = (b - r) / d + 2
            break
          when b
            h = (r - g) / d + 4
            break

        h /= 6

      this.h = h
      this.s = s
      this.l = l

  init: ->
    @perlinNoise = new SimplexNoise()
    @perlinNoise.octaves 3
    @baseNoiseOpts      = { base: 100000, amplitude: 0.6, speed: 0.02 }
    @lightningNoiseOpts = { base: 90, amplitude: 0.2, speed: 0.05 }
    @childNoiseOpts     = { base: 60, amplitude: 0.8, speed: 0.08 }

    for n in [0..2]
      @dragPoints.push(new DragPoint(n * 50, n * 50))

    @baseLine      = new NoiseLine(8,  @baseNoiseOpts, @perlinNoise)
    @lightningLine = new NoiseLine(16, @lightningNoiseOpts, @perlinNoise)

    for n in [0..@CHILD_NUM]
      @lightningLine.createChild(@childNoiseOpts, @lightningLine)

  disable: ->

  spawn: (position, colorGenerate, input, randomSize, conf) ->
    rgb = colorGenerate()
    rgb = rgb.replace(/[^\d,]/g, '').split(',')

    @color.setRgb rgb[0], rgb[1], rgb[2]
    console.log @color
    @dragPoints.push(new DragPoint(position.left, position.top))

  update: ->
    controls = []

    if @dragPoints.length
      for i in [@dragPoints.length - 1 ..0]
        p = @dragPoints[i]
        p.update(@context)
        p.alpha = 0.2
        if (p.dead)
          dragPoints.splice(i, 1)
          continue
        if (!p.dying)
          controls.push(p)

    controls.sort (p1, p2) ->
      p1.length() - p2.length()

    @baseLine.update(controls)

    @lightningLine.update(@baseLine.points)

  animate: (context) ->
    @context = context
    context.globalCompositeOperation = 'lighter'

    for i in [0..@dragPoints.length - 1]
      p = @dragPoints[i]
      p.draw(@context, @color)

    @drawLightningBlur(@lightningLine, 50, 30)
    @drawLightningLine(@lightningLine, 0.75, 1, 1, 5)
    @drawLightningCap(@lightningLine)

    for child in @lightningLine.children
      @drawLightningLine(child, 0, 1, 0, 4)
      @drawLightningBlur(child, 50, 30)

    @color.l = @randomRange(@L_MIN, @L_MAX)

  drawLightningLine: (line, maxAlpha, minAlpha, maxLineW, minLineW) ->
    @context.beginPath()
    @context.strokeStyle = @color.setAlphaToString(@randomRange(minAlpha, maxAlpha))
    @context.lineWidth   = @randomRange(minLineW, maxLineW)
    i = 0
    for p in line.points
      @context[if i is 0 then 'moveTo' else 'lineTo'](p.x, p.y)
      i++
    @context.stroke()

  drawLightningBlur: (line, blur, maxSize) ->
    @context.save()
    @context.fillStyle = 'rgba(0, 0, 0, 1)'
    @context.shadowBlur = blur
    @context.shadowColor = @color.setAlphaToString()
    @context.beginPath()
    len = line.points.length
    i = 0
    for p in line.points
      dist = 0
      if len > 1
        if i is len - 1
          dist = p.distance(line.points[i - 1])
        else
          dist = p.distance(line.points[i + 1])

      if (dist > maxSize)
        dist = maxSize
      @context.moveTo(p.x + dist, p.y)
      @context.arc(p.x, p.y, dist, 0, Math.PI * 2, false)
      i++
    @context.fill()
    @context.restore()

  drawLightningCap: (line) ->
    points = line.points
    len = points.length
    i = 0
    while i < points.length
      p = points[i]
      radius = @randomRange(3, 8)
      gradient = @context.createRadialGradient(p.x, p.y, radius / 3, p.x, p.y, radius)
      gradient.addColorStop(0, @color.setAlphaToString(1))
      gradient.addColorStop(1, @color.setAlphaToString(0))
      @context.fillStyle = gradient
      @context.beginPath()
      @context.arc(p.x, p.y, radius, 0, Math.PI * 2, false)
      @context.fill()
      i += len

  randomRange: (min, max) ->
    random() * (max - min) + min
