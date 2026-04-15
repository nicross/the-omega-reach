content.shop = (() => {
  const cooldownTime = 60,
    cooldownDisallowed = new Set(['atrium','shop'])

  const qualifiers = [
    'Active',
    'Baked',
    'Battered',
    'Boiled',
    'Breakfast',
    'Broiled',
    'Caramelized',
    'Choice',
    'Deconstructed',
    'Dehydrated',
    'Dried',
    'Elevated',
    'Earthen',
    'Fermented',
    'Fried',
    'Glazed',
    'Grilled',
    'Marinated',
    'Peppered',
    'Raw',
    'Roasted',
    'Rubbed',
    'Salted',
    'Seared',
    'Seasoned',
    'Secret',
    'Spiced',
    'Sweetened',
    'Special',
    'Super',
    'Toasted',
    'Zested',
  ]

  const ingredients = [
    'Amphibian',
    'Antimatter',
    'Bird',
    'Crab',
    'Earthling',
    'Egg',
    'Fish',
    'Fruit',
    'Insect',
    'Mammal',
    'Microbe',
    'Mushroom',
    'Plant',
    'Reptile',
    'Seed',
    'Synthetic',
    'Unicorn',
    'Vegetable',
    'Worm',
  ]

  const types = [
    'Beverage',
    'Biscuit',
    'Bread',
    'Brew',
    'Burger',
    'Burrito',
    'Butter',
    'Cake',
    'Casserole',
    'Cheese',
    'Chips',
    'Chowder',
    'Cream',
    'Curry',
    'Donut',
    'Dumpling',
    'Elixir',
    'Fillet',
    'Jerky',
    'Juice',
    'Milk',
    'Mousse',
    'Pasta',
    'Pie',
    'Pizza',
    'Potion',
    'Pudding',
    'Roll',
    'Salad',
    'Sandwich',
    'Sauce',
    'Sausage',
    'Skewer',
    'Soup',
    'Steak',
    'Stew',
    'Sticks',
    'Taco',
    'Truffle',
    'Waffle',
    'Wrap',
    'Yogurt',
  ]

  const uniques = [
    // Me???
    'shiftBacktick',
    // Games
    'Audo',
    'Auroboros',
    'Bladius',
    'Chimera',
    'E.X.O.',
    'Fishyphus',
    'Kaleidophone',
    'Lacus Opportunitas',
    'Lost Lakes',
    'Periphery Synthetic',
    'Project Ephemera',
    'S.E.A.',
    'Soundsearcher',
    'soundStrider',
    'Wurmus',
    // Demos
    'Harmony Falls',
    'Melody Heights',
    'Secret Bread',
    // Jokes
    'Adjective noun',
    'Adjective adjective noun',
    'the easter egg',
    'the fourth wall',
    'the inside joke',
    'the password generator',
    // Weapons
    'The Annihilator',
    'The Banisher',
    'The Cauterizer',
    'The Dragonslayer',
    'The Exterminator',
    'The Finisher',
    'The Gravedigger',
    'The Harbinger',
    'The Intimidator',
    'The Judicator',
    'The Kingmaker',
    'The Liquidator',
    'The Mangler',
    'The Negator',
    'The Overthrower',
    'The Pacifier',
    'The Quasher',
    'The Rectifier',
    'The Sanitizer',
    'The Tenderizer',
    'The Unifier',
    'The Vaporizer',
    'The Wrangler',
    'The Xenoripper',
    'The Yielder',
    'The Zapper',
  ]

  let previous = new Set(),
    timer = cooldownTime

  function generateUniqueName() {
    let name

    do {
      name = engine.fn.choose([
        [
          engine.fn.choose(qualifiers, Math.random()),
          engine.fn.choose(ingredients, Math.random()).toLowerCase(),
          engine.fn.choose(types, Math.random()).toLowerCase(),
        ].join(' '),
        engine.fn.choose(uniques, Math.random()),
      ], Math.random() ** 2)
    } while (name && (previous.has(name) || content.instruments.has(name)))

    if (previous.size > qualifiers.length * ingredients.length * types.length * 0.5) {
      previous.clear()
    }

    previous.add(name)

    return name
  }

  function getCost() {
    return Math.ceil(
      engine.fn.lerp(
        100, 9999,
        engine.fn.clamp(engine.fn.scale(content.wallet.amount(), 100, 20000, 0, 1))
      )
    )
  }

  return {
    export: () => ({
      previous: [...previous],
      timer,
    }),
    generateUniqueName,
    getCost,
    import: function (data = {}) {
      previous = new Set(data.previous || [])
      timer = 'timer' in data ? data.timer : cooldownTime

      return this
    },
    isOpen: () => content.conservatory.isReady() && content.wallet.amount() >= getCost() && timer == 0,
    reset: function () {
      previous.clear()
      timer = cooldownTime

      return this
    },
    resetTimer: function () {
      timer = cooldownTime

      return this
    },
    update: function () {
      if (content.conservatory.isOpen() && !cooldownDisallowed.has(content.location.id())) {
        timer = engine.fn.accelerateValue(timer, 0, 1)
      }

      return this
    },
  }
})()

engine.state.on('export', (data) => data.shop = content.shop.export())
engine.state.on('import', ({shop}) => content.shop.import(shop))
engine.state.on('reset', () => content.shop.reset())

engine.loop.on('frame', ({paused}) => {
  if (paused) {
    return
  }

  // XXX: Prevent timer updating while app has a dialog open
  if (app.screen.game.dialog.isOpen()) {
    return
  }

  content.shop.update()
})
