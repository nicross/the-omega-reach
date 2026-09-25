content.cellar.tiles.kiln = content.cellar.tiles.invent({
  id: 'kiln',
  name: 'The kiln',
  category: 'special',
  uniquePerRun: true,
  weight: 1,
  defaultState: {
    cooldown: 0,
    uses: 0,
  },
  canInteractMore: function () {
    return content.wallet.has(this.calculateCost())
      && content.time.value() > this.state.cooldown
  },
  effectsGlobal: [],
  getDialogs: () => [
    {
      title: `It's a furnace.`,
      description: `The intensity escaping its engines of creation nurtures a pleasant respite, spilling into the graven heiroglyphics of its enclosing bricks, which appear…`,
      actions: [
        {label: 'instructive.'},
        {label: 'provocative.'},
        {label: 'decorative.'},
      ],
    },
    {
      tutorial: true,
      title: `<span class="u-highlight">[Tutorial]</span> <span class="u-screenReader">for</span> The kiln:`,
      description: () => ({
        gamepad: `${app.settings.computed.inputHold ? 'Hold' : 'Press'} any <kbd>Face Button</kbd>`,
        keyboard: `${app.settings.computed.inputHold ? 'Hold' : 'Press'} <kbd>Enter</kbd> or <kbd>Spacebar</kbd>`,
        mouse: `${app.settings.computed.inputHold ? 'Click and hold' : 'Click'} the <kbd>Interact Button</kbd>`,
        touch: `${app.settings.computed.inputHold ? 'Tap and hold' : 'Tap'} the <kbd>Interact Button</kbd>`,
      }[app.tutorial.getInputPreference()]) + ` to repurpose credits into new instruments.`,
    },
  ],
  getInteractLabelMore: () => 'Interact',
  onInteractMore: function () {
    content.location.emit('cellar-kiln', {
      tile: this,
    })
  },
  alterParticle: function (particle) {
    const height = 2,
      radius = 7.5,
      square = 10

    if (Math.abs(particle.target.x) > square || Math.abs(particle.target.y) > square) {
      return
    }

    const distance = 1 - (engine.tool.vector2d.create(particle.target).distance() / radius)

    if (distance < 0) {
      return
    }

    const time = content.time.value(),
      value = 0.5 + (0.5 * Math.sin(engine.const.tau * time/11 * particle.twinkleFrequencies[1]))

    const vector = engine.tool.vector2d.create(particle.floor)
      .scale(value)

    particle.target.h = engine.fn.lerpExp(1/3 * particle.value, 0, value, 0.5) - (1/4 * this.getCooldownValue())
    particle.target.s = (3/4 + (1/4 * Math.sin(engine.const.tau * time * particle.twinkleFrequencies[2])))
    particle.target.v = (1 - value) ** 0.25
    particle.target.x = vector.x
    particle.target.y = vector.y
    particle.target.z += -1 + (height * (value ** 4))
  },
  // Interactions
  cooldownTime: 10,
  calculateCost: function () {
    return content.shop.getCost() * (1/3 * (this.state.uses + 2))
  },
  getCooldownValue: function () {
    return engine.fn.clamp(
      (this.state.cooldown - content.time.value()) / this.cooldownTime
    ) ** 2
  },
  incrementUses: function () {
    this.state.uses += 1

    return this
  },
  triggerCooldown: function () {
    this.state.cooldown = content.time.value() + this.cooldownTime

    return this
  },
}, content.cellar.tiles.baseUnique)
