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
        tutorial: true,
        title: `<span class="u-highlight">[Tutorial]</span> <span class="u-screenReader">for</span> Galaxies:`,
        description: 'You may now interact with galaxies at any time to reach new stars within them.',
        actions: [
          {
            label: 'Regain control',
          }
        ],
        finally: () => {
          this.markComplete()
          content.solution.generate()
          app.screen.game.interact.update()
        },
      },
    ].forEach((x) => app.screen.game.dialog.push(x))
  },
})
