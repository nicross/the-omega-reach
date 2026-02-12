content.rooms.star = content.rooms.invent({
  // Attributes
  id: 'star',
  name: '(Star name)',
  description: '(Star description)',
  moveDownLabel: 'Zoom out',
  moveLeftLabel: 'Previous star',
  moveRightLabel: 'Next star',
  moveUpLabel: 'Zoom in',
  // Transitions
  transitions: {
    up: 'planet',
    down: 'galaxy',
  },
  // State
  state: {},
  // Methods
  getStar: function () {
    return this.state.name
      ? content.stars.get(this.state.name)
      : undefined
  },
  getDescription: function () {
    const star = this.getStar()

    return content.scans.is(star.name)
      ? star.type
      : 'Unexamined'
  },
  getName: function () {
    return this.getStar().name
  },
  getNameShort: function () {
    return this.getName().split(' ').pop()
  },
  isComplete: function () {
    return content.stars.isComplete(
      this.getStar().name
    )
  },
  isDiscovered: function () {
    return content.scans.is(this.getStar().name)
  },
  setStarByName: function (name) {
    this.state.name = name

    return this
  },
  // Interaction
  canInteract: function () {
    const star = this.getStar()

    return content.scans.get(star.name) < 1 + star.quirks.length
  },
  canInteractFreely: function () {
    return !this.solution
  },
  getInteractJingle: function () {
    const star = this.getStar()
    const scans = content.scans.get(star.name)

    if (scans == 1) {
      return star.quirks.length ? 0 : 2
    }

    if (scans < 1 + star.quirks.length) {
      return 1
    }

    return 2
  },
  onInteract: function () {
    const star = this.getStar()
    const scans = content.scans.increment(star.name)

    const message = []

    if (scans == 1) {
      if (star.children) {
        message.push(`${star.children} planet${star.children == 1 ? '' : 's'} detected`)
      }

      if (star.quirks.length) {
        message.push(`${star.quirks.length} quirk${star.quirks.length == 1 ? '' : 's'} detected`)
      }
    } else {
      message.push(`${star.quirks[scans - 2].name} found`)
    }

    if (content.stars.isComplete(star.name)) {
      message.push('Star complete')
    }

    if (scans == 1 + star.quirks.length) {
      content.location.emit('interact-complete', {room: this})
    }

    return message.join(', ')
  },
  // Attributes
  getAttributeLabels: function () {
    const star = this.getStar()
    const scans = content.scans.get(this.getStar().name)

    if (!scans) {
      return []
    }

    const attributes = []

    if (scans > 0 && star.children > 0) {
      attributes.push({
        label: `${star.children} planet${star.children == 1 ? '' : 's'}`,
        modifiers: [star.children > 8 ? 'rare' : ''],
      })
    }

    for (const i in star.quirks) {
      const quirk = star.quirks[i]

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

    return attributes
  },
  // Movement
  canEnter: () => content.stars.namesForGalaxy(content.rooms.galaxy.getGalaxy()?.name).length > 0,
  canMoveLeft: () => content.stars.namesForGalaxy(content.rooms.galaxy.getGalaxy()?.name).length > 1,
  canMoveRight: () => content.stars.namesForGalaxy(content.rooms.galaxy.getGalaxy()?.name).length > 1,
  canMoveUp: function () {
    const star = this.getStar()

    return content.scans.is(star.name)
      && star.children > 0
  },
  getMoveUpLabel: function () {
    return this.canMoveUp() ? 'Zoom in' : 'Max zoom reached'
  },
  moveLeft: function () {
    const names = content.stars.namesForStar(this.getStar().name)

    this.setStarByName(
      names[
        engine.fn.wrap(names.indexOf(this.state.name) - 1, 0, names.length)
      ]
    )

    content.rooms.planet.reset()
    content.rooms.moon.reset()

    return this.move('left')
  },
  moveRight: function () {
    const names = content.stars.namesForStar(this.getStar().name)

    this.setStarByName(
      names[
        engine.fn.wrap(names.indexOf(this.state.name) + 1, 0, names.length)
      ]
    )

    content.rooms.planet.reset()
    content.rooms.moon.reset()

    return this.move('right')
  },
  moveUp: function () {
    if (!content.rooms.planet.getPlanet()) {
      const names = content.planets.namesForStar(this.getStar().name)
      content.rooms.planet.setPlanetByName(names[0])
    }

    return this.move('up')
  },
})
