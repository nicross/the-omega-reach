app.tutorial.galaxyUnlocked = app.tutorial.invent({
  id: 'galaxyUnlocked',
  // State
  state: {},
  // Lifecycle
  shouldActivate: () => content.location.is('galaxy') && app.tutorial.firstInstrument.complete,
  onUpdate: function () {
    if (!content.location.is('galaxy')) {
      return
    }

    [
      {
        title: `[Tutorial] Galaxies:`,
        description: 'You may now interact with galaxies at any time to reach new stars.',
        actions: [
          {
            label: 'Regain control',
            before: () => this.markComplete(),
            after: () => {
              content.rooms.galaxy.generateSolution()
              app.screen.game.interact.update()
            },
          }
        ],
      },
    ].forEach((x) => app.screen.game.dialog.push(x))
  },
})
