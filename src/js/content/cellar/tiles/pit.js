content.cellar.tiles.pit = content.cellar.tiles.invent({
  id: 'pit',
  name: 'The pit',
  category: 'negative',
  uniquePerFloor: true,
  weight: 8,
  defaultState: {
    uses: 0,
  },
  calculateCost: function () {
    return content.wallet.amount() * (0.05 + (0.01 * this.state.uses))
  },
  canInteractMore: function () {
    return content.wallet.has(this.calculateCost())
  },
  getDialogs: () => [
    {
      title: `It's a sink.`,
      description: `The air freezes as its sanity leaches into the vortex reeling at your feet. Perhaps it feeds greedily upon other tithings?`,
      actions: [
        {label: 'Exhale deeply'},
        {label: 'Inhale sharply'},
      ],
    },
    {
      tutorial: true,
      title: `<span class="u-highlight">[Tutorial]</span> <span class="u-screenReader">for</span> The pit:`,
      description: () => ({
        gamepad: `${app.settings.computed.inputHold ? 'Hold' : 'Press'} any <kbd>Face Button</kbd>`,
        keyboard: `${app.settings.computed.inputHold ? 'Hold' : 'Press'} <kbd>Enter</kbd> or <kbd>Spacebar</kbd>`,
        mouse: `${app.settings.computed.inputHold ? 'Click and hold' : 'Click'} the <kbd>Interact Button</kbd>`,
        touch: `${app.settings.computed.inputHold ? 'Tap and hold' : 'Tap'} the <kbd>Interact Button</kbd>`,
      }[app.tutorial.getInputPreference()]) + ` to absolve your greed with credits.`,
    },
  ],
  getInteractLabelMore: () => 'Interact',
  incrementUses: function () {
    this.state.uses += 1

    return this
  },
  onEnterEffects: function () {
    if (!content.cellar.health.has(2)) {
      return
    }

    content.cellar.health.subtract(1)
    content.audio.sanityChange.trigger({isUp: false})

    this.effectsOnEnter.push({
      attribute: {
        label: 'Sanity drained',
        modifiers: [],
      },
    })
  },
  onInteractMore: function () {
    content.location.emit('cellar-pit', {
      tile: this,
    })
  },
  alterParticle: function (particle) {
    const radius = 10

    if (Math.abs(particle.target.x) > radius || Math.abs(particle.target.y) > radius) {
      return
    }

    let vector = engine.tool.vector2d.create(particle.target)
    const distance = 1 - (vector.distance() / radius)

    if (distance < 0) {
      return
    }

    const time = content.time.value()

    vector = vector.rotate(
      engine.const.tau * time * 0.05 * distance
    )

    particle.target.x = vector.x
    particle.target.y = vector.y
    particle.target.z -= distance * 2

    particle.target.v *= 1 - distance
  },
}, content.cellar.tiles.baseUnique)
