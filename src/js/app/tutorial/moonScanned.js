app.tutorial.moonScanned = app.tutorial.invent({
  id: 'moonScanned',
  // State
  state: {},
  // Lifecycle
  shouldActivate: () => content.location.is('moon') && content.scans.is(content.rooms.moon.getMoon().name),
  onUpdate: function () {
    if (!content.location.is('moon')) {
      return
    }

    if (this.preventDouble()) {
      return
    }

    [
      {
        title: `[Tutorial] <span class="u-screenReader">for</span> Instruments:`,
        description: `Some objects have the artifacts you need. Interact to recover this instrument for <strong>the gallery</strong>.`,
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
