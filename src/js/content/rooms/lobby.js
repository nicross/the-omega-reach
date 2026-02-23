content.rooms.lobby = content.rooms.invent({
  // Attributes
  id: 'lobby',
  name: 'The lobby',
  description: 'Closed to visitors',
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
      : 'Closed to visitors'
  },
  isDiscovered: function () {
    return this.isOpen()
  },
  isOpen: () => content.conservatory.isOpen(),
  // Reach
  getReachMuffle: () => 1 - (1/8),
  getReachPan: () => 1/2,
})
