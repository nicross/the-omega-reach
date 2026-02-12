app.tutorial.reachUnlocked = app.tutorial.invent({
  id: 'reachUnlocked',
  // State
  state: {},
  // Lifecycle
  shouldActivate: () => content.location.is('reach') && app.tutorial.firstInstrument.complete,
  onUpdate: function () {
    if (!content.location.is('reach')) {
      return
    }

    [
      {
        title: `[Tutorial] The reach:`,
        description: 'You may now interact with <strong>the reach</strong> at any time to power it off and on.',
        actions: [
          {
            label: 'Regain control',
            before: () => this.markComplete(),
            after: () => {
              content.rooms.reach.generateSolution()
              app.screen.game.interact.update()
            },
          }
        ],
      },
    ].forEach((x) => app.screen.game.dialog.push(x))
  },
})
