app.tutorial.moon = app.tutorial.invent({
  id: 'moon',
  // State
  state: {},
  // Lifecycle
  shouldActivate: () => content.location.is('moon'),
  onUpdate: function () {
    if (!content.location.is('moon')) {
      return
    }

    if (this.preventDouble()) {
      return
    }

    [
      {
        title: `It's a moon!`,
        description: ``,
        actions: [
          {
            label: 'Reach deeper',
          }
        ],
      },
      {
        title: `[Tutorial] Moons:`,
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
