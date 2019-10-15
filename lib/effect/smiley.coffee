module.exports =
  title: 'Smiley'
  description: 'Happiness into atom'
  image: 'atom://power-effects/images/smiley-effect.gif'

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
    # Outer circle
    context.arc x + 7.5, y + s / 4 + 7.5, 5.0, 0, Math.PI * 2, true
    # Mouth (clockwise)
    context.moveTo x + 11.0, y + s / 4 + 7.5
    context.arc x + 7.5, y + s / 4 + 7.5, 3.5, 0, Math.PI, false
    # Left eye
    context.moveTo  x + 6.5, y + s / 4 + 6.5
    context.arc x + 6.0, y + s / 4 + 6.5, 1.5, 0, Math.PI * 2, false
    # Right eye
    context.moveTo x + 9.5, y + s / 4 + 6.5
    context.arc x + 9.0, y + s / 4 + 6.5, 1.5, 0, Math.PI * 2, false

    color = "rgba(#{particle.color[4...-1]}, #{particle.alpha})"
    context.fillStyle = context.shadowColor = color

    context.shadowBlur = 10

    context.fill()
