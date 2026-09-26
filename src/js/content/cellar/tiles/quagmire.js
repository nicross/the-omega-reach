content.cellar.tiles.quagmire = content.cellar.tiles.invent({
  id: 'quagmire',
  name: 'The quagmire',
  category: 'special',
  uniquePerRun: true,
  weight: 1,
  defaultState: {
    active: true,
  },
  canInteractMore: function () {
    return this.state.active && content.wallet.has(this.calculateCost())
  },
  getDialogs: function () {
    return [
      {
        title: `It's a boondoggle.`,
        description: ``,
        actions: [
          {label: 'Pardon the problem'},
          {label: 'Seek a solution'},
        ],
      },
      {
        tutorial: true,
        title: `<span class="u-highlight">[Tutorial]</span> <span class="u-screenReader">for</span> The quagmire:`,
        description: () => `Donations are reduced while this remains unaddressed. ` + ({
          gamepad: `${app.settings.computed.inputHold ? 'Hold' : 'Press'} any <kbd>Face Button</kbd>`,
          keyboard: `${app.settings.computed.inputHold ? 'Hold' : 'Press'} <kbd>Enter</kbd> or <kbd>Spacebar</kbd>`,
          mouse: `${app.settings.computed.inputHold ? 'Click and hold' : 'Click'} the <kbd>Interact Button</kbd>`,
          touch: `${app.settings.computed.inputHold ? 'Tap and hold' : 'Tap'} the <kbd>Interact Button</kbd>`,
        }[app.tutorial.getInputPreference()]) + ` to pay off this debt.`,
      },
    ]
  },
  getEffects: function () {
    return [
      {
        attribute: {
          label: this.state.active ? 'Garnished donations' : 'Completed project',
          modifiers: [],
        }
      },
      ...this.effectsUnique,
    ]
  },
  getGlobalDonationRate: function () {
    return this.state.active ? -1/2 : 0
  },
  onActivate: function () {
    this.zField = engine.fn.createNoise({
      octaves: 3,
      seed: ['quagmire', 'z', this.x, this.y, this.z],
      type: 'simplex3d',
    })

    engine.ephemera.add(this.zField)
  },
  onDeactivate: function () {
    engine.ephemera.remove(this.zField)
    delete this.zField
  },
  onInteractMore: function () {
    content.location.emit('cellar-quagmire', {
      tile: this,
    })
  },
  alterParticle: function (particle) {
    const radius = 10,
      square = 10

    if (Math.abs(particle.target.x) > square || Math.abs(particle.target.y) > square) {
      return
    }

    const distance = 1 - (engine.tool.vector2d.create(particle.target).distance() / radius)

    if (distance < 0) {
      return
    }

    const time = content.time.value(),
      value = this.zField.value(particle.target.x / 10, particle.target.y / 10, time / 10)

    particle.target.z += this.state.active
      ? 1.5 * engine.fn.scale(value, 0, 1, -1, 1) * (distance ** 0.75)
      : 0

    particle.target.h = this.state.active
      ? particle.target.h
      : Math.sin(engine.const.tau * time / 60 * particle.twinkleFrequencies[0])

    particle.target.s = this.state.active
      ? (0.5 + (0.5 * Math.sin(engine.const.tau * time * particle.twinkleFrequencies[1]))) ** 0.5
      : 3/4 + Math.sin(engine.const.tau * time * particle.twinkleFrequencies[1])/4

    particle.target.v = this.state.active
      ? (0.5 + (0.5 * Math.sin(engine.const.tau * time * particle.twinkleFrequencies[2]))) ** 1.5
      : 3/4 + Math.sin(engine.const.tau * time * particle.twinkleFrequencies[0])/4
  },
  // Interactions
  calculateCost: function () {
    return Math.round(content.shop.getCost() * 0.5)
  },
}, content.cellar.tiles.baseUnique)
