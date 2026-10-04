content.cellar.health = (() => {
  const pubsub = engine.tool.pubsub.create()

  let amount = 0

  function calculateMax(isRaw = false) {
    const instruments = content.instruments.count(),
      runs = content.cellar.run.count()

    const bonus = Math.min(
      Math.round(Math.sqrt(4 * instruments)),
      Math.max(0, (runs - 1) * 2),
    )

    const raw = 4 + bonus

    return isRaw
      ? raw
      : raw + content.cellar.tiles.calculateGlobalHealthBonus()
  }

  return pubsub.decorate({
    add: function (value = 1) {
      amount = engine.fn.clamp(amount + value, 0, calculateMax())
      pubsub.emit('add')

      return this
    },
    amount: () => amount,
    export: function () {
      return {
        amount,
      }
    },
    has: (value = 1) => amount >= value,
    import: function (data = {}) {
      amount = data.amount || 0

      return this
    },
    isMax: () => amount == calculateMax(),
    max: (isRaw = false) => calculateMax(isRaw),
    progress: () => amount / calculateMax(),
    reset: function () {
      amount = 0

      return this
    },
    set: function (value = 0) {
      amount = engine.fn.clamp(value, 0, calculateMax())

      return this
    },
    setMax: function () {
      amount = calculateMax()

      return this
    },
    subtract: function (value = 1) {
      amount = engine.fn.clamp(amount - value, 0, calculateMax())
      pubsub.emit('subtract')

      return this
    },
  })
})()
