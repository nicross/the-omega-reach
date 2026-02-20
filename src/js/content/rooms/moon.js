content.rooms.moon = content.rooms.invent({
  // Attributes
  id: 'moon',
  name: '(Moon name)',
  description: '(Moon description)',
  moveDownLabel: 'Zoom out',
  moveLeftLabel: 'Previous moon',
  moveRightLabel: 'Next moon',
  // Transitions
  transitions: {
    down: 'planet',
  },
  // State
  state: {},
  // Methods
  getMoon: function () {
    return this.state.name
      ? content.moons.get(this.state.name)
      : undefined
  },
  getDescription: function () {
    const moon = this.getMoon()

    return content.scans.is(moon.name)
      ? moon.type
      : 'Unreached moon'
  },
  getInteractLabel: function () {
    return this.isDiscovered() ? (this.hasInstrumentReady() ? 'Recover' : 'Examine') : 'Reach'
  },
  getName: function () {
    return this.getMoon().name
  },
  getNameShort: function () {
    return this.getName().split(' ').pop()
  },
  isComplete: function () {
    return content.moons.isComplete(
      this.getMoon().name
    )
  },
  isDiscovered: function () {
    return content.scans.is(this.getMoon().name)
  },
  isIncomplete: function () {
    return !this.isComplete()
  },
  setMoonByName: function (name) {
    this.state.name = name

    return this
  },
  // Interaction
  canInteract: function () {
    const moon = this.getMoon()

    return content.scans.get(moon.name) < 1 + moon.quirks.length + (moon.instrument ? 1 : 0)
  },
  canInteractFreely: function () {
    return !content.solution.has()
  },
  getInteractJingle: function () {
    const moon = this.getMoon()
    const scans = content.scans.get(moon.name)

    if (scans == 1) {
      return moon.quirks.length || moon.instrument ? 0 : 2
    }

    if (scans < 1 + moon.quirks.length + (moon.instrument ? 1 : 0)) {
      return 1
    }

    return 2
  },
  onInteract: function () {
    const moon = this.getMoon()
    const scans = content.scans.increment(moon.name)

    const message = []

    // Initial scan
    if (scans == 1) {
      if (moon.quirks.length) {
        message.push(`${moon.quirks.length} quirk${moon.quirks.length == 1 ? '' : 's'} detected`)
      }

      if (moon.instrument) {
        message.push(`Instrument detected`)
      }

      content.sphereIndex.randomize()
    } else if (scans <= 1 + moon.quirks.length) {
      message.push(`${moon.quirks[scans - 2].name} found`)
    } else if (moon.instrument) {
      content.instruments.add(
        content.instruments.generateNameForBody(moon.name)
      )

      message.push(`Instrument recovered`)
    }

    if (content.moons.isComplete(moon.name)) {
      message.push('Moon complete')
    }

    if (scans == 1 + moon.quirks.length + (moon.instrument ? 1 : 0)) {
      content.location.emit('interact-complete', {room: this})
    }

    return message.join(', ')
  },
  // Attributes
  getAttributeLabels: function () {
    const moon = this.getMoon()
    const scans = content.scans.get(moon.name)

    if (!scans) {
      return []
    }

    const attributes = []

    for (const i in moon.quirks) {
      const quirk = moon.quirks[i]

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

    if (moon.instrument) {
      if (scans > 1 + moon.quirks.length) {
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
  canEnter: () => content.moons.namesForPlanet(content.rooms.planet.getPlanet()?.name).length > 0,
  canMoveLeft: () => content.moons.namesForPlanet(content.rooms.planet.getPlanet()?.name).length > 1,
  canMoveRight: () => content.moons.namesForPlanet(content.rooms.planet.getPlanet()?.name).length > 1,
  getMoveUpLabel: () => 'Max zoom reached',
  moveLeft: function () {
    const names = content.moons.namesForMoon(this.getMoon().name)

    this.setMoonByName(
      names[
        engine.fn.wrap(names.indexOf(this.state.name) - 1, 0, names.length)
      ]
    )

    content.solution.generate()
    this.updateProgram()

    return this.move('left')
  },
  moveRight: function () {
    const names = content.moons.namesForMoon(this.getMoon().name)

    this.setMoonByName(
      names[
        engine.fn.wrap(names.indexOf(this.state.name) + 1, 0, names.length)
      ]
    )

    content.solution.generate()
    this.updateProgram()

    return this.move('right')
  },onEnter: function () {
    this.updateProgram()
  },
  updateProgram: function () {
    const moon = this.getMoon()

    content.programs.load(moon.program, {
      body: moon,
      seed: moon.name,
    })
  },
  // Methods
  hasInstrumentReady: function () {
    const moon = this.getMoon()

    if (!moon.instrument) {
      return false
    }

    return content.scans.get(moon.name) == 1 + moon.quirks.length
  },
})
