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
        title: `Was this always here?`,
        description: `You follow the shopkeeper into the <em>earthen labyrinth</em> undetected. Perhaps this is a shortcut to wherever they find their wares? Yet, the darkness which enshrouds their footsteps seems to creep much further.`,
        actions: [
          {
            label: 'Be careful',
          }
        ],
        after: () => this.markComplete(),
      },
      {
        tutorial: true,
        title: `<span class="u-highlight">[Tutorial]</span> <span class="u-screenReader">for</span> Sanity`,
        description: `Sanity is your main resource when exploring <strong>the cellar</strong>. Use it to reveal unexplored areas—but beware! The consequences for running out aren't yet clear.`,
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
