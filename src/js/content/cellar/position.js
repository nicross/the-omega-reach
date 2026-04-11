content.cellar.position = (() => {
  let vector = engine.tool.vector3d.create()

  return {
    export: function () {
      return {
        vector: vector.clone(),
      }
    },
    get: () => vector.clone(),
    import: function (data = {}) {
      vector = engine.tool.vector3d.create(data.vector)

      return this
    },
    is: ({x, y, z}) => vector.x == x && vector.y == y && vector.z == z,
    reset: function () {
      vector = engine.tool.vector2d.create()

      return this
    },
    set: function (value) {
      vector = engine.tool.vector3d.create(value)

      return this
    },
  }
})()
