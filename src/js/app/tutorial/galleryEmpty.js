app.tutorial.galleryEmpty = app.tutorial.invent({
  id: 'galleryEmpty',
  // State
  state: {},
  // Lifecycle
  shouldActivate: () => content.location.is('gallery') && content.instruments.count() == 0,
  onUpdate: function () {
    if (!content.location.is('gallery')) {
      return
    }

    [
      {
        title: `Something's missing.`,
        description: `<strong>The gallery</strong> falls silent as your footsteps dissipate. Briefly you entertain your sweet memories of how it will soon be. The cacophony of melodies shall be deafening!`,
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
