content.stars = (() => {
  const generated = new Map(),
    namesByGalaxy = new Map()

  const latinLetters = [
    'A', 'B', 'C', 'D', 'E',
    'F', 'G', 'H', 'I', 'J',
    'K', 'L', 'M', 'N', 'O',
    'P', 'Q', 'R', 'S', 'T',
    'U', 'V', 'W', 'X', 'Y',
    'Z',
  ]

  function extractGalaxyName(name) {
    const parts = name.split(' ')
    parts.pop()
    return parts.join(' ')
  }

  function generate(name) {
    const isTutorial = name.includes(content.const.tutorialName)

    const galaxyName = extractGalaxyName(name)
    const galaxy = content.galaxies.get(galaxyName)

    const srand = (...seed) => engine.fn.srand('star', name, 'attribute', ...seed)()

    const type = engine.fn.chooseWeighted(generateTypes(galaxy, srand), srand('type'))
    type.commonQuirks = engine.fn.shuffle(type.commonQuirks, engine.fn.srand(srand('sort','common')))
    type.rareQuirks = engine.fn.shuffle(type.rareQuirks, engine.fn.srand(srand('sort','rare')))

    const star = {
      age: srand('age') * galaxy.age,
      children: isTutorial ? 1 : Math.round(engine.fn.lerpExp(0, 12, srand('children') * type.planets, 1.5)),
      habitability: srand('habitability') * galaxy.habitability * type.habitability,
      galaxy,
      mass: srand('mass') * galaxy.mass,
      name,
      quirks: [],
      radius: srand('radius'),
      type: type.label,
      wildcard: (srand('wildcard') + galaxy.wildcard) * 0.5,
    }

    if (isTutorial || type.commonQuirks.length && srand('quirk', 'common1', 'roll') < star.wildcard) {
      star.quirks.push({
        name: engine.fn.chooseSplice(
          type.commonQuirks,
          srand('quirk', 'common1', 'type')
        ),
      })
    }

    if (!isTutorial && type.commonQuirks.length && srand('quirk', 'common2', 'roll') < star.wildcard/2) {
      star.quirks.push({
        name: engine.fn.chooseSplice(
          type.commonQuirks,
          srand('quirk', 'common2', 'type')
        ),
      })
    }

    if (!isTutorial && type.rareQuirks.length && srand('quirk', 'rare', 'roll') < star.wildcard/3) {
      star.quirks.push({
        isRare: true,
        name: engine.fn.chooseSplice(
          type.rareQuirks,
          srand('quirk', 'rare', 'type')
        ),
      })
    }

    return star
  }

  function generateTypes(galaxy, srand) {
    return [
      {
        label: 'Main sequence star',
        habitability: 1,
        planets: 1,
        weight: engine.fn.lerp(1/2, 0, galaxy.age),
        commonQuirks: [
          'Asteroid belt',
          'Highly metallic',
          'Irregular spin',
          'Mass ejections',
          'Stellar winds',
          'Stellar flares',
          'Unusual spectra',
        ],
        rareQuirks: [
          'Debris disk',
          'Distress beacon',
          'Protostar',
          'Spaceship graveyard',
        ],
      },
      {
        label: 'White dwarf',
        habitability: 1/2,
        planets: 1/4,
        weight: engine.fn.lerp(0, 1/2, galaxy.age),
        commonQuirks: [
          engine.fn.choose(['Carbon core', 'Neon core', 'Helium core'], srand('dwarf','core')),
          'High density',
          'Highly magnetic',
          'Highly metallic',
          'Irregular spin',
          'Planetary nebula',
          'Unusual spectra',
        ],
        rareQuirks: [
          'Collapsing core',
          'Distress beacon',
          'Runaway fusion',
          'Spaceship graveyard',
        ],
      },
      {
        label: 'Black hole',
        habitability: 1/8,
        planets: 1/4,
        weight: engine.fn.lerp(0, 1/6/2, galaxy.age),
        commonQuirks: [
          'Dilated time',
          'Gravitational lens',
          'Hawking radiation',
          'Irregular spin',
          'Photon sphere',
          'Relatavistic jets',
          'Unusual charge',
        ],
        rareQuirks: [
          'Accretion disk',
          'Distress beacon',
          'Quasar',
          'Spaceship graveyard',
          'Supernova remnant',
        ],
      },
      {
        label: 'Neutron star',
        habitability: 1/8,
        planets: 1/4,
        weight: engine.fn.lerp(0, 1/6/2, galaxy.age),
        commonQuirks: [
          'Dilated time',
          'Gravitational lens',
          'Irregular spin',
          'High density',
          'High gravity',
          'Highly magnetic',
          'Unusual spectra',
        ],
        rareQuirks: [
          'Gamma rays',
          'Distress beacon',
          'Pulsar',
          'Star quakes',
          'Spaceship graveyard',
          'Supernova remnant',
        ],
      },
      {
        label: 'Red supergiant',
        habitability: 1/4,
        planets: 1,
        weight: engine.fn.lerp(1/3/2, 1/6/2, galaxy.age),
        commonQuirks: [
          'Asteroid belt',
          'Highly metallic',
          'Irregular spin',
          'Low density',
          'Low gravity',
          'Mass ejections',
          'Stellar winds',
          'Super flares',
          'Unusual spectra',
        ],
        rareQuirks: [
          'Collapsing core',
          'Debris disk',
          'Distress beacon',
          'Spaceship graveyard',
          'Supernova candidate',
        ],
      },
      {
        label: 'Blue hypergiant',
        habitability: 1/4,
        planets: 1,
        weight: engine.fn.lerp(1/3/2, 1/6/2, galaxy.age),
        commonQuirks: [
          'Asteroid belt',
          'Highly metallic',
          'Irregular spin',
          'Low density',
          'Low gravity',
          'Mass ejections',
          'Stellar winds',
          'Super flares',
          'Unusual spectra',
        ],
        rareQuirks: [
          'Collapsing core',
          'Debris disk',
          'Distress beacon',
          'Spaceship graveyard',
          'Supernova candidate',
        ],
      },
    ]
  }

  function getNamesForGalaxy(galaxyName) {
    if (!namesByGalaxy.has(galaxyName)) {
      namesByGalaxy.set(galaxyName, new Set())
    }

    return namesByGalaxy.get(galaxyName)
  }

  function isEmpty() {
    for (const starNames of namesByGalaxy.values()) {
      if (starNames.size > 0) {
        return false
      }
    }

    return true
  }

  function randomInteger(max) {
    return engine.fn.randomInt(1, max)
  }

  function randomLatin() {
    return engine.fn.choose(latinLetters, Math.random())
  }

  function uniqueName(galaxyName) {
    const names = getNamesForGalaxy(galaxyName)

    let name

    do {
      name = engine.fn.choose([
        () => `${randomLatin()}${randomInteger(9)}${randomLatin()}${randomInteger(9)}`,
        () => `${randomLatin()}${randomLatin()}${randomInteger(99)}`,
        () => `${randomLatin()}${randomInteger(999)}`,
        () => `${randomInteger(9999)}`,
      ], Math.random())()
    } while (names.has(name))

    return `${galaxyName} ${name}`
  }

  return {
    countForGalaxy: (galaxyName) => getNamesForGalaxy(galaxyName).size,
    countForStar: (starName) => getNamesForGalaxy(extractGalaxyName(starName)).size,
    export: () => {
      const data = {}

      for (const [galaxyName, starNames] of namesByGalaxy.entries()) {
        data[galaxyName] = [...starNames]
      }

      return data
    },
    get: function (name) {
      if (!generated.has(name)) {
        generated.set(name, generate(name))
      }

      return generated.get(name)
    },
    import: function (data = {}) {
      for (const [galaxyName, starNames] of Object.entries(data)) {
        const names = getNamesForGalaxy(galaxyName)

        for (const starName of starNames) {
          names.add(starName)
        }
      }

      return this
    },
    isComplete: function (starName) {
      const star = this.get(starName)

      if (content.scans.get(starName) < 1 + star.quirks.length) {
        return false
      }

      for (const planetName of content.planets.namesForStar(starName)) {
        if (!content.planets.isComplete(planetName)) {
          return false
        }
      }

      return true
    },
    namesForGalaxy: (galaxyName) => [...getNamesForGalaxy(galaxyName)],
    namesForStar: (starName) => [...getNamesForGalaxy(extractGalaxyName(starName))],
    new: function (galaxyName) {
      const name = isEmpty() ? `${galaxyName} ${content.const.tutorialName}` : uniqueName(galaxyName)
      getNamesForGalaxy(galaxyName).add(name)
      return this.get(name)
    },
    reset: function () {
      generated.clear()
      namesByGalaxy.clear()

      return this
    },
  }
})()

engine.state.on('import', ({stars}) => content.stars.import(stars))
engine.state.on('export', (data) => data.stars = content.stars.export())
engine.state.on('reset', () => content.stars.reset())
