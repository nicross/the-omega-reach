content.rooms.planet = content.rooms.invent({
  // Attributes
  id: 'planet',
  name: '(Planet name)',
  description: '(Planet description)',
  moveDownLabel: 'Zoom out',
  moveLeftLabel: 'Previous planet',
  moveRightLabel: 'Next planet',
  moveUpLabel: 'Zoom in',
  // Transitions
  transitions: {
    up: 'moon',
    down: 'star',
  },
  // State
  state: {},
  // Methods
  getPlanet: function () {
    return this.state.name
      ? content.planets.get(this.state.name)
      : undefined
  },
  getDescription: function () {
    const planet = this.getPlanet()

    return content.scans.is(planet.name)
      ? planet.type
      : 'Unexamined'
  },
  getName: function () {
    return this.getPlanet().name
  },
  getNameShort: function () {
    return this.getName().split(' ').pop()
  },
  isComplete: function () {
    return content.planets.isComplete(
      this.getPlanet().name
    )
  },
  isDiscovered: function () {
    return content.scans.is(this.getPlanet().name)
  },
  setPlanetByName: function (name) {
    this.state.name = name

    return this
  },
  // Interaction
  canInteract: function () {
    const planet = this.getPlanet()

    return content.scans.get(planet.name) < 1 + planet.quirks.length + (planet.instrument ? 1 : 0)
  },
  canInteractFreely: function () {
    return !content.solution.has()
  },
  getInteractJingle: function () {
    const planet = this.getPlanet()
    const scans = content.scans.get(planet.name)

    if (scans == 1) {
      return planet.quirks.length || planet.instrument ? 0 : 2
    }

    if (scans < 1 + planet.quirks.length + (planet.instrument ? 1 : 0)) {
      return 1
    }

    return 2
  },
  onInteract: function () {
    const planet = this.getPlanet()
    const scans = content.scans.increment(planet.name)

    const message = []

    if (scans == 1) {
      if (planet.children) {
        message.push(`${planet.children} moon${planet.children == 1 ? '' : 's'} detected`)
      }

      if (planet.quirks.length) {
        message.push(`${planet.quirks.length} quirk${planet.quirks.length == 1 ? '' : 's'} detected`)
      }

      if (planet.instrument) {
        message.push(`Instrument detected`)
      }

      content.sphereIndex.randomize()
    } else if (scans <= 1 + planet.quirks.length) {
      message.push(`${planet.quirks[scans - 2].name} found`)
    } else if (planet.instrument) {
      content.instruments.add(
        content.instruments.generateNameForBody(planet.name)
      )

      message.push(`Instrument recovered`)
    }

    if (content.planets.isComplete(planet.name)) {
      message.push('Planet complete')
    }

    if (scans == 1 + planet.quirks.length + (planet.instrument ? 1 : 0)) {
      content.location.emit('interact-complete', {room: this})
    }

    return message.join(', ')
  },
  // Attributes
  getAttributeLabels: function () {
    const planet = this.getPlanet()
    const scans = content.scans.get(this.getPlanet().name)

    if (!scans) {
      return []
    }

    const attributes = []

    if (scans > 0 && planet.children > 0) {
      attributes.push({
        label: `${planet.children} moon${planet.children == 1 ? '' : 's'}`,
        modifiers: [planet.children > 4 ? 'rare' : ''],
      })
    }

    for (const i in planet.quirks) {
      const quirk = planet.quirks[i]

      if (scans - 1 > i) {
        attributes.push({
          label: quirk.name,
          modifiers: [quirk.isRare ? 'rare' : ''],
        })
      } else {
        attributes.push({
          label: 'Unexamined quirk',
          modifiers: ['undiscovered'],
        })
      }
    }

    if (planet.instrument) {
      if (scans > 1 + planet.quirks.length) {
        attributes.push({
          label: 'Instrument recovered',
          modifiers: ['instrument'],
        })
      } else {
        attributes.push({
          label: 'Unrecovered instrument',
          modifiers: ['undiscovered','instrument'],
        })
      }
    }

    return attributes
  },
  // Movement
  canEnter: () => content.planets.namesForStar(content.rooms.star.getStar()?.name).length > 0,
  canMoveLeft: () => content.planets.namesForStar(content.rooms.star.getStar()?.name).length > 1,
  canMoveRight: () => content.planets.namesForStar(content.rooms.star.getStar()?.name).length > 1,
  canMoveUp: function () {
    const planet = this.getPlanet()

    return content.scans.is(planet.name)
      && planet.children > 0
  },
  getMoveUpLabel: function () {
    return this.canMoveUp() ? 'Zoom in' : 'Max zoom reached'
  },
  moveLeft: function () {
    const names = content.planets.namesForPlanet(this.getPlanet().name)

    this.setPlanetByName(
      names[
        engine.fn.wrap(names.indexOf(this.state.name) - 1, 0, names.length)
      ]
    )

    content.solution.generate()
    content.rooms.moon.reset()

    this.updateProgram()

    return this.move('left')
  },
  moveRight: function () {
    const names = content.planets.namesForPlanet(this.getPlanet().name)

    this.setPlanetByName(
      names[
        engine.fn.wrap(names.indexOf(this.state.name) + 1, 0, names.length)
      ]
    )

    content.solution.generate()
    content.rooms.moon.reset()

    this.updateProgram()

    return this.move('right')
  },
  moveUp: function () {
    if (content.rooms.moon.getMoon()?.planet !== this.getPlanet()) {
      const names = content.moons.namesForPlanet(this.getPlanet().name)
      content.rooms.moon.setMoonByName(names[0])
    }

    return this.move('up')
  },
  onEnter: function () {
    this.updateProgram()
  },
  updateProgram: function () {
    const planet = this.getPlanet()

    content.programs.load(planet.program, {
      body: planet,
      seed: planet.name,
    })
  },
})
