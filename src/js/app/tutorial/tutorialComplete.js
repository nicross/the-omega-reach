app.tutorial.tutorialComplete = app.tutorial.invent({
  id: 'tutorialComplete',
  // State
  state: {},
  // Lifecycle
  shouldActivate: () => content.location.is('atrium') && app.tutorial.galleryComplete.complete,
  onUpdate: function () {
    if (!content.location.is('atrium')) {
      return
    }

    [
      {
        title: `This is the life!`,
        description: `You've remembered all of the basics for success this cycle. You may recall more later, but until then? Reach for the stars, gather their instruments, and curate the best collection in the universe!`,
        actions: [
          {
            label: 'End tutorial',
          }
        ],
        finally: () => this.markComplete(),
      },
    ].forEach((x) => app.screen.game.dialog.push(x))
  },
})
