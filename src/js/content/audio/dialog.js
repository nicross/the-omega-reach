content.audio.dialog = (() => {
  const baseGain = engine.fn.fromDb(-7.5),
    bus = content.audio.channel.default.createBus()

  function trigger({
    color,
    duration,
    frequency,
    pan,
    when,
    width,
  } = {}) {
    // Synthesis
    const synth = engine.synth.pwm({
      detune: engine.fn.randomFloat(-10, 10),
      frequency,
      type: 'triangle',
      when,
      width,
    }).filtered({
      frequency: frequency * color,
    }).chainAssign(
      'panner', engine.context().createStereoPanner()
    ).connect(bus)

    synth.panner.pan.value = pan

    synth.param.gain.linearRampToValueAtTime(baseGain, when + 1/64)
    synth.param.gain.setValueAtTime(baseGain, when + duration - 1/64)
    synth.param.gain.linearRampToValueAtTime(engine.const.zeroGain, when + duration)

    synth.stop(when + duration)
  }

  return {
    trigger: function ({
      duration = 1/24,
      delay = 1/24,
      when = engine.time() + 1/8,
    } = {}) {
      const notes = engine.fn.shuffle([
        60,63,65,67,70,72,
      ]).slice(0, 5).map(engine.fn.fromMidi)

      for (const i in notes) {
        trigger({
          color: engine.fn.scale(i, 0, 4, 0.5, engine.fn.randomFloat(0.5, 1.5)),
          duration,
          frequency: notes[i],
          pan: engine.fn.randomFloat(-0.25, 0.25),
          when: when + (i * delay),
          width: engine.fn.randomFloat(0.25, 0.75),
        })
      }

      return this
    },
  }
})()
