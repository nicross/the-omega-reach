content.audio.interactSuccess = (() => {
  const baseGain = engine.fn.fromDb(-9),
    bus = content.audio.channel.default.createBus()

  function trigger({
    color,
    duration,
    frequency,
    pan,
    tail,
    when,
    width,
  } = {}) {
    // Synthesis
    const synth = engine.synth.pwm({
      detune: engine.fn.randomFloat(-10, 10),
      frequency,
      type: 'sawtooth',
      when,
      width,
    }).filtered({
      frequency: frequency * color,
    }).chainAssign(
      'panner', engine.context().createStereoPanner()
    ).connect(bus)

    synth.panner.pan.value = pan

    synth.filter.frequency.linearRampToValueAtTime(frequency, when + duration)
    synth.filter.frequency.linearRampToValueAtTime(frequency * color * 0.5, when + duration + tail)

    synth.param.gain.linearRampToValueAtTime(baseGain, when + 1/64)
    synth.param.gain.setValueAtTime(baseGain, when + duration - 1/64)
    synth.param.gain.linearRampToValueAtTime(engine.const.zeroGain, when + duration)
    synth.param.gain.linearRampToValueAtTime(baseGain/4, when + duration + tail - 1/32)
    synth.param.gain.linearRampToValueAtTime(engine.const.zeroGain, when + duration + tail)

    synth.panner.pan.setValueAtTime(pan, when + duration)
    synth.panner.pan.linearRampToValueAtTime(-Math.sign(pan), when + duration + tail)

    synth.stop(when + duration + tail)
  }

  return {
    trigger: function ({
      duration = 1/24,
      delay = 1/24,
      index = 2,
      tail = 1/2,
      when = engine.time(),
    } = {}) {
      const notes = [
        [56,58,60,63,72,70],
        [58,60,62,65,72,70],
        [60,62,63,67,72,70],
      ][index].map(engine.fn.fromMidi)

      for (const i in notes) {
        trigger({
          color: 6,
          duration,
          frequency: notes[i] * 2,
          pan: engine.fn.randomFloat(-0.25, 0.25),
          tail,
          when: when + (i * delay),
          width: engine.fn.randomFloat(0.25, 0.75),
        })
      }

      return this
    },
  }
})()
