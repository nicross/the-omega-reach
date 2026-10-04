app.tutorial.galleryStealLoop = app.tutorial.invent({
  id: 'galleryStealLoop',
  // Lifecycle
  shouldActivate: () => content.stockroom.hasStolen(),
  onUpdate: function () {
    if (!(content.location.is('gallery') && content.stockroom.hasStolen())) {
      return
    }

    const stolenCount = content.stockroom.countStolen()

    app.screen.game.dialog.push({
      title: `Checkpoint!`,
      description: `You stole <strong>${stolenCount} instrument${stolenCount == 1 ? '' : 's'}</strong> from <strong>the stockroom</strong>.`,
      actions: [
        {
          label: `Stash it`,
          after: () => {
            content.audio.interactSuccess.trigger({index: 2})
            content.audio.interactComplete.trigger()

            content.stockroom.keepStolen()
          },
        },
      ],
    })
  },
})
