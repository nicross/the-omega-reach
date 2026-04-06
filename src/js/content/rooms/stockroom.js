content.rooms.stockroom = content.rooms.invent({
  // Attributes
  id: 'stockroom',
  name: 'The stockroom',
  description: 'Bereft of wares',
  moveDownLabel: 'To the shop',
  moveLeftLabel: 'Previous instrument',
  moveRightLabel: 'Next instrument',
  // Transitions
  transitions: {
    down: 'shop',
  },
  // Methods
  getInstrument: function () {
    return this.state.name && content.cellar.stockroom.isGenerated(this.state.name)
      ? content.cellar.stockroom.getInstrument(this.state.name)
      : undefined
  },
  getDescription: function () {
    const instrument = this.getInstrument()

    if (instrument) {
      return instrument.state.scans > 0
        ? `${instrument.rarityLabel} instrument`
        : 'Unrevealed instrument'
    }

    return 'Bereft of wares'
  },
  getDescriptionModifier: function () {
    const instrument = this.getInstrument()

    return instrument && instrument.state.scans > 0
      ? instrument.rarityLabel.toLowerCase()
      : ''
  },
  getInteractLabel: function () {
    const instrument = this.getInstrument()

    return instrument
      ? this.isDiscovered() ? (this.isComplete() ? (content.cellar.stockroom.isStolen(instrument.name) ? 'Return' : 'Steal') : 'Examine') : 'Reveal'
      : 'Examine'
  },
  getName: function () {
    return this.getInstrument()?.name || 'The stockroom'
  },
  isComplete: function () {
    const instrument = this.getInstrument()

    return instrument
      ? (instrument.state.scans || 0) >= 1 + instrument.quirks.length
      : false
  },
  isIncomplete: function () {
    const instrument = this.getInstrument()

    return instrument
      ? (instrument.state.scans || 0) < 1 + instrument.quirks.length
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
    return Boolean(this.getInstrument())
  },
  hasSolution: function () {
    const instrument = this.getInstrument()

    return instrument
      ? (instrument.state.scans || 0) < 1 + instrument.quirks.length
      : false
  },
  canInteractFreely: function () {
    return true
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

    if (this.isComplete()) {
      if (content.cellar.stockroom.isStolen(instrument.name)) {
        content.location.emit('try-unsteal', {instrument})
      } else {
        content.location.emit('try-steal', {instrument})
      }

      return
    }

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
      message.push(`Valued at ${instrument.value} credits`)
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

    if (this.isComplete()) {
      attributes.push({
        label: app.utility.format.currency(instrument.value),
        labelPlain: `${instrument.value} credits`,
        modifiers: ['instrument'],
      })
    }

    return attributes
  },
  getCompleteLabel: function () {
    const isStolen = content.cellar.stockroom.isStolen(
      this.getInstrument()?.name
    )

    return isStolen
      ? `<li class="a-game--attribute a-game--attribute-instrument"><i aria-hidden="true">✓</i>Stealing</li>`
      : `<li class="a-game--attribute a-game--attribute-complete"><i aria-hidden="true">✓</i>Complete</li>`
  },
  // Movement
  canEnter: () => content.cellar.isRunning(),
  canMoveLeft: () => content.cellar.stockroom.countGenerated() > 1,
  canMoveRight: () => content.cellar.stockroom.countGenerated() > 1,
  moveLeft: function () {
    const names = content.cellar.stockroom.generated()

    this.setInstrumentByName(
      names[
        engine.fn.wrap(names.indexOf(this.state.name) - 1, 0, names.length)
      ]
    )

    content.solution.generate()
    this.updateProgram()

    content.location.emit('move', {
      direction: 'left',
      from: this,
      to: this,
    })

    return this.move('left')
  },
  moveRight: function () {
    const names = content.cellar.stockroom.generated()

    this.setInstrumentByName(
      names[
        engine.fn.wrap(names.indexOf(this.state.name) + 1, 0, names.length)
      ]
    )

    content.solution.generate()
    this.updateProgram()

    content.location.emit('move', {
      direction: 'right',
      from: this,
      to: this,
    })

    return this.move('right')
  },
  onEnter: function () {
    if (!this.getInstrument() && content.cellar.stockroom.hasGenerated()) {
      this.setInstrumentByName(
        content.cellar.stockroom.generated()[0]
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
      content.programs.load('stockroomEmpty')
    }
  },
})
