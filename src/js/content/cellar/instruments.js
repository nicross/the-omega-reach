content.cellar.instruments = (() => {
  const adjectives = [
    'Antimatter',
    'Antique',
    'Blessed',
    'Ceremonial',
    'Charismatic',
    'Contraband',
    'Curious',
    'Cursed',
    'Decorative',
    'Divine',
    'Effulgent',
    'Elegant',
    'Exalted',
    'Expensive',
    'Expressive',
    'Extravagent',
    'Exquisite',
    'Fancy',
    'Fantastical',
    'Glorious',
    'Grand',
    'Grandiose',
    'Great',
    'Heavenly',
    'Heroic',
    'Hidden',
    'Holographic',
    'Imaginary',
    'Incandescent',
    'Lavish',
    'Lucent',
    'Magnificent',
    'Majestic',
    'Noble',
    'Ornate',
    'Ornamental',
    'Polychromatic',
    'Pristine',
    'Prized',
    'Psychedelic',
    'Resplendent',
    'Royal',
    'Sacred',
    'Secret',
    'Sentimental',
    'Transcendental',
    'Triumphant',
    'Typical',
    'Undying',
    'Verified',
    'Whatever',
  ]

  const nouns = [
    'Accessory',
    'Amulet',
    'Apparatus',
    'Armor',
    'Artifact',
    'Band',
    'Bauble',
    'Bijou',
    'Bobblehead',
    'Bracelet',
    'Charm',
    'Coin',
    'Component',
    'Crystal',
    'Curio',
    'Device',
    'Digit',
    'Dingbat',
    'Doll',
    'Effigy',
    'Element',
    'Earring',
    'Figurine',
    'Fixture',
    'Furniture',
    'Gadget',
    'Garment',
    'Gemstone',
    'Gizmo',
    'Instrument',
    'Item',
    'Jewel',
    'Junk',
    'Keepsake',
    'Knicknack',
    'Machine',
    'Memento',
    'Model',
    'Module',
    'Mote',
    'Necklace',
    'Novelty',
    'Number',
    'Object',
    'Oddity',
    'Ornament',
    'Painting',
    'Pendant',
    'Piece',
    'Possession',
    'Ring',
    'Sarcophagus',
    'Skull',
    'Statue',
    'Stuff',
    'Talisman',
    'Totem',
    'Thing',
    'Tool',
    'Toy',
    'Treasure',
    'Trinket',
    'Unit',
    'Utensil',
    'Urn',
    'Vase',
    'Weapon',
    'Whatever',
    'Widget',
    'Wristlet',
  ]

  let previous = new Set()

  function generateUniqueName() {
    let name

    do {
      name = [
        engine.fn.choose(adjectives, Math.random()),
        engine.fn.choose(nouns, Math.random()).toLowerCase(),
      ].join(' ')
    } while (name && (previous.has(name) || content.instruments.has(name)))

    if (previous.size > adjectives.length * nouns.length * 0.5) {
      previous.clear()
    }

    previous.add(name)

    return name
  }

  return {
    export: () => ({
      previous: [...previous],
    }),
    generateUniqueName,
    import: function (data = {}) {
      previous = new Set(data.previous || [])

      return this
    },
    reset: function () {
      previous.clear()

      return this
    },
  }
})()
