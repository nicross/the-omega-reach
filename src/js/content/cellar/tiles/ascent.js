content.cellar.tiles.ascent = content.cellar.tiles.invent({
  alwaysAudible: true,
  id: 'ascent',
  name: 'The ascent',
  category: 'traversal',
  firstFloor: -1,
  isAscent: true,
  isUnique: true,
  uniquePerFloor: true,
  weight: 4,
  canGenerate: function (tile) {
    return engine.fn.between(tile.z, this.firstFloor, content.cellar.lastFloor())
  },
  canInteractMore: () => true,
  getDestination: function () {
    return content.cellar.tiles.get({
      x: this.x,
      y: this.y,
      z: this.z + 1,
    })
  },
  getDialogs: () => [
    {
      tutorial: true,
      title: `<span class="u-highlight">[Tutorial]</span> <span class="u-screenReader">for</span> The ascent:`,
      description: () => ({
        gamepad: `${app.settings.computed.inputHold ? 'Hold' : 'Press'} any <kbd>Face Button</kbd>`,
        keyboard: `${app.settings.computed.inputHold ? 'Hold' : 'Press'} <kbd>Enter</kbd> or <kbd>Spacebar</kbd>`,
        mouse: `${app.settings.computed.inputHold ? 'Click and hold' : 'Click'} the <kbd>Ascend Button</kbd>`,
        touch: `${app.settings.computed.inputHold ? 'Tap and hold' : 'Tap'} the <kbd>Ascend Button</kbd>`,
      }[app.tutorial.getInputPreference()]) + ` to return to the previous level of <strong>the cellar</strong>.`,
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
          label: `${labels[Math.abs(this.z) - 1]} floor opening`,
          modifiers: ['legendary'],
        },
      },
    ]
  },
  onEnter: function () {
    content.cellar.scans.set(this, this.getEffects().length)
  },
  onExit: function () {
    content.cellar.scans.set(this, 0)
  },
  getInteractLabelMore: () => 'Ascend',
  onInteractMore: function () {
    content.location.emit('cellar-ascent', {
      tile: this,
    })
  },
  alterParticle: function (particle) {
    const radius = 3.333

    if (Math.abs(particle.target.x) > radius || Math.abs(particle.target.y) > radius) {
      return
    }

    let vector = engine.tool.vector2d.create(particle.target)
    const distance = vector.distance()

    if (distance > radius) {
      return
    }

    const time = content.time.value()

    vector = vector.normalize()
      .scale(radius)
      .rotate(engine.const.tau * time / 60)

    particle.target.x = vector.x
    particle.target.y = vector.y
    particle.target.z = particle.floor.z + engine.fn.scale(Math.sin(engine.const.tau * time / 20 * particle.twinkleFrequencies[0]), -1, 1, 0, 10)

    particle.target.s = 0.666 + (0.333 * Math.sin(engine.const.tau * time * particle.twinkleFrequencies[1]))
  },
  // XXX: Does not extend baseUnique
  getGlobalDonationRate: () => 0,
  getGlobalHealthBonus: () => 0,
})
