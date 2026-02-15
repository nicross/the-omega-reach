content.rooms.lobby = content.rooms.invent({
  // Attributes
  id: 'lobby',
  name: 'The lobby',
  description: 'Closed for the cycle',
  defaultProgram: 'lobby',
  moveRightLabel: 'To the atrium',
  // Transitions
  transitions: {
    right: 'atrium',
  },
  // Methods
  getDescription: function () {
    return this.isOpen()
      ? 'Open to visitors'
      : 'Closed for the cycle'
  },
  isDiscovered: function () {
    return this.isOpen()
  },
  isOpen: () => false,
  // ...
})
