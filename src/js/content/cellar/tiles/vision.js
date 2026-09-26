content.cellar.tiles.vision = content.cellar.tiles.invent({
  id: 'vision',
  name: 'The vision',
  category: 'special',
  uniquePerRun: true,
  weight: 1,
  defaultState: {
    active: true,
    entered: false,
  },
  activeHealthBonus: 3,
  canInteractMore: function () {
    return content.cellar.health.has(this.calculateCost() + 1)
  },
  getDialogs: function () {
    return [
      {
        title: `It's an omen.`,
        description: ``,
        actions: [
          {label: 'Quiver cowardly'},
          {label: 'Scoff skeptically'},
        ],
      },
      {
        tutorial: true,
        title: `<span class="u-highlight">[Tutorial]</span> <span class="u-screenReader">for</span> The vision:`,
        description: () => `You lose <strong class="a-game--dialogHealth">${app.utility.format.health(this.activeHealthBonus)}</strong> while under its gaze. ` + ({
          gamepad: `${app.settings.computed.inputHold ? 'Hold' : 'Press'} any <kbd>Face Button</kbd>`,
          keyboard: `${app.settings.computed.inputHold ? 'Hold' : 'Press'} <kbd>Enter</kbd> or <kbd>Spacebar</kbd>`,
          mouse: `${app.settings.computed.inputHold ? 'Click and hold' : 'Click'} the <kbd>Interact Button</kbd>`,
          touch: `${app.settings.computed.inputHold ? 'Tap and hold' : 'Tap'} the <kbd>Interact Button</kbd>`,
        }[app.tutorial.getInputPreference()]) + ` to restore your maximum sanity.`,
      },
    ]
  },
  getEffects: function () {
    return [
      {
        attribute: {
          label: this.state.active ? 'Weakened sanity' : 'Banished curse',
          modifiers: [],
        }
      },
      ...this.effectsUnique,
    ]
  },
  getGlobalHealthBonus: function () {
    return this.state.active ? -this.activeHealthBonus : 0
  },
  getInteractLabelMore: () => 'Interact',
  onEnterEffects: function () {
    if (this.state.entered) {
      return
    }

    this.state.entered = true

    const health = content.cellar.health.amount()
    const target = Math.max(1, content.cellar.health.max(true) + this.getGlobalHealthBonus())

    if (health > target) {
      content.cellar.health.set(target)
      content.audio.healthChange.trigger({isUp: false})
    }
  },
  onInteractMore: function () {
    content.location.emit('cellar-vision', {
      tile: this,
    })
  },
  alterParticle: function (particle) {
    const radius = 7.5

    if (Math.abs(particle.target.x) > radius || Math.abs(particle.target.y) > radius || !this.state.active) {
      return
    }

    const time = content.time.value()
    const value = 0.5 + (0.5 * Math.sin(engine.const.tau * time/30 * particle.twinkleFrequencies[0]))

    particle.target.x = engine.fn.lerpExp(particle.floor.x, 0, value, 3)
    particle.target.y = engine.fn.lerpExp(particle.floor.y, 0, value, 3)
    particle.target.z = engine.fn.lerpExp(particle.floor.z, 2, value, 1)

    particle.target.s = engine.fn.lerpExp(
      0,
      0.5 + (0.5 * Math.sin(engine.const.tau * time * particle.twinkleFrequencies[0])),
      value,
      0.5,
    )

    particle.target.v = engine.fn.lerpExp(
      1,
      0.5 + (0.5 * Math.sin(engine.const.tau * time * particle.twinkleFrequencies[0])),
      value,
      0.5,
    )
  },
  // Interactions
  calculateCost: function () {
    return content.cellar.health.max() - 1
  },
}, content.cellar.tiles.baseUnique)
