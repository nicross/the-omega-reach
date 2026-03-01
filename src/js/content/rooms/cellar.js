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

    return app.utility.format.coordinates(content.cellar.position.get())
  },
  getAttributeLabels: function () {
    const attributes = []

    const tile = content.cellar.tiles.current()
    const scans = content.cellar.scans.get(tile)

    for (let i = 0; i < tile.effects.length; i += 1) {
      const effect = tile.effects[i]

      if (scans >= i + 1) {
        attributes.push(effect.attribute)
      } else {
        attributes.push({
          label: `Unexamined anomaly`,
          modifiers: ['undiscovered'],
        })
      }
    }

    attributes.push({
      label: `${app.utility.format.health(content.cellar.health.amount())}`,
      modifiers: ['legendary'],
    })

    return attributes
  },
  isDiscovered: function () {
    return true
  },
  isEntrance: () => content.cellar.position.is({x: 0, y: 0}),
  // Interaction
  canInteract: function () {
    const tile = content.cellar.tiles.current()
    return tile.effects.length > content.cellar.scans.get(tile)
  },
  canInteractFreely: () => true,
  isComplete: () => false,
  isIncomplete: function () {
    return this.canInteract()
  },
  onInteract: function () {
    const message = []

    const tile = content.cellar.tiles.current()
    const scans = content.cellar.scans.increment(tile)
    const effect = tile.effects[scans - 1]

    message.push(effect.liveLabel || effect.attribute.label)
    effect.apply()

    if (!content.cellar.health.has()) {
      content.location.emit('cellar-death')
      return
    }

    if (scans == tile.effects.length) {
      message.push('Area complete')
      content.location.emit('interact-complete', {room: this})
    }

    return message.join(', ')
  },
  // Movement
  canEnter: () => content.cellar.isRunning(),
  canMoveDown: () => !content.cellar.tiles.isOffLimits(content.cellar.position.get().add({y: -1})) && (content.cellar.health.has(2) || content.cellar.discovered.is(content.cellar.position.get().add({y: -1}))),
  canMoveLeft: () => !content.cellar.tiles.isOffLimits(content.cellar.position.get().add({x: -1})) && (content.cellar.health.has(2) || content.cellar.discovered.is(content.cellar.position.get().add({x: -1}))),
  canMoveRight: () => !content.cellar.tiles.isOffLimits(content.cellar.position.get().add({x: 1})) && (content.cellar.health.has(2) || content.cellar.discovered.is(content.cellar.position.get().add({x: 1}))),
  canMoveUp: function() {return this.isEntrance() || (!content.cellar.tiles.isOffLimits(content.cellar.position.get().add({y: 1})) && (content.cellar.health.has(2) || content.cellar.discovered.is(content.cellar.position.get().add({y: 1}))))},
  getMoveDownLabel: function () {
    return this.canMoveDown()
      ? 'Go south'
      : 'No south'
  },
  getMoveLeftLabel: function () {
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
      ? (this.isEntrance() ? 'To the shop' : 'Go north')
      : 'No north'
  },
  moveDown: function () {
    const next = content.cellar.position.get().add({y: -1})
    const isDiscovered = content.cellar.discovered.is(next)

    if (!isDiscovered) {
      content.cellar.health.subtract(1)
      content.cellar.discovered.set(next)
    }

    content.audio.cellarMovement.down()

    content.cellar.position.set(next)
    content.solution.generate()
    this.updateProgram()

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

    content.audio.cellarMovement.left()

    content.cellar.position.set(next)
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
    const next = content.cellar.position.get().add({x: 1})
    const isDiscovered = content.cellar.discovered.is(next)

    if (!isDiscovered) {
      content.cellar.health.subtract(1)
      content.cellar.discovered.set(next)
    }

    content.audio.cellarMovement.right()

    content.cellar.position.set(next)
    content.solution.generate()
    this.updateProgram()

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

    content.audio.cellarMovement.up()

    content.cellar.position.set(next)
    content.solution.generate()
    this.updateProgram()

    content.location.emit('move', {
      direction: 'up',
      from: this,
      to: this,
    })

    return this.move('up')
  },
  updateProgram: function () {
    content.programs.load(this.defaultProgram)
  },
  // Atrium
  getAtriumMuffle: () => 1,
  // Reach
  getReachMuffle: () => {
    const distance = content.cellar.position.get().distance(),
      max = content.cellar.health.max(),
      value = engine.fn.clamp(distance / max)

    return 1 - engine.fn.lerpExp(1/4, 0, value, 0.5)
  },
  getReachPan: () => -content.cellar.position.get().normalize().x,
})
