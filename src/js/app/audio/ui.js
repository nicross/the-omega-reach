app.audio.ui = {}

app.audio.ui.click = ({
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
  synth.param.gain.exponentialRampToValueAtTime(1, now + 1/32)
  synth.param.gain.linearRampToValueAtTime(1/2, now + duration/2)
  synth.param.gain.linearRampToValueAtTime(engine.const.zero, now + duration)

  synth.stop(now + duration)
}

app.audio.ui.focus = ({
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
  synth.param.gain.exponentialRampToValueAtTime(1, now + 1/32)
  synth.param.gain.linearRampToValueAtTime(engine.const.zero, now + duration)

  synth.stop(now + duration)
}

app.audio.ui.value = ({
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
  synth.param.gain.exponentialRampToValueAtTime(1, now + 1/32)
  synth.param.gain.linearRampToValueAtTime(engine.const.zero, now + duration)

  synth.stop(now + duration)
}

// Clicking
document.addEventListener('click', (e) => {
  if (!e.target.matches('.c-menuButton, .c-menuButton *, .c-select *, .c-toggle, .c-toggle *, .a-game--menu, .a-game--interact[aria-disabled="true"]')) {
    return
  }

  if (e.target.matches('.c-toggle, .c-toggle *')) {
    const button = e.target.closest('.c-toggle').querySelector('.c-toggle--button')

    return app.audio.ui.value({
      enabled: button.getAttribute('aria-disabled') != 'true',
      strength: button.getAttribute('aria-checked') == 'true' ? 1 : 0,
    })
  }

  const button = e.target.closest('.c-menuButton') || e.target

  app.audio.ui.click({
    enabled: button.getAttribute('aria-disabled') != 'true',
    strength: button.hasAttribute('aria-disabled') ? 0 : 1,
  })
})

engine.ready(() => {
  app.screen.game.movement.on('disallowed', (e) => {
    app.audio.ui.click({
      enabled: 0,
      pan: ['left','right'].includes(e.direction) ? (e.direction == 'right' ? 1/2 : -1/2) : 0,
      strength: e.direction == 'down' ? -0.5 : (['left','right'].includes(e.direction) ? 0: 0.5),
    })
  })
})

// Focusing
document.addEventListener('focusin', (e) => {
  if (e.target.matches('.a-app--screen') || e.target.closest('.a-app--splash') || e.target.matches('[tabindex="0"]')) {
    return
  }

  app.audio.ui.focus({
    enabled: e.target.matches('.c-menuButton, .c-select, .c-select *, .c-slider, .c-slider *, .c-toggle, .c-toggle *, .a-game--nav button') && e.target.getAttribute('aria-disabled') != 'true',
    pan: e.target.matches('.a-game--left, .a-game--right') ? (e.target.matches('.a-game--right') ? 1/3 : -1/3) : 0,
    strength: e.target.matches('.c-menuButton, .a-game--interact, .a-game--menu') ? 1 : (
      e.target.matches('.a-game--down') ? -0.5 : (e.target.matches('.a-game--left, .a-game--right') ? 0 : 0.5)
    ),
  })
})

// Sliders
document.addEventListener('input', (e) => {
  if (!e.target.matches('.c-slider input')) {
    return
  }

  app.audio.ui.value({
    enabled: true,
    strength: engine.fn.scale(e.target.value, e.target.min, e.target.max, 0, 1),
  })
})
