content.audio.cellarInteractives = (() => {
  const baseGain = engine.fn.fromDb(-9),
    bus = content.audio.channel.music.createBus(),
    context = engine.context(),
    maxSynths = 8,
    synths = []

  let current

  content.audio.reverb().from(bus)

  function createSynth(tile, direction = 0) {
    const relative = engine.tool.vector2d.create(tile)
      .subtract(content.cellar.tiles.current())

    const distance = relative.distance(),
      distanceRatio = engine.fn.clamp(distance / 2 / Math.sqrt(2)),
      isDiscovered = content.cellar.discovered.is(tile),
      isHere = distance == 0,
      isNearDeath = content.cellar.health.amount() <= 1,
      normal = relative.normalize()

    const rootFrequency = isHere ? engine.fn.fromMidi(36 + tile.note) : (engine.fn.fromMidi(48 + tile.note) * distance)

    const amDepth = engine.fn.fromDb(-7.5),
      gain = engine.fn.fromDb((isHere ? 0 : -4.5) + engine.fn.lerp(0, -3, distanceRatio)),
      when = engine.time()

    const synth = engine.synth.pwm({
      detune: engine.fn.randomFloat(-50, 50),
      frequency: rootFrequency,
      gain: gain - amDepth,
      type: 'sine',
      width: engine.fn.randomFloat(0.25, 0.75),
      when,
    }).chainAssign(
      'panner', context.createStereoPanner()
    ).chainAssign(
      'fader', context.createGain()
    ).filtered({
      detune: -600,
      frequency: rootFrequency,
    }).connect(bus)

    // Amplitude LFO
    synth.assign('am', engine.synth.lfo({
      depth: amDepth,
      frequency: 5/tile.prime * engine.fn.lerp(1, 0.75, distanceRatio),
      when,
    }))

    synth.am.connect(synth.param.gain)
    synth.chainStop(synth.am)

    // Color LFO
    synth.assign('cm', engine.synth.lfo({
      depth: 600,
      frequency: 7/tile.prime * engine.fn.lerp(1, 0.5, distanceRatio),
      when,
    }))

    synth.cm.connect(synth.filter.detune)
    synth.chainStop(synth.cm)

    // Detune LFO
    synth.assign('dm', engine.synth.lfo({
      depth: 100,
      frequency: 2/tile.prime * engine.fn.lerp(1, 0.5, distanceRatio),
      when,
    }))

    synth.dm.connect(synth.param.detune)
    synth.chainStop(synth.dm)

    // Width LFO
    synth.assign('wm', engine.synth.lfo({
      depth: 0.125,
      frequency: 3/tile.prime * engine.fn.lerp(1, 0.5, distanceRatio),
      when,
    }))

    synth.wm.connect(synth.param.width)
    synth.chainStop(synth.wm)

    // Fader
    const attack = (isHere || isNearDeath) ? 1/8 : (distance/4),
      panAttack = 1/4

    synth.panner.pan.value = direction
    synth.panner.pan.setValueAtTime(direction, when)
    synth.panner.pan.linearRampToValueAtTime(normal.x, when + panAttack)

    synth.fader.gain.value = 0
    synth.fader.gain.setValueAtTime(0, when)
    synth.fader.gain.linearRampToValueAtTime(baseGain / maxSynths, when + attack)

    return synth
  }

  function destroySynths(direction = 0) {
    const now = engine.time(),
      release = 1/16

    for (const synth of synths) {
      engine.fn.rampLinear(synth.fader.gain, 0, release)
      engine.fn.rampLinear(synth.panner.pan, direction, release)
      synth.stop(now + release)
    }

    synths.length = 0
  }

  function getTiles() {
    const isNearDeath = content.cellar.health.amount() <= 1,
      position = content.cellar.position.get(),
      tiles = []

    for (let x = -2; x <= 2; x += 1) {
      for (let y = -2; y <= 2; y += 1) {
        const tile = content.cellar.tiles.get(
          position.add({x, y})
        )

        const scans = content.cellar.scans.get(tile)

        if (tile.effects.length && tile.effects.length > scans && (!isNearDeath || content.cellar.discovered.is(tile))) {
          tiles.push(tile)
        }
      }
    }

    const distances = new Map()

    tiles.sort((a, b) => {
      if (!distances.has(a)) {
        distances.set(a, engine.fn.distance(position, a))
      }

      if (!distances.has(b)) {
        distances.set(b, engine.fn.distance(position, b))
      }

      return distances.get(b) - distances.get(b)
    })

    return tiles.slice(0, maxSynths)
  }

  function trigger(direction = 0) {
    destroySynths(-direction)

    for (const tile of getTiles()) {
      synths.push(
        createSynth(tile, direction)
      )
    }
  }

  return {
    getTiles,
    import: function () {
      this.update()

      return this
    },
    reset: function () {
      current = undefined

      destroySynths()

      return this
    },
    update: function (force = false) {
      const isCellar = content.location.is('cellar')

      if (isCellar) {
        const next = content.cellar.position.get()

        if (force || !current || current.x != next.x || current.y != next.y) {
          trigger(
            engine.tool.vector2d.create(next).subtract(current).normalize().x
          )

          current = {x: next.x, y: next.y}
        }
      } else if (synths.length) {
        destroySynths()
        current = undefined
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

    content.audio.cellarInteractives.update()
  })

  engine.state.on('import', () => content.audio.cellarInteractives.import())
  engine.state.on('reset', () => content.audio.cellarInteractives.reset())
})
