app.tutorial.atriumOffer = app.tutorial.invent({
  id: 'atriumOffer',
  // State
  state: {},
  // Lifecycle
  shouldActivate: () => content.location.is('atrium') && content.shop.isOpen(),
  onUpdate: function () {
    if (!content.location.is('atrium')) {
      return
    }

    [
      {
        title: `The eagle has landed!`,
        description: `The delicious aromatics manifesting their profits waft in from <strong>the shop</strong>. They typically have something delightful to share—despite your many philosophical snares.`,
        actions: [
          {
            label: 'Check it out',
            before: () => this.markComplete(),
          }
        ],
      },
    ].forEach((x) => app.screen.game.dialog.push(x))
  },
})
