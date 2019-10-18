{CompositeDisposable} = require 'atom'

stars = require './effect/stars'
hearts = require './effect/hearts'
lights = require './effect/lights'
characters = require './effect/characters'
roundies = require './effect/roundies'
sparks = require './effect/sparks'
smiley = require './effect/smiley'
lastCharacterEffect = require './effect/last-character'

module.exports = PowerEffects =
  subscriptions: null
  config:
    charactersEffect:
      title: "Characters effect"
      type: 'object'
      properties:
        set:
          title: "Characters set"
          type: 'string'
          default: 'chinese'
          enum: ['chinese', 'runic', 'greek', 'chess', 'cards', 'zodiac', 'custom']
        customSet:
          title: "Custom set"
          type: 'string'
          description: 'Characters set used when Characters set is custom'
          default: 'abc'

  activate: (state) ->
    @subscriptions = new CompositeDisposable

    requestIdleCallback ->
      require('atom-package-deps').install('power-effects')

  deactivate: ->
    @subscriptions.dispose()

  consumeActivatePowerModeServiceV1: (service) ->
    starsEffect = service.createParticlesEffect stars
    heartsEffect = service.createParticlesEffect hearts
    lightsEffect = service.createParticlesEffect lights
    charactersEffect = service.createParticlesEffect characters
    roundiesEffect = service.createParticlesEffect roundies
    sparksEffect = service.createParticlesEffect sparks
    smileyEffect = service.createParticlesEffect smiley
    service.registerEffect 'powerEffectsStars', starsEffect
    service.registerEffect 'powerEffectsHearts', heartsEffect
    service.registerEffect 'powerEffectsLights', lightsEffect
    service.registerEffect 'powerEffectsCharacters', charactersEffect
    service.registerEffect 'powerEffectsRoundies', roundiesEffect
    service.registerEffect 'powerEffectsSparks', sparksEffect
    service.registerEffect 'powerEffectsSmiley', smileyEffect
    service.registerEffect 'powerEffectsLastCharacter', lastCharacterEffect
