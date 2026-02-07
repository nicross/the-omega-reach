app.tutorial.firstInstrument = app.tutorial.invent({
  id: 'firstInstrument',
  // State
  state: {},
  // Lifecycle
  shouldActivate: () => content.location.is('moon') && content.instruments.count() > 0,
  onUpdate: function () {
    if (!content.location.is('moon')) {
      return
    }

    [
      {
        title: `What's that?`,
        description: ``,
        actions: [
          {
            label: 'To the gallery',
            before: () => this.markComplete(),
          }
        ],
      },
    ].forEach((x) => app.screen.game.dialog.push(x))
  },
})
