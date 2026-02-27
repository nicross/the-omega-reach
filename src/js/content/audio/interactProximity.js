content.audio.interactProximity = (() => {
  const baseGain = engine.fn.fromDb(-3),
    bus = content.audio.channel.default.createBus(),
    rootFrequency = engine.fn.fromMidi(72)

  let synth

  function calculateParameters({
    value,
    vector,
  } = {}) {
    const amDepth = engine.fn.fromDb(engine.fn.lerp(-4.5, -3, value))

    return {
      amDepth,
      amFrequency: engine.fn.lerpExp(2, 12, value, 2),
      carrierGain: 1 - amDepth,
      color: engine.fn.lerp(4, 1, value) * engine.fn.scale(vector.x, -1, 1, 0.5, 1),
      detune: engine.fn.lerp(-2400, 0, value),
      fmDepth: engine.fn.lerpExp(0.25, 0.5, value, 2) * rootFrequency,
      fmFrequency: engine.fn.lerpExp(4, 1, value, 2) * rootFrequency,
      gain: baseGain * engine.fn.lerpExp(1/8, 1, value, 2),
      pan: engine.fn.lerpExp(2/3 * vector.y, 0, value, 3),
    }
  }

  function createSynth(...args) {
    const {
      amDepth,
      amFrequency,
      carrierGain,
      color,
      detune,
      fmDepth,
      fmFrequency,
      gain,
      pan,
    } = calculateParameters(...args)

    synth = engine.synth.mod({
      carrierDetune: detune,
      carrierFrequency: rootFrequency,
      carrierType: 'triangle',
      fmDepth,
      fmFrequency,
      fmType: 'square',
      gain,
    }).chainAssign(
      'panner', engine.context().createStereoPanner()
    ).filtered({
      detune,
      frequency: rootFrequency * color,
    }).connect(bus)

    synth.panner.pan.value = pan
  }

  function destroySynth() {
    const now = engine.time(),
      release = 1/16

    engine.fn.rampLinear(synth.param.gain, 0, release)
    synth.stop(now + release)

    synth = undefined
  }

  function updateSynth(...args) {
    const {
      amDepth,
      amFrequency,
      carrierGain,
      color,
      detune,
      fmDepth,
      fmFrequency,
      gain,
      pan,
    } = calculateParameters(...args)

    engine.fn.setParam(synth.filter.detune, detune)
    engine.fn.setParam(synth.filter.frequency, rootFrequency * color)
    engine.fn.setParam(synth.panner.pan, pan)
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
    update: function ({
      value,
      vector,
    } = {}) {
      if (value) {
        if (synth) {
          updateSynth({value, vector})
        } else {
          createSynth({value, vector})
        }
      } else if (synth) {
        destroySynth()
      }

      return this
    },
  }
})()

engine.state.on('reset', () => content.audio.interactValue.reset())
