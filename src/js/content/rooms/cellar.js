content.rooms.cellar = content.rooms.invent({
  // Attributes
  id: 'cellar',
  name: 'The cellar',
  description: 'Unexamiend area',
  defaultProgram: 'cellar',
  // Transitions
  transitions: {
    exit: 'shop',
    faint: 'atrium',
  },
  // Methods
  getDescription: function () {
    if (this.isEntrance()) {
      return 'Cellar entrance'
    }

    return `Cellar room`
  },
  getAttributeLabels: function () {
    return [
      {
        label: `${content.cellar.health.amount()} sanity`,
        modifiers: [content.cellar.health.has(2) ? 'legendary' : 'rare'],
      },
    ]
  },
  isDiscovered: function () {
    return true
  },
  isEntrance: () => content.cellar.position.is({x: 0, y: 0}),
  // Interaction
  canInteract: function () {
    // TODO: OR when interactive object
    return false
  },
  canInteractFreely: function () {
    return true
  },
  isComplete: () => false,
  isIncomplete: function () {
    // TODO: OR when interactive and completed
    return false
  },
  onInteract: function () {
    const message = []

    // TODO: discovered things

    return message.join(', ')
  },
  // Movement
  canEnter: () => content.cellar.isRunning(),
  canMoveDown: () => !content.cellar.position.is({x: 0, y: 2}) && (content.cellar.health.has(2) || content.cellar.discovered.is(content.cellar.position.get().add({y: -1}))),
  canMoveLeft: () => !content.cellar.position.is({x: 1, y: 1}) && (content.cellar.health.has(2) || content.cellar.discovered.is(content.cellar.position.get().add({x: -1}))),
  canMoveRight: () => !content.cellar.position.is({x: -1, y: 1}) && (content.cellar.health.has(2) || content.cellar.discovered.is(content.cellar.position.get().add({x: 1}))),
  canMoveUp: function() {return this.isEntrance() || content.cellar.health.has(2) || content.cellar.discovered.is(content.cellar.position.get().add({y: 1}))},
  getMoveDownLabel: function () {
    return this.canMoveDown()
      ? 'Go south'
      : 'No south'
  },
  getMoveDownLabel: function () {
    return this.canMoveLeft()
      ? 'Go west'
      : 'No west'
  },
  getMoveRightLabel: function () {
    return this.canMoveRight()
      ? 'Go east'
      : 'No east'
  },
  getMoveUpLabel: function () {
    return this.canMoveUp()
      ? (this.isEntrance() ? 'To shop' : 'Go north')
      : 'No north'
  },
  moveDown: function () {
    const next = content.cellar.position.get().add({y: -1})
    const isDiscovered = content.cellar.discovered.is(next)

    if (!isDiscovered) {
      content.cellar.health.subtract(1)
      content.cellar.discovered.set(next)
    }

    content.cellar.position.set(next)

    content.location.emit('move', {
      direction: 'down',
      from: this,
      to: this,
    })

    return this.move('down')
  },
  moveLeft: function () {
    const next = content.cellar.position.get().add({x: -1})
    const isDiscovered = content.cellar.discovered.is(next)

    if (!isDiscovered) {
      content.cellar.health.subtract(1)
      content.cellar.discovered.set(next)
    }

    content.cellar.position.set(next)

    content.location.emit('move', {
      direction: 'left',
      from: this,
      to: this,
    })

    return this.move('left')
  },
  moveRight: function () {
    const next = content.cellar.position.get().add({x: 1})
    const isDiscovered = content.cellar.discovered.is(next)

    if (!isDiscovered) {
      content.cellar.health.subtract(1)
      content.cellar.discovered.set(next)
    }

    content.cellar.position.set(next)

    content.location.emit('move', {
      direction: 'right',
      from: this,
      to: this,
    })

    return this.move('right')
  },
  moveUp: function () {
    if (this.isEntrance()) {
      return this.move('exit')
    }

    const next = content.cellar.position.get().add({y: 1})
    const isDiscovered = content.cellar.discovered.is(next)

    if (!isDiscovered) {
      content.cellar.health.subtract(1)
      content.cellar.discovered.set(next)
    }

    content.cellar.position.set(next)

    content.location.emit('move', {
      direction: 'up',
      from: this,
      to: this,
    })

    return this.move('up')
  },
  // Atrium
  getAtriumMuffle: () => 1,
  // Reach
  getReachMuffle: () => {
    const base = 1/2,
      distance = content.cellar.position.get().distance(),
      max = content.cellar.health.max() - 1,
      value = engine.fn.clamp(distance / max)

    return 1 - engine.fn.lerpExp(0.5, 0, value, 2)
  },
  getReachPan: () => -content.cellar.position.get().normalize().x,
})
