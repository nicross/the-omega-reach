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
        title: `[Tutorial] Planets:`,
        description: `Interact to reveal more about a planet.`,
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
