app.tutorial.tutorialComplete = app.tutorial.invent({
  id: 'tutorialComplete',
  // State
  state: {},
  // Lifecycle
  // TODO: Require tutorial for shop when implemented
  shouldActivate: () => content.location.is('atrium') && app.tutorial.galleryScanned.complete,
  onUpdate: function () {
    if (!content.location.is('atrium')) {
      return
    }

    [
      {
        title: `This is the life!`,
        description: `You've recalled everything you need to be successful.`,
        actions: [
          {
            label: 'Grow your collection',
            before: () => this.markComplete(),
          }
        ],
      },
      ].forEach((x) => app.screen.game.dialog.push(x))
  },
})
