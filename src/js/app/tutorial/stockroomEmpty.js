app.tutorial.stockroomEmpty = app.tutorial.invent({
  id: 'stockroomEmpty',
  // State
  state: {},
  // Lifecycle
  shouldActivate: () => content.location.is('stockroom') && !content.stockroom.hasGenerated(),
  onUpdate: function () {
    if (!content.location.is('stockroom')) {
      return
    }

    [
      {
        title: `It's… empty?`,
        description: `You slip into <strong>the stockroom</strong> without explicit approval. Lacking the shopkeeper's atypical personality, the hollow room exhibits similar acoustics to <strong>the gallery</strong>. What might they normally keep within this underused facility?`,
        actions: [
          {
            label: 'Sneak back later',
          }
        ],
        after: () => this.markComplete(),
      },
    ].forEach((x) => app.screen.game.dialog.push(x))
  },
})
