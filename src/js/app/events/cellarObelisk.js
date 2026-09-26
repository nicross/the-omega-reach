content.location.on('cellar-obelisk', ({tile}) => {
  app.screen.game.dialog.push({
    title: `Pay your respects?`,
    description: `You will gain <strong class="a-game--dialogHealth">${app.utility.format.health(tile.activeHealthBonus)}</strong> while having its blessing.`,
    actions: [
      {
        label: `Hail the spire`,
        before: () => {
          tile.state.active = true

          content.cellar.health.add(tile.activeHealthBonus)
          content.audio.healthChange.trigger({isUp: true})
          content.cellar.scans.set(tile, tile.getEffects().length)

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
