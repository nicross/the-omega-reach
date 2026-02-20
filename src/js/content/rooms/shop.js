content.rooms.shop = content.rooms.invent({
  // Attributes
  id: 'shop',
  name: 'The shop',
  description: 'Out for lunch',
  defaultProgram: 'shop',
  moveLeftLabel: 'To the atrium',
  // Transitions
  transitions: {
    left: 'atrium',
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
  isOpen: () => content.conservatory.isOpen(),
  // ...
})
