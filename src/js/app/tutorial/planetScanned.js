app.tutorial.planetScanned = app.tutorial.invent({
  id: 'planetScanned',
  // State
  state: {},
  // Lifecycle
  shouldActivate: () => content.location.is('planet') && content.scans.is(content.rooms.planet.getPlanet().name),
  onUpdate: function () {
    if (!content.location.is('planet')) {
      return
    }

    if (this.preventDouble()) {
      return
    }

    [
      {
        title: `[Tutorial] Moons:`,
        description: `Some planets have moons that orbit around them. Zoom in to examine them closer.`,
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
