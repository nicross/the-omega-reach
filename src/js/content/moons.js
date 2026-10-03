content.moons = (() => {
  const generated = new Map()

  function extractIndex(name) {
    return Number(name.substring(extractPlanetName(name).length)) - 2
  }

  function extractPlanetName(name) {
    return /(.+\D)\d+/.exec(name)[1]
  }

  function generate(name) {
    const index = extractIndex(name)

    const planetName = extractPlanetName(name)
    const planet = content.planets.get(planetName)

    const isTutorial = planet.star.isTutorial

    const srand = (...seed) => engine.fn.srand('moon', name, 'attribute', ...seed)()

    const type = engine.fn.chooseWeighted(generateTypes({
      planet,
      srand,
    }), srand('type'))

    type.commonQuirks = engine.fn.shuffle(type.commonQuirks, engine.fn.srand(srand('sort','common')))
    type.rareQuirks = engine.fn.shuffle(type.rareQuirks, engine.fn.srand(srand('sort','rare')))

    const moon = {
      age: srand('age') * planet.age,
      habitability: planet.habitability, // Inherit from planet
      heat: planet.habitability, // Inherit from planet
      index,
      mass: srand('mass') * planet.mass,
      name,
      planet,
      program: type.program || 'baseMoon',
      quirks: [],
      radius: srand('radius') * planet.radius,
      type: type.label,
      wildcard: (srand('wildcard') + planet.wildcard) * 0.5, // Inherit from star
    }

    if (!isTutorial && type.commonQuirks.length && srand('quirk', 'common1', 'roll') < moon.wildcard) {
      moon.quirks.push({
        name: engine.fn.chooseSplice(
          type.commonQuirks,
          srand('quirk', 'common1', 'type')
        ),
      })
    }

    if (!isTutorial && type.commonQuirks.length && srand('quirk', 'common2', 'roll') < moon.wildcard/1.5) {
      moon.quirks.push({
        name: engine.fn.chooseSplice(
          type.commonQuirks,
          srand('quirk', 'common2', 'type')
        ),
      })
    }

    if (!isTutorial && type.rareQuirks.length && srand('quirk', 'rare', 'roll') < moon.wildcard/2) {
      moon.quirks.push({
        isRare: true,
        name: engine.fn.chooseSplice(
          type.rareQuirks,
          srand('quirk', 'rare', 'type')
        ),
      })
    }

    moon.instrument = isTutorial
      ? true
      : srand('instrument', 'roll') < type.instrument * moon.wildcard/2

    return moon
  }

  function generateTypes({
    planet,
    srand,
  } = {}) {
    const commonQuirks = [
      engine.fn.choose(['High','Low'], srand('density')) + ' density',
      engine.fn.choose(['High','Low'], srand('gravity')) + ' gravity',
      'Geological activity',
      engine.fn.choose(['Strong','Weak'], srand('magnetism')) + ' magnetic field',
    ]

    const rareQuirks = [
      planet.heat > 0.5 ? 'Captured asteroid' : 'Captured comet',
      'Distress beacon',
      'Extreme tilt',
      'High eccentricity',
      'High inclination',
      'Navigational beacon',
      'Recent impact',
      'Retrograde orbit',
      'Retrograde spin',
      'Spaceship graveyard',
      'Tidally locked',
    ]

    const rareTerrestrialQuirks = [
      ...rareQuirks,
      'Mining stations',
      'Organic compounds',
      'Precious metals',
      'Precious minerals',
      'Research stations',
    ]

    const lifeQuirks = [
      'Primordial life',
      'Microbial life',
      'Fungal life',
      'Floral life',
      'Animal life',
      'Intelligent life',
    ]

    return [
      {
        label: 'Rocky moon',
        program: 'rockyMoon',
        instrument: 1,
        weight: 1,
        commonQuirks: [
          ...commonQuirks,
          'Fine regolith',
          'Heavily cratered',
          'High albedo',
          'Highly metallic',
        ],
        rareQuirks: [
          ...rareQuirks,
          ...rareTerrestrialQuirks,
          lifeQuirks[0],
          'Diamond fields',
          'Iron lakes',
          'Long markings',
          'Polar ice',
          'Stripped atmosphere',
          'Tenuous atmosphere',
        ],
      },
      {
        label: 'Acid moon',
        program: 'acidMoon',
        instrument: 1,
        weight: 1 - planet.habitability,
        commonQuirks: [
          ...commonQuirks,
          'Acid ocean',
          'Acid rain',
          'Cyclonic storms',
          'Greenhouse gases',
          'Lightning storms',
          'Thick atmosphere',
        ],
        rareQuirks: [
          ...rareQuirks,
          ...rareTerrestrialQuirks,
          lifeQuirks[0],
          'Ancient ruins',
          'Captured asteroid',
          'Tectonic plates',
        ],
      },
      {
        label: 'Hycean moon',
        program: 'hyceanMoon',
        instrument: 1,
        moons: 2,
        weight: planet.habitability,
        commonQuirks: [
          ...commonQuirks,
          lifeQuirks[1],
          lifeQuirks[2],
          lifeQuirks[3],
          'Breathable atmosphere',
          'Cyclonic storms',
          'Polar ice',
          'Tectonic plates',
          'Water ocean',
        ],
        rareQuirks: [
          ...rareQuirks,
          ...rareTerrestrialQuirks,
          lifeQuirks[4],
          lifeQuirks[5],
          'Hydrothermal vents',
          'Heavy water',
          'Magnetic storms',
          'Vaporizing',
        ],
      },
      {
        label: 'Terran moon',
        program: 'terranMoon',
        instrument: 1,
        weight: 2 * planet.habitability,
        commonQuirks: [
          ...commonQuirks,
          lifeQuirks[1],
          lifeQuirks[2],
          lifeQuirks[3],
          'Ancient ruins',
          'Breathable atmosphere',
          'Cyclonic storms',
          'Lightning storms',
          'Polar ice',
          'Tectonic plates',
          'Water ocean',
        ],
        rareQuirks: [
          ...rareQuirks,
          ...rareTerrestrialQuirks,
          lifeQuirks[4],
          lifeQuirks[5],
          'Abandoned cities',
          'Greenhosue gases',
          'Heavy water',
          'Magnetic storms',
          'Terraformed',
        ],
      },
      {
        label: 'Desert moon',
        program: 'desertMoon',
        instrument: 1,
        weight: 1,
        commonQuirks: [
          ...commonQuirks,
          lifeQuirks[0],
          lifeQuirks[1],
          'Dried riverbeds',
          'Dust storms',
          'Fine regolith',
          'Polar ice',
          'Thin atmosphere',
        ],
        rareQuirks: [
          ...rareQuirks,
          ...rareTerrestrialQuirks,
          lifeQuirks[2],
          lifeQuirks[3],
          'Ancient ruins',
          'Breathable atmosphere',
          'Lightning storms',
          'Tectonic plates',
        ],
      },
      {
        label: 'Arctic moon',
        program: 'arcticMoon',
        instrument: 1,
        weight: 1 - planet.heat,
        commonQuirks: [
          ...commonQuirks,
          lifeQuirks[0],
          lifeQuirks[1],
          engine.fn.choose(['Ammonia','Dry ice','Methane','Water ice'], srand('arctic moon','surface')) + ' surface',
          'Cryovolcanism',
          'Extreme cold',
          'Global cryosphere',
          'Heavily cratered',
          'High albedo',
          'Long markings',
          'Subsurface ocean',
          'Thin atmosphere',
        ],
        rareQuirks: [
          ...rareQuirks,
          ...rareTerrestrialQuirks,
          lifeQuirks[2],
          lifeQuirks[3],
          'Breathable atmosphere',
          'Heavy water',
          'Sublimating',
        ],
      },
      {
        label: 'Lava moon',
        program: 'lavaMoon',
        habitability: 0,
        instrument: 1,
        weight: 1,
        commonQuirks: [
          ...commonQuirks,
          'Ashen atmosphere',
          'Lava rivers',
          'Planetary impact',
          'Volcanic activity',
        ],
        rareQuirks: [
          ...rareQuirks,
          ...rareTerrestrialQuirks,
          lifeQuirks[0],
          lifeQuirks[1],
          'Lava oceans',
          'Megaquakes',
          'Supervolcanoes',
          'Tectonic plates',
        ],
      },
      // Black holes
      {
        label: 'Black hole',
        program: 'blackHoleMoon',
        habitability: 0,
        instrument: 0,
        weight: planet.wildcard * planet.age * 0.5,
        commonQuirks: [
          'Dilated time',
          'Dark matter candidate',
          'Gravitational microlens',
          'Hawking radiation',
          'Irregular spin',
          'Primordial',
          'Unusual charge',
        ],
        rareQuirks: [
          ...rareQuirks,
        ],
      },
    ]
  }

  return {
    get: function (name) {
      if (!generated.has(name)) {
        generated.set(name, generate(name))
      }

      return generated.get(name)
    },
    isComplete: function (moonName) {
      const moon = this.get(moonName)

      return content.scans.get(moonName) >= 1 + moon.quirks.length + (moon.instrument ? 1 : 0)
    },
    namesForPlanet: (planetName) => {
      const planet = content.planets.get(planetName)
      const names = []

      for (let i = 0; i < planet.children; i += 1) {
        names.push(
          `${planet.name}${2 + i}`
        )
      }

      return names
    },
    namesForMoon: function (moonName) {
      return this.namesForPlanet(
        extractPlanetName(moonName)
      )
    },
    reset: function () {
      generated.clear()

      return this
    },
  }
})()

engine.state.on('reset', () => content.moons.reset())
