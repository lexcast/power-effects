random = require "lodash.random"

getConfig = (config) ->
  atom.config.get "activate-power-mode.#{config}"

useEffectPreferedColor = ->
  atom.config.get "power-effects.usePreferedColors"

module.exports =
  init: (particle) ->
    particle.size = random getConfig("particles.size.min"), getConfig("particles.size.max"), true
    particle.vx = -1 + Math.random() * 2
    particle.vy = -3.5 + Math.random() * 2

  update: (particle, context) ->
    particle.vy += 0.075
    particle.x += particle.vx
    particle.y += particle.vy
    particle.alpha *= 0.96

    context.beginPath()
    context.translate(particle.x, particle.y)
    for i in [5...0]
      context.lineTo(0, particle.size)
      context.translate(0, particle.size)
      context.rotate((Math.PI * .2))
      context.lineTo(0, -particle.size)
      context.translate(0, -particle.size)
      context.rotate(-(Math.PI * .6))
    context.lineTo(0, particle.size)
    context.closePath()
    context.translate(-particle.x, -particle.y)

    if useEffectPreferedColor()
      context.fillStyle = "rgba(255, 255, 200, #{particle.alpha})"
      context.shadowColor = "rgba(255, 255, 51, #{particle.alpha})"
    else
      context.fillStyle = context.shadowColor = "rgba(#{particle.color[4...-1]}, #{particle.alpha})"

    context.shadowBlur = 3
    context.fill()
    context.restore()
