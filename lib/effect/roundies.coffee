random = require "lodash.random"

module.exports =
  title: 'Roundies'
  description: 'Roundies.'
  image: 'atom://power-effects/images/roundies.gif'

  isDone: (p) ->
    p.size <= .1

  init: (p) ->
    p.drag = 0.92
    p.velocity.x = random -3, 3
    p.velocity.y = random -3, 3
    p.wander = 0.15
    p.theta = random(0, 360) * Math.PI / 180

  update: (p) ->
    p.x += p.velocity.x
    p.y += p.velocity.y
    p.velocity.x *= p.drag
    p.velocity.y *= p.drag
    p.theta += random -0.5, 0.5
    p.velocity.x += Math.sin(p.theta) * 0.1
    p.velocity.y += Math.cos(p.theta) * 0.1
    p.size *= 0.96

  draw: (p, context) ->
    context.fillStyle = "rgba(#{p.color[4...-1]}, #{p.alpha})"
    context.beginPath()
    context.arc(Math.round(p.x - 1), Math.round(p.y - 1), p.size, 0, 2 * Math.PI)
    context.fill()
