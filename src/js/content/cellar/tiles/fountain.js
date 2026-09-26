content.cellar.tiles.fountain = content.cellar.tiles.invent({
  id: 'fountain',
  name: 'The fountain',
  category: 'positive',
  uniquePerFloor: true,
  weight: 8,
  defaultState: {
    uses: 0,
  },
  getDialogs: () => [
    {
      title: `It's a fountain.`,
      description: `A spring of sanity babbles calmly, submerging its menagerie of shinies accumulated across eternities. Legends say donating may improve one's <em>earthen luck</em>.`,
      actions: [
        {label: 'Smile whimsically'},
        {label: 'Scoff snootily'},
      ],
    },
    {
      tutorial: true,
      title: `<span class="u-highlight">[Tutorial]</span> <span class="u-screenReader">for</span> The fountain:`,
      description: () => ({
        gamepad: `${app.settings.computed.inputHold ? 'Hold' : 'Press'} any <kbd>Face Button</kbd>`,
        keyboard: `${app.settings.computed.inputHold ? 'Hold' : 'Press'} <kbd>Enter</kbd> or <kbd>Spacebar</kbd>`,
        mouse: `${app.settings.computed.inputHold ? 'Click and hold' : 'Click'} the <kbd>Interact Button</kbd>`,
        touch: `${app.settings.computed.inputHold ? 'Tap and hold' : 'Tap'} the <kbd>Interact Button</kbd>`,
      }[app.tutorial.getInputPreference()]) + ` to donate credits for your sanity. You may recover them from <strong>the lobby</strong>.`
    },
  ],
  calculateCost: function (uses = this.state.uses + 1) {
    // Fibonacci sequence, starting at second term: 1, 2, 3, 5, 8, 13...
    let x = 1,
      y = 0

    for (let i = 0; i < uses; i += 1) {
      [x, y] = [x+y, x]
    }

    return x
  },
  calculateRecovery: function () {
    return 1 + this.state.uses
  },
  canInteractMore: function () {
    return content.wallet.has(this.calculateCost())
  },
  getInteractLabelMore: () => 'Interact',
  incrementUses: function () {
    this.state.uses += 1

    return this
  },
  onEnterEffects: function () {
    // Add one health

    if (content.cellar.health.isMax()) {
      return
    }

    content.cellar.health.add(1)
    content.audio.healthChange.trigger({isUp: true})

    this.effectsOnEnter.push({
      attribute: {
        label: 'Sanity recovered',
        modifiers: [],
      },
    })
  },
  onInteractMore: function () {
    content.location.emit('cellar-fountain', {
      tile: this,
    })
  },
  alterParticle: function (particle) {
    const radius = 10

    if (Math.abs(particle.target.x) > radius || Math.abs(particle.target.y) > radius) {
      return
    }

    let vector = engine.tool.vector2d.create(particle.target)
    let distance = vector.distance() / radius

    if (distance > 1) {
      return
    }

    const time = content.time.value()
    const scale = Math.sin(engine.const.tau * time / 30 * particle.twinkleFrequencies[0])

    distance = (1 - (distance * Math.abs(scale))) ** 1.5

    particle.target.x = vector.x * scale
    particle.target.y = vector.y * scale
    particle.target.z += 0.375 * distance

    particle.target.s = distance * (0.875 + (0.125 * Math.sin(engine.const.tau * time * particle.twinkleFrequencies[1])))
  },
}, content.cellar.tiles.baseUnique)
