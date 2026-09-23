content.audio.cellarInteractives.generic = content.audio.cellarInteractives.base.extend({
  createSynth: function () {
    const {
      distanceRatio,
      radius,
      relative,
      tile,
    } = this.options

    const isFullyScanned = tile.isFullyScanned(),
      isUp = relative.y >= 0

    const rootFrequency = engine.fn.detune(
      engine.fn.fromMidi(42 + tile.note),
      (
          engine.fn.scale(Math.abs(this.options.relative.x), 0, radius, 0, 1200)
        + engine.fn.scale(this.options.relative.y, -radius, radius, -1200, 1200)
      )
    )

    const amDepth = engine.fn.fromDb(tile.isUnique || !isFullyScanned ? -6 : -3)

    const synth = engine.synth.pwm({
      detune: engine.fn.randomFloat(-50, 50),
      frequency: rootFrequency,
      gain: 1 - amDepth,
      type: ((isUp && !isFullyScanned) || tile.isUnique ? 'triangle' : 'sine'),
      width: engine.fn.randomFloat(0.375, 0.625),
    }).filtered({
      frequency: rootFrequency,
    }).connect(this.input)

    this.synth = synth

    // Amplitude LFO
    synth.assign('am', engine.synth.lfo({
      depth: amDepth,
      frequency: tile.isUnique ? tile.prime/7 : 5/tile.prime * engine.fn.lerp(1.5, 0.5, distanceRatio),
    }))

    synth.am.connect(synth.param.gain)
    synth.chainStop(synth.am)

    // Color LFO
    synth.assign('cm', engine.synth.lfo({
      depth: 600,
      frequency: tile.isUnique ? tile.prime/8 : 7/tile.prime * engine.fn.lerp(1.5, 0.5, distanceRatio),
    }))

    synth.cm.connect(synth.filter.detune)
    synth.chainStop(synth.cm)

    // Detune LFO
    synth.assign('dm', engine.synth.lfo({
      depth: tile.isUnique ? 25 : 100,
      frequency: tile.isUnique ? tile.prime/9 : 2/tile.prime * engine.fn.lerp(1, 0.5, distanceRatio),
    }))

    synth.dm.connect(synth.param.detune)
    synth.chainStop(synth.dm)

    // Width LFO
    synth.assign('wm', engine.synth.lfo({
      depth: 0.125,
      frequency: tile.isUnique ? tile.prime/5 : 3/tile.prime * engine.fn.lerp(1, 0.5, distanceRatio),
    }))

    synth.wm.connect(synth.param.width)
    synth.chainStop(synth.wm)
  },
  destroySynth: function () {
    this.synth.stop()
  },
})
