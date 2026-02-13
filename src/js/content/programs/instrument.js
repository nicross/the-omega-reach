content.programs.instrument = content.programs.invent({
  id: 'instrument',
  hasReverb: true,
  hasSynths: true,
  fieldDefinitions: {

  },
  propertyDefinitions: {

  },
  onLoad: function ({
    instrument,
  } = {}) {
    this.instrument = instrument
  },
  createSynth: function ({point, wrapper}) {
    const synth = engine.synth.simple({
      frequency: wrapper.rootFrequency,
      gain: 1,
      type: 'sawtooth',
    }).connect(wrapper.input)

    wrapper.onStop = () => synth.stop()

    wrapper.onUpdate = () => {

    }
  },
})
