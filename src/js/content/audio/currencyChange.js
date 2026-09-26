content.audio.currencyChange = (() => {
  const baseGain = engine.fn.fromDb(-6),
    bus = content.audio.channel.sfx.createBus()

  function trigger({
    color,
    duration,
    frequency,
    isUp,
    pan,
    when,
    width,
  } = {}) {
    const detune = engine.fn.randomFloat(-10, 10)

    // Synthesis
    const synth = engine.synth.pwm({
      detune,
      frequency,
      type: 'triangle',
      when,
      width,
    }).filtered({
      frequency: frequency * color,
    }).connect(bus)

    synth.param.gain.linearRampToValueAtTime(baseGain, when + 1/64)
    synth.param.gain.setValueAtTime(baseGain, when + duration - 1/64)
    synth.param.gain.linearRampToValueAtTime(engine.const.zeroGain, when + duration)

    synth.param.detune.setValueAtTime(detune, when + duration/4)
    synth.param.detune.linearRampToValueAtTime(isUp ? 1200 : -1200, when + duration/2)

    synth.stop(when + duration)
  }

  return {
    trigger: function ({
      duration = 1/12,
      delay = 1/24,
      isUp = false,
      when = engine.time(),
    } = {}) {
      const notes = engine.fn.shuffle([
        60,63,65,67,70,72,75,77,79,
      ]).slice(0, 3).map(engine.fn.fromMidi)

      notes.sort((a, b) => isUp ? a - b : b - a)

      for (const i in notes) {
        when += (i * delay) + engine.fn.randomFloat(0, 1/18)

        trigger({
          color: isUp ? engine.fn.scale(i, 0, 2, 0.5, 1) : engine.fn.scale(i, 0, 2, 1, 0.5),
          duration,
          frequency: notes[i],
          isUp,
          when,
          width: engine.fn.randomFloat(0.25, 0.75),
        })
      }

      return this
    },
  }
})()
