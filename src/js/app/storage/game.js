app.storage.game = {
  clear: () => app.storage.clear('game'),
  has: () => app.storage.has('game'),
  get: () => app.storage.get('game'),
  set: (value) => app.storage.set('game', value),
  // Helpers
  generate: function () {
    return {
      location: {
        id: 'atrium',
      },
      seed: app.fn.generateSeed(),
      tutorial: {},
      wallet: {
        amount: 50,
      },
    }
  },
  load: function () {
    engine.state.import(
      this.get()
    )

    return this
  },
  new: function () {
    engine.state.import(
      this.generate()
    )

    return this.save()
  },
  save: function () {
    this.set(
      engine.state.export()
    )

    return this
  },
}
