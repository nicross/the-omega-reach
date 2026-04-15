app.tutorial.stockroomInstrument = app.tutorial.invent({
  id: 'stockroomInstrument',
  // State
  state: {},
  // Lifecycle
  shouldActivate: () => content.location.is('stockroom') && content.stockroom.hasGenerated(),
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
            label: `Consider examining ${content.stockroom.countGenerated() == 1 ? 'it' : 'them'}`,
          },
        ],
        after: () => this.markComplete(),
      },
    ].forEach((x) => app.screen.game.dialog.push(x))
  },
})
