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
        title: `It's a star!`,
        description: ``,
        actions: [
          {
            label: 'Reach deeper',
          }
        ],
      },
      {
        title: `[Tutorial] Stars:`,
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
