app.tutorial.horizon = app.tutorial.invent({
  id: 'horizon',
  // State
  state: {},
  // Lifecycle
  shouldActivate: () => content.location.is('horizon'),
  onUpdate: function () {
    if (!content.location.is('horizon')) {
      return
    }

    [
      {
        title: `It's full of galaxies!`,
        description: `They resolve from the void as you reach into <strong>the horizon</strong>—first as infrared blobs before more recognizable discs. Although the options are staggeringly numerous, you trust its lack of incorrect choices.`,
        actions: [
          {
            label: 'Reach deeper',
          }
        ],
      },
      {
        tutorial: true,
        title: `<span class="u-highlight">[Tutorial]</span> <span class="u-screenReader">for</span> The horizon:`,
        description: `Interact to reach toward a random galaxy upon <strong>the horizon</strong>. You will zoom in automagically to any new galaxies that you reach.`,
        actions: [
          {
            label: 'Regain control',
          }
        ],
        after: () => this.markComplete(),
      },
    ].forEach((x) => app.screen.game.dialog.push(x))
  },
})
