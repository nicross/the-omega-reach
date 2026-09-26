content.location.on('cellar-trove', ({tile}) => {
  const amount = tile.calculateReward()

  app.screen.game.dialog.push({
    title: `Take an earthen penny?`,
    description: `You will transfer <strong class="a-game--dialogCurrency">${app.utility.format.currency(amount)}</strong> from your donations.`,
    actions: [
      {
        label: `Pocket the credit${amount == 1 ? '' : 's'}`,
        before: () => {
          content.donations.remove(amount)

          content.wallet.add(amount)
          content.audio.currencyChange.trigger({isUp: true})

          app.tutorial.update()
          app.screen.game.update()
        },
      },
      {
        label: 'Not now',
      },
    ],
  })

})
