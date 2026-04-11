app.tutorial.galleryStealLoop = app.tutorial.invent({
  id: 'galleryStealLoop',
  // State
  state: {},
  // Lifecycle
  shouldActivate: () => content.stockroom.hasStolen(),
  onUpdate: function () {
    if (!(content.location.is('gallery') && content.stockroom.hasStolen())) {
      return
    }

    const stolenCount = content.stockroom.countStolen()

    content.audio.interactSuccess.trigger({index: 0})
    content.stockroom.keepStolen()

    app.screen.game.dialog.push({
      title: `Checkpoint!`,
      description: `You stole <strong>${stolenCount} instrument${stolenCount == 1 ? '' : 's'}</strong> from <strong>the stockroom</strong> this run.`,
      actions: [
        {
          label: `Enjoy!`,
        },
      ],
    })
  },
})
