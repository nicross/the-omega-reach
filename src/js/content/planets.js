content.planets = (() => {
  const generated = new Map(),
    namesByStar = new Map()

  const latinLetters = [
    'a', 'b', 'c', 'd', 'e',
    'f', 'g', 'h', 'i', 'j',
    'k', 'l', 'm', 'n', 'o',
    'p', 'q', 'r', 's', 't',
    'u', 'v', 'w', 'x', 'y',
    'z',
  ]

  function extractIndex(name) {
    return latinLetters.indexOf(
      name.split(' ').pop()
    ) - 1
  }

  function extractStarName(name) {
    const parts = name.split(' ')
    parts.pop()
    return parts.join(' ')
  }

  function generate(name) {
    const isTutorial = name.includes(content.const.tutorialName)

    const starName = extractStarName(name)
    const star = content.galaxies.get(starName)

    const index = extractIndex(name)
    const habitability = star.habitability * (
      star.children <= 2
        ? srand('habitability')
        : Math.sin(Math.PI * index / star.children)
    )
    const heat = star.children == 1
      ? srand('heat')
      : 1 - (index / star.children)

    const srand = (...seed) => engine.fn.srand('planet', name, 'attribute', ...seed)()

    const type = engine.fn.chooseWeighted(generateTypes({
      habitability,
      heat,
      srand,
      star,
    }), srand('type'))

    type.commonQuirks = engine.fn.shuffle(type.commonQuirks, engine.fn.srand(srand('sort','common')))
    type.rareQuirks = engine.fn.shuffle(type.rareQuirks, engine.fn.srand(srand('sort','rare')))

    const planet = {
      age: srand('age') * star.age,
      children: isTutorial ? 1 : Math.round(engine.fn.lerpExp(0, 6, srand('children') * type.moons, 1.5)),
      habitability, // Pass raw habitability to children, not type habitability
      heat,
      index,
      mass: srand('mass') * star.mass,
      name,
      quirks: [],
      radius: srand('radius'),
      star,
      type: type.label,
      wildcard: (srand('wildcard') + star.wildcard) * 0.5,
    }

    if (!isTutorial && type.commonQuirks.length && srand('quirk', 'common1', 'roll') < planet.wildcard) {
      planet.quirks.push({
        name: engine.fn.chooseSplice(
          type.commonQuirks,
          srand('quirk', 'common1', 'type')
        ),
      })
    }

    if (!isTutorial && type.commonQuirks.length && srand('quirk', 'common2', 'roll') < planet.wildcard/1.5) {
      planet.quirks.push({
        name: engine.fn.chooseSplice(
          type.commonQuirks,
          srand('quirk', 'common2', 'type')
        ),
      })
    }

    if (isTutorial || type.rareQuirks.length && srand('quirk', 'rare', 'roll') < planet.wildcard/2) {
      planet.quirks.push({
        isRare: true,
        name: engine.fn.chooseSplice(
          type.rareQuirks,
          srand('quirk', 'rare', 'type')
        ),
      })
    }

    planet.instrument = isTutorial
      ? false
      : srand('instrument', 'roll') < type.instrument * planet.wildcard/2

    return planet
  }

  function generateTypes({
    habitability,
    heat,
    srand,
    star,
  } = {}) {
    const commonQuirks = [
      engine.fn.choose(['High','Low'], srand('density')) + ' density',
      engine.fn.choose(['High','Low'], srand('gravity')) + ' gravity',
    ]
    const commonGiantQuirks = [
      'Anticyclonic storms',
      'Banded clouds',
      'Extreme winds',
      'Gravity well',
      'Ring system',
      'Rocky core',
      'Strong magnetic field',
    ]
    const commonTerrestrialQuirks = [
      'Geological activity',
      engine.fn.choose(['Strong','Weak'], srand('magnetism')) + ' magnetic field',
    ]

    const rareQuirks = [
      'Extreme tilt',
      'Organic compounds',
      'Recent impact',
      'Retrograde orbit',
      'Retrograde spin',
      'Spaceship graveyard',
    ]
    const rareGiantQuirks = [
      'Decommissioned probes',
      'Internal heating',
      'Magnetic storms',
    ]
    const rareTerrestrialQuirks = [
      'Distress beacon',
      'Precious metals',
      'Precious minerals',
      'Ring system',
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
        label: 'Gas giant',
        instrument: 0,
        moons: 1,
        weight: 1,
        commonQuirks: [
          ...commonQuirks,
          ...commonGiantQuirks,
          'Highly metallic',
        ],
        rareQuirks: [
          ...rareQuirks,
          ...rareGiantQuirks,
          lifeQuirks[0],
          'Captured asteroid',
          'Contracting interior',
          'Failed star',
        ],
      },
      {
        label: 'Ice giant',
        instrument: 0,
        moons: 1,
        weight: 1 - heat,
        commonQuirks: [
          ...commonQuirks,
          ...commonGiantQuirks,
          'Icy mantle',
        ],
        rareQuirks: [
          ...rareQuirks,
          ...rareGiantQuirks,
          lifeQuirks[0],
          'Captured comet',
          'Diamond rain',
          'Extreme cold',
          'Heavy water',
        ],
      },
      {
        label: 'Rocky planet',
        instrument: 1,
        moons: 1/3,
        weight: 1 * 0.5,
        commonQuirks: [
          ...commonQuirks,
          ...commonTerrestrialQuirks,
          'Cratered',
          'Fine regolith',
          'High albedo',
          'Highly metallic',
        ],
        rareQuirks: [
          ...rareQuirks,
          ...rareTerrestrialQuirks,
          lifeQuirks[0],
          'Captured asteroid',
          'Mining sites',
          'Polar ice',
          'Research stations',
          'Tenuous atmosphere',
        ],
      },
      {
        label: 'Acid planet',
        instrument: 1,
        moons: 1/3,
        weight: habitability * 0.5,
        commonQuirks: [
          ...commonQuirks,
          ...commonTerrestrialQuirks,
          'Acid ocean',
          'Acid rain',
          'Cyclonic storms',
          'Greenhouse gases',
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
        label: 'Terran planet',
        instrument: 1,
        moons: 1/2,
        weight: habitability,
        commonQuirks: [
          ...commonQuirks,
          ...commonTerrestrialQuirks,
          lifeQuirks[1],
          lifeQuirks[2],
          lifeQuirks[3],
          'Ancient ruins',
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
          'Abandoned cities',
          'Captured asteroid',
          'Heavy water',
          'Magnetic storms',
          'Terraformed',
        ],
      },
      {
        label: 'Desert planet',
        instrument: 1,
        moons: 1/3,
        weight: (1 - habitability) * 0.5,
        commonQuirks: [
          ...commonQuirks,
          ...commonTerrestrialQuirks,
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
          'Captured asteroid',
          'Breathable atmosphere',
          'Mining sites',
          'Research stations',
          'Tectonic plates',
        ],
      },
      {
        label: 'Arctic planet',
        habitability: 1/3,
        instrument: 1,
        moons: 1/3,
        weight: (1 - heat) * 0.5,
        commonQuirks: [
          ...commonQuirks,
          ...commonTerrestrialQuirks,
          lifeQuirks[0],
          lifeQuirks[1],
          'Extreme cold',
          'High albedo',
          'Subsurface ocean',
          'Thin atmosphere',
        ],
        rareQuirks: [
          ...rareQuirks,
          ...rareTerrestrialQuirks,
          lifeQuirks[2],
          lifeQuirks[3],
          'Breathable atmosphere',
          'Captured comet',
          'Heavy water',
          'Research stations',
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
    isComplete: function (planetName) {
      const planet = this.get(planetName)

      if (content.scans.get(planetName) < 1 + planet.quirks.length + (planet.instrument ? 1 : 0)) {
        return false
      }

      for (const moonName of content.moons.namesForPlanet(planetName)) {
        if (!content.moons.isComplete(moonName)) {
          return false
        }
      }

      return true
    },
    namesForStar: (starName) => {
      const star = content.stars.get(starName)

      return latinLetters
        .slice(1, 1 + star.children)
        .map((designation) => `${star.name} ${designation}`)
    },
    namesForPlanet: function (planetName) {
      return this.namesForStar(
        extractStarName(planetName)
      )
    },
    reset: function () {
      generated.clear()
      namesByStar.clear()

      return this
    },
  }
})()

engine.state.on('reset', () => content.planets.reset())
