content.galaxies = (() => {
  const generated = new Map(),
    names = new Set()

  const greekLetters = [
    'Alpha', 'Beta', 'Gamma', 'Delta', 'Epsilon',
    'Zeta', 'Eta', 'Theta', 'Iota', 'Kappa',
    'Lambda', 'Mu', 'Nu', 'Xi', 'Omicron',
    'Pi', 'Rho', 'Sigma', 'Tau', 'Upsilon',
    'Phi', 'Chi', 'Psi',
  ]

  const latinLetters = [
    'A', 'B', 'C', 'D', 'E',
    'F', 'G', 'H', 'I', 'J',
    'K', 'L', 'M', 'N', 'O',
    'P', 'Q', 'R', 'S', 'T',
    'U', 'V', 'W', 'X', 'Y',
    'Z',
  ]

  function generate(name) {
    const index = [...names].indexOf(name)
    const srand = (...seed) => engine.fn.srand('galaxy', name, 'attribute', ...seed)()

    return {
      age: srand('age'),
      habitability: engine.fn.lerp(0.5, 1, srand('habitability')),
      index,
      mass: srand('mass'),
      name,
      program: 'baseGalaxy',
      scale: [3,5,7,10,12],
      type: engine.fn.chooseWeighted([
        {label: 'Elliptical', weight: 1/3},
        {label: 'Lenticular', weight: 1/3/3},
        {label: 'Irregular', weight: 1/3/3},
        {label: 'Peculiar', weight: 1/3/3},
        {label: 'Spiral', weight: 1/3},
      ], srand('type')).label,
      wildcard: srand('wildcard'),
    }
  }

  function randomGreek() {
    return engine.fn.choose(greekLetters, Math.random())
  }

  function randomInteger(max) {
    return engine.fn.randomInt(1, max)
  }

  function randomLatin() {
    return engine.fn.choose(latinLetters, Math.random())
  }

  function uniqueName() {
    let name

    do {
      name = engine.fn.choose([
        () => `${randomLatin()} ${randomGreek()}`,
        () => `${randomLatin()}${randomInteger(99)} ${randomGreek()}`,
        () => `${randomInteger(99)}${randomLatin()} ${randomGreek()}`,
        () => `${randomInteger(999)} ${randomGreek()}`,
      ], Math.random())()
    } while (names.has(name))

    return name
  }

  return {
    count: () => names.size,
    export: () => ({
      discovered: [...names],
    }),
    firstName: () => {
      for (const name of names) {
        return name
      }
    },
    get: function (name) {
      if (!generated.has(name)) {
        generated.set(name, generate(name))
      }

      return generated.get(name)
    },
    hasIncomplete: function () {
      for (const galaxyName of names) {
        if (!this.isComplete(galaxyName)) {
          return true
        }
      }

      return false
    },
    import: function ({
      discovered = [],
    } = {}) {
      for (const name of discovered) {
        names.add(name)
      }

      return this
    },
    isComplete: function (galaxyName) {
      const galaxy = this.get(galaxyName)

      for (const starName of content.stars.namesForGalaxy(galaxyName)) {
        if (!content.stars.isComplete(starName)) {
          return false
        }
      }

      return true
    },
    new: function () {
      const name = uniqueName()
      names.add(name)
      return this.get(name)
    },
    names: () => [...names],
    reset: function () {
      generated.clear()
      names.clear()

      return this
    },
  }
})()

engine.state.on('import', ({galaxies}) => content.galaxies.import(galaxies))
engine.state.on('export', (data) => data.galaxies = content.galaxies.export())
engine.state.on('reset', () => content.galaxies.reset())
