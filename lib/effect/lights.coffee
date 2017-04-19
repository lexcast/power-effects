module.exports =
  title: 'Lights'
  description: 'Like in a party.'
  image: 'atom://power-effects/images/lights-effect.gif'

  isDone: (particle) ->
    particle.size <= .1

  init: (particle) ->
    particle.velocity.y = -2.5 + Math.random() * 2

  update: (p) ->
    p.x += p.velocity.x
    p.y += p.velocity.y
    p.alpha *= 0.96
    p.size -= 0.1

  draw: (p, context) ->
    context.beginPath()
    gradient = context.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size * 2)
    gradient.addColorStop(0, "rgba(#{p.color[4...-1]}, #{p.alpha})")
    gradient.addColorStop(0.5, "rgba(#{p.color[4...-1]}, #{p.alpha})")
    gradient.addColorStop(1, "rgba(#{p.color[4...-1]}, 0)")
    context.fillStyle = gradient
    context.arc(p.x, p.y, p.size * 2, Math.PI * 2, false)
    context.fill()
