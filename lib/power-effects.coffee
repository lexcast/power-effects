{CompositeDisposable} = require 'atom'

starsEffect = require './effect/stars.coffee'
heartsEffect = require './effect/hearts.coffee'

module.exports = PowerEffects =
  subscriptions: null
  config:
    usePreferedColors:
      title: "Use effect prefered colors"
      type: "boolean"
      default: true

  activate: (state) ->
    @subscriptions = new CompositeDisposable

  deactivate: ->
    @subscriptions.dispose()

  consumeActivatePowerModeServiceV1: (activatePowerMode) ->
    activatePowerMode.registerEffect 'Stars', starsEffect
    activatePowerMode.registerEffect 'Hearts', heartsEffect
