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
        tutorial: true,
        title: `<span class="u-highlight">[Tutorial]</span> <span class="u-screenReader">for</span> The horizon:`,
        description: 'You may now interact with <strong>the horizon</strong> at any time to reach new galaxies from it.',
        actions: [
          {
            label: 'Regain control',
          }
        ],
        after: () => {
          this.markComplete()
          content.solution.generate()
          app.screen.game.interact.update()
        },
      },
    ].forEach((x) => app.screen.game.dialog.push(x))
  },
})
