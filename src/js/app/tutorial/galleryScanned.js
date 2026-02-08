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
        title: `[Tutorial] Instruments:`,
        description: `Appraising instruments and revealing all of their quirks increases their sale value.`,
        actions: [
          {
            label: 'Regain control',
            before: () => this.markComplete(),
          }
        ],
      },
      // TODO: Tutorial for selling when implemented
    ].forEach((x) => app.screen.game.dialog.push(x))
  },
})
