content.cellar.tiles.base = {
  effects : undefined,
  note: undefined,
  prime: undefined,
  uniquePerFloor: false,
  uniquePerRun: false,
  weight: 1,
  x: undefined,
  y: undefined,
  z: undefined,
  // Generator
  generate: function (tile = {}) {
    return this.extend(tile)
  },
  // Methods
  extend: function (definition = {}) {
    return engine.fn.extend(this, definition)
  },
  getEffects: function () {
    return this.effects || []
  },
}
