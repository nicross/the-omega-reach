content.cellar.health = (() => {
  let amount = 0

  function calculateMax() {
    const count = content.instruments.count()
    return 4 + (count ? Math.round(Math.sqrt(count)) : 0)
  }

  return {
    add: function (value = 1) {
      amount = engine.fn.clamp(amount + value, 0, calculateMax())

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

      return this
    },
  }
})()
