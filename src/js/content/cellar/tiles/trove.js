content.cellar.tiles.trove = content.cellar.tiles.invent({
  id: 'trove',
  name: 'The trove',
  category: 'special',
  uniquePerRun: true,
  weight: 1,
  defaultState: {
    entered: false,
    total: 0,
  },
  canInteractMore: () => content.donations.has(1),
  getDialogs: () => [
    {
      title: `It's a miracle.`,
      description: ``,
      actions: [
        {label: 'stealing.'},
        {label: 'swimming.'},
        {label: 'saving.'},
      ],
    },
    {
      tutorial: true,
      title: `<span class="u-highlight">[Tutorial]</span> <span class="u-screenReader">for</span> The trove:`,
      description: () => ({
        gamepad: `${app.settings.computed.inputHold ? 'Hold' : 'Press'} any <kbd>Face Button</kbd>`,
        keyboard: `${app.settings.computed.inputHold ? 'Hold' : 'Press'} <kbd>Enter</kbd> or <kbd>Spacebar</kbd>`,
        mouse: `${app.settings.computed.inputHold ? 'Click and hold' : 'Click'} the <kbd>Interact Button</kbd>`,
        touch: `${app.settings.computed.inputHold ? 'Tap and hold' : 'Tap'} the <kbd>Interact Button</kbd>`,
      }[app.tutorial.getInputPreference()]) + ` to raid donations from <strong>the lobby</strong>.`,
    },
  ],
  getEffects: function () {
    const hasDonations = content.donations.has(1)

    return [
      {
        attribute: {
          label: hasDonations ? 'Clandestine donation' : 'Empty coffers',
          modifiers: hasDonations ? ['rare'] : [],
        }
      },
      ...this.effectsUnique,
    ]
  },
  getInteractLabelMore: () => 'Interact',
  onActivate: function () {
    this.zField = engine.fn.createNoise({
      octaves: 3,
      seed: ['trove', 'z', this.x, this.y, this.z],
      type: 'simplex2d',
    })

    engine.ephemera.add(this.zField)
  },
  onDeactivate: function () {
    engine.ephemera.remove(this.zField)
    delete this.zField
  },
  onEnterEffects: function () {
    if (this.state.entered) {
      this.state.total = Math.max(this.state.total, content.donations.amount())
      return
    }

    content.donations.add(engine.fn.randomInt(20, 30))

    this.state.entered = true
    this.state.total = content.donations.amount()
  },
  onInteractMore: function () {
    content.location.emit('cellar-trove', {
      tile: this,
    })
  },
  alterParticle: function (particle) {
    const radius = 4,
      square = 10

    if (Math.abs(particle.target.x) > square || Math.abs(particle.target.y) > square) {
      return
    }

    const distances = [
      engine.tool.vector2d.unitX().scale(square - radius).rotate(engine.const.tau * (1/8)).distance(particle.target),
      engine.tool.vector2d.unitX().scale(square - radius).rotate(engine.const.tau * (3/8)).distance(particle.target),
      engine.tool.vector2d.unitX().scale(square - radius).rotate(engine.const.tau * (5/8)).distance(particle.target),
      engine.tool.vector2d.unitX().scale(square - radius).rotate(engine.const.tau * (7/8)).distance(particle.target),
    ]

    const closest = Math.min(...distances),
      value = this.calculateValue()

    if (closest > radius || !value) {
      return
    }

    const distance = 1 - (Math.min(closest) / radius),
      time = content.time.value(),
      z = this.zField.value(particle.target.x / 10, particle.target.y / 10)

    particle.target.z += 2.5 * content.fn.gain(distance, 2) * z * value
    particle.target.h = Math.sin(engine.const.tau * time / 60 * particle.twinkleFrequencies[2])
    particle.target.s = engine.fn.lerpExp(0, 3/4 + Math.sin(engine.const.tau * time * particle.twinkleFrequencies[0])/4, z, 0.5)
    particle.target.v = engine.fn.lerpExp(1, 3/4 + Math.sin(engine.const.tau * time * particle.twinkleFrequencies[1])/4, z, 0.5)
  },
  // Interactions
  calculateReward: function () {
    const donations = content.donations.amount()
    return engine.fn.clamp(Math.ceil(donations * 0.5) + 1, 1, donations)
  },
  calculateValue: function () {
    return engine.fn.clamp(content.donations.amount() / this.state.total)
  },
}, content.cellar.tiles.baseUnique)
