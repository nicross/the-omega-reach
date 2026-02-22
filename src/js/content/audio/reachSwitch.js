content.audio.reachSwitch = (() => {
  const baseGain = engine.fn.fromDb(-6),
    bus = content.audio.channel.default.createBus()

  function trigger({
    duration,
    frequency,
    when,
  } = {}) {
    const synth = engine.synth.amBuffer({
      buffer: content.audio.buffer.whiteNoise.choose(),
      carrierGain: 0.75,
      modDepth: 0.25,
      modFrequency: engine.fn.randomFloat(10, 20),
      playbackRate: 1,
    }).filtered({
      detune: 8 * 1200,
      frequency: frequency,
    }).connect(bus)

    content.audio.reverb().from(synth)

    synth.filter.detune.exponentialRampToValueAtTime(engine.const.zero, when + duration)

    synth.param.gain.exponentialRampToValueAtTime(baseGain, when + 1/16)
    synth.param.gain.exponentialRampToValueAtTime(engine.const.zeroGain, when + duration)

    synth.param.playbackRate.exponentialRampToValueAtTime(1/32, when + duration)

    synth.stop(when + duration)
  }

  return {
    trigger: function (isOnline) {
      const now = engine.time()

      if (isOnline) {
        trigger({
          duration: 1/2,
          frequency: 1000,
          when: now,
        })
        trigger({
          duration: 3/2,
          frequency: 2000,
          when: now + 1/16,
        })
      } else {
        trigger({
          duration: 1/2,
          frequency: 2500,
          when: now,
        })
        trigger({
          duration: 3/2,
          frequency: 1500,
          when: now + 1/16,
        })
      }
    },
  }
})()
