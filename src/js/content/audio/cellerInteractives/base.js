content.audio.cellarInteractives.base = {
  extend: function (definition = {}) {
    return engine.fn.extend(this, definition)
  },
  instantiate: function (options) {
    const instance = Object.create(this)
    instance.create(options)
    return instance
  },
  // Lifecycle
  create: function ({
    bus,
    direction = 0,
    radius = 3,
    tile,
  } = {}) {
    const current = content.cellar.tiles.current()
    const relative = engine.tool.vector2d.create({x: tile.x, y: tile.y})
      .subtract({x: current.x, y: current.y})

    const distance = relative.distance(),
      distanceRatio = engine.fn.clamp(distance / radius / Math.sqrt(2))

    this.options = {
      distanceRatio,
      radius,
      relative,
      tile,
    }

    // Determine circuit parameters
    const isDiscovered = content.cellar.discovered.is(tile),
      isFullyScanned = tile.isFullyScanned(),
      isHere = distance == 0,
      isNearDeath = content.cellar.health.amount() <= 1,
      normal = relative.normalize()

    const gain = engine.fn.fromDb(
        engine.fn.lerp(0, tile.isUnique || isNearDeath ? -9 : -12, distanceRatio)
      + (isFullyScanned && !tile.isUnique && !isNearDeath ? -6 : 0)
    )

    const attack = (isHere || isNearDeath) ? 1/8 : (distance/4),
      panAttack = 1/4

    // Create circuit
    const context = engine.context(),
      now = engine.time()

    this.input = context.createGain()
    this.panner = context.createStereoPanner()
    this.output = context.createGain()

    this.input.connect(this.panner)
    this.panner.connect(this.output)
    this.output.connect(bus)

    this.panner.pan.value = direction
    this.panner.pan.setValueAtTime(direction, now)
    this.panner.pan.linearRampToValueAtTime(normal.x, now + panAttack)

    this.output.gain.value = 0
    this.output.gain.setValueAtTime(0, now)
    this.output.gain.linearRampToValueAtTime(gain, now + attack)

    // Create synth
    this.createSynth()

    return this
  },
  createSynth: function () {},
  destroy: function ({
    direction = 0,
  } = {}) {
    const context = engine.context(),
      now = engine.time(),
      release = 1/16

    const timer = context.createConstantSource()
    timer.start(now)
    timer.stop(now + release)

    engine.fn.rampLinear(this.panner.pan, direction, release)
    engine.fn.rampLinear(this.output.gain, engine.const.zeroGain, release)

    timer.onended = () => {
      this.output.disconnect()
    }

    return this
  },
  destroySynth: function () {},
}
