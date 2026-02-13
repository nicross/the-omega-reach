content.programs.base = {
  // Attributes
  id: undefined,
  channel: 'default',
  hasSynths: false,
  fieldDefinitions: {
    // Hash of names to objects for engine.fn.createNoise()
  },
  fields: {
    // Hash of named fields for this instance
  },
  options: {},
  propertyGenerators: {
    // Hash of names to function (srand) {}
    // These are values that only need to be generated once
  },
  properties: {
    // Hash of generated values for this instance
  },
  // Methods
  create: function (...args) {
    const instance = Object.create(this)
    instance.load(...args)
    return instance
  },
  destroy: function () {
    this.unload()

    return this
  },
  extend: function (definition) {
    return engine.fn.extend(this, definition)
  },
  // Lifecycle
  load: function (options = {}) {
    this.destination = content.audio.channel[this.channel].createBus()
    this.options = {...options}
    this.synths = new Map()

    this.loadFields()
    this.loadProperties()

    this.onLoad()

    return this
  },
  loadFields: function () {
    this.fields = {}

    for (const [name, definition] of Object.entries(this.fieldDefinitions)) {
      this.fields[name] = engine.fn.createNoise({
        ...definition,
        seed: [this.id, this.options.seed, ...definition.seed],
      })

      engine.ephemera.add(this.fields[name])
    }

    return this
  },
  loadProperties: function () {
    this.properties = {}

    for (const [name, generator] of Object.entries(this.propertyDefinitions)) {
      this.properties[name] = generator.call(this, {
        srand: engine.fn.srand(this.id, this.options.seed, name),
      })
    }

    return this
  },
  onLoad: function () {},
  onUnload: function () {},
  onUpdate: function () {},
  unload: function () {
    this.unloadFields()
    this.unloadProperties()
    this.unloadSynths()

    this.onUnload()

    return this
  },
  unloadFields: function () {
    for (const [name, field] of Object.entries(this.fields)) {
      engine.ephemera.remove(field)
    }

    this.fields = {}

    return this
  },
  unloadProperties: function () {
    this.properties = {}

    return this
  },
  unloadSynths: function () {
    for (const synth of this.synths.values()) {
      synth.off()
    }

    this.synths.clear()

    return this
  },
  update: function (options = {}) {
    this.updateSynths(options)

    return this
  },
  updateSynths: function ({
    points = [],
  } = {}) {
    console.log(points)

    if (!this.hasSynths) {
      return this
    }

    points = new Set(points)

    // Update or destroy current synths
    for (const [point, synth] of this.synths.entries()) {
      if (points.has(point)) {
        synth.update(point)
      } else {
        synth.stop()
        this.synths.delete(point)
      }
    }

    // Create new synths
    for (const point of points) {
      if (!this.synths.has(point)) {
        const wrapper = this.createSynthWrapper(point)
        this.createSynth({point, wrapper})
        this.synths.set(point, wrapper)
      }
    }

    return this
  },
  // Synthesis - override createSynth as needed
  createSynth: function ({point, wrapper}) {},
  createSynthWrapper: function (point) {
    const attack = 1/16,
      baseGain = engine.fn.fromDb(-6)/8,
      context = engine.context(),
      release = 1/16

    const wrapper = {
      filter: context.createBiquadFilter(),
      input: context.createGain(),
      maxColor: 8,
      minColor: 0.5,
      rootFrequency: 440,
      panner: context.createStereoPanner(),
      onUpdate: () => {},
      onStop: () => {},
      stop: async function () {
        engine.fn.rampLinear(this.input.gain, 0, release)
        await engine.fn.promise(release * 1000)

        this.onStop()

        this.filter.disconnect()
        this.input.disconnect()
        this.panner.disconnect()

        return this
      },
      update: function (point) {
        this.onUpdate()

        engine.fn.setParam(wrapper.filter.frequency, wrapper.rootFrequency * engine.fn.scale(point.x, -1, 1, wrapper.minColor, wrapper.maxColor))
        engine.fn.setParam(wrapper.panner.pan, -point.y)

        return this
      }
    }

    wrapper.input.connect(wrapper.panner)
    wrapper.panner.connect(wrapper.filter)
    wrapper.filter.connect(this.destination)

    wrapper.filter.frequency.value = wrapper.rootFrequency * engine.fn.scale(point.x, -1, 1, wrapper.minColor, wrapper.maxColor)
    wrapper.panner.pan.value = -point.y

    wrapper.input.gain.value = 0
    engine.fn.rampLinear(wrapper.input.gain, baseGain, attack)

    return wrapper
  },
  // TODO: Particles
}
