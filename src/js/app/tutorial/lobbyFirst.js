app.tutorial.lobbyFirst = app.tutorial.invent({
  id: 'lobbyFirst',
  // State
  state: {},
  // Lifecycle
  shouldActivate: () => content.location.is('lobby'),
  onUpdate: function () {
    if (!content.location.is('lobby') || content.donations.has()) {
      return
    }

    [
      {
        title: `Is anybody there?`,
        description: `Even when it's accepting visitors, finding a conversation in <strong>the lobby</strong> is rare. At least the <em>earthen wood</em> adorning the ceiling is always an alluring appeal? You could recall every detail of the cycle it was installed.`,
        actions: [
          {
            label: 'Come back later',
          }
        ],
        finally: () => this.markComplete(),
      },
    ].forEach((x) => app.screen.game.dialog.push(x))
  },
})
