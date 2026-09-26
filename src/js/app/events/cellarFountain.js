content.location.on('cellar-fountain', ({tile}) => {
  const cost = tile.calculateCost(),
    recovery = tile.calculateRecovery()

  app.screen.game.dialog.push({
    title: `Make an earthen wish?`,
    description: `You will recover <strong class="a-game--dialogHealth">${app.utility.format.health(recovery)}</strong> for <strong class="a-game--dialogCurrency">${app.utility.format.currency(cost)}</strong>.`,
    actions: [
      {
        label: `Donate the credit${cost == 1 ? '' : 's'}`,
        after: () => {
          content.audio.healthChange.trigger({isUp: true})
          content.cellar.health.add(recovery)
          content.wallet.subtract(cost)
          content.donations.add(cost)

          tile.incrementUses()

          app.screen.game.update()
        },
      },
      {
        label: 'Not now',
      },
    ],
  })

})
