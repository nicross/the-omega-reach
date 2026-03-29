content.audio = (() => {
  const context = engine.context(),
    mainInput = context.createGain(),
    mainOutput = engine.mixer.createBus()

  const reverb = engine.mixer.reverb.send.create({
    gainModel: engine.mixer.reverb.gainModel.normalize.instantiate({
      gain: engine.fn.fromDb(-6),
    }),
  })

  mainInput.connect(mainOutput)

  function createBus() {
    const gain = context.createGain()
    gain.connect(mainInput)
    return gain
  }

  function createBypass() {
    return engine.mixer.createBus()
  }

  function createChannel(isBypass) {
    const input = context.createGain(),
      output = isBypass ? createBypass() : createBus()

    input.connect(output)

    return {
      createBus: function () {
        const gain = context.createGain()
        gain.connect(input)
        return gain
      },
      input,
      output,
      param: {
        gain: output.gain,
      },
    }
  }

  return {
    channel: {
      bypass: createChannel(true),
      default: createChannel(),
      music: createChannel(),
    },
    main: () => mainOutput,
    reverb: () => reverb,
    // Namespaces
    buffer: {},
  }
})()

// Basic mixer
engine.loop.on('resume', () => {
  engine.fn.rampLinear(content.audio.main().gain, 1, 0.25)
  engine.fn.rampLinear(engine.mixer.reverb.param.gain, 1, 0.25)
})

engine.loop.on('pause', () => {
  engine.fn.rampLinear(content.audio.main().gain, 1/3, 0.25)
  engine.fn.rampLinear(engine.mixer.reverb.param.gain, 1/3, 0.25)
})
