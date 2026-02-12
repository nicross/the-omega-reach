app.tutorial.lobbyClosed = app.tutorial.invent({
  id: 'lobbyClosed',
  // State
  state: {},
  // Lifecycle
  shouldActivate: () => content.location.is('lobby') && !content.rooms.lobby.isOpen(),
  onUpdate: function () {
    if (!content.location.is('lobby')) {
      return
    }

    [
      {
        title: `Is anybody there?`,
        description: `Even when it's accepting visitors, finding a conversation in <strong>the lobby</strong> is rare. At least the <em>earthen wood</em> adorning the ceiling is always an alluring appeal? You could recall every detail of the cycle it was installed.`,
        actions: [
          {
            label: 'Come back later',
            before: () => this.markComplete(),
          }
        ],
      },
    ].forEach((x) => app.screen.game.dialog.push(x))
  },
})
