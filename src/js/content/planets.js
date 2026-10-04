content.planets = (() => {
  const generated = new Map()

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
    const srand = (...seed) => engine.fn.srand('planet', name, 'attribute', ...seed)()

    const starName = extractStarName(name)
    const star = content.stars.get(starName)

    const isTutorial = star.isTutorial

    const index = extractIndex(name)
    const habitability = star.habitability * (
      star.children <= 2
        ? srand('habitability')
        : Math.sin(Math.PI * index / star.children)
    )
    const heat = star.children == 1
      ? srand('heat')
      : 1 - (index / star.children)

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
      children: isTutorial ? 1 : Math.round(engine.fn.lerpExp(0, 6, srand('children'), type.moons)),
      habitability, // Pass raw habitability to children, not type habitability
      heat,
      index,
      lightSource: engine.tool.vector3d.create({
        x: srand('lightSourceX'),
        y: engine.fn.lerp(-1, 1, srand('lightSourceY')),
        z: engine.fn.lerp(-1, 1, srand('lightSourceZ')),
      }).normalize(),
      mass: srand('mass') * star.mass,
      name,
      program: type.program || 'basePlanet',
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
    ]
    const commonTerrestrialQuirks = [
      'Geologic activity',
      engine.fn.choose(['Strong','Weak'], srand('magnetism')) + ' magnetic field',
    ]

    const rareQuirks = [
      heat > 0.5 ? 'Captured asteroid' : 'Captured comet',
      'Extreme tilt',
      'High eccentricity',
      'High inclination',
      'Recent impact',
      'Retrograde orbit',
      'Retrograde spin',
      'Spaceship graveyard',
      'Navigational beacon',
    ]
    const rareGiantQuirks = [
      'Decommissioned probes',
      'Electric storms',
      'Great spot',
      'Internal heating',
      'Magnetic storms',
    ]
    const rareTerrestrialQuirks = [
      'Distress beacon',
      'Mining stations',
      'Organic compounds',
      'Precious metals',
      'Precious minerals',
      'Research stations',
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
        program: 'gasGiant',
        instrument: 0,
        moons: 1,
        weight: 1,
        commonQuirks: [
          ...commonQuirks,
          ...commonGiantQuirks,
          'Highly oblate',
          'Strong magnetic field',
        ],
        rareQuirks: [
          ...rareQuirks,
          ...rareGiantQuirks,
          lifeQuirks[0],
          'Coreless',
          'Contracting interior',
          'Failed star',
          'Helium rain',
          'Hexagonal clouds',
        ],
      },
      {
        label: 'Ice giant',
        program: 'iceGiant',
        instrument: 0,
        moons: 1,
        weight: 1 - heat,
        commonQuirks: [
          ...commonQuirks,
          ...commonGiantQuirks,
          'Dense core',
          'Highly metallic',
          'Icy mantle',
          'Polar vortices',
          'Unusual magnetic field',
        ],
        rareQuirks: [
          ...rareQuirks,
          ...rareGiantQuirks,
          lifeQuirks[0],
          'Diamond rain',
          'Extreme cold',
          'Heavy water',
        ],
      },
      {
        label: 'Rocky planet',
        program: 'rockyPlanet',
        instrument: 1,
        moons: 3,
        weight: 1 * 0.5,
        commonQuirks: [
          ...commonQuirks,
          ...commonTerrestrialQuirks,
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
          'Terraforming candidate',
        ],
      },
      {
        label: 'Acid planet',
        program: 'acidPlanet',
        instrument: 1,
        moons: 3,
        weight: (1 - habitability) * 0.5,
        commonQuirks: [
          ...commonQuirks,
          ...commonTerrestrialQuirks,
          'Acid ocean',
          'Acid rain',
          'Cyclonic storms',
          'Electric storms',
          'Greenhouse gases',
          'Thick atmosphere',
        ],
        rareQuirks: [
          ...rareQuirks,
          ...rareTerrestrialQuirks,
          lifeQuirks[0],
          'Ancient ruins',
          'Tectonic plates',
          'Terraforming candidate',
        ],
      },
      {
        label: 'Hycean planet',
        program: 'hyceanPlanet',
        instrument: 1,
        moons: 2,
        weight: habitability,
        commonQuirks: [
          ...commonQuirks,
          ...commonTerrestrialQuirks,
          lifeQuirks[1],
          lifeQuirks[2],
          lifeQuirks[3],
          'Breathable atmosphere',
          'Cyclonic storms',
          'Electric storms',
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
          'Terraformed',
          'Vaporizing',
        ],
      },
      {
        label: 'Terran planet',
        program: 'terranPlanet',
        instrument: 1,
        moons: 2,
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
          'Electric storms',
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
          'Colonized',
          'Enslaved',
          'Greenhosue gases',
          'Heavy water',
          'Magnetic storms',
          'Mass graveyards',
          'Terraformed',
        ],
      },
      {
        label: 'Desert planet',
        program: 'desertPlanet',
        instrument: 1,
        moons: 3,
        weight: 1 * 0.5,
        commonQuirks: [
          ...commonQuirks,
          ...commonTerrestrialQuirks,
          lifeQuirks[0],
          lifeQuirks[1],
          'Dried riverbeds',
          'Dust storms',
          'Electric storms',
          'Fine regolith',
          'Polar ice',
          'Terraforming candidate',
          'Thin atmosphere',
        ],
        rareQuirks: [
          ...rareQuirks,
          ...rareTerrestrialQuirks,
          lifeQuirks[2],
          lifeQuirks[3],
          'Ancient ruins',
          'Breathable atmosphere',
          'Tectonic plates',
        ],
      },
      {
        label: 'Arctic planet',
        program: 'arcticPlanet',
        habitability: 1/3,
        instrument: 1,
        moons: 3,
        weight: (1 - heat) * 0.5,
        commonQuirks: [
          ...commonQuirks,
          ...commonTerrestrialQuirks,
          lifeQuirks[0],
          lifeQuirks[1],
          engine.fn.choose(['Ammonia','Dry ice','Methane','Water ice'], srand('arctic planet','surface')) + ' surface',
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
          'Terraforming candidate',
        ],
      },
      {
        label: 'Lava planet',
        program: 'lavaPlanet',
        habitability: 0,
        instrument: 1,
        moons: 3,
        weight: 1 * 0.5,
        commonQuirks: [
          ...commonQuirks,
          ...commonTerrestrialQuirks,
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
          'Terraforming candidate',
        ],
      },
      // Black holes
      {
        label: 'Black hole',
        program: 'blackHolePlanet',
        habitability: 0,
        instrument: 0,
        moons: 2,
        weight: star.wildcard * star.age * 0.5,
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

      return this
    },
  }
})()

engine.state.on('reset', () => content.planets.reset())
