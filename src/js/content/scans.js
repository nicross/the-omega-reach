content.scans = (() => {
  const map = new Map()

  return {
    get: (name) => map.get(name) || 0,
    export: function () {
      const data = {}

      for (const [name, count] of map.entries()) {
        data[name] = count
      }

      return data
    },
    firstMoon: () => {
      let i = 0

      for (const [name, count] of map.entries()) {
        i += 1

        if (i == 3) {
          return name.split(' ').slice(2,4).join(' ')
        }
      }
    },
    import: function (data = {}) {
      for (const [name, count] of Object.entries(data)) {
        map.set(name, count)
      }

      return this
    },
    increment: function (name) {
      const next = (map.get(name) || 0) + 1
      map.set(name, next)
      return next
    },
    is: (name) => map.get(name) > 0,
    reset: function () {
      map.clear()

      return this
    },
  }
})()

engine.state.on('import', ({scans}) => content.scans.import(scans))
engine.state.on('export', (data) => data.scans = content.scans.export())
engine.state.on('reset', () => content.scans.reset())
