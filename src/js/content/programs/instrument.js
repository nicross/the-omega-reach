content.programs.instrument = content.programs.invent({
  id: 'instrument',
  channel: 'instrument',
  hasReverb: true,
  hasSynths: true,
  unscannedRadius: 0.5,
  onLoad: function () {
    content.sphereIndex.randomize()

    if (this.properties.holographic) {
      this.createDelayEffect()
    }

    return this
  },
  onUnload: function () {
    this.destroyDelayEffect()

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
    // Particles
    particleHue: {},
    particleSaturation: {},
    particleValue: {},
    particleRadius: {octaves: 3},
  },
  propertyDefinitions: {
    // Synthesis
    amType: (srand) => engine.fn.choose(['sine','triangle','sawtooth'], srand()),
    amDepthCenter: (srand) => srand(),
    amDepthRange: function (srand) {return srand() * this.options.instrument.rarity * 0.5},
    amDepthScale: function (srand) {return srand() * this.options.instrument.rarity},
    amFrequencyCenter: (srand) => srand(),
    amFrequencyRange: function (srand) {return srand() * this.options.instrument.rarity * 0.5},
    amFrequencyScale: function (srand) {return srand() * this.options.instrument.rarity},
    cmType: (srand) => engine.fn.choose(['sine','triangle','sawtooth'], srand()),
    cmDepthCenter: (srand) => srand(),
    cmDepthRange: function (srand) {return srand() * this.options.instrument.rarity * 0.5},
    cmDepthScale: function (srand) {return srand() * this.options.instrument.rarity},
    cmFrequencyCenter: (srand) => srand(),
    cmFrequencyRange: function (srand) {return srand() * this.options.instrument.rarity * 0.5},
    cmFrequencyScale: function (srand) {return srand() * this.options.instrument.rarity},
    carrierType: (srand) => engine.fn.choose(['sine','triangle','square','sawtooth'], srand()),
    colorCenter: function (srand) {return engine.fn.lerp(srand(), 0.5, this.options.instrument.rarity)},
    colorRange: function (srand) {return engine.fn.lerp(srand(), 1, this.options.instrument.rarity) * 0.5},
    colorScale: function (srand) {return srand() * this.options.instrument.rarity},
    detuneRange: function (srand) {return srand() * this.options.instrument.rarity * 0.5},
    detuneScale: function (srand) {return srand() * this.options.instrument.rarity},
    dmType: (srand) => engine.fn.choose(['sine','triangle','sawtooth'], srand()),
    dmDepthCenter: (srand) => srand(),
    dmDepthRange: function (srand) {return srand() * this.options.instrument.rarity * 0.5},
    dmDepthScale: function (srand) {return srand() * this.options.instrument.rarity},
    dmFrequencyCenter: (srand) => srand(),
    dmFrequencyRange: function (srand) {return srand() * this.options.instrument.rarity * 0.5},
    dmFrequencyScale: function (srand) {return srand() * this.options.instrument.rarity},
    frequencyCenter: (srand) => srand(),
    frequencyRange: function (srand) {return ((srand() * 0.25) + (this.options.instrument.rarity * 0.75)) * 0.5},
    frequencyScale: function (srand) {return (srand() * 0.25) + (this.options.instrument.rarity * 0.75)},
    fmType: (srand) => engine.fn.choose(['sine','triangle','square','sawtooth'], srand()),
    fmDepthCenter: (srand) => srand(),
    fmDepthRange: function (srand) {return srand() * this.options.instrument.rarity * 0.5},
    fmDepthScale: function (srand) {return srand() * this.options.instrument.rarity},
    fmDetuneRange: function (srand) {return srand() * this.options.instrument.rarity * 0.5},
    fmDetuneScale: function (srand) {return srand() * this.options.instrument.rarity},
    fmFrequencyCenter: (srand) => srand(),
    fmFrequencyRange: function (srand) {return srand() * this.options.instrument.rarity * 0.5},
    fmFrequencyScale: function (srand) {return srand() * this.options.instrument.rarity},
    holographic: function () {return this.hasAttribute('Holographic')},
    mode: (srand) => srand(),
    scale: (srand) => srand(),
    widthCenter: (srand) => srand(),
    widthRange: function (srand) {return srand() * this.options.instrument.rarity * 0.25},
    widthScale: function (srand) {return srand() * this.options.instrument.rarity},
    wmType: (srand) => engine.fn.choose(['sine','triangle','sawtooth'], srand()),
    wmDepthCenter: (srand) => srand(),
    wmDepthRange: function (srand) {return srand() * this.options.instrument.rarity * 0.25},
    wmDepthScale: function (srand) {return srand() * this.options.instrument.rarity},
    wmFrequencyCenter: (srand) => srand(),
    wmFrequencyRange: function (srand) {return srand() * this.options.instrument.rarity * 0.5},
    wmFrequencyScale: function (srand) {return srand() * this.options.instrument.rarity},
    // Particles
    particleHueCenter: (srand) => srand(-0.5, 0.5),
    particleHueRange: function (srand) {return (srand() * 0.125) + (this.options.instrument.rarity * 0.375)},
    particleHueScale: function (srand) {return engine.fn.lerp(1, 3, (srand() * 0.25) + (this.options.instrument.rarity * 0.75))},
    particleHueMax: function () {return this.properties.particleHueCenter + this.properties.particleHueRange},
    particleHueMin: function () {return this.properties.particleHueCenter - this.properties.particleHueRange},
    particleRadiusPower: (srand) => srand(1, 3),
    particleRadiusScale: function (srand) {return engine.fn.lerp(1, 3, (srand() * 0.25) + (this.options.instrument.rarity * 0.75))},
    particleSaturationCenter: (srand) => srand(),
    particleSaturationRange: function (srand) {return ((srand() * 0.25) + (this.options.instrument.rarity * 0.75))},
    particleSaturationScale: function (srand) {return engine.fn.lerp(1, 3, (srand() * 0.25) + (this.options.instrument.rarity * 0.75))},
    particleSaturationMax: function () {return engine.fn.clamp(this.properties.particleSaturationCenter + this.properties.particleSaturationRange)},
    particleSaturationMin: function () {return engine.fn.clamp(this.properties.particleSaturationCenter - this.properties.particleSaturationRange)},
    particleValueCenter: (srand) => srand(0.5, 1),
    particleValueRange: function (srand) {return ((srand() * 0.25) + (this.options.instrument.rarity * 0.75))},
    particleValueScale: function (srand) {return engine.fn.lerp(1, 3, (srand() * 0.25) + (this.options.instrument.rarity * 0.75))},
    particleValueMax: function () {return engine.fn.clamp(this.properties.particleValueCenter + this.properties.particleValueRange)},
    particleValueMin: function () {return engine.fn.clamp(this.properties.particleValueCenter - this.properties.particleValueRange)},
    particleScaleX: function (srand) {return engine.fn.lerp(1, srand(0.125, 1.875), this.options.instrument.rarity)},
    particleScaleY: function (srand) {return engine.fn.lerp(1, srand(0.125, 1.875), this.options.instrument.rarity)},
    particleScaleZ: function (srand) {return engine.fn.lerp(1, srand(0.125, 1.875), this.options.instrument.rarity)},
    rotation: () => engine.tool.quaternion.fromEuler({pitch: engine.fn.randomFloat(-Math.PI, Math.PI), roll: engine.fn.randomFloat(-Math.PI, Math.PI), yaw: engine.fn.randomFloat(-Math.PI, Math.PI)}).normalize(),
    rotationVelocity: () => engine.tool.quaternion.fromEuler({pitch: engine.fn.randomFloat(-Math.PI, Math.PI), roll: engine.fn.randomFloat(-Math.PI, Math.PI), yaw: engine.fn.randomFloat(-Math.PI, Math.PI)}).normalize(),
  },
  onUpdate: function () {
    this.properties.rotation = this.properties.rotation.multiply(
      this.properties.rotationVelocity.lerpFrom({}, engine.loop.delta() / 30)
    ).normalize()

    // Handle time tracking and donations
    if (this.synths.size && content.location.is('gallery') && content.location.get().isComplete()) {
      const delta = engine.loop.delta(),
        rarity = engine.fn.lerp(1/3, 1, this.options.instrument.rarity)

      this.options.instrument.state.time += delta
      content.donations.add(delta * rarity * 15/60)
    }

    this.updateDelayEffect()
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
      gain,
      width,
      wmDepth,
      wmFrequency,
    } = this.calculateParameters(point)

    wrapper.maxColor = color
    wrapper.rootFrequency = frequency

    const synth = engine.synth.pwm({
      detune,
      gain: (1 - amDepth) * gain,
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
        gain,
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
      engine.fn.setParam(synth.param.gain, (1 - amDepth) * gain)
      engine.fn.setParam(synth.param.width, width)
      engine.fn.setParam(synth.param.wm.depth, wmDepth)
      engine.fn.setParam(synth.param.wm.frequency, wmFrequency)
    }
  },
  calculateFrequency: function (point) {
    const maxNote = 96,
      minNote = 24,
      octaves = [-3, -2, -1, 0, 1, 2, 3].map((x) => x * 12),
      rootNote = 60

    // Choose the scale type
    let scale = engine.fn.choose([
      [0,1,2,3,4,5,6,7,8,9,10,11],
      [0,12,17,24,28,31],
      [0,2,4,5,7,9,11],
      [0,3,5,7,10],
      [0,2,3,7,8],
      [0,2,3,5,7,8,10],
      [0,2,3,6,7,8,11],
      [0,2,4,6,8,10],
    ], this.properties.scale)

    // Choose the mode
    const mode = engine.fn.choose(scale, this.properties.mode)
    const modeDelta = -Math.floor(mode / 12) * 12

    // Convert scale into all possible notes in the mode
    scale = scale.reduce((notes, note) => {
      for (const octave of octaves) {
        const value = rootNote + note + mode + modeDelta + octave

        if (engine.fn.between(value, minNote, maxNote)) {
          notes.push(value)
        }
      }

      return notes
    }, [])

    // Sort unique notes
    scale.sort((a, b) => a - b)
    scale = [...new Set(scale)]

    // Determine note value at point
    const value = engine.fn.lerp(
      engine.fn.clamp(this.properties.frequencyCenter - this.properties.frequencyRange),
      engine.fn.clamp(this.properties.frequencyCenter + this.properties.frequencyRange),
      this.fields.frequency.valueAt(point, engine.fn.lerpExp(1, 3, this.properties.frequencyScale, 3/2))
    )

    // Return as frequency
    return engine.fn.fromMidi(
      scale[Math.round(value * (scale.length - 1))]
    )
  },
  calculateParameters: function (point) {
    const frequency = this.calculateFrequency(point),
      isComplete = content.location.get().isComplete(),
      proximity = app.screen.game.interact.proximity()

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
      color: isComplete ? engine.fn.lerp(1, 8, engine.fn.clamp(
        engine.fn.lerp(this.properties.colorCenter - this.properties.colorRange, this.properties.colorCenter + this.properties.colorRange, this.fields.color.valueAt(point, engine.fn.lerp(minField, maxField, this.properties.colorScale))),
      )) : 0.5,
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
      gain: engine.fn.fromDb(isComplete ? 0 : -15),
      width: engine.fn.lerp(0.375, 0.625, engine.fn.clamp(
        engine.fn.lerp(this.properties.widthCenter - this.properties.widthRange, this.properties.widthCenter + this.properties.widthRange, this.fields.color.valueAt(point, engine.fn.lerp(minField, maxField, this.properties.widthScale))),
      )),
      wmDepth: engine.fn.lerp(0, 0.25, engine.fn.clamp(
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
      isScanned = this.options.instrument.state.scans > 0,
      time = content.time.value()

    particle.target.h = engine.fn.lerp(this.properties.particleHueMin, this.properties.particleHueMax, this.fields.particleHue.valueAt(particle.spheres[index], this.properties.particleHueScale))

    if (!isScanned) {
      return this.alterParticleUnscanned(particle)
    }

    const radius = engine.fn.lerpExp(1, 3, this.fields.particleRadius.valueAt(particle.spheres[index], this.properties.particleRadiusScale), this.properties.particleRadiusPower)

    particle.target.s = engine.fn.lerp(this.properties.particleSaturationMin, this.properties.particleSaturationMax, this.fields.particleSaturation.valueAt(particle.spheres[index], this.properties.particleSaturationScale))
    particle.target.v = Math.max(particle.target.s, engine.fn.lerp(this.properties.particleValueMin, this.properties.particleValueMax, this.fields.particleValue.valueAt(particle.spheres[index], this.properties.particleValueScale)))
    particle.target.x = particle.spheres[index].x * radius * this.properties.particleScaleX
    particle.target.y = particle.spheres[index].y * radius * this.properties.particleScaleY
    particle.target.z = particle.spheres[index].z * radius * this.properties.particleScaleZ

    if (this.properties.holographic) {
      particle.target.h += engine.fn.scale(Math.sin(time * engine.const.tau * particle.twinkleFrequencies[0]), -1, 1, -1/8, 1/8)
      particle.target.s = engine.fn.scale(Math.sin(time * engine.const.tau * particle.twinkleFrequencies[1]), -1, 1, 0, 1)
      particle.target.v = engine.fn.scale(Math.sin(time * engine.const.tau * particle.twinkleFrequencies[2]), -1, 1, 0.5, 1)
    }
  },
  getLightSource: () => engine.tool.euler.create().forward(),
  getRotation: function () {
    return this.options.instrument.state.scans > 0
      ? this.properties.rotation
      : engine.tool.quaternion.identity()
  },
  // Rumble
  getRumble: function (point) {
    return this.fields.particleRadius.valueAt(point, this.properties.particleRadiusScale) ** this.properties.particleRadiusPower
  },
  // Methods
  hasAttribute: function (name) {
    for (const quirk of this.options.instrument.quirks) {
      if (quirk.name == name) {
        return true
      }
    }

    return false
  },
  // Delay effect
  calculateDelayEffectParameters: function () {
    if (!this.properties.holographic) {
      return {}
    }

    return {
      dry: engine.fn.fromDb(0),
      delay: 1/4,
      feedback: engine.fn.fromDb(-6),
      filter: {
        detune: 0,
        gain: engine.fn.fromDb(0),
        frequency: 500,
        Q: 1,
      },
      gain: engine.fn.fromDb(0),
      wet: engine.fn.fromDb(0),
    }
  },
  createDelayEffect: function () {
    if (!this.properties.holographic) {
      return this
    }

    this.delayEffect = content.effect.pingPongDubDelay(
      this.calculateDelayEffectParameters()
    )

    this.delayEffect.output.connect(this.destination)
  },
  destroyDelayEffect: function () {
    if (!this.delayEffect) {
      return this
    }

    engine.fn.rampLinear(this.delayEffect.param.wet, 0, 1/32)
    delete this.delayEffect
  },
  getSynthWrapperDestination: function () {
    return this.delayEffect ? this.delayEffect.input : this.destination
  },
  updateDelayEffect: function () {
    if (!this.delayEffect) {
      return this
    }

    const {
      dry,
      delay,
      feedback,
      filter,
      gain,
      wet,
    } = this.calculateDelayEffectParameters()

    engine.fn.setParam(this.delayEffect.param.dry, dry)
    engine.fn.setParam(this.delayEffect.param.delay, delay)
    engine.fn.setParam(this.delayEffect.param.filter.detune, filter.detune)
    engine.fn.setParam(this.delayEffect.param.filter.gain, filter.gain)
    engine.fn.setParam(this.delayEffect.param.filter.frequency, filter.frequency)
    engine.fn.setParam(this.delayEffect.param.filter.Q, filter.Q)
    engine.fn.setParam(this.delayEffect.param.gain, gain)
    engine.fn.setParam(this.delayEffect.param.wet, wet)
  },
})
