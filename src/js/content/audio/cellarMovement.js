content.audio.cellarMovement = (() => {
  const baseGain = engine.fn.fromDb(-6),
    bus = content.audio.channel.default.createBus()

  const directions = {
    down: 63,
    left: 70,
    right: 67,
    up: 72,
  }

  function trigger({
    color = 0.25,
    detune = engine.fn.randomFloat(-10, 10),
    direction = 'up',
    duration = 1,
    width = engine.fn.randomFloat(0.25, 0.75),
    when = engine.time(),
  } = {}) {
    const frequency = engine.fn.fromMidi(directions[direction] + 12)

    // Synthesis
    const synth = engine.synth.pwm({
      detune: 1200,
      frequency,
      type: 'square',
      when,
      width,
    }).filtered({
      frequency: frequency * color,
    }).connect(bus)

    synth.param.gain.linearRampToValueAtTime(baseGain, when + 1/64)
    synth.param.gain.linearRampToValueAtTime(baseGain/8, when + 1/16)
    synth.param.gain.linearRampToValueAtTime(engine.const.zeroGain, when + duration)

    synth.param.detune.linearRampToValueAtTime(detune, when + 1/16)
    synth.param.width.linearRampToValueAtTime(0.5, when + duration)

    synth.stop(when + duration)

    return this
  }

  return {
    down: function () {
      trigger({
        direction: 'down',
      })

      return this
    },
    left: function () {
      trigger({
        direction: 'left',
      })

      return this
    },
    right: function () {
      trigger({
        direction: 'right',
      })

      return this
    },
    up: function () {
      trigger({
        direction: 'up',
      })

      return this
    },
  }
})()
