app.tutorial.galaxy = app.tutorial.invent({
  id: 'galaxy',
  // State
  state: {},
  // Lifecycle
  shouldActivate: () => content.location.is('galaxy'),
  onUpdate: function () {
    if (!content.location.is('galaxy')) {
      return
    }

    if (this.preventDouble()) {
      return
    }

    [
      {
        title: `[Tutorial] Galaxies:`,
        description: `Interact to find a new star. The reach will zoom in automatically.`,
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
