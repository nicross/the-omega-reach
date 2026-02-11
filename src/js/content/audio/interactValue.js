content.audio.interactValue = (() => {
  const baseGain = engine.fn.fromDb(-6),
    bus = content.audio.channel.default.createBus(),
    rootFrequency = engine.fn.fromMidi(48)

  let synth

  function calculateParameters(value) {
    const amDepth = engine.fn.fromDb(engine.fn.lerp(-12, -3, value))

    return {
      amDepth,
      amFrequency: rootFrequency / 4,
      amType: 'square',
      carrierGain: 1 - amDepth,
      color: engine.fn.lerp(0.5, 4, value),
      detune: engine.fn.lerp(-2400, 0, value),
      fmDepth: engine.fn.lerp(0, 1/12/1.5, value) * rootFrequency,
      fmFrequency: engine.fn.lerp(2, 12, value),
      gain: engine.fn.lerp(1/8, 1, value) * baseGain,
    }
  }

  function createSynth(value) {
    const {
      amDepth,
      amFrequency,
      carrierGain,
      color,
      detune,
      fmDepth,
      fmFrequency,
      gain,
    } = calculateParameters(value)

    synth = engine.synth.mod({
      carrierDetune: detune,
      carrierFrequency: rootFrequency,
      carrierType: 'square',
      fmDepth,
      fmFrequency,
      gain,
    }).filtered({
      detune,
      frequency: rootFrequency * color,
    }).connect(bus)
  }

  function destroySynth() {
    const now = engine.time(),
      release = 1/16

    engine.fn.rampLinear(synth.param.gain, 0, release)
    synth.stop(now + release)

    synth = undefined
  }

  function updateSynth(value) {
    const {
      amDepth,
      amFrequency,
      carrierGain,
      color,
      detune,
      fmDepth,
      fmFrequency,
      gain,
    } = calculateParameters(value)

    engine.fn.setParam(synth.filter.detune, detune)
    engine.fn.setParam(synth.filter.frequency, rootFrequency * color)
    engine.fn.setParam(synth.param.amod.depth, amDepth)
    engine.fn.setParam(synth.param.amod.frequency, amFrequency)
    engine.fn.setParam(synth.param.carrierGain, carrierGain)
    engine.fn.setParam(synth.param.detune, detune)
    engine.fn.setParam(synth.param.fmod.depth, fmDepth)
    engine.fn.setParam(synth.param.fmod.frequency, fmFrequency)
    engine.fn.setParam(synth.param.gain, gain)
  }

  return {
    reset: function () {
      if (synth) {
        destroySynth()
      }

      return this
    },
    update: function (value) {
      if (value) {
        if (synth) {
          updateSynth(value)
        } else {
          createSynth(value)
        }
      } else if (synth) {
        destroySynth()
      }

      return this
    },
  }
})()

engine.state.on('reset', () => content.audio.interactValue.reset())
