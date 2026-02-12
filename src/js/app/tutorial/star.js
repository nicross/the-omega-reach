app.tutorial.star = app.tutorial.invent({
  id: 'star',
  // State
  state: {},
  // Lifecycle
  shouldActivate: () => content.location.is('star'),
  onUpdate: function () {
    if (!content.location.is('star')) {
      return
    }

    if (this.preventDouble()) {
      return
    }

    [
      {
        title: `[Tutorial] Stars:`,
        description: `Stars may host complex systems of planets and moons—some with <em>legendary instruments</em> to recover! Interact to reveal more details about a star.`,
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
