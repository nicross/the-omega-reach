app.tutorial.galleryInstrument = app.tutorial.invent({
  id: 'galleryInstrument',
  // State
  state: {},
  // Lifecycle
  shouldActivate: () => content.location.is('gallery') && content.instruments.count() > 0,
  onUpdate: function () {
    if (!content.location.is('gallery')) {
      return
    }

    [
      {
        title: `[Tutorial] Appraisal:`,
        description: `Interact to reveal more about an instrument.`,
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
