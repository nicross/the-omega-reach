content.location.on('cellar-pit', ({tile}) => {
  const cost = tile.calculateCost()

  app.screen.game.dialog.push({
    title: `Pay the earthen toll?`,
    description: `You will gain <strong class="a-game--dialogBarrier">${app.utility.format.barrier(1)}</strong> for <strong class="a-game--dialogCurrency">${app.utility.format.currency(cost)}</strong>.`,
    actions: [
      {
        label: `Destroy the credit${cost == 1 ? '' : 's'}`,
        before: () => {
          // XXX: Uses before() so the tutorial is enqueued without a screen flash
          content.audio.barrierChange.trigger({isUp: true})
          content.cellar.barrier.add(1)

          content.wallet.subtract(cost)
          content.audio.currencyChange.trigger({isUp: true})

          tile.incrementUses()

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
