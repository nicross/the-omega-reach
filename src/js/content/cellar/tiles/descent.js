content.cellar.tiles.descent = content.cellar.tiles.invent({
  alwaysAudible: true,
  id: 'descent',
  name: 'The descent',
  category: 'traversal',
  firstFloor: 0,
  isDescent: true,
  isUnique: true,
  uniquePerFloor: true,
  weight: 4,
  canGenerate: function (tile) {
    return engine.fn.between(tile.z, this.firstFloor, content.cellar.lastFloor() - 1)
  },
  canInteractMore: () => true,
  getDestination: function () {
    return content.cellar.tiles.get({
      x: this.x,
      y: this.y,
      z: this.z - 1,
    })
  },
  getDialogs: () => [
    {
      title: `It's an opening.`,
      description: `The deep chasm into which <strong>the cellar</strong> proceeds is gently lit by drifting wisps of sanity. You approach its interminable darkness with…`,
      actions: [
        {label: 'curiosity.'},
        {label: 'anxiety.'},
        {label: 'incredulity.'},
      ],
    },
    {
      tutorial: true,
      title: `<span class="u-highlight">[Tutorial]</span> <span class="u-screenReader">for</span> The descent:`,
      description: () => ({
        gamepad: `${app.settings.computed.inputHold ? 'Hold' : 'Press'} any <kbd>Face Button</kbd>`,
        keyboard: `${app.settings.computed.inputHold ? 'Hold' : 'Press'} <kbd>Enter</kbd> or <kbd>Spacebar</kbd>`,
        mouse: `${app.settings.computed.inputHold ? 'Click and hold' : 'Click'} the <kbd>Descent Button</kbd>`,
        touch: `${app.settings.computed.inputHold ? 'Tap and hold' : 'Tap'} the <kbd>Descent Button</kbd>`,
      }[app.tutorial.getInputPreference()]) + ` to delve into the next level of <strong>the cellar</strong>.`,
    },
  ],
  getEffects: function () {
    const labels = [
      'First',
      'Second',
      'Third',
      'Fourth',
      'Fifth',
      'Sixth',
      'Seventh',
      'Eighth',
      'Ninth',
      'Tenth',
    ]

    return [
      {
        attribute: {
          label: `${labels[Math.abs(this.z) + 1]} floor opening`,
          modifiers: ['legendary'],
        },
      },
    ]
  },
  getInteractLabelMore: () => 'Descend',
  onEnter: function () {
    content.cellar.scans.set(this, this.getEffects().length)
  },
  onExit: function () {
    content.cellar.scans.set(this, 0)
  },
  onInteractMore: function () {
    content.location.emit('cellar-descent', {
      tile: this,
    })
  },
  alterParticle: function (particle) {
    const radius = 3.333

    if (Math.abs(particle.target.x) > radius || Math.abs(particle.target.y) > radius) {
      return
    }

    let vector = engine.tool.vector2d.create(particle.target)
    let distance = vector.distance()

    if (distance > radius) {
      return
    }

    const time = content.time.value()

    vector = vector.normalize()
      .scale(radius)
      .rotate(engine.const.tau * time / 60)

    particle.target.x = vector.x
    particle.target.y = vector.y
    particle.target.z = particle.floor.z + engine.fn.scale(Math.sin(engine.const.tau * time / 20 * particle.twinkleFrequencies[0]), -1, 1, -10, 0)

    particle.target.s = 0.666 + (0.333 * Math.sin(engine.const.tau * time * particle.twinkleFrequencies[1]))
  },
  // XXX: Does not extend baseUnique
  getGlobalDonationRate: () => 0,
  getGlobalHealthBonus: () => 0,
})
