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
        title: `What's this?`,
        description: `It's an instrument outside its appropriate place inside <strong>the gallery</strong>. This must be a new specimen—as laid evident by your skeptical lack of recognition. You question its origin and connection to <strong>the cellar</strong>.`,
        actions: [
          {
            label: `Consider appraising ${content.stockroom.countGenerated() == 1 ? 'it' : 'them'}`,
          },
        ],
        after: () => this.markComplete(),
      },
    ].forEach((x) => app.screen.game.dialog.push(x))
  },
})
