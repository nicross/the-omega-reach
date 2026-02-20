content.location.on('try-sell', ({instrument}) => {

  app.screen.game.dialog.push({
    title: `Sell this instrument?`,
    description: `You will receive <strong>${app.utility.format.currency(instrument.value)}</strong> for <strong>${instrument.name}</strong>.`,
    actions: [
      {
        label: 'Sell instrument',
        after: () => {
          content.rooms.gallery.onSell()
          app.screen.game.update()
          content.audio.interactComplete.trigger()
          content.audio.interactSuccess.trigger({
            index: 2,
          })
        },
      },
      {
        label: 'Decline',
        after: () => {},
      }
    ],
  })

})
