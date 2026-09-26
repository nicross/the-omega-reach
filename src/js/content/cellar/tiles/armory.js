content.cellar.tiles.armory = content.cellar.tiles.invent({
  id: 'armory',
  name: 'The armory',
  category: 'special',
  uniquePerRun: true,
  weight: 1,
  defaultState: {
    uses: 0,
  },
  canInteractMore: function () {
    return this.state.uses < this.calculateMaxUses()
  },
  getDialogs: () => [
    {
      title: `It's a stockpile.`,
      description: `Ghastly silhouettes of <em>earthen weapons</em> possess the manifold gaps of its frames. Its vesigial provisions gather rust and collect dust the longer that they age.`,
      actions: [
        {label: 'Adore the sword'},
        {label: 'Fancy the shield'},
        {label: 'Covet the amulet'},
        {label: 'Stick with your fists'},
      ],
    },
    {
      tutorial: true,
      title: `<span class="u-highlight">[Tutorial]</span> <span class="u-screenReader">for</span> The armory:`,
      description: () => ({
        gamepad: `${app.settings.computed.inputHold ? 'Hold' : 'Press'} any <kbd>Face Button</kbd>`,
        keyboard: `${app.settings.computed.inputHold ? 'Hold' : 'Press'} <kbd>Enter</kbd> or <kbd>Spacebar</kbd>`,
        mouse: `${app.settings.computed.inputHold ? 'Click and hold' : 'Click'} the <kbd>Interact Button</kbd>`,
        touch: `${app.settings.computed.inputHold ? 'Tap and hold' : 'Tap'} the <kbd>Interact Button</kbd>`,
      }[app.tutorial.getInputPreference()]) + ` to equip some extra protection.`,
    },
  ],
  getEffects: function () {
    const effects = [
      ...this.effectsUnique,
    ]

    if (this.state.uses >= this.calculateMaxUses()) {
      effects.unshift({
        attribute: {
          label: `Empty shelves`,
          modifiers: [],
        },
      })
    }

    return effects
  },
  getInteractLabelMore: () => 'Interact',
  onInteractMore: function () {
    content.location.emit('cellar-armory', {
      tile: this,
    })
  },
  alterParticle: function (particle) {
    const radius = 10,
      square = 10

    if (Math.abs(particle.target.x) > square || Math.abs(particle.target.y) > square) {
      return
    }

    const dx = Math.abs(particle.target.x),
      dy = Math.abs(particle.target.y)

    const z = Math.min(
      engine.fn.clamp(engine.fn.scale(dx, 2.5, 4, 0, 1)),
      engine.fn.clamp(engine.fn.scale(dx, 6, 7.5, 1, 0)),
    ) * Math.min(
      engine.fn.clamp(engine.fn.scale(dy, 2, 2.5, 0, 1)),
      engine.fn.clamp(engine.fn.scale(dy, 7.5, 8, 1, 0)),
    )

    particle.target.z += z * 2

    if (z > 0 && z < 1 && engine.fn.between(dy, 2.5, 7.5)) {
      const time = content.time.value(),
        value = 1 - engine.fn.clamp(this.state.uses / this.calculateMaxUses())

      particle.target.h = engine.fn.lerpExp(
        -25/360,
        Math.sin(engine.const.tau * time / 60 * particle.twinkleFrequencies[1]),
        value,
        1.5,
      )

      particle.target.s = engine.fn.lerpExp(
        0.25,
        3/4 + (1/4 * Math.sin(engine.const.tau * time * particle.twinkleFrequencies[2])),
        value,
        1.5,
      )

      particle.target.v = engine.fn.lerpExp(
        0.25,
        3/4 + (1/4 * Math.sin(engine.const.tau * time * particle.twinkleFrequencies[0])),
        value,
        1.5,
      )
    }
  },
  // Interactions
  calculateMaxUses: function () {
    return Math.max(3, Math.abs(this.z))
  },
  incrementUses: function () {
    this.state.uses += 1
  },
}, content.cellar.tiles.baseUnique)
