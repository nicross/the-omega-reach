content.location.on('try-steal', ({instrument}) => {

  app.screen.game.dialog.push({
    title: `Steal this instrument?`,
    description: `You will acquire <strong>${instrument.name}</strong>.`,
    actions: [
      {
        label: 'Steal it',
        after: () => {
          content.stockroom.steal(instrument.name)

          app.screen.game.update()
          app.tutorial.update()

          content.audio.interactSuccess.trigger({index: 1})
        },
      },
      {
        label: 'Not now',
        after: () => {},
      }
    ],
  })

})
