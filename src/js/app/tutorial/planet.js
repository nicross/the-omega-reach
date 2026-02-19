app.tutorial.planet = app.tutorial.invent({
  id: 'planet',
  // State
  state: {},
  // Lifecycle
  shouldActivate: () => content.location.is('planet'),
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
        description: `Planets can also be hosts to interesting systems. Interact to reveal more details about a planet.`,
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
