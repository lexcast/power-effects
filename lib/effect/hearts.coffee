random = require "lodash.random"

getConfig = (config) ->
  atom.config.get "activate-power-mode.#{config}"

useEffectPreferedColor = ->
  atom.config.get "power-effects.usePreferedColors"

module.exports =
  init: (particle) ->
    particle.size = random getConfig("particles.size.min"), getConfig("particles.size.max"), true
    particle.vx = -1 + Math.random() * 2
    particle.vy = -2.5 + Math.random() * 2

  update: (particle, context) ->
    particle.x += particle.vx
    particle.y += particle.vy
    particle.alpha *= 0.96

    x = particle.x
    y = particle.y
    s = particle.size * 2

    context.beginPath()
    context.moveTo(x, y + s / 4)
    context.quadraticCurveTo(x, y, x + s / 4, y)
    context.quadraticCurveTo(x + s / 2, y, x + s / 2, y + s / 4)
    context.quadraticCurveTo(x + s / 2, y, x + s * 3 / 4, y)
    context.quadraticCurveTo(x + s, y, x + s, y + s / 4)
    context.quadraticCurveTo(x + s, y + s / 2, x + s * 3 / 4, y + s * 3 / 4)
    context.lineTo(x + s / 2, y + s)
    context.lineTo(x + s / 4, y + s * 3 / 4)
    context.quadraticCurveTo(x, y + s / 2, x, y + s / 4)
    if useEffectPreferedColor()
      context.fillStyle = context.shadowColor = "rgba(246, 69, 130, " + particle.alpha + ")"
    else
      context.fillStyle = context.shadowColor = "rgba(#{particle.color[4...-1]}, #{particle.alpha})"

    context.shadowBlur = 10
    context.fill()
