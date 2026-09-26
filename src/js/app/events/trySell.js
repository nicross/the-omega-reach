content.location.on('try-sell', ({instrument}) => {

  app.screen.game.dialog.push({
    title: `Sell this instrument?`,
    description: `You will get <strong class="a-game--dialogCurrency">${app.utility.format.currency(instrument.value)}</strong> for <strong>${instrument.name}</strong>.`,
    actions: [
      {
        label: 'Sell it',
        after: () => {
          content.rooms.gallery.onSell()
          content.audio.currencyChange.trigger({isUp: true})

          app.screen.game.update()
          app.tutorial.update()
        },
      },
      {
        label: 'Not now',
        after: () => {},
      }
    ],
  })

})
