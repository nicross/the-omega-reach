content.rooms.gallery = content.rooms.invent({
  // Attributes
  id: 'gallery',
  name: 'The gallery',
  description: 'Bereft of instruments',
  moveLeftLabel: 'Previous instrument',
  moveRightLabel: 'Next instrument',
  moveUpLabel: 'To the atrium',
  // Transitions
  transitions: {
    up: 'atrium',
  },
  // Methods
  getInstrument: function () {
    return this.state.name && content.instruments.has(this.state.name)
      ? content.instruments.get(this.state.name)
      : undefined
  },
  getDescription: function () {
    const instrument = this.getInstrument()

    if (instrument) {
      return instrument.state.scans > 0
        ? `${instrument.rarityLabel} instrument`
        : 'Unappraised'
    }

    return 'Bereft of instruments'
  },
  getDescriptionModifier: function () {
    const instrument = this.getInstrument()

    return instrument && instrument.state.scans > 0
      ? instrument.rarityLabel.toLowerCase()
      : ''
  },
  getName: function () {
    return this.getInstrument()?.name || 'The gallery'
  },
  isComplete: function () {
    const instrument = this.getInstrument()

    return instrument
      ? (instrument.state.scans || 0) >= 1 + instrument.quirks.length
      : false
  },
  isDiscovered: function () {
    return (this.getInstrument()?.state.scans || 0) > 0
  },
  setInstrumentByName: function (name) {
    this.state.name = name

    return this
  },
  // Interaction
  canInteract: function () {
    const instrument = this.getInstrument()

    return instrument
      ? (instrument.state.scans || 0) < 1 + instrument.quirks.length
      : false
  },
  canInteractFreely: function () {
    return Boolean(this.getInstrument())
  },
  canInteractFreely: function () {
    return this.getInstrument() && !content.solution.has()
  },
  getInteractJingle: function () {
    const instrument = this.getInstrument()

    if (instrument.state.scans == 1) {
      return 0
    }

    if (instrument.state.scans < 1 + instrument.quirks.length) {
      return 1
    }

    return 2
  },
  onInteract: function () {
    const instrument = this.getInstrument()
    instrument.state.scans = (instrument.state.scans || 0) + 1

    const message = []

    if (instrument.state.scans == 1) {
      if (instrument.quirks.length) {
        message.push(`${instrument.quirks.length} quirk${instrument.quirks.length == 1 ? '' : 's'} detected`)
      }
      
      content.sphereIndex.randomize()
    } else if (instrument.state.scans <= 1 + instrument.quirks.length) {
      message.push(`${instrument.quirks[instrument.state.scans - 2].name} found`)
    }

    if (this.isComplete()) {
      content.location.emit('interact-complete', {room: this})
      message.push(`Instrument complete`)
    }

    return message.join(', ')
  },
  // Attributes
  getAttributeLabels: function () {
    const instrument = this.getInstrument()

    if (!instrument?.state.scans) {
      return []
    }

    const attributes = []

    for (const i in instrument.quirks) {
      const quirk = instrument.quirks[i]

      if (instrument.state.scans - 1 > i) {
        attributes.push({
          label: quirk.name,
          modifiers: [quirk.isRare ? 'rare' : ''],
        })
      } else {
        attributes.push({
          label: 'Unexamined quirk',
          modifiers: ['undiscovered'],
        })
      }
    }

    return attributes
  },
  // Movement
  canMoveLeft: () => content.instruments.count() > 1,
  canMoveRight: () => content.instruments.count() > 1,
  moveLeft: function () {
    const names = content.instruments.names()

    this.setInstrumentByName(
      names[
        engine.fn.wrap(names.indexOf(this.state.name) - 1, 0, names.length)
      ]
    )

    content.solution.generate()
    this.updateProgram()

    return this.move('left')
  },
  moveRight: function () {
    const names = content.instruments.names()

    this.setInstrumentByName(
      names[
        engine.fn.wrap(names.indexOf(this.state.name) + 1, 0, names.length)
      ]
    )

    content.solution.generate()
    this.updateProgram()

    return this.move('right')
  },
  onEnter: function () {
    if (!this.getInstrument() && content.instruments.count()) {
      this.setInstrumentByName(
        content.instruments.names()[0]
      )
    }

    this.updateProgram()
  },
  updateProgram: function () {
    const instrument = this.getInstrument()

    if (instrument) {
      content.programs.load('instrument', {
        instrument,
        seed: instrument.name,
      })
    } else {
      content.programs.load('galleryEmpty')
    }
  },
})
