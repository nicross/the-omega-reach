content.cellar.discovered = (() => {
  const cache = engine.tool.cache3d.create(),
    flattened = []

  return {
    count: () => flattened.length,
    countForFloor: (z) => flattened.filter((array) => Math.abs(array[2]) == Math.abs(z)).length,
    export: function () {
      return {
        vectors: flattened.map((x) => [...x]),
      }
    },
    hasAny: () => flattened.length > 1,
    import: function (data = {}) {
      for (const [x, y, z] of data.vectors || []) {
        flattened.push([x, y, z])
        cache.set(x, y, z, true)
      }

      return this
    },
    is: ({x, y, z}) => cache.has(x, y, z),
    reset: function () {
      cache.reset()
      flattened.length = 0

      return this
    },
    set: function ({x, y, z}, value = true) {
      if (!cache.has(x, y, z)) {
        flattened.push([x, y, z])
        cache.set(x, y, z, true)
      }

      return this
    },
  }
})()
