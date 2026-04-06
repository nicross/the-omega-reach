content.cellar.deaths = (() => {
  let count = 0

  return {
    count: () => count,
    export: function () {
      return {
        count,
      }
    },
    has: (value = 1) => count >= value,
    import: function (data = {}) {
      count = data.count || 0

      return this
    },
    increment: function () {
      count += 1

      return this
    },
    reset: function () {
      count = 0

      return this
    },
  }
})()
