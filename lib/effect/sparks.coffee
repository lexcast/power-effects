random = require "lodash.random"

module.exports =
  title: 'Sparks'
  description: 'Sparks like from an ember'
  image: 'atom://power-effects/images/sparks-effect.gif'

  isDone: (particle) ->
    particle.alpha <= 0.1

  init: (particle) ->
    particle.velocity.x = 5 - (Math.random() * 10 + 5)
    particle.velocity.y = 5 - (Math.random() * 10 + 5)

  update: (particle, context) ->
    particle.velocity.x += Math.random() * 4 - 2
    particle.velocity.y += Math.random() * 4 - 2
    particle.x += particle.velocity.x + Math.random()
    particle.y += particle.velocity.y + Math.random()
    particle.alpha *= 0.999

  draw: (particle, context) ->
    context.fillStyle = "rgba(#{particle.color[4...-1]}, #{particle.alpha})"
    context.fillRect(
      Math.round(particle.x - particle.size / 2)
      Math.round(particle.y - particle.size / 2)
      particle.size, particle.size
    )
