content.audio.reachGalaxy = (() => {
  const allowedRooms = new Set(['galaxy','star','planet','moon']),
    baseGain = engine.fn.fromDb(-12),
    bus = content.audio.channel.default.createBus(),
    context = engine.context(),
    primes = [107, 109, 113],
    rootNote = 36 + (12 * 0)

  let current,
    synth

  function createSynth() {
    if (synth) {
      return
    }

    const index = current.index,
      prime = primes[index % primes.length],
      scale = current.scale

    const rootFrequency = engine.fn.fromMidi(rootNote + scale[index % scale.length])

    synth = engine.synth.pwm({
      frequency: rootFrequency,
      gain: 0.75,
      type: 'sawtooth',
    }).filtered({
      detune: 0,
      frequency: rootFrequency,
    }).chainAssign(
      'panner', context.createStereoPanner()
    ).chainAssign(
      'fader', context.createGain()
    ).connect(bus)

    content.audio.reverb().from(synth)

    // Gain LFO
    synth.assign('am', engine.synth.lfo({
      depth: 0.25,
      frequency: prime/17,
    }))

    synth.am.connect(synth.param.gain)
    synth.chainStop(synth.am)

    // Color LFO
    synth.assign('cm', engine.synth.lfo({
      depth: -1200,
      frequency: 1/(prime/2),
    }))

    synth.cm.connect(synth.filter.detune)
    synth.chainStop(synth.cm)

    // Pan LFO
    synth.assign('pm', engine.synth.lfo({
      depth: [-1, 1][index % 2] * 1,
      frequency: 1/(prime/3),
    }))

    synth.pm.connect(synth.panner.pan)
    synth.chainStop(synth.pm)

    // Width LFO
    synth.assign('wm', engine.synth.lfo({
      depth: 0.25,
      frequency: 1/(prime),
    }))

    synth.wm.connect(synth.param.width)
    synth.chainStop(synth.wm)

    const attack = 1
    synth.fader.gain.value = 0
    engine.fn.rampLinear(synth.fader.gain, baseGain, attack)
  }

  function destroySynth() {
    if (!synth) {
      return
    }

    const now = engine.time(),
      release = 1/4

    engine.fn.rampLinear(synth.fader.gain, 0, release)
    synth.stop(now + release)

    synth = undefined
  }

  function updateCurrent() {
    const roomId = content.location.id()

    if (allowedRooms.has(roomId)) {
      const next = content.rooms.galaxy.getGalaxy()

      if (current !== next && synth) {
        destroySynth()
      }

      current = next
    } else {
      current = undefined
    }
  }

  return {
    import: function () {
      return this.update()
    },
    reset: function () {
      current = undefined

      if (synth) {
        destroySynth()
      }

      return this
    },
    update: function () {
      updateCurrent()

      if (current) {
        if (!synth) {
          createSynth()
        }
      } else if (synth) {
        destroySynth()
      }

      return this
    },
  }
})()

engine.ready(() => {

  engine.loop.on('frame', ({paused}) => {
    if (paused) {
      return
    }

    content.audio.reachGalaxy.update()
  })

  engine.state.on('import', () => content.audio.reachGalaxy.import())
  engine.state.on('reset', () => content.audio.reachGalaxy.reset())

})
