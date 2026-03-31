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
        tutorial: true,
        title: `<span class="u-highlight">[Tutorial]</span> <span class="u-screenReader">for</span> Moons:`,
        description: `Some planets may have moons orbiting around them. Continue zooming to examine their moons closer.`,
        actions: [
          {
            label: 'Regain control',
          }
        ],
        after: () => this.markComplete(),
      },
    ].forEach((x) => app.screen.game.dialog.push(x))
  },
})
