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
        title: `<span class="u-highlight">[Tutorial]</span> <span class="u-screenReader">for</span> Instruments:`,
        description: `They're your <em>earthen bread and butter</em>—or what keeps the conservatory's lights on. Interact to reveal more details about an instrument.`,
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
