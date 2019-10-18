random = require "lodash.random"

module.exports =
  title: 'Last Character'
  description: 'Last written character.'
  image: 'atom://power-effects/images/last-character-effect.gif'
  particles: []

  init: ->
    @reset()

  disable: ->
    @reset()

  reset: ->
    @particles = []

  spawn: (position, colorGenerate, input, randomSize, conf) ->
    @conf = conf
    numParticles = random @conf['spawnCount.min'], @conf['spawnCount.max']

    while numParticles--
      @particles.shift() if @particles.length >= @conf['totalCount.max']
      particle = @createParticle position.left, position.top, colorGenerate, randomSize

      particle.char = if input.getText().length then input.getText() else input.getDeletedText()
      particle.char = particle.char[particle.char.length - 1]

      @particles.push particle

  createParticle: (x, y, colorGenerate, randomSize) ->
    x: x
    y: y
    alpha: 1
    color: colorGenerate()
    size: randomSize()
    velocity:
      x: -1 + Math.random() * 2
      y: -3.5 + Math.random() * 2

  update: ->
    return if not @particles.length

    for i in [@particles.length - 1 ..0]
      particle = @particles[i]

      if particle.alpha <= .1
        @particles.splice i, 1
        continue

      particle.x += particle.velocity.x
      particle.y += particle.velocity.y
      particle.alpha *= 0.96

  animate: (context) ->
    return if not @particles.length

    gco = context.globalCompositeOperation
    context.globalCompositeOperation = "lighter"

    for i in [@particles.length - 1 ..0]
      particle = @particles[i]

      context.font = "bolder " + (particle.size * 3) + "px sans-serif"

      context.fillStyle = "rgba(#{particle.color[4...-1]}, #{particle.alpha})"

      context.fillText(particle.char, particle.x, particle.y)

    context.globalCompositeOperation = gco
