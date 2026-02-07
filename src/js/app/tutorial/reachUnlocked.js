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
        description: 'You may now interact with <strong>the reach</strong> to power it off and on at any time.',
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
