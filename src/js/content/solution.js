content.solution = (() => {
  const minSequentialDistance = 3/4

  let previous,
    solution

  return {
    generate: function (preference = app.settings.computed.inputPreference) {
      if (solution) {
        previous = solution
      }

      if (!content.location.get()?.hasSolution()) {
        solution = undefined

        return this
      }

      do {
        if (preference == 'keyboard') {
          solution = engine.fn.choose([...Object.values(
            app.controls.interactions.keyboardMappings()
          )], Math.random())
        } else if (preference == 'mouse') {
          solution = engine.tool.vector3d.create({
            x: engine.fn.randomFloat(0, 1),
            y: engine.fn.randomFloat(-1, 1),
            z: engine.fn.randomFloat(-1, 1),
          }).normalize()
        } else {
          solution = engine.tool.vector3d.create({
            x: engine.fn.randomFloat(-1, 1),
            y: engine.fn.randomFloat(-1, 1),
            z: engine.fn.randomFloat(-1, 1),
          }).normalize()
        }
      } while (previous && previous.distance(solution) < minSequentialDistance)

      return this
    },
    get: () => solution,
    has: () => Boolean(solution),
    reset: function () {
      previous = undefined
      solution = undefined

      return this
    },
  }
})()

engine.state.on('reset', () => content.solution.reset())
