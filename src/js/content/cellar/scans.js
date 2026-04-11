content.cellar.scans = (() => {
  let cache = {}

  function get(x, y, z) {
    if (!(x in cache) || !(y in cache[x])) {
      return 0
    }

    return cache[x][y][z] || 0
  }

  function set(x, y, z, value) {
    if (!(x in cache)) {
      cache[x] = {}
    }

    if (!(y in cache[x])) {
      cache[x][y] = {}
    }

    cache[x][y][z] = value
  }

  return {
    delete: function ({x, y, z}) {
      set(x, y, z, 0)
      return this
    },
    export: function () {
      return {
        hash: {...cache},
      }
    },
    import: function (data = {}) {
      cache = {...(data.hash || {})}

      return this
    },
    increment: function ({x, y, z}) {
      const value = get(x, y, z) + 1
      set(x, y, z, value)
      return value
    },
    get: ({x, y, z}) => get(x, y, z),
    reset: function () {
      cache = {}

      return this
    },
  }
})()
