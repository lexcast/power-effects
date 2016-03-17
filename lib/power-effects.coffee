{CompositeDisposable} = require 'atom'

starsEffect = require './effect/stars.coffee'
heartsEffect = require './effect/hearts.coffee'
lightsEffect = require './effect/lights.coffee'
charactersEffect = require './effect/characters.coffee'

module.exports = PowerEffects =
  subscriptions: null
  config:
    usePreferedColors:
      title: "Use effect prefered colors"
      type: "boolean"
      default: true
    charactersEffect:
      title: "Characters effect"
      type: 'object'
      properties:
        set:
          title: "Characters set"
          type: 'string'
          default: 'chinese'
          enum: ['chinese', 'runic', 'custom']
        customSet:
          title: "Custom set"
          type: 'string'
          description: 'Caracters set used when Characters set is custom'
          default: 'abc'

  activate: (state) ->
    @subscriptions = new CompositeDisposable

  deactivate: ->
    @subscriptions.dispose()

  consumeActivatePowerModeServiceV1: (activatePowerMode) ->
    activatePowerMode.registerEffect 'Stars', starsEffect
    activatePowerMode.registerEffect 'Hearts', heartsEffect
    activatePowerMode.registerEffect 'Lights', lightsEffect
    activatePowerMode.registerEffect 'Characters', charactersEffect
