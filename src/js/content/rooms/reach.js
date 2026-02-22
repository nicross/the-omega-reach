content.rooms.reach = content.rooms.invent({
  // Attributes
  id: 'reach',
  name: 'The reach',
  description: 'Beyond the end of time',
  defaultProgram: 'reach',
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

    if (this.state.online) {
      content.sphereIndex.randomize()
    } else {
      content.rooms.galaxy.reset()
      content.rooms.star.reset()
      content.rooms.planet.reset()
      content.rooms.moon.reset()
    }

    content.audio.reachSwitch.trigger(this.state.online)

    return this.getAttributeLabels()[0]?.label
  },
  // Attributes
  getAttributeLabels: function () {
    return [
      {
        label: `Ability ${this.state.online ? 'online' : 'offline'}`,
        modifiers: this.state.online ? ['rare'] : ['undiscovered'],
      },
    ]
  },
  // Reach
  getReachMuffle: () => 0,
})
