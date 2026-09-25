content.location.on('cellar-obelisk', ({tile}) => {
  app.screen.game.dialog.push({
    title: `Pay your respects?`,
    description: `You will gain <strong class="a-game--dialogHealth">${app.utility.format.health(tile.activeHealthBonus)}</strong> while blessed.`,
    actions: [
      {
        label: `Hail the spire`,
        before: () => {
          tile.state.active = true

          content.cellar.health.add(tile.getGlobalHealthBonus())
          content.audio.sanityChange.trigger({isUp: true})
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
