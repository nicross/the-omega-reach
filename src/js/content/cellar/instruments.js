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
    'Elegant',
    'Expensive',
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
    'Imaginary',
    'Incandescent',
    'Lucent',
    'Magnificent',
    'Majestic',
    'Noble',
    'Ornamental',
    'Pristine',
    'Prized',
    'Psychedelic',
    'Resplendent',
    'Royal',
    'Sacred',
    'Secret',
    'Sentimental',
    'Transcendent',
    'Triumphant',
    'Typical',
    'Undying',
    'Verified',
    'Whatever',
  ]

  const nouns = [
    'Amulet',
    'Armor',
    'Artifact',
    'Bauble',
    'Bobblehead',
    'Charm',
    'Coin',
    'Crystal',
    'Device',
    'Digit',
    'Dingbat',
    'Doll',
    'Effigy',
    'Figurine',
    'Furniture',
    'Gadget',
    'Garment',
    'Gemstone',
    'Gizmo',
    'Instrument',
    'Jewel',
    'Junk',
    'Machine',
    'Model',
    'Module',
    'Mote',
    'Necklace',
    'Number',
    'Ornament',
    'Painting',
    'Possession',
    'Ring',
    'Sarcophagus',
    'Skull',
    'Statue',
    'Stuff',
    'Talisman',
    'Totem',
    'Thing',
    'Treasure',
    'Trinket',
    'Utensil',
    'Urn',
    'Vase',
    'Weapon',
    'Whatever',
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
