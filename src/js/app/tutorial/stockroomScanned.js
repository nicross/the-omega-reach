app.tutorial.stockroomScanned = app.tutorial.invent({
  id: 'stockroomScanned',
  // State
  state: {},
  // Lifecycle
  shouldActivate: () => content.location.is('stockroom') && content.rooms.stockroom.isComplete(),
  onUpdate: function () {
    if (!content.location.is('stockroom')) {
      return
    }

    [
      {
        title: ``,
        description: ``,
        actions: [
          {
            label: `Consider taking it`,
          },
        ],
        after: () => this.markComplete(),
      },
    ].forEach((x) => app.screen.game.dialog.push(x))
  },
})
