random = require "lodash.random"

chinese = "田由甲申甴电甶男甸甹町画甼甽甾甿畀畁畂畃畄畅畆畇畈畉畊畋界畍畎畏畐畑"
runic = "ᚠᚢᚦᚨᚱᚲᚷᚹᚺᚾᛁᛃᛇᛈᛉᛊᛏᛒᛖᛗᛚᛜᛞᛟ"

getConfig = (config) ->
  atom.config.get "activate-power-mode.#{config}"

useEffectPreferedColor = ->
  atom.config.get "power-effects.usePreferedColors"

getCharactersSet = ->
  atom.config.get "power-effects.charactersEffect.set"

getCustomCharactersSet = ->
  atom.config.get "power-effects.charactersEffect.customSet"

module.exports =
  init: (particle) ->
    particle.size = random getConfig("particles.size.min"), getConfig("particles.size.max"), true
    particle.vx = -1 + Math.random() * 2
    particle.vy = -2.1 + Math.random() * 2

    set = getCharactersSet()
    chars = chinese.split("") if set is 'chinese'
    chars = runic.split("") if set is 'runic'
    chars = getCustomCharactersSet().split("") if set is 'custom'
    particle.char = chars[Math.floor(Math.random() * chars.length)]

  update: (particle, context) ->
    set = getCharactersSet()

    particle.x += particle.vx
    particle.y += particle.vy
    particle.alpha *= 0.96

    context.font = "bolder " + (particle.size * 2.5) + "px Ubuntu"

    if useEffectPreferedColor() and set != 'custom'
      context.fillStyle = "rgba(245, 50, 50, #{particle.alpha})" if set is 'chinese'
      context.fillStyle = "rgba(93, 233, 247, #{particle.alpha})" if set is 'runic'
    else
      context.fillStyle = "rgba(#{particle.color[4...-1]}, #{particle.alpha})"

    context.fillText(particle.char, particle.x, particle.y)
