content.donations = (() => {
  let amount = 0,
    collected = 0

  return {
    add: function (value = 0) {
      amount += Math.abs(value) || 0

      return this
    },
    amount: () => amount,
    collect: function (value = 0) {
      value = engine.fn.clamp(Math.abs(value) || 0, 0, amount)

      amount -= value
      collected += value

      return this
    },
    collected: () => collected,
    export: () => ({
      amount,
      collected,
    }),
    has: (value = 1) => value <= amount,
    import: function (data = {}) {
      amount = data.amount || 0
      collected = data.collected || 0

      return this
    },
    remove: function (value = 0) {
      amount -= engine.fn.clamp(Math.abs(value) || 0, 0, amount)

      return this
    },
    reset: function () {
      amount = 0
      collected = 0

      return this
    },
  }
})()

engine.state.on('export', (data) => data.donations = content.donations.export())
engine.state.on('import', ({donations}) => content.donations.import(donations))
engine.state.on('reset', () => content.donations.reset())

// Donation generation: must have at least one instrument, 3+ credits when fully scanning a body
engine.ready(() => {
  const allowedRooms = new Set(['star','planet','moon'])

  content.location.on('interact', ({room}) => {
    if (allowedRooms.has(room.id) && content.conservatory.isOpen()) {
      content.donations.add(1)
    }
  })

  content.location.on('interact-complete', ({room}) => {
    if (allowedRooms.has(room.id) && content.conservatory.isOpen()) {
      content.donations.add(2)
    }
  })
})
