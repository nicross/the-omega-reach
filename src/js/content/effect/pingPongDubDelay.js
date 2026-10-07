content.effect.pingPongDubDelay = function ({
  delay: delayAmount = 0.5,
  dry: dryAmount = 1,
  feedback: feedbackAmount = 0.5,
  filterDetune = 0,
  filterFrequency = engine.const.maxFrequency,
  filterGain = 0,
  filterQ = 1,
  filterType = 'lowpass',
  maxDelayTime = 1,
  wet: wetAmount = 0.5,
} = {}) {
  const context = engine.context()

  const delay = context.createDelay(maxDelayTime),
    dry = context.createGain(),
    feedback = context.createGain(),
    filter = context.createBiquadFilter(),
    input = context.createGain(),
    merger = context.createChannelMerger(2),
    output = context.createGain(),
    panner = context.createStereoPanner(),
    splitter = context.createChannelSplitter(2),
    wet = context.createGain()

  input.connect(dry)
  input.connect(panner)
  panner.connect(splitter)
  splitter.connect(merger, 0, 1)
  splitter.connect(merger, 1, 0)
  merger.connect(filter)
  filter.connect(delay)
  delay.connect(feedback)
  delay.connect(wet)
  feedback.connect(panner)
  dry.connect(output)
  wet.connect(output)

  delay.delayTime.value = delayAmount
  dry.gain.value = dryAmount
  feedback.gain.value = feedbackAmount
  filter.detune.value = filterDetune
  filter.frequency.value = filterFrequency
  filter.gain.value = filterGain
  filter.Q.value = filterQ
  filter.type = filterType
  input.gain.value = 1
  output.gain.value = 1
  wet.gain.value = wetAmount

  return {
    input,
    output,
    param: {
      dry: dry.gain,
      delay: delay.delayTime,
      feedback: feedback.gain,
      filter: {
        detune: filter.detune,
        gain: filter.gain,
        frequency: filter.frequency,
        Q: filter.Q,
      },
      gain: output.gain,
      wet: wet.gain,
    },
  }
}
