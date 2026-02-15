content.programs.instrument = content.programs.invent({
  id: 'instrument',
  hasReverb: true,
  hasSynths: true,
  onLoad: function () {
    content.sphereIndex.randomize()
    return this
  },
  fieldDefinitions: {
    // Synthesis
    amDepth: {},
    amFrequency: {},
    cmDepth: {},
    cmFrequency: {},
    color: {},
    detune: {},
    dmDepth: {},
    dmFrequency: {},
    frequency: {},
    fmDepth: {},
    fmDetune: {},
    fmFrequency: {},
    width: {},
    wmDepth: {},
    wmFrequency: {},
    // TODO: haptics
    // Particles
    particleHue: {},
    particleSaturation: {},
    particleValue: {},
    particleRadius: {},
  },
  propertyDefinitions: {
    // Synthesis
    amType: (srand) => engine.fn.choose(['sine','triangle'], srand()),
    amDepthCenter: (srand) => srand(),
    amDepthRange: function (srand) {return srand() * this.options.instrument.rarity * 0.5},
    amDepthScale: function (srand) {return srand() * (1 - this.options.instrument.rarity)},
    amFrequencyCenter: (srand) => srand(),
    amFrequencyRange: function (srand) {return srand() * this.options.instrument.rarity * 0.5},
    amFrequencyScale: function (srand) {return srand() * (1 - this.options.instrument.rarity)},
    cmType: (srand) => engine.fn.choose(['sine','sine','triangle','triangle','square','sawtooth'], srand()),
    cmDepthCenter: (srand) => srand(),
    cmDepthRange: function (srand) {return srand() * this.options.instrument.rarity * 0.5},
    cmDepthScale: function (srand) {return srand() * (1 - this.options.instrument.rarity)},
    cmFrequencyCenter: (srand) => srand(),
    cmFrequencyRange: function (srand) {return srand() * this.options.instrument.rarity * 0.5},
    cmFrequencyScale: function (srand) {return srand() * (1 - this.options.instrument.rarity)},
    carrierType: (srand) => engine.fn.choose(['sine','triangle','square','sawtooth'], srand()),
    colorCenter: function (srand) {return engine.fn.lerp(srand(), 0.5, this.options.instrument.rarity)},
    colorRange: function (srand) {return engine.fn.lerp(srand(), 1, this.options.instrument.rarity) * 0.5},
    colorScale: function (srand) {return srand() * (1 - this.options.instrument.rarity)},
    detuneRange: function (srand) {return srand() * this.options.instrument.rarity * 0.5},
    detuneScale: function (srand) {return srand() * (1 - this.options.instrument.rarity)},
    dmType: (srand) => engine.fn.choose(['sine','sine','triangle','triangle','square','sawtooth'], srand()),
    dmDepthCenter: (srand) => srand(),
    dmDepthRange: function (srand) {return srand() * this.options.instrument.rarity * 0.5},
    dmDepthScale: function (srand) {return srand() * (1 - this.options.instrument.rarity)},
    dmFrequencyCenter: (srand) => srand(),
    dmFrequencyRange: function (srand) {return srand() * this.options.instrument.rarity * 0.5},
    dmFrequencyScale: function (srand) {return srand() * (1 - this.options.instrument.rarity)},
    frequencyCenter: (srand) => srand(),
    frequencyRange: function (srand) {return engine.fn.lerp(srand(), 1, this.options.instrument.rarity) * 0.5},
    frequencyScale: function (srand) {return srand() * (1 - this.options.instrument.rarity)},
    fmType: (srand) => engine.fn.choose(['sine','triangle','square','sawtooth'], srand()),
    fmDepthCenter: (srand) => srand(),
    fmDepthRange: function (srand) {return srand() * this.options.instrument.rarity * 0.5},
    fmDepthScale: function (srand) {return srand() * (1 - this.options.instrument.rarity)},
    fmDetuneRange: function (srand) {return srand() * this.options.instrument.rarity * 0.5},
    fmDetuneScale: function (srand) {return srand() * (1 - this.options.instrument.rarity)},
    fmFrequencyCenter: (srand) => srand(),
    fmFrequencyRange: function (srand) {return srand() * this.options.instrument.rarity * 0.5},
    fmFrequencyScale: function (srand) {return srand() * (1 - this.options.instrument.rarity)},
    scale: (srand) => srand(),
    widthCenter: (srand) => srand(),
    widthRange: function (srand) {return srand() * this.options.instrument.rarity * 0.25},
    widthScale: function (srand) {return srand() * (1 - this.options.instrument.rarity)},
    wmType: (srand) => engine.fn.choose(['sine','sine','triangle','triangle','square','sawtooth'], srand()),
    wmDepthCenter: (srand) => srand(),
    wmDepthRange: function (srand) {return srand() * this.options.instrument.rarity * 0.25},
    wmDepthScale: function (srand) {return srand() * (1 - this.options.instrument.rarity)},
    wmFrequencyCenter: (srand) => srand(),
    wmFrequencyRange: function (srand) {return srand() * this.options.instrument.rarity * 0.5},
    wmFrequencyScale: function (srand) {return srand() * (1 - this.options.instrument.rarity)},
    // TODO: Haptics
    // Particles
    particleRadiusScale: function (srand) {return engine.fn.lerp(1, 4, (srand() * 0.5) + (this.options.instrument.rarity * 0.5))},
    particleHueCenter: (srand) => srand(),
    particleHueRange: function (srand) {return (srand() * 0.5) + (this.options.instrument.rarity * 0.5)},
    particleHueScale: function (srand) {return engine.fn.lerp(1, 4, (srand() * 0.5) + (this.options.instrument.rarity * 0.5))},
    particleHueMax: function () {return this.properties.particleHueCenter + this.properties.particleHueRange},
    particleHueMin: function () {return this.properties.particleHueCenter - this.properties.particleHueRange},
    particleSaturationCenter: (srand) => engine.fn.lerp(0, 1, srand()),
    particleSaturationRange: function (srand) {return ((srand() * 0.5) + (this.options.instrument.rarity * 0.5))},
    particleSaturationScale: function (srand) {return engine.fn.lerp(1, 4, (srand() * 0.5) + (this.options.instrument.rarity * 0.5))},
    particleSaturationMax: function () {return engine.fn.clamp(this.properties.particleSaturationCenter + this.properties.particleSaturationRange)},
    particleSaturationMin: function () {return engine.fn.clamp(this.properties.particleSaturationCenter - this.properties.particleSaturationRange)},
    particleValueCenter: (srand) => engine.fn.lerp(0.75, 1, srand()),
    particleValueRange: function (srand) {return ((srand() * 0.5) + (this.options.instrument.rarity * 0.5)) * 0.25},
    particleValueScale: function (srand) {return engine.fn.lerp(1, 4, (srand() * 0.5) + (this.options.instrument.rarity * 0.5))},
    particleValueMax: function () {return engine.fn.clamp(this.properties.particleValueCenter + this.properties.particleValueRange)},
    particleValueMin: function () {return engine.fn.clamp(this.properties.particleValueCenter - this.properties.particleValueRange)},
    rotation: () => engine.tool.quaternion.fromEuler({pitch: engine.fn.randomFloat(-Math.PI, Math.PI), roll: engine.fn.randomFloat(-Math.PI, Math.PI), yaw: engine.fn.randomFloat(-Math.PI, Math.PI)}).normalize(),
    rotationVelocity: () => engine.tool.quaternion.fromEuler({pitch: engine.fn.randomFloat(-Math.PI, Math.PI), roll: engine.fn.randomFloat(-Math.PI, Math.PI), yaw: engine.fn.randomFloat(-Math.PI, Math.PI)}).normalize(),
  },
  createSynth: function ({point, wrapper}) {
    const {
      amDepth,
      amFrequency,
      cmDepth,
      cmFrequency,
      color,
      detune,
      dmDepth,
      dmFrequency,
      frequency,
      fmDepth,
      fmDetune,
      fmFrequency,
      width,
      wmDepth,
      wmFrequency,
    } = this.calculateParameters(point)

    wrapper.maxColor = color
    wrapper.rootFrequency = frequency

    const synth = engine.synth.pwm({
      detune,
      gain: 1 - amDepth,
      frequency,
      type: this.properties.carrierType,
      width,
    }).connect(wrapper.input)

    synth.assign('am', engine.synth.lfo({
      depth: amDepth,
      frequency: amFrequency,
      type: this.properties.amType,
    }))

    synth.assign('cm', engine.synth.lfo({
      depth: cmDepth,
      frequency: cmFrequency,
      type: this.properties.cmType,
    }))

    synth.assign('dm', engine.synth.lfo({
      depth: dmDepth,
      frequency: dmFrequency,
      type: this.properties.dmType,
    }))

    synth.assign('fm', engine.synth.lfo({
      depth: fmDepth,
      detune: fmDetune + detune,
      frequency: fmFrequency,
      type: this.properties.fmType,
    }))

    synth.assign('wm', engine.synth.lfo({
      depth: wmDepth,
      frequency: wmFrequency,
      type: this.properties.wmType,
    }))

    synth.am.connect(synth.param.gain)
    synth.chainStop(synth.am)

    synth.cm.connect(wrapper.filter.detune)
    synth.chainStop(synth.cm)

    synth.dm.connect(synth.param.detune)
    synth.dm.connect(synth.fm.param.detune)
    synth.chainStop(synth.dm)

    synth.fm.connect(synth.param.frequency)
    synth.chainStop(synth.fm)

    synth.wm.connect(synth.param.width)
    synth.chainStop(synth.wm)

    wrapper.onStop = () => synth.stop()

    wrapper.onUpdate = () => {
      const {
        amDepth,
        amFrequency,
        cmDepth,
        cmFrequency,
        color,
        detune,
        dmDepth,
        dmFrequency,
        frequency,
        fmDepth,
        fmDetune,
        fmFrequency,
        width,
        wmDepth,
        wmFrequency,
      } = this.calculateParameters(point)

      wrapper.maxColor = color
      wrapper.rootFrequency = frequency

      engine.fn.setParam(synth.param.am.depth, amDepth)
      engine.fn.setParam(synth.param.am.frequency, amFrequency)
      engine.fn.setParam(synth.param.cm.depth, cmDepth)
      engine.fn.setParam(synth.param.cm.frequency, cmFrequency)
      engine.fn.setParam(synth.param.detune, detune)
      engine.fn.setParam(synth.param.dm.depth, dmDepth)
      engine.fn.setParam(synth.param.dm.frequency, dmFrequency)
      engine.fn.setParam(synth.param.fm.detune, fmDetune + detune)
      engine.fn.setParam(synth.param.fm.depth, fmDepth)
      engine.fn.setParam(synth.param.fm.frequency, fmFrequency)
      engine.fn.setParam(synth.param.frequency, frequency)
      engine.fn.setParam(synth.param.gain, 1 - amDepth)
      engine.fn.setParam(synth.param.width, width)
      engine.fn.setParam(synth.param.wm.depth, wmDepth)
      engine.fn.setParam(synth.param.wm.frequency, wmFrequency)
    }
  },
  calculateFrequency: function (point) {
    let scale = engine.fn.choose([
      [0,1,2,3,4,5,6,7,8,9,10,11],
      [0,2,3,5,7,8,10],
      [0,2,3,6,7,8,11],
      [0,3,5,7,10],
      [0,2,3,7,8],
    ], this.properties.scale)

    scale = [
      ...scale.map((x) => x - 24),
      ...scale.map((x) => x - 12),
      ...scale.map((x) => x + 0),
      ...scale.map((x) => x + 12),
      ...scale.map((x) => x + 24),
    ]

    const value = engine.fn.lerp(
      engine.fn.clamp(this.properties.frequencyCenter - this.properties.frequencyRange),
      engine.fn.clamp(this.properties.frequencyCenter + this.properties.frequencyRange),
      this.fields.frequency.valueAt(point, engine.fn.lerp(1, 2, this.properties.frequencyScale))
    )

    return engine.fn.fromMidi(
      60 + scale[Math.round(value * (scale.length - 1))]
    )
  },
  calculateParameters: function (point) {
    const frequency = this.calculateFrequency(point)

    const maxField = 2.5,
      minField = 0.5

    return {
      amDepth: engine.fn.lerp(0, 0.5, engine.fn.clamp(
        engine.fn.lerp(this.properties.amDepthCenter - this.properties.amDepthRange, this.properties.amDepthCenter + this.properties.amDepthRange, this.fields.amDepth.valueAt(point, engine.fn.lerp(minField, maxField, this.properties.amDepthScale))),
      )),
      amFrequency: engine.fn.lerpExp(1/8, 8, engine.fn.clamp(
        engine.fn.lerp(this.properties.amFrequencyCenter - this.properties.amFrequencyRange, this.properties.amFrequencyCenter + this.properties.amFrequencyRange, this.fields.amFrequency.valueAt(point, engine.fn.lerp(minField, maxField, this.properties.amFrequencyScale))),
      ), 4),
      cmDepth: engine.fn.lerp(0, 2400, engine.fn.clamp(
        engine.fn.lerp(this.properties.cmDepthCenter - this.properties.cmDepthRange, this.properties.cmDepthCenter + this.properties.cmDepthRange, this.fields.cmDepth.valueAt(point, engine.fn.lerp(minField, maxField, this.properties.cmDepthScale))),
      )),
      cmFrequency: engine.fn.lerpExp(1/8, 8, engine.fn.clamp(
        engine.fn.lerp(this.properties.cmFrequencyCenter - this.properties.cmFrequencyRange, this.properties.cmFrequencyCenter + this.properties.cmFrequencyRange, this.fields.cmFrequency.valueAt(point, engine.fn.lerp(minField, maxField, this.properties.cmFrequencyScale))),
      ), 4),
      color: engine.fn.lerp(1, 8, engine.fn.clamp(
        engine.fn.lerp(this.properties.colorCenter - this.properties.colorRange, this.properties.colorCenter + this.properties.colorRange, this.fields.color.valueAt(point, engine.fn.lerp(minField, maxField, this.properties.colorScale))),
      )),
      detune: engine.fn.lerp(
        -50 * this.properties.detuneRange,
        50 * this.properties.detuneRange,
        this.fields.detune.valueAt(point, engine.fn.lerp(minField, maxField, this.properties.detuneScale)),
      ),
      dmDepth: engine.fn.lerp(0, 50, engine.fn.clamp(
        engine.fn.lerp(this.properties.dmDepthCenter - this.properties.dmDepthRange, this.properties.dmDepthCenter + this.properties.dmDepthRange, this.fields.dmDepth.valueAt(point, engine.fn.lerp(minField, maxField, this.properties.dmDepthScale))),
      )),
      dmFrequency: engine.fn.lerpExp(1/8, 8, engine.fn.clamp(
        engine.fn.lerp(this.properties.dmFrequencyCenter - this.properties.dmFrequencyRange, this.properties.dmFrequencyCenter + this.properties.dmFrequencyRange, this.fields.dmFrequency.valueAt(point, engine.fn.lerp(minField, maxField, this.properties.dmFrequencyScale))),
      ), 4),
      frequency,
      fmDepth: engine.fn.clamp(
        engine.fn.lerp(this.properties.fmDepthCenter - this.properties.fmDepthRange, this.properties.fmDepthCenter + this.properties.fmDepthRange, this.fields.fmDepth.valueAt(point, engine.fn.lerp(minField, maxField, this.properties.fmDepthScale))),
      ) * frequency,
      fmDetune: engine.fn.lerp(
        -50 * this.properties.fmDetuneRange,
        50 * this.properties.fmDetuneRange,
        this.fields.fmDetune.valueAt(point, engine.fn.lerp(minField, maxField, this.properties.fmDetuneScale)),
      ),
      fmFrequency: engine.fn.lerp(1/4, 4, engine.fn.clamp(
        engine.fn.lerp(this.properties.fmFrequencyCenter - this.properties.fmFrequencyRange, this.properties.fmFrequencyCenter + this.properties.fmFrequencyRange, this.fields.fmFrequency.valueAt(point, engine.fn.lerp(minField, maxField, this.properties.fmFrequencyScale))),
      )) * frequency,
      width: engine.fn.lerp(0.25, 0.75, engine.fn.clamp(
        engine.fn.lerp(this.properties.widthCenter - this.properties.widthRange, this.properties.widthCenter + this.properties.widthRange, this.fields.color.valueAt(point, engine.fn.lerp(minField, maxField, this.properties.widthScale))),
      )),
      wmDepth: engine.fn.lerp(0, 0.5, engine.fn.clamp(
        engine.fn.lerp(this.properties.wmDepthCenter - this.properties.wmDepthRange, this.properties.wmDepthCenter + this.properties.wmDepthRange, this.fields.wmDepth.valueAt(point, engine.fn.lerp(minField, maxField, this.properties.wmDepthScale))),
      )),
      wmFrequency: engine.fn.lerpExp(1/8, 8, engine.fn.clamp(
        engine.fn.lerp(this.properties.wmFrequencyCenter - this.properties.wmFrequencyRange, this.properties.wmFrequencyCenter + this.properties.wmFrequencyRange, this.fields.wmDepth.valueAt(point, engine.fn.lerp(minField, maxField, this.properties.wmFrequencyScale))),
      ), 4),
    }
  },
  // Particles
  alterParticle: function (particle) {
    const index = content.sphereIndex.get(),
      isScanned = this.options.instrument.state.scans > 0

    const radius = engine.fn.lerp(0.5, 2.5, this.fields.particleRadius.valueAt(particle.spheres[index], this.properties.particleRadiusScale))

    particle.target.h = engine.fn.lerp(this.properties.particleHueMin, this.properties.particleHueMax, this.fields.particleHue.valueAt(particle.spheres[index], this.properties.particleHueScale))
    particle.target.s = isScanned
      ? engine.fn.lerp(this.properties.particleSaturationMin, this.properties.particleSaturationMax, this.fields.particleSaturation.valueAt(particle.spheres[index], this.properties.particleSaturationScale))
      : 0
    particle.target.v = isScanned
      ? engine.fn.lerp(this.properties.particleValueMin, this.properties.particleValueMax, this.fields.particleValue.valueAt(particle.spheres[index], this.properties.particleValueScale))
      : 0.25
    particle.target.x = particle.spheres[index].x * (isScanned ? radius : 1)
    particle.target.y = particle.spheres[index].y * (isScanned ? radius : 1)
    particle.target.z = particle.spheres[index].z * (isScanned ? radius : 1)
  },
  getRotation: function () {
    this.properties.rotation = this.properties.rotation.multiply(
      this.properties.rotationVelocity.lerpFrom({}, engine.loop.delta() / 30)
    ).normalize()

    return this.properties.rotation
  },
})
