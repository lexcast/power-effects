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

    if useEffectPreferedColor()
      r = Math.round(Math.random() * 255)
      g = Math.round(Math.random() * 255)
      b = Math.round(Math.random() * 255)
      particle.color = "rgb(#{r}, #{g}, #{b})"

  update: (particle, context) ->
    p = particle
    p.x += p.vx
    p.y += p.vy
    p.alpha *= 0.96

    context.beginPath()
    gradient = context.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size * 2)
    gradient.addColorStop(0, "rgba(#{p.color[4...-1]}, #{p.alpha})")
    gradient.addColorStop(0.5, "rgba(#{p.color[4...-1]}, #{p.alpha})")
    gradient.addColorStop(1, "rgba(#{p.color[4...-1]}, 0)")
    context.fillStyle = gradient
    context.arc(p.x, p.y, p.size * 2, Math.PI * 2, false)
    context.fill()

    p.size -= 0.1
