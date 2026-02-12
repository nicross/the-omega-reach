content.rooms.reach = content.rooms.invent({
  // Attributes
  id: 'reach',
  name: 'The reach',
  description: 'Beyond the end of time',
  moveDownLabel: 'To the atrium',
  moveUpLabel: 'Zoom in',
  // Transitions
  transitions: {
    up: 'horizon',
    down: 'atrium',
  },
  // State
  defaultState: {
    online: false,
  },
  // Interaction
  canInteract: () => Boolean(!app.tutorial.reachOnline.complete || app.tutorial.reachUnlocked.complete),
  getInteractJingle: function () {
    return this.state.online ? 2 : 0
  },
  onInteract: function () {
    this.state.online = !this.state.online

    if (!this.state.online) {
      content.rooms.galaxy.reset()
      content.rooms.star.reset()
      content.rooms.planet.reset()
      content.rooms.moon.reset()
    }

    return this.getAttributeLabels()[0]?.label
  },
  // Attributes
  getAttributeLabels: function () {
    return [
      {
        label: `Reach ${this.state.online ? 'online' : 'offline'}`,
        modifiers: this.state.online ? ['rare'] : ['undiscovered'],
      },
    ]
  },
  // ...
})
