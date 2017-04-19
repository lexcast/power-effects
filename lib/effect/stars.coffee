module.exports =
  title: 'Stars'
  description: 'Fun stars.'
  image: 'atom://power-effects/images/stars-effect.gif'

  isDone: (particle) ->
    particle.alpha <= .1

  update: (particle) ->
    particle.velocity.y += 0.075
    particle.x += particle.velocity.x
    particle.y += particle.velocity.y
    particle.alpha *= 0.96

  draw: (particle, context) ->
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

    color = "rgba(#{particle.color[4...-1]}, #{particle.alpha})"
    context.fillStyle = context.shadowColor = color

    context.shadowBlur = 3
    context.fill()
    context.restore()
