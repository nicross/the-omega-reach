content.shop = (() => {
  const cooldownTime = 60

  const qualifiers = [
    'Apocryphal',
    'Baked',
    'Battered',
    'Boiled',
    'Breakfast',
    'Broiled',
    'Caramelized',
    'Deconstructed',
    'Dehydrated',
    'Dried',
    'Elevated',
    'Earthen',
    'Fermented',
    'Fried',
    'Grilled',
    'Marinated',
    'Peppered',
    'Raw',
    'Roasted',
    'Salted',
    'Seared',
    'Seasoned',
    'Secret',
    'Spiced',
    'Sweetened',
    'Special',
    'Toasted',
    'Zested',
  ]

  const ingredients = [
    'Amphibian',
    'Antimatter',
    'Bird',
    'Crab',
    'Earthling',
    'Fish',
    'Fruit',
    'Insect',
    'Mammal',
    'Microbe',
    'Mushroom',
    'Plant',
    'Reptile',
    'Synthetic',
    'Worm',
    'Vegetable',
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
    // Randoms
    'The easter egg',
    'The fourth wall',
    'The inside joke',
    'The password generator',
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
    return engine.fn.lerp(100, 300, engine.fn.clamp(engine.fn.scale(content.wallet.amount(), 100, 1000, 0, 1)))
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
    isOpen: () => content.conservatory.isOpen() && content.wallet.amount() >= getCost() && timer == 0,
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
      if (content.conservatory.isOpen()) {
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

  content.shop.update()
})
