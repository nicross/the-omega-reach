content.wallet = (() => {
  let amount = 0

  return {
    add: function (value = 0) {
      amount += Math.abs(value) || 0

      return this
    },
    amount: () => amount,
    export: () => ({
      amount,
    }),
    has: (value = 1) => value <= amount,
    import: function (data = {}) {
      amount = data.amount || 0

      return this
    },
    reset: function () {
      amount = 0

      return this
    },
    subtract: function (value = 0) {
      amount -= Math.abs(value) || 0

      return this
    },
  }
})()

engine.state.on('export', (data) => data.wallet = content.wallet.export())
engine.state.on('import', ({wallet}) => content.wallet.import(wallet))
engine.state.on('reset', () => content.wallet.reset())
