content.location.on('cellar-quagmire', ({tile}) => {
  const cost = tile.calculateCost()

  app.screen.game.dialog.push({
    title: `Finish the earthen project?`,
    description: `You will pay <strong class="a-game--dialogCurrency">${app.utility.format.currency(cost)}</strong> to resume your donations.`,
    actions: [
      {
        label: `Burn the credit${cost == 1 ? '' : 's'}`,
        before: () => {
          tile.state.active = false
          content.wallet.subtract(cost)

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
