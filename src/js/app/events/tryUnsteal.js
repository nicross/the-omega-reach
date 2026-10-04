content.location.on('try-unsteal', ({instrument}) => {

  app.screen.game.dialog.push({
    title: `Return this instrument?`,
    description: `You will discard <strong>${instrument.name}</strong>.`,
    actions: [
      {
        label: 'Put it back',
        after: () => {
          content.stockroom.unsteal(instrument.name)

          app.screen.game.update()
          app.tutorial.update()

          content.audio.interactSuccess.trigger({index: 0})
        },
      },
      {
        label: 'Keep it',
        after: () => {},
      }
    ],
  })

})
