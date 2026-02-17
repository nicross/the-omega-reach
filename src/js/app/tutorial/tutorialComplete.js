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
        description: `You've recalled all of the basics for you to be successful this cycle. You may recall more later, but until then? Reach for the stars, gather their instruments, and curate the best collection in the universe!`,
        actions: [
          {
            label: 'End tutorial',
            before: () => this.markComplete(),
          }
        ],
      },
      ].forEach((x) => app.screen.game.dialog.push(x))
  },
})
