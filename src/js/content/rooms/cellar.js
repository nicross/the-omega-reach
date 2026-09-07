content.rooms.cellar = content.rooms.invent({
  // Attributes
  id: 'cellar',
  name: 'The cellar',
  description: 'Unexamined area',
  defaultProgram: 'cellar',
  // Transitions
  transitions: {
    exit: 'shop',
    faint: 'atrium',
  },
  // Methods
  getName: function () {
    const tile = content.cellar.tiles.current()
    const name = tile.getName() || this.name

    return tile.z == 0 || tile.isUniquePerRun
      ? name
      : `${name} B${Math.abs(tile.z) + 1}`
  },
  getNameShort: function () {
    return this.nameShort
  },
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
    const effects = tile.getEffects()

    for (let i = 0; i < effects.length; i += 1) {
      const effect = effects[i]

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
      modifiers: ['health', 'inline'],
    })

    const barrier = content.cellar.barrier.amount()

    if (barrier) {
      attributes.push({
        label: `${app.utility.format.barrier(content.cellar.barrier.amount())}`,
        modifiers: ['barrier', 'inline'],
      })
    }

    return attributes
  },
  isDiscovered: function () {
    return true
  },
  isEntrance: () => content.cellar.position.is({x: 0, y: 0, z: 0}),
  // Interaction
  canInteract: function () {
    const tile = content.cellar.tiles.current()

    return tile.isFullyScanned()
      ? tile.canInteractMore()
      : true
  },
  canInteractFreely: () => true,
  getInteractJingle: function () {
    const tile = content.cellar.tiles.current()
    const scans = content.cellar.scans.get(tile)
    const effects = tile.getEffects()

    if (scans < effects.length) {
      return 1
    }

    return 2
  },
  getInteractLabel: function () {
    const tile = content.cellar.tiles.current()

    return tile.isFullyScanned()
      ? (tile.getInteractLabelMore() || this.interactLabel)
      : this.interactLabel
  },
  hasSolution: function () {
    const tile = content.cellar.tiles.current()

    return tile.isFullyScanned()
      ? tile.hasSolutionMore()
      : true
  },
  isComplete: () => false,
  isIncomplete: function () {
    const tile = content.cellar.tiles.current()

    return tile.isFullyScanned()
      ? tile.isIncompleteMore()
      : true
  },
  onInteract: function () {
    const tile = content.cellar.tiles.current()

    if (tile.isFullyScanned()) {
      return tile.onInteractMore()
    }

    const message = []

    // Increment scans and apply next effect
    const effects = tile.getEffects(),
      scans = content.cellar.scans.increment(tile)

    const effect = effects[scans - 1]

    effect.apply()

    message.push((
      typeof effect.liveLabel == 'function'
        ? effect.liveLabel()
        : effect.liveLabel
    ) || effect.attribute.label)

    // Force walls to update
    content.programs.get().loadProperties()

    if (!content.cellar.health.has()) {
      // XXX: Run is over, do not call tile.onExit()
      content.location.emit('cellar-death', {
        reason: effect.reason,
      })

      return
    }

    if (scans == effects.length) {
      content.audio.cellarInteractives.update(true)
      message.push('Area complete')
      content.location.emit('interact-complete', {room: this})
    }

    return message
      .filter((x) => x)
      .join(', ')
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
    content.cellar.tiles.current()?.exit()

    const next = content.cellar.position.get().add({y: -1})
    const isDiscovered = content.cellar.discovered.is(next)

    if (!isDiscovered) {
      content.cellar.health.subtract(1)
      content.cellar.discovered.set(next)
    }

    content.audio.cellarMovement.down()

    content.cellar.position.set(next)
    content.cellar.tiles.current()?.enter()

    content.solution.generate()
    this.updateNameShort()
    this.updateProgram()

    content.location.emit('move', {
      direction: 'down',
      from: this,
      isCellar: true,
      to: this,
    })
  },
  moveLeft: function () {
    content.cellar.tiles.current()?.exit()

    const next = content.cellar.position.get().add({x: -1})
    const isDiscovered = content.cellar.discovered.is(next)

    if (!isDiscovered) {
      content.cellar.health.subtract(1)
      content.cellar.discovered.set(next)
    }

    content.audio.cellarMovement.left()

    content.cellar.position.set(next)
    content.cellar.tiles.current()?.enter()

    content.solution.generate()

    this.updateNameShort()
    this.updateProgram()

    content.location.emit('move', {
      direction: 'left',
      from: this,
      isCellar: true,
      to: this,
    })
  },
  moveRight: function () {
    content.cellar.tiles.current()?.exit()

    const next = content.cellar.position.get().add({x: 1})
    const isDiscovered = content.cellar.discovered.is(next)

    if (!isDiscovered) {
      content.cellar.health.subtract(1)
      content.cellar.discovered.set(next)
    }

    content.audio.cellarMovement.right()

    content.cellar.position.set(next)
    content.cellar.tiles.current()?.enter()

    content.solution.generate()

    this.updateNameShort()
    this.updateProgram()

    content.location.emit('move', {
      direction: 'right',
      from: this,
      isCellar: true,
      to: this,
    })
  },
  moveUp: function () {
    content.cellar.tiles.current()?.exit()

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
    content.cellar.tiles.current()?.enter()

    content.solution.generate()

    this.updateNameShort()
    this.updateProgram()

    content.location.emit('move', {
      direction: 'up',
      from: this,
      isCellar: true,
      to: this,
    })
  },
  onEnter: function () {
    this.updateNameShort()

    // XXX: Tile effects persist when saving/loading, do not call onEnter()
    content.cellar.tiles.current()?.activate()
  },
  onExit: function () {
    this.clearNameShort()

    // XXX: Tile effects persist when saving/loading, do not call onExit()
    content.cellar.tiles.current()?.deactivate()
  },
  clearNameShort: function () {
    this.nameShort = ''
    this.previousNameShort = ''
  },
  updateNameShort: function () {
    const name = this.getName()

    this.nameShort = name != this.previousNameShort
      ? name
      : ''

    this.previousNameShort = name
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
      value = engine.fn.clamp(distance / (max * 2))

    return engine.fn.lerpExp(1/4, 1, value, 1/3)
  },
  getReachPan: () => -content.cellar.position.get().normalize().x,
})
