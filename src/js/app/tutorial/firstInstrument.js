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
        title: `It sings:`,
        description: `<q>You've finally reached the treasure you seek!</q> Its fanfare recedes into the telescopic esophagus for its analysis by your hand. By zooming out to <strong>the gallery</strong>, you might feel its truths that you could never reach.`,
        actions: [
          {
            label: 'Get zooming',
            before: () => this.markComplete(),
          }
        ],
      },
    ].forEach((x) => app.screen.game.dialog.push(x))
  },
})
