content.cellar.scans = (() => {
  let cache = {}

  function get(x, y) {
    if (!(x in cache)) {
      cache[x] = {}
    }

    return cache[x][y] || 0
  }

  function set(x, y, value) {
    if (!(x in cache)) {
      cache[x] = {}
    }

    return cache[x][y] = value
  }

  return {
    export: function () {
      return {
        hash: {...cache},
      }
    },
    import: function (data = {}) {
      cache = {...(data.hash || {})}

      return this
    },
    increment: function ({x, y}) {
      const value = get(x, y) + 1
      set(x, y, value)
      return value
    },
    get: ({x, y}) => get(x, y),
    reset: function () {
      cache = {}

      return this
    },
  }
})()
