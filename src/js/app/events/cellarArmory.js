content.location.on('cellar-armory', ({tile}) => {
  app.screen.game.dialog.push({
    title: `Borrow something?`,
    description: `You will gain <strong class="a-game--dialogBarrier">${app.utility.format.barrier(1)}</strong>.`,
    actions: [
      {
        label: `Take the equipment`,
        before: () => {
          content.cellar.barrier.add(1)
          content.audio.barrierChange.trigger({isUp: true})
  
          tile.incrementUses()
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
