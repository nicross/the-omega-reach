content.location.on('cellar-kiln', ({tile}) => {
  const cost = tile.calculateCost(),
    name = content.cellar.instruments.generateUniqueName()

  app.screen.game.dialog.push({
    title: `Forge an instrument?`,
    description: `You will get <strong>${name}</strong> for <strong class="a-game--dialogCurrency">${app.utility.format.currency(cost)}</strong>.`,
    actions: [
      {
        label: `Smelt the credit${cost == 1 ? '' : 's'}`,
        before: () => {
          content.instruments.add(name)
          content.audio.interactSuccess.trigger({index: 2})
          content.wallet.subtract(cost)

          tile.incrementUses()
          tile.triggerCooldown()

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
