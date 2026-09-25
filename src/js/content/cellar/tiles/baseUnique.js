content.cellar.tiles.baseUnique = content.cellar.tiles.base.extend({
  alwaysAudible: true,
  category: 'default',
  effectsGlobal: [],
  effectsOnEnter: [],
  effectsUnique: [
    {
      attribute: {
        label: 'Radix of power',
        modifiers: ['legendary'],
      },
    },
  ],
  firstFloor: 0,
  isUnique: true,
  canGenerate: function (tile) {
    return engine.fn.between(tile.z, this.firstFloor, content.cellar.lastFloor() - 1)
  },
  getDialogs: () => [],
  getEffects: function () {
    return [
      ...this.effectsOnEnter,
      ...this.effectsGlobal,
      ...this.effectsUnique,
    ]
  },
  getGlobalDonationRate: () => 0,
  getGlobalHealthBonus: () => 0,
  onEnter: function () {
    this.effectsOnEnter = []
    this.onEnterEffects()

    content.cellar.scans.set(this, this.getEffects().length)
  },
  onEnterEffects: function () {},
  onExit: function () {
    this.effectsOnEnter = []
    this.onExitEffects()

    content.cellar.scans.set(this, 0)
  },
  onExitEffects: function () {},
})
