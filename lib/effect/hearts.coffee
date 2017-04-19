module.exports =
  title: 'Hearts'
  description: 'Love on the air.'
  image: 'atom://power-effects/images/hearts-effect.gif'

  isDone: (particle) ->
    particle.alpha <= .1

  init: (particle) ->
    particle.velocity.y = -2.5 + Math.random() * 2

  update: (particle) ->
    particle.x += particle.velocity.x
    particle.y += particle.velocity.y
    particle.alpha *= 0.96

  draw: (particle, context) ->
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

    color = "rgba(#{particle.color[4...-1]}, #{particle.alpha})"
    context.fillStyle = context.shadowColor = color

    context.shadowBlur = 10
    context.fill()
