content.rooms.galaxy = content.rooms.invent({
  // Attributes
  id: 'galaxy',
  name: '(Galaxy name)',
  description: '(Galaxy description)',
  interactLabel: 'Reach',
  moveDownLabel: 'Zoom out',
  moveLeftLabel: 'Previous galaxy',
  moveRightLabel: 'Next galaxy',
  moveUpLabel: 'Zoom in',
  // Transitions
  transitions: {
    up: 'star',
    down: 'horizon',
  },
  // State
  state: {},
  // Methods
  getGalaxy: function () {
    return this.state.name
      ? content.galaxies.get(this.state.name)
      : undefined
  },
  getDescription: function () {
    return `${this.getGalaxy().type} galaxy`
  },
  getName: function () {
    return this.getGalaxy().name
  },
  setGalaxyByName: function (name) {
    this.state.name = name

    return this
  },
  // Interaction
  canInteract: () => Boolean(!app.tutorial.star.complete || app.tutorial.galaxyUnlocked.complete),
  onInteract: function () {
    const star = content.stars.new(this.getGalaxy().name)
    content.rooms.star.setStarByName(star.name)
    content.location.set('star')
  },
  // Attributes
  getAttributeLabels: function () {
    if (!this.canInteract()) {
      return []
    }

    return [
      {
        label: 'Unreached stars',
        modifiers: ['undiscovered'],
      },
    ]
  },
  // Movement
  canEnter: () => content.galaxies.count() > 0,
  canMoveLeft: () => content.galaxies.count() > 1,
  canMoveRight: () => content.galaxies.count() > 1,
  moveLeft: function () {
    const names = content.galaxies.names()

    this.setGalaxyByName(
      names[
        engine.fn.wrap(names.indexOf(this.state.name) - 1, 0, names.length)
      ]
    )

    content.solution.generate()
    content.rooms.star.reset()
    content.rooms.planet.reset()
    content.rooms.moon.reset()

    this.updateProgram()

    content.location.emit('move', {
      direction: 'left',
      from: this,
      to: this,
    })

    return this.move('left')
  },
  moveRight: function () {
    const names = content.galaxies.names()

    this.setGalaxyByName(
      names[
        engine.fn.wrap(names.indexOf(this.state.name) + 1, 0, names.length)
      ]
    )

    content.solution.generate()
    content.rooms.star.reset()
    content.rooms.planet.reset()
    content.rooms.moon.reset()

    this.updateProgram()

    content.location.emit('move', {
      direction: 'right',
      from: this,
      to: this,
    })

    return this.move('right')
  },
  moveUp: function () {
    if (content.rooms.star.getStar()?.galaxy !== this.getGalaxy()) {
      const names = content.stars.namesForGalaxy(this.getGalaxy().name)
      content.rooms.star.setStarByName(names[0])
    }

    return this.move('up')
  },
  onEnter: function () {
    this.updateProgram()
  },
  updateProgram: function () {
    const galaxy = this.getGalaxy()

    content.programs.load(galaxy.program, {
      galaxy,
      seed: galaxy.name,
    })
  },
  // Reach
  getReachMuffle: () => 1 - (1/3),
})
