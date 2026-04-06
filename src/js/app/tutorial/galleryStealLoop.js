app.tutorial.galleryStealLoop = app.tutorial.invent({
  id: 'galleryStealLoop',
  // State
  state: {},
  // Lifecycle
  shouldActivate: () => content.cellar.stockroom.hasStolen(),
  onUpdate: function () {
    if (!(content.location.is('gallery') && content.cellar.stockroom.hasStolen())) {
      return
    }

    const stolenCount = content.cellar.stockroom.countStolen()

    content.audio.interactSuccess.trigger({index: 0})
    content.cellar.stockroom.keepStolen()

    app.screen.game.dialog.push({
      title: `Theft undetected!`,
      description: `You stole <strong>${stolenCount} instrument${stolenCount == 1 ? '' : 's'}</strong> from <strong>the stockroom</strong> this run.`,
      actions: [
        {
          label: `Enjoy!`,
        },
      ],
    })
  },
})
