content.audio.cellarInteractives = (() => {
  const baseGain = engine.fn.fromDb(-7.5),
    bus = content.audio.channel.music.createBus(),
    context = engine.context(),
    maxSynths = 8,
    radius = 3,
    synths = []

  let current

  content.audio.reverb().from(bus)

  function createSynth(tile, direction = 0) {
    const current = content.cellar.tiles.current()

    // Ignore z-axis
    const relative = engine.tool.vector2d.create({x: tile.x, y: tile.y})
      .subtract({x: current.x, y: current.y})

    const distance = relative.distance(),
      distanceRatio = engine.fn.clamp(distance / radius / Math.sqrt(2)),
      isDiscovered = content.cellar.discovered.is(tile),
      isFullyScanned = tile.isFullyScanned(),
      isHere = distance == 0,
      isNearDeath = content.cellar.health.amount() <= 1,
      isUp = relative.y >= 0,
      normal = relative.normalize()

    const gain = engine.fn.fromDb(
        engine.fn.lerp(0, tile.isUnique ? -7.5 : -12, distanceRatio)
      + (isFullyScanned && !tile.isUnique ? -6 : 0)
    )

    const rootFrequency = engine.fn.detune(
      engine.fn.fromMidi(42 + tile.note),
      (
          engine.fn.scale(Math.abs(relative.x), 0, radius, 0, 1800)
        + engine.fn.scale(relative.y, -radius, radius, -1200, 1200)
      )
    )

    const amDepth = gain * engine.fn.fromDb(tile.isUnique ? -6 : -12),
      when = engine.time()

    const synth = engine.synth.pwm({
      detune: engine.fn.randomFloat(-50, 50),
      frequency: rootFrequency,
      gain: gain - amDepth,
      type: tile.synthType || (isUp && !isFullyScanned ? 'triangle' : 'sine'),
      width: engine.fn.randomFloat(0.375, 0.625),
      when,
    }).chainAssign(
      'panner', context.createStereoPanner()
    ).chainAssign(
      'fader', context.createGain()
    ).filtered({
      frequency: rootFrequency,
    }).connect(bus)

    // Amplitude LFO
    synth.assign('am', engine.synth.lfo({
      depth: amDepth,
      frequency: tile.isUnique ? tile.prime/7 : 5/tile.prime * engine.fn.lerp(1, 0.75, distanceRatio),
      when,
    }))

    synth.am.connect(synth.param.gain)
    synth.chainStop(synth.am)

    // Color LFO
    synth.assign('cm', engine.synth.lfo({
      depth: 600,
      frequency: tile.isUnique ? tile.prime/8 : 7/tile.prime * engine.fn.lerp(1, 0.5, distanceRatio),
      when,
    }))

    synth.cm.connect(synth.filter.detune)
    synth.chainStop(synth.cm)

    // Detune LFO
    synth.assign('dm', engine.synth.lfo({
      depth: 100,
      frequency: tile.isUnique ? tile.prime/9 : 2/tile.prime * engine.fn.lerp(1, 0.5, distanceRatio),
      when,
    }))

    synth.dm.connect(synth.param.detune)
    synth.chainStop(synth.dm)

    // Width LFO
    synth.assign('wm', engine.synth.lfo({
      depth: 0.125,
      frequency: tile.isUnique ? tile.prime/10 : 3/tile.prime * engine.fn.lerp(1, 0.5, distanceRatio),
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
    const distancesByTile = new Map(),
      isNearDeath = content.cellar.health.amount() <= 1,
      position = content.cellar.position.get(),
      scansByTile = new Map(),
      tiles = []

    for (let x = -radius; x <= radius; x += 1) {
      for (let y = -radius; y <= radius; y += 1) {
        const here = position.add({x, y})

        // Prevent early discovery of uniques
        if (!content.cellar.discovered.is(here)) {
          continue
        }

        const tile = content.cellar.tiles.get(here)
        const effects = tile.getEffects()

        distancesByTile.set(tile, engine.fn.distance(position, tile))
        scansByTile.set(tile, tile.isFullyScanned() ? 1 : 0)

        if (tile.alwaysAudible || (effects.length && (!isNearDeath || content.cellar.discovered.is(tile)))) {
          tiles.push(tile)
        }
      }
    }

    // [...unscanned sorted by distance asc, ...scanned sorted by distance asc]
    tiles.sort((a, b) => {
      if (a.alwaysAudible) {
        return -1
      }

      if (b.alwaysAudible) {
        return 1
      }

      const scanA = scansByTile.get(a),
        scanB = scansByTile.get(b)

      return scanA == scanB
        ? distancesByTile.get(a) - distancesByTile.get(b)
        : scanA - scanB
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

        if (force || !current || current.x != next.x || current.y != next.y || current.z != next.z) {
          trigger(
            engine.tool.vector2d.create(next).subtract(current).normalize().x
          )

          current = {x: next.x, y: next.y, z: next.z}
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
