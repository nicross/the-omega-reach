app.tutorial.cellar = app.tutorial.invent({
  id: 'cellar',
  // State
  state: {},
  // Lifecycle
  shouldActivate: () => content.location.is('cellar'),
  onUpdate: function () {
    if (!content.location.is('cellar')) {
      return
    }

    [
      {
        title: `[Tutorial] <span class="u-screenReader">for</span> The cellar?`,
        description: `Who put this <em>earthen labyrinth</em> here? Your surprise is as genuine as mine—so you're on your own in this maze! My best advice is to turn away.`,
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
