content.sphereIndex = (() => {
  const total = 3
  let value = engine.fn.randomInt(0, total - 1)

  return {
    get: () => value,
    randomize: function () {
      let next

      do {
        next = engine.fn.randomInt(0, total - 1)
      } while (next == value)

      value = next

      return this
    },
  }
})()
