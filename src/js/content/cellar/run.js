content.cellar.run = (() => {
  let count = 0

  return {
    count: () => count,
    export: function () {
      return {
        count,
      }
    },
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
