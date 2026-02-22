content.rooms.atrium = content.rooms.invent({
  // Attributes
  id: 'atrium',
  name: 'The atrium',
  description: 'At the center of time',
  defaultProgram: 'atrium',
  moveDownLabel: 'To the gallery',
  moveLeftLabel: 'To the lobby',
  moveRightLabel: 'To the shop',
  moveUpLabel: 'To the reach',
  // Transitions
  transitions: {
    up: 'reach',
    right: 'shop',
    down: 'gallery',
    left: 'lobby',
  },
  // Methods
  getAttributeLabels: function () {
    const attributes = []

    if (content.instruments.hasUnscanned()) {
      attributes.push({
        label: 'New instruments',
        modifiers: ['undiscovered'],
        chimeNote: 63,
      })
    }

    if (content.donations.has()) {
      attributes.push({
        label: 'New donations',
        modifiers: ['undiscovered'],
        chimeNote: 67,
      })
    }

    if (content.shop.isOpen()) {
      attributes.push({
        label: 'New offer',
        modifiers: ['undiscovered'],
        chimeNote: 70,
      })
    }

    if (content.wallet.has(51) || app.tutorial.atriumWallet.complete) {
      attributes.push({
        label: `${app.utility.format.currency(content.wallet.amount())}`,
        modifiers: ['rare'],
      })
    }

    return attributes
  },
  // Movement
  moveDown: function () {
    const unscanned = content.instruments.getFirstUnscannedName()

    if (unscanned) {
      content.rooms.gallery.setInstrumentByName(unscanned)
    }

    this.move('down')
  },
  onEnter: function () {
    const chimeNotes = this.getAttributeLabels()
      .map((x) => x.chimeNote)
      .filter((x) => x)

    if (chimeNotes.length) {
      chimeNotes.push(75)

      content.audio.atriumChime.trigger({
        notes: chimeNotes.map(engine.fn.fromMidi),
      })
    }
  },
  // Reach
  getReachMuffle: () => 1 - (1/3),
  getReachPan: () => 0,
})
