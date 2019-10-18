random = require "lodash.random"

chinese = "功率火水地球空气最好游戏编程龙虎鹰音乐电脑"
runic = "ᚠᚢᚦᚨᚱᚲᚷᚹᚺᚾᛁᛃᛇᛈᛉᛊᛏᛒᛖᛗᛚᛜᛞᛟ"
greek = "ΑΒΓΔΕΖΗΘΙΚΛΜΝΞΟΠΡΣΤΥΦΧΨΩ"
chess = "♔♕♖♗♘♙♚♛♜♝♞♟"
cards = "♠♥♦♣♤♡♢♧"
zodiac = "♈♉♊♋♌♍♎♏♐♑♒♓"

getCharactersSet = ->
  atom.config.get "power-effects.charactersEffect.set"

getCustomCharactersSet = ->
  atom.config.get "power-effects.charactersEffect.customSet"

module.exports =
  title: 'Characters'
  description: 'Characters from a set (runic, chinese or custom).'
  image: 'atom://power-effects/images/characters-effect.gif'

  isDone: (particle) ->
    particle.alpha <= .1

  init: (particle) ->
    particle.velocity.x = -1 + Math.random() * 2
    particle.velocity.y = -2.1 + Math.random() * 2

    set = getCharactersSet()
    chars = chinese.split("") if set is 'chinese'
    chars = runic.split("") if set is 'runic'
    chars = greek.split("") if set is 'greek'
    chars = chess.split("") if set is 'chess'
    chars = cards.split("") if set is 'cards'
    chars = zodiac.split("") if set is 'zodiac'
    chars = getCustomCharactersSet().split("") if set is 'custom'
    particle.char = chars[Math.floor(Math.random() * chars.length)]

  update: (particle, context) ->
    particle.x += particle.velocity.x
    particle.y += particle.velocity.y
    particle.alpha *= 0.96

  draw: (particle, context) ->
    set = getCharactersSet()
    context.font = "bolder " + (particle.size * 3) + "px sans-serif"

    context.fillStyle = "rgba(#{particle.color[4...-1]}, #{particle.alpha})"

    context.fillText(particle.char, particle.x, particle.y)
