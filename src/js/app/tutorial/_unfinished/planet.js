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
        title: `It's a planet!`,
        description: ``,
        actions: [
          {
            label: 'Reach deeper',
          }
        ],
      },
      {
        title: `[Tutorial] Planets:`,
        description: ``,
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
