content.audio.ui = {}

content.audio.ui.click = ({
  enabled = 0,
  pan = 0,
  strength = 0,
}) => {
  const bus = app.audio.bus(),
    duration = engine.fn.randomFloat(1/8, 1/6),
    frequency = engine.fn.fromMidi(enabled ? 48 : 42),
    now = engine.time()

  const synth = engine.synth.pwm({
    detune: engine.fn.randomFloat(-10, 10),
    frequency: frequency,
    type: enabled ? 'square' : 'sawtooth',
    width: engine.fn.randomFloat(0.25, 0.75),
  }).filtered({
    frequency: frequency * (enabled ? 1 : 2),
  }).chainAssign(
    'panner', engine.context().createStereoPanner()
  ).connect(bus)

  synth.panner.pan.value = pan

  synth.param.detune.linearRampToValueAtTime(engine.fn.lerp(-1200, 1200, strength), now + duration/4)
  synth.param.gain.exponentialRampToValueAtTime(1, now + 1/48)
  synth.param.gain.linearRampToValueAtTime(1/2, now + duration/2)
  synth.param.gain.linearRampToValueAtTime(engine.const.zero, now + duration)

  synth.stop(now + duration)
}

content.audio.ui.focus = ({
  enabled = 0,
  pan = 0,
  strength = 0,
}) => {
  const bus = app.audio.bus(),
    duration = engine.fn.randomFloat(1/24, 1/16),
    frequency = engine.fn.fromMidi(enabled ? 48 : 42),
    now = engine.time()

  const synth = engine.synth.pwm({
    detune: engine.fn.randomFloat(-10, 10),
    frequency: frequency,
    type: enabled ? 'sine' : 'sawtooth',
    width: engine.fn.randomFloat(0.25, 0.75),
  }).filtered({
    frequency: frequency * (enabled ? 1 : 2),
  }).chainAssign(
    'panner', engine.context().createStereoPanner()
  ).connect(bus)

  synth.panner.pan.value = pan

  synth.param.detune.linearRampToValueAtTime(engine.fn.lerp(-1200, 1200, strength), now + duration/2)
  synth.param.gain.exponentialRampToValueAtTime(1, now + 1/48)
  synth.param.gain.linearRampToValueAtTime(engine.const.zero, now + duration)

  synth.stop(now + duration)
}

content.audio.ui.value = ({
  enabled = 0,
  strength = 0,
}) => {
  const bus = app.audio.bus(),
    duration = engine.fn.randomFloat(1/16, 1/12),
    frequency = engine.fn.fromMidi(enabled ? 48 : 42),
    now = engine.time()

  const synth = engine.synth.pwm({
    detune: engine.fn.randomFloat(-10, 10),
    frequency: frequency,
    type: enabled ? 'square' : 'sawtooth',
    width: engine.fn.randomFloat(0.25, 0.75),
  }).filtered({
    frequency: frequency * (enabled ? 1 : 2),
  }).connect(bus)

  synth.param.detune.linearRampToValueAtTime(engine.fn.lerp(-1200, 1200, strength), now + duration/2)
  synth.param.gain.exponentialRampToValueAtTime(1, now + 1/48)
  synth.param.gain.linearRampToValueAtTime(engine.const.zero, now + duration)

  synth.stop(now + duration)
}
