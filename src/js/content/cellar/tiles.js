content.cellar.tiles = (() => {
  const cache = engine.tool.cache3d.create(),
    registry = new Map(),
    uniques = []

  const offLimits = [
    engine.tool.vector3d.create({x: 0, y: 2, z: 0}), // stockroom
    engine.tool.vector3d.create({x: 0, y: 1, z: 0}), // shop
    engine.tool.vector3d.create({x: -1, y: 1, z: 0}), // atrium
    engine.tool.vector3d.create({x: -1, y: 2, z: 0}), // reach
    engine.tool.vector3d.create({x: -2, y: 1, z: 0}), // lobby
    engine.tool.vector3d.create({x: -1, y: 0, z: 0}), // gallery
  ]

  function generate(x, y, z) {
    const seed = ['cellar', content.cellar.run.count(), 'tile', x, y, z],
      srand = engine.fn.srand(...seed)

    const tile = {
      effects : [],
      note: engine.fn.choose([1,2,3,4,5,6,7,8,10,11,12], srand()),
      prime: engine.fn.choose([59, 61, 67, 73, 79, 83, 89, 97, 101, 103, 107, 109, 113], srand()),
      seed,
      x,
      y,
      z,
    }

    const types = getTypes(tile)
    const type = engine.fn.chooseWeighted(types, srand())

    if (type.uniquePerFloor || type.uniquePerRun) {
      uniques.push({
        id: type.id,
        x: tile.x,
        y: tile.y,
        z: tile.z,
      })
    }

    return type.generate(tile)
  }

  function getTypes(tile) {
    // Origin is always normal
    if (tile.x == 0 && tile.y == 0 && tile.z == 0) {
      return [
        registry.get('normal'),
      ]
    }

    // If known to be unique, force tile to be that type
    for (const unique of uniques) {
      if (unique.x == tile.x && unique.y == tile.y && unique.z == tile.z) {
        return [
          registry.get(unique.id),
        ]
      }
    }

    // Determine which unique types are already in-use
    const nonUniqueTypes = [],
      uniqueTypes = [],
      uniquesInUse = new Set()

    for (const unique of uniques) {
      const type = registry.get(unique.id)

      if (!type.uniquePerFloor || unique.z == tile.z) {
        uniquesInUse.add(unique.id)
      }
    }

    // Combine all non-unique and unused-unique types
    for (const type of registry.values()) {
      if (!type.uniquePerFloor && !type.uniquePerRun) {
        nonUniqueTypes.push(type)
      } else if (!uniquesInUse.has(type.id)) {
        uniqueTypes.push(type)
      }
    }

    return [
      ...nonUniqueTypes,
      ...uniqueTypes,
    ]
  }

  return {
    current: function () {
      return this.get(
        content.cellar.position.get()
      )
    },
    export: () => ({
      uniques: [...uniques],
    }),
    get: function ({x, y, z}) {
      if (!cache.has(x, y, z)) {
        cache.set(x, y, z, generate(x, y, z))
      }

      return cache.get(x, y, z)
    },
    import: function (data = {}) {
      if (data.uniques?.length) {
        for (const unique of data.uniques) {
          uniques.push(unique)
        }
      }

      return this
    },
    invent: function (prototype) {
      if (!this.base.isPrototypeOf(prototype)) {
        prototype = this.base.extend(prototype)
      }

      registry.set(prototype.id, prototype)

      return prototype
    },
    isOffLimits: ({x, y, z}) => {
      for (let vector of offLimits) {
        if (vector.x == x && vector.y == y && vector.z == z) {
          return true
        }
      }

      return false
    },
    reset: function () {
      cache.reset()
      uniques.length = 0

      return this
    },
  }
})()
