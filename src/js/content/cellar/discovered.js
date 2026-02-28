content.cellar.discovered = (() => {
  const cache = engine.tool.cache2d.create(),
    flattened = []

  return {
    export: function () {
      return {
        vectors: flattened.map((x) => [...x]),
      }
    },
    hasAny: () => flattened.length > 1,
    import: function (data = {}) {
      for (const [x, y] of data.vectors || []) {
        flattened.push([x, y])
        cache.set(x, y, true)
      }

      return this
    },
    is: ({x, y}) => cache.has(x, y),
    reset: function () {
      cache.reset()
      flattened.length = 0

      return this
    },
    set: function ({x, y}, value = true) {
      if (!cache.has(x, y)) {
        flattened.push([x, y])
        cache.set(x, y, true)
      }

      return this
    },
  }
})()
