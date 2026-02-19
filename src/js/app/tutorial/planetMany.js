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
        title: `[Tutorial] <span class="u-screenReader">for</span> Planets:`,
        description: () => ({
          gamepad: `Some stars have multiple planets to examine. Press <kbd>D-Pad Right</kbd> and <kbd>D-Pad Left</kbd> to navigate between the planets around this star.`,
          keyboard: `Some stars have multiple planets to examine. Press <kbd>Right Arrow</kbd> and <kbd>Left Arrow</kbd> to navigate between the planets around this star.`,
          mouse: `Some stars have multiple planets to examine. Click the <kbd>Arrow Buttons</kbd> to navigate between the planets around this star.`,
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
