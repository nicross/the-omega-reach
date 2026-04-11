content.cellar.health = (() => {
  const pubsub = engine.tool.pubsub.create()

  let amount = 0

  function calculateMax() {
    const count = content.instruments.count()
    return 4 + Math.round(Math.sqrt(2 * count))
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
    max: () => calculateMax(),
    progress: () => amount / calculateMax(),
    reset: function () {
      amount = 0

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
