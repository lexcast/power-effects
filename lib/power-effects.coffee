{CompositeDisposable} = require 'atom'

stars = require './effect/stars'
hearts = require './effect/hearts'
lights = require './effect/lights'
characters = require './effect/characters'
roundies = require './effect/roundies'
lightningEffect = require './effect/lightning'

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
          enum: ['chinese', 'runic', 'greek', 'custom']
        customSet:
          title: "Custom set"
          type: 'string'
          description: 'Caracters set used when Characters set is custom'
          default: 'abc'

  activate: (state) ->
    @subscriptions = new CompositeDisposable

    requestIdleCallback ->
      require('atom-package-deps').install('power-effects')

  deactivate: ->
    @subscriptions.dispose()
    @service.unregisterEffect 'powerEffectsStars'
    @service.unregisterEffect 'powerEffectsHearts'
    @service.unregisterEffect 'powerEffectsLights'
    @service.unregisterEffect 'powerEffectsCharacters'
    @service.unregisterEffect 'powerEffectsRoundies'
    @service.unregisterEffect 'powerEffectsLightning'

  consumeActivatePowerModeServiceV1: (service) ->
    @service = service
    starsEffect = service.createParticlesEffect stars
    heartsEffect = service.createParticlesEffect hearts
    lightsEffect = service.createParticlesEffect lights
    charactersEffect = service.createParticlesEffect characters
    roundiesEffect = service.createParticlesEffect roundies
    service.registerEffect 'powerEffectsStars', starsEffect
    service.registerEffect 'powerEffectsHearts', heartsEffect
    service.registerEffect 'powerEffectsLights', lightsEffect
    service.registerEffect 'powerEffectsCharacters', charactersEffect
    service.registerEffect 'powerEffectsRoundies', roundiesEffect
    service.registerEffect 'powerEffectsLightning', lightningEffect
