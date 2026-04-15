app.tutorial.stockroomStolen = app.tutorial.invent({
  id: 'stockroomStolen',
  // State
  state: {},
  // Lifecycle
  shouldActivate: () => content.location.is('stockroom') && content.stockroom.hasStolen(),
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
            label: `Consider putting it back`,
          },
        ],
        after: () => this.markComplete(),
      },
    ].forEach((x) => app.screen.game.dialog.push(x))
  },
})
