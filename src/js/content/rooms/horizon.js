content.rooms.horizon = content.rooms.invent({
  // Attributes
  id: 'horizon',
  name: 'The horizon',
  description: 'Zooming into focus',
  defaultProgram: 'horizon',
  interactLabel: 'Reach',
  moveDownLabel: 'Zoom out',
  moveUpLabel: 'Zoom in',
  // Transitions
  transitions: {
    up: 'galaxy',
    down: 'reach',
  },
  // Interaction
  canInteract: () => Boolean(!app.tutorial.galaxy.complete || app.tutorial.horizonUnlocked.complete),
  onInteract: function () {
    const galaxy = content.galaxies.new()

    content.rooms.galaxy.setGalaxyByName(galaxy.name)
    content.rooms.star.reset()
    content.rooms.planet.reset()
    content.rooms.moon.reset()

    content.location.set('galaxy')
  },
  // Attributes
  getAttributeLabels: function () {
    const attributes = [],
      count = content.galaxies.count()

    if (count) {
      attributes.push({
        label: `${app.utility.format.number(count)} ${count == 1 ? 'galaxy' : 'galaxies'} reached`,
        modifiers: [],
      })
    }

    if (this.canInteract()) {
      attributes.push({
        label: 'Unreached galaxies',
        modifiers: ['undiscovered'],
      })
    }

    return attributes
  },
  // Movement
  canEnter: () => Boolean(content.rooms.reach.state.online),
  moveUp: function () {
    if (!content.rooms.galaxy.getGalaxy()) {
      const names = content.galaxies.names()
      content.rooms.galaxy.setGalaxyByName(names[0])
    }

    return this.move('up')
  },
  // Atrium
  getAtriumMuffle: () => 1/3,
  getAtriumPan: () => 0,
  // Reach
  getReachMuffle: () => 1 - (2/3),
})
