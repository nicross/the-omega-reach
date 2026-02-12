app.tutorial.starScanned = app.tutorial.invent({
  id: 'starScanned',
  // State
  state: {},
  // Lifecycle
  shouldActivate: () => content.location.is('star') && content.scans.is(content.rooms.star.getStar().name),
  onUpdate: function () {
    if (!content.location.is('star')) {
      return
    }

    if (this.preventDouble()) {
      return
    }

    [
      {
        title: `[Tutorial] Quirks:`,
        description: `Some objects have interesting properties to be grazed. Interact to reveal their quirks. Beware that some quirks are rarer than others!`,
        actions: [
          {
            label: 'Next tutorial',
          }
        ],
      },
      {
        title: `[Tutorial] Planets:`,
        description: `Some stars may have planets orbiting around them. Continue zooming to examine their planets closer.`,
        actions: [
          {
            label: 'Regain control',
            before: () => this.markComplete(),
          }
        ],
      },
    ].forEach((x) => app.screen.game.dialog.push(x))
  },
})
