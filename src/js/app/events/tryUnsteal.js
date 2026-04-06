content.location.on('try-unsteal', ({instrument}) => {

  app.screen.game.dialog.push({
    title: `Return this instrument?`,
    description: `You will discard <strong>${instrument.name}</strong>.`,
    actions: [
      {
        label: 'Put it back',
        after: () => {
          content.cellar.stockroom.unsteal(instrument.name)

          app.screen.game.update()
          app.tutorial.update()

          content.audio.interactSuccess.trigger({index: 2})
        },
      },
      {
        label: 'Keep it',
        after: () => {},
      }
    ],
  })

})
