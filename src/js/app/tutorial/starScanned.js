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
        description: `Some objects have one or more interesting quirks. Interact to reveal one quirk at a time.`,
        actions: [
          {
            label: 'Next tutorial',
          }
        ],
      },
      {
        title: `[Tutorial] Planets:`,
        description: `Some stars have planets that orbit around them. Zoom in to examine them closer.`,
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
