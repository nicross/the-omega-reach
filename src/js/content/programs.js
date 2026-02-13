content.programs = (() => {
  const registry = new Map()

  let loaded

  return {
    get: () => loaded,
    invent: function (definition, prototype = this.base) {
      registry.set(definition.id, prototype.extend(definition))
      return registry.get(definition.id)
    },
    load: function (id, instantiateOptions = {}, destroyOptions = {}) {
      if (loaded) {
        loaded.destroy(destroyOptions)
      }

      loaded = registry.get(id)?.create(instantiateOptions)

      return this
    },
    reset: function () {
      this.unload()

      return this
    },
    unload: function () {
      if (loaded) {
        loaded.destroy(destroyOptions)
      }

      loaded = undefined

      return this
    },
  }
})()

engine.state.on('reset', () => content.programs.unload())
