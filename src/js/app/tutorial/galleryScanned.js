app.tutorial.galleryScanned = app.tutorial.invent({
  id: 'galleryScanned',
  // State
  state: {},
  // Lifecycle
  shouldActivate: () => content.location.is('gallery') && content.rooms.gallery.getInstrument()?.state.scans,
  onUpdate: function () {
    if (!content.location.is('gallery')) {
      return
    }

    [
      {
        title: `[Tutorial] <span class="u-screenReader">for</span> Appraisal:`,
        description: `Some instruments have quirks as well! Continue interacting to fully appraise an instrument.`,
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
