content.location.on('cellar-vision', ({tile}) => {
  const cost = tile.calculateCost()

  app.screen.game.dialog.push({
    title: `Banish the earthen curse?`,
    description: `You will lose <strong class="a-game--dialogHealth">${app.utility.format.health(cost)}</strong> to remove its effects.`,
    actions: [
      {
        label: `Make the sacrifice`,
        before: () => {
          tile.state.active = false

          content.cellar.health.subtract(cost)
          content.audio.healthChange.trigger({isUp: false})

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
