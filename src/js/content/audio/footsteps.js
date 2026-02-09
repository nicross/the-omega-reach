content.audio.footsteps = (() => {
  const baseGain = engine.fn.fromDb(-6),
    bus = content.audio.channel.default.createBus()

  function trigger({
    duration,
    pan,
    velocity,
    when,
  } = {}) {
    const frequency = engine.fn.lerp(375, 750, velocity),
      modDepth = engine.fn.fromDb(-6),
      modFrequency = engine.fn.lerp(4, 20, Math.random())

    // Synthesis
    const synth = engine.synth.amBuffer({
      buffer: content.audio.buffer.whiteNoise.choose(),
      carrierGain: 1,
      modDepth: 0,
      modFrequency,
    }).filtered({
      detune: engine.fn.randomFloat(-10, 10),
      frequency: frequency,
    }).chainAssign(
      'panner', engine.context().createStereoPanner()
    ).connect(bus)

    content.audio.reverb().from(synth)

    synth.panner.pan.value = pan

    synth.filter.frequency.linearRampToValueAtTime(frequency/2, when + duration/2)
    synth.filter.frequency.exponentialRampToValueAtTime(frequency, when + duration)

    synth.param.gain.exponentialRampToValueAtTime(baseGain, when + 1/32)
    synth.param.gain.linearRampToValueAtTime(baseGain/8, when + duration/4)
    synth.param.gain.exponentialRampToValueAtTime(engine.const.zeroGain, when + duration)

    synth.param.carrierGain.linearRampToValueAtTime(1 - modDepth, when + duration)
    synth.param.mod.depth.linearRampToValueAtTime(modDepth, when + duration)

    synth.stop(when + duration)
  }

  return {
    trigger: function ({
      count = 3,
      delay = 1/8,
      duration = 1/12,
      pan = 0,
      velocity = 1,
      when = engine.time(),
    } = {}) {
      for (let i = 0; i < count; i += 1) {
        trigger({
          duration,
          pan: engine.fn.scale(i, 0, count - 1, 0, pan),
          velocity: engine.fn.scale(i, 0, count - 1, velocity, 0),
          when: when + (i * (delay + engine.fn.randomFloat(-1/48, 1/48))),
        })
      }
    },
  }
})()
