content.cellar.instruments = (() => {
  const adjectives = [
    'Antique',
    'Blessed',
    'Charismatic',
    'Contraband',
    'Curious',
    'Cursed',
    'Decorative',
    'Divine',
    'Elegant',
    'Expensive',
    'Extravagent',
    'Exquisite',
    'Fancy',
    'Fantastical',
    'Heavenly',
    'Heroic',
    'Glorious',
    'Grandiose',
    'Great',
    'Magnificent',
    'Majestic',
    'Noble',
    'Ornamental',
    'Pristine',
    'Prized',
    'Psychedelic',
    'Royal',
    'Sacred',
    'Splendid',
  ]

  const nouns = [
    'Amulet',
    'Artifact',
    'Bauble',
    'Bobblehead',
    'Charm',
    'Coin',
    'Crystal',
    'Device',
    'Doll',
    'Effigy',
    'Figurine',
    'Furniture',
    'Gemstone',
    'Gadget',
    'Gizmo',
    'Instrument',
    'Jewel',
    'Module',
    'Mote',
    'Necklace',
    'Ornament',
    'Painting',
    'Possession',
    'Ring',
    'Sarcophagus',
    'Statue',
    'Talisman',
    'Totem',
    'Thing',
    'Treasure',
    'Trinket',
    'Utensil',
    'Urn',
    'Vase',
    'Widget',
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
