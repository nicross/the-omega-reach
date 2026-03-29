app.settings.register('gamepadDeadzone', {
  default: engine.fn.scale(0.15, 0, 0.5, 0, 1),
  compute: (rawValue) => engine.fn.lerp(0, 0.5, rawValue),
  update: function (computedValue) {
    engine.input.gamepad.setDeadzone(computedValue)
  },
})

app.settings.register('gamepadVibration', {
  default: 1,
  update: function (computedValue) {
    app.haptics.setSensitivity(computedValue)
  },
})

app.settings.register('graphicsOn', {
  compute: (rawValue) => Boolean(rawValue),
  default: true,
  update: function (computedValue) {
    content.gl.setActive(computedValue)

    if (app.gameState.isLoaded()) {
      if (computedValue) {
        content.video.load()
      } else {
        content.video.unload()
      }
    }
  },
})

app.settings.register('inputHold', {
  compute: (rawValue) => Boolean(rawValue),
  default: true,
})

app.settings.register('inputPreference', {
  default: 'keyboard',
  update: function (computedValue) {
    content.solution.generate()
  },
})

app.settings.register('mainVolume', {
  compute: (rawValue) => engine.fn.fromDb(engine.fn.lerpExp(engine.const.zeroDb, 0, rawValue, 0.1)),
  default: 1,
  update: function (computedValue) {
    engine.fn.setParam(engine.mixer.param.gain, computedValue)
  },
})

app.settings.register('tutorialOn', {
  compute: (rawValue) => Boolean(rawValue),
  default: true,
})
