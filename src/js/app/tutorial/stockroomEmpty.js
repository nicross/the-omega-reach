app.tutorial.stockroomEmpty = app.tutorial.invent({
  id: 'stockroomEmpty',
  // State
  state: {},
  // Lifecycle
  shouldActivate: () => content.location.is('stockroom') && !content.stockroom.hasGenerated() && !content.stockroom.hasStolen() && !content.stockroom.stealCount(),
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
            label: 'Sneak back later',
          }
        ],
        after: () => this.markComplete(),
      },
    ].forEach((x) => app.screen.game.dialog.push(x))
  },
})
