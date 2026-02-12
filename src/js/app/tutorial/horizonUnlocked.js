app.tutorial.horizonUnlocked = app.tutorial.invent({
  id: 'horizonUnlocked',
  // State
  state: {},
  // Lifecycle
  shouldActivate: () => content.location.is('horizon') && app.tutorial.firstInstrument.complete,
  onUpdate: function () {
    if (!content.location.is('horizon')) {
      return
    }

    [
      {
        title: `[Tutorial] The horizon:`,
        description: 'You may now interact with <strong>the horizon</strong> at any time to reach new galaxies from it.',
        actions: [
          {
            label: 'Regain control',
            before: () => this.markComplete(),
            after: () => {
              content.solution.generate()
              app.screen.game.interact.update()
            },
          }
        ],
      },
    ].forEach((x) => app.screen.game.dialog.push(x))
  },
})
