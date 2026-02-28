content.cellar.position = (() => {
  let vector = engine.tool.vector2d.create()

  function calculateMax() {
    const count = content.instruments.count()
    return 2 + (count ? Math.round(Math.log2(count)) : 0)
  }

  return {
    export: function () {
      return {
        vector: vector.clone(),
      }
    },
    get: () => vector.clone(),
    import: function (data = {}) {
      vector = engine.tool.vector2d.create(data.vector)

      return this
    },
    reset: function () {
      vector = engine.tool.vector2d.create()

      return this
    },
    set: function (value) {
      vector = engine.tool.vector2d.create(value)

      return this
    },
  }
})()
