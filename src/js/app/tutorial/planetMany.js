app.tutorial.planetMany = app.tutorial.invent({
  id: 'planetMany',
  // State
  state: {},
  // Lifecycle
  shouldActivate: () => content.location.is('planet') && content.planets.namesForPlanet(content.rooms.planet.getPlanet()?.name).length > 1,
  onUpdate: function () {
    if (!content.location.is('planet')) {
      return
    }

    if (this.preventDouble()) {
      return
    }

    [
      {
        title: `[Tutorial] Planets:`,
        description: () => ({
          gamepad: `Some stars have multiple planets. Press <kbd>D-Pad Right</kbd> and <kbd>D-Pad Left</kbd> to navigate between the planets at this star.`,
          keyboard: `Some stars have multiple planets. Press <kbd>Right Arrow</kbd> and <kbd>Left Arrow</kbd> to navigate between the planets at this star.`,
          mouse: `Some stars have multiple planets. Click the <kbd>Arrow Buttons</kbd> to navigate between the planets at this star.`,
        }[app.settings.computed.inputPreference]),
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
