content.cellar.tiles.obelisk = content.cellar.tiles.invent({
  id: 'obelisk',
  name: 'The obelisk',
  category: 'special',
  uniquePerRun: true,
  weight: 1,
  activeHealthBonus: 3,
  defaultState: {
    active: false,
    rotation: 0,
  },
  canInteractMore: function () {
    return !this.state.active
  },
  effectsGlobal: [],
  getDialogs: () => [
    {
      title: `It's a monolith.`,
      description: `It stretches forever in both directions like mirrored antennas to the heavens, subverting whatever meaning you gleaned of the labyrinth's looping geometry.`,
      actions: [
        {label: 'Look up'},
        {label: 'Look down'},
        {label: 'Divert your gaze'},
      ],
    },
    {
      tutorial: true,
      title: `<span class="u-highlight">[Tutorial]</span> <span class="u-screenReader">for</span> The obelisk:`,
      description: () => ({
        gamepad: `${app.settings.computed.inputHold ? 'Hold' : 'Press'} any <kbd>Face Button</kbd>`,
        keyboard: `${app.settings.computed.inputHold ? 'Hold' : 'Press'} <kbd>Enter</kbd> or <kbd>Spacebar</kbd>`,
        mouse: `${app.settings.computed.inputHold ? 'Click and hold' : 'Click'} the <kbd>Interact Button</kbd>`,
        touch: `${app.settings.computed.inputHold ? 'Tap and hold' : 'Tap'} the <kbd>Interact Button</kbd>`,
      }[app.tutorial.getInputPreference()]) + ` to gain its blessings.`,
    },
  ],
  getEffects: function () {
    const effects = [
      ...this.effectsUnique,
    ]

    if (this.state.active) {
      effects.unshift({
        attribute: {
          label: `Hardened sanity`,
          modifiers: [],
        },
      })
    }

    return effects
  },
  getGlobalHealthBonus: function () {
    return this.state.active ? this.activeHealthBonus : 0
  },
  getInteractLabelMore: () => 'Interact',
  onEnterEffects: function () {
    this.state.rotation = this.state.rotation
      ? this.state.rotation * -1
      : engine.fn.randomSign()
  },
  onInteractMore: function () {
    content.location.emit('cellar-obelisk', {
      tile: this,
    })
  },
  alterParticle: function (particle) {
    const radius = 5

    if (Math.abs(particle.target.x) > radius || Math.abs(particle.target.y) > radius) {
      return
    }

    // Convert to edges of a rectangular prism
    const square = radius / Math.sqrt(2),
      square2 = square / 1.618,
      time = content.time.value()

    let vector = engine.tool.vector2d.create({
      x: engine.fn.closer(particle.target.x, -square, square),
      y: engine.fn.closer(particle.target.y, -square2, square2),
    })

    particle.target.s = this.state.active
      ? engine.fn.lerp(
          // Full color
          1,
          // Twinkling white
          0.5 + (0.5 * Math.sin(engine.const.tau * time * particle.twinkleFrequencies[1])),
          // Alternating oscillating columns
          0.5 + (0.5 * Math.sin(Math.sign(vector.x * vector.y) * engine.const.tau * (time/6 + particle.value*3)))
        )
      : 1

    // Rotate clockwise
    vector = vector.rotate(this.state.rotation * engine.const.tau * time / 120 * (this.state.active ? 1 : 0))

    const value = (0.5 + (0.5 * Math.sin(engine.const.tau * time/10 * particle.twinkleFrequencies[2]))) ** 4

    particle.target.x = engine.fn.lerp(vector.x, particle.floor.x, value)
    particle.target.y = engine.fn.lerp(vector.y, particle.floor.y, value)
    particle.target.z += engine.fn.lerp(-5, 10, particle.value)
  },
}, content.cellar.tiles.baseUnique)
