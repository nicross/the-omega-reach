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
        tutorial: true,
        title: `<span class="u-highlight">[Tutorial]</span> <span class="u-screenReader">for</span> Visitors:`,
        description: `Congratulations! <strong>The Omega Conservatory</strong> is now open to visitors. <strong>The gallery</strong> must have an appraised instrument for it to remain open.`,
        actions: [
          {
            label: 'Next tutorial',
          }
        ],
        finally: () => content.conservatory.setReady(true),
      },
      {
        tutorial: true,
        title: `<span class="u-highlight">[Tutorial]</span> <span class="u-screenReader">for</span> Appraisal:`,
        description: `Some instruments have quirks as well! Continue interacting to fully appraise an instrument.`,
        actions: [
          {
            label: 'Regain control',
          }
        ],
        finally: () => this.markComplete(),
      },
    ].forEach((x) => app.screen.game.dialog.push(x))
  },
})
