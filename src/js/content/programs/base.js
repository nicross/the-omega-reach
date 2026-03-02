content.programs.base = {
  // Attributes
  id: undefined,
  channel: 'default',
  hasReverb: false,
  hasSynths: true,
  fieldDefinitions: {
    // Hash of names to objects for engine.fn.createNoise()
    rumble3d: {},
  },
  fields: {
    // Hash of named fields for this instance
  },
  options: {},
  propertyDefinitions: {
    // Hash of names to function (srand) {}
    // These are values that only need to be generated once
  },
  properties: {
    // Hash of generated values for this instance
  },
  defaultState: {},
  state: {},
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
    const prototype = engine.fn.extend(this, definition)

    prototype.defaultState = {
      ...(this.defaultState || {}),
      ...(definition.defaultState || {}),
    }

    prototype.fieldDefinitions = {
      ...(this.fieldDefinitions || {}),
      ...(definition.fieldDefinitions || {}),
    }

    prototype.propertyDefinitions = {
      ...(this.propertyDefinitions || {}),
      ...(definition.propertyDefinitions || {}),
    }

    return prototype
  },
  // Lifecycle
  load: function (options = {}) {
    this.destination = content.audio.channel[this.channel].createBus()
    this.options = {...options}
    this.state = {...this.defaultState}
    this.synths = new Map()

    if (this.hasReverb) {
      content.audio.reverb().from(this.destination)
    }

    this.loadFields()
    this.loadProperties()

    this.onLoad()

    return this
  },
  loadFields: function () {
    this.fields = {}

    for (const [name, definition] of Object.entries(this.fieldDefinitions)) {
      this.fields[name] = engine.fn.createNoise({
        octaves: 1,
        type: 'simplex3d',
        ...definition,
        seed: [this.id, this.options.seed, name],
      })

      this.fields[name].valueAt = function (point, scale, timeScale) {
        scale *= engine.tool.simplex3d.prototype.skewFactor
        return this.value(point.x * scale, point.y * scale, point.z * scale, point.time * timeScale)
      }

      engine.ephemera.add(this.fields[name])
    }

    return this
  },
  loadProperties: function () {
    this.properties = {}

    for (const [name, generator] of Object.entries(this.propertyDefinitions)) {
      this.properties[name] = generator.call(this, engine.fn.srand(this.id, this.options.seed, name))
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
      synth.stop()
    }

    this.synths.clear()

    return this
  },
  update: function (options = {}) {
    this.updateSynths(options)
    this.onUpdate()

    return this
  },
  updateSynths: function ({
    points = [],
  } = {}) {
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
  calculateParameters: function (point) {
    const rootFrequency = engine.fn.fromMidi(48)

    const value = Math.max(
      content.solution.has() ? engine.fn.clamp(engine.fn.scale(engine.fn.distance(point, content.solution.get()), 1, 1/3, 0, 1)) ** 2 : 0,
      this.getRumbleRotated(point)
    )

    return {
      color: engine.fn.lerp(3, 4, value),
      detune: engine.fn.lerp(-1200, 0, value),
      fmDepth: rootFrequency * engine.fn.lerp(1/6, 1, value),
      fmFrequency: engine.fn.lerp(4, 16, value),
      frequency: rootFrequency,
      gain: engine.fn.fromDb(-7.5, -3, value),
    }
  },
  createSynth: function ({point, wrapper}) {
    const {
      color,
      detune,
      fmDepth,
      fmFrequency,
      frequency,
      gain,
    } = this.calculateParameters(point)

    wrapper.maxColor = color
    wrapper.minColor = 2
    wrapper.rootFrequency = frequency

    const synth = engine.synth.pwm({
      detune,
      gain,
      frequency,
      type: 'triangle',
    }).connect(wrapper.input)

    synth.assign('fm', engine.synth.lfo({
      depth: fmDepth,
      detune: detune,
      frequency: fmFrequency,
    }))

    synth.fm.connect(synth.param.frequency)
    synth.chainStop(synth.fm)

    wrapper.onStop = () => synth.stop()

    wrapper.onUpdate = () => {
      const {
        color,
        detune,
        fmDepth,
        fmFrequency,
        gain,
      } = this.calculateParameters(point)

      wrapper.maxColor = color

      engine.fn.setParam(synth.param.detune, detune)
      engine.fn.setParam(synth.param.fm.detune, detune)
      engine.fn.setParam(synth.param.fm.depth, fmDepth)
      engine.fn.setParam(synth.param.fm.frequency, fmFrequency)
      engine.fn.setParam(synth.param.gain, gain)
    }
  },
  createSynthWrapper: function (point) {
    const _this = this

    const attack = 1/32,
      baseGain = engine.fn.fromDb(-4.5),
      context = engine.context(),
      depth = point.depth || 1,
      release = 1/32

    const wrapper = {
      filter: context.createBiquadFilter(),
      input: context.createGain(),
      output: context.createGain(),
      maxColor: 8,
      minColor: 0.5,
      rootFrequency: 440,
      panner: context.createStereoPanner(),
      onUpdate: () => {},
      onStop: () => {},
      stop: async function () {
        engine.fn.rampLinear(this.output.gain, 0, release)
        await engine.fn.promise(release * 1000)

        this.onStop()

        this.filter.disconnect()
        this.input.disconnect()
        this.panner.disconnect()

        return this
      },
      update: function (point) {
        const depth = point.depth || 1

        this.onUpdate(point)

        engine.fn.setParam(wrapper.filter.frequency, wrapper.rootFrequency * engine.fn.scale((_this.invertSynthX() ? -1 : 1) * point.x, -1, 1, wrapper.minColor, engine.fn.lerp(wrapper.minColor, wrapper.maxColor, depth)))
        engine.fn.setParam(wrapper.input.gain, depth * baseGain / ((1+_this.synths.size)*0.5))
        engine.fn.setParam(wrapper.panner.pan, point.y)

        return this
      }
    }

    wrapper.input.connect(wrapper.panner)
    wrapper.panner.connect(wrapper.filter)
    wrapper.filter.connect(wrapper.output)
    wrapper.output.connect(this.destination)

    wrapper.filter.frequency.value = wrapper.rootFrequency * engine.fn.scale((_this.invertSynthX() ? -1 : 1) * point.x, -1, 1, wrapper.minColor, engine.fn.lerp(wrapper.minColor, wrapper.maxColor, depth))
    wrapper.input.gain.value = 0
    wrapper.panner.pan.value = point.y

    wrapper.output.gain.value = 0
    engine.fn.setParam(wrapper.output.gain, 0)
    engine.fn.rampLinear(wrapper.output.gain, baseGain, attack)

    this.decorateSynthWrapper(wrapper)

    return wrapper
  },
  decorateSynthWrapper: (wrapper) => {},
  invertSynthX: () => false,
  // Particles
  alterParticle: function (particle) {},
  alterParticleUnscanned: function (particle) {
    const index = content.sphereIndex.get()

    particle.target.h = 0
    particle.target.s = 0
    particle.target.v = 0.25
    particle.target.x = particle.spheres[index].x
    particle.target.y = particle.spheres[index].y
    particle.target.z = particle.spheres[index].z
  },
  getLightSource: () => engine.tool.vector3d.create(),
  getRotation: function () {
    return engine.tool.quaternion.identity()
  },
  // Haptics
  getRumble: function (point) {
    return this.useNavigationalRumble()
      ? this.getNavigationalRumble(point)
      : this.fields.rumble3d.valueAt(point, 1)
  },
  getRumbleRotated: function (point) {
    return this.getRumble(
      engine.tool.vector3d.create(point).rotateQuaternion(
        this.getRotation()
      ).invertZ()
    )
  },
  useNavigationalRumble: () => false,
  getNavigationalRumble: function (point) {
    const location = content.location.get()

    const vectors = [
      engine.tool.vector3d.unitZ(),
      engine.tool.vector3d.unitZ().inverse(),
    ]

    if (!location.canMoveDown()) {
      vectors.push(engine.tool.vector3d.unitX())
    }

    if (!location.canMoveLeft()) {
      vectors.push(engine.tool.vector3d.unitY().inverse())
    }

    if (!location.canMoveRight()) {
      vectors.push(engine.tool.vector3d.unitY())
    }

    if (!location.canMoveUp()) {
      vectors.push(engine.tool.vector3d.unitX().inverse())
    }

    const test = {
      x: Math.sign(point.x) * (Math.abs(point.x)) ** 3,
      y: Math.sign(point.y) * (Math.abs(point.y)) ** 3,
      z: Math.sign(point.z) * (Math.abs(point.z)) ** 3,
    }

    return vectors.reduce((value, vector) => {
      return Math.max(vector.dotProduct(test), value)
    }, 0)
  },
}
