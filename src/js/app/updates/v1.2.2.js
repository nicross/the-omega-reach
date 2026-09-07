app.updates.register('1.2.2', () => {
  migrateGame()

  function migrateGame() {
    const game = app.storage.get('game')

    if (!game) {
      return
    }

    // Reset cellar progress due to number of changes
    game.cellar = {
      deaths: game.cellar?.deaths,
      run: game.cellar?.run,
    }

    // Reset location to prevent cellar locks
    if (game.location?.id == 'cellar') {
      game.location = {id: 'atrium'}
    }

    app.storage.set('game', game)
  }
})
