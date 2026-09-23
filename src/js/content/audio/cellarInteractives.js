content.audio.cellarInteractives = (() => {
  const baseGain = engine.fn.fromDb(-9),
    bus = content.audio.channel.music.createBus(),
    context = engine.context(),
    maxSynths = 8,
    radius = 3,
    synths = []

  const buses = {
    music: content.audio.channel.music.createBus(),
    sfx: content.audio.channel.sfx.createBus(),
  }

  let current

  for (const bus of Object.values(buses)) {
    content.audio.reverb().from(bus)
    bus.gain.value = baseGain / maxSynths
  }

  function createSynth(tile, direction = 0) {
    const options = {
      bus: tile.isUnique ? buses.sfx : buses.music,
      direction,
      radius,
      tile,
    }

    return content.audio.cellarInteractives.generic.instantiate(options)
  }

  function destroySynths(direction = 0) {
    const options = {
      direction,
    }

    for (const synth of synths) {
      synth.destroy(options)
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
    synths: () => synths,
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
