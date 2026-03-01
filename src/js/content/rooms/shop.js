content.rooms.shop = content.rooms.invent({
  // Attributes
  id: 'shop',
  name: 'The shop',
  description: 'Out for lunch',
  defaultProgram: 'shop',
  moveLeftLabel: 'To the atrium',
  moveDownLabel: 'To the cellar',
  // Transitions
  transitions: {
    left: 'atrium',
    down: 'cellar',
  },
  // Methods
  getDescription: function () {
    return this.isOpen()
      ? 'Open for business'
      : 'Out for lunch'
  },
  isDiscovered: function () {
    return this.isOpen()
  },
  isOpen: () => content.shop.isOpen(),
  // Interactions
  canInteractFreely: () => true,
  // Atrium
  getAtriumMuffle: () => 1/4,
  getAtriumPan: () => -2/3,
  // Reach
  getReachMuffle: () => 1 - (1/4),
  getReachPan: () => -1/2,
})
