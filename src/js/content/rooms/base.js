content.rooms.base = {
  // Attributes
  id: undefined,
  name: undefined,
  description: undefined,
  defaultProgram: undefined,
  interactLabel: 'Examine',
  moveDownLabel: 'No south',
  moveLeftLabel: 'No west',
  moveRightLabel: 'No east',
  moveUpLabel: 'No north',
  // Transitions
  transitions: {},
  // State
  defaultState: {},
  state: {},
  // Main methods
  export: function () {
    return {...this.defaultState, ...this.state}
  },
  extend: function (definition) {
    return engine.fn.extend(this, definition)
  },
  import: function (state = {}) {
    this.state = {...this.defaultState, ...state}
    return this
  },
  reset: function () {
    this.state = {...this.defaultState}
    return this
  },
  // Attribute getters (override to return dynamic values)
  getAttributeLabels: function () {
    return []
  },
  getDescription: function () {
    return this.description
  },
  getDescriptionModifier: function () {
    return ''
  },
  getInteractLabel: function () {
    return this.interactLabel
  },
  getMoveDownLabel: function () {
    return this.moveDownLabel
  },
  getMoveLeftLabel: function () {
    return this.moveLeftLabel
  },
  getMoveRightLabel: function () {
    return this.moveRightLabel
  },
  getMoveUpLabel: function () {
    return this.moveUpLabel
  },
  getName: function () {
    return this.name
  },
  getNameShort: function () {
    return this.getName()
  },
  isComplete: function () {
    return false
  },
  isIncomplete: function () {
    return false
  },
  isDiscovered: () => true,
  // Interaction
  canInteract: () => false,
  canInteractFreely: () => false,
  hasSolution: function () {
    return this.canInteract()
  },
  getInteractJingle: () => 2,
  interact: function () {
    if (!this.canInteract()) {
      return this
    }

    const action = this.getInteractLabel()

    const result = this.onInteract()
    content.solution.generate()

    content.location.emit('interact', {
      action,
      result,
      room: this,
    })

    return result
  },
  onInteract: () => {}, // Return a string to announce to interface
  // Movement
  canEnter: () => true,
  canMove: function (direction) {
    return content.rooms.get(this.transitions[direction])?.canEnter() ?? false
  },
  canMoveDown: function () {
    return this.canMove('down')
  },
  canMoveLeft: function () {
    return this.canMove('left')
  },
  canMoveRight: function () {
    return this.canMove('right')
  },
  canMoveUp: function () {
    return this.canMove('up')
  },
  enter: function () {
    if (this.defaultProgram) {
      content.programs.load(this.defaultProgram)
    }

    content.solution.generate()
    this.onEnter()

    return this
  },
  exit: function () {
    content.programs.unload()

    this.onExit()

    return this
  },
  move: function (direction) {
    if (!this.canMove(direction)) {
      return this
    }

    content.location.set(this.transitions[direction])

    return this
  },
  moveDown: function () {
    return this.move('down')
  },
  moveLeft: function () {
    return this.move('left')
  },
  moveRight: function () {
    return this.move('right')
  },
  moveUp: function () {
    return this.move('up')
  },
  onEnter: function () {},
  onExit: function () {},
}
