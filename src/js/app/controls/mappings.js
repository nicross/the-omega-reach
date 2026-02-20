app.controls.mappings = {
  game: {
    interact: {
      gamepadAnalog: [],
      gamepadAxis: [],
      gamepadDigital: [
        0,
        1,
        2,
        3,
      ],
      keyboard: [
        'Enter',
        'NumpadEnter',
        'Space',
      ],
      mouseAxis: [],
      mouseButton: [],
      mouseWheel: [],
    },
  },
  ui: {
    // Navigation
    up: {
      gamepadAnalog: [],
      gamepadAxis: [
        [1, -1],
        [3, -1],
      ],
      gamepadDigital: [
        12,
      ],
      keyboard: [
        'ArrowUp',
        'KeyW',
        'Numpad8',
      ],
      mouseAxis: [],
      mouseButton: [],
      mouseWheel: [],
    },
    down: {
      gamepadAnalog: [],
      gamepadAxis: [
        [1, 1],
        [3, 1],
      ],
      gamepadDigital: [
        13,
      ],
      keyboard: [
        'ArrowDown',
        'KeyS',
        'Numpad5',
      ],
      mouseAxis: [],
      mouseButton: [],
      mouseWheel: [],
    },
    left: {
      gamepadAnalog: [],
      gamepadAxis: [
        [0, -1],
        [2, -1],
      ],
      gamepadDigital: [
        14,
      ],
      keyboard: [
        'ArrowLeft',
        'KeyA',
        'KeyQ',
        'Numpad4',
        'Numpad7',
      ],
      mouseAxis: [],
      mouseButton: [],
      mouseWheel: [],
    },
    right: {
      gamepadAnalog: [],
      gamepadAxis: [
        [0, 1],
        [2, 1],
      ],
      gamepadDigital: [
        15,
      ],
      keyboard: [
        'ArrowRight',
        'KeyD',
        'KeyE',
        'Numpad6',
        'Numpad9',
      ],
      mouseAxis: [],
      mouseButton: [],
      mouseWheel: [],
    },
    // Movement
    moveUp: {
      gamepadAnalog: [],
      gamepadAxis: [],
      gamepadDigital: [
        12,
      ],
      keyboard: [
        'ArrowUp',
        'Numpad8',
      ],
      mouseAxis: [],
      mouseButton: [],
      mouseWheel: [
        ['getWheelY', -1],
      ],
    },
    moveDown: {
      gamepadAnalog: [],
      gamepadAxis: [],
      gamepadDigital: [
        13,
      ],
      keyboard: [
        'ArrowDown',
        'Numpad5',
      ],
      mouseAxis: [],
      mouseButton: [],
      mouseWheel: [
        ['getWheelY', 1],
      ],
    },
    moveLeft: {
      gamepadAnalog: [],
      gamepadAxis: [],
      gamepadDigital: [
        14,
      ],
      keyboard: [
        'ArrowLeft',
        'Numpad4',
      ],
      mouseAxis: [],
      mouseButton: [],
      mouseWheel: [
        ['getWheelX', -1],
      ],
    },
    moveRight: {
      gamepadAnalog: [],
      gamepadAxis: [],
      gamepadDigital: [
        15,
      ],
      keyboard: [
        'ArrowRight',
        'Numpad6',
      ],
      mouseAxis: [],
      mouseButton: [],
      mouseWheel: [
        ['getWheelX', 1],
      ],
    },
    // Actions
    confirm: {
      gamepadAnalog: [],
      gamepadAxis: [],
      gamepadDigital: [
        0,
      ],
      keyboard: [
        'Enter',
        'KeyF',
        'NumpadEnter',
        'Space',
      ],
      mouseAxis: [],
      mouseButton: [],
      mouseWheel: [],
    },
    back: {
      gamepadAnalog: [],
      gamepadAxis: [],
      gamepadDigital: [
        1,
      ],
      keyboard: [
        'Backspace',
        'Delete',
        'Escape',
        'NumpadDecimal',
        'Pause',
      ],
      mouseAxis: [],
      mouseButton: [
        3,
      ],
      mouseWheel: [],
    },
    pause: {
      gamepadAnalog: [],
      gamepadAxis: [],
      gamepadDigital: [
        8,
        9,
      ],
      keyboard: [
        'Escape',
        'Pause',
      ],
      mouseAxis: [],
      mouseButton: [
        3,
      ],
      mouseWheel: [],
    },
    interact: {
      gamepadAnalog: [],
      gamepadAxis: [],
      gamepadDigital: [
        0,
      ],
      keyboard: [
        'Enter',
        'NumpadEnter',
        'Space',
      ],
      mouseAxis: [],
      mouseButton: [
        // Handled by interactions
      ],
      mouseWheel: [],
    },
    // Individual special buttons
    enter: {
      gamepadAnalog: [],
      gamepadAxis: [],
      gamepadDigital: [],
      keyboard: [
        'Enter',
        'NumpadEnter',
      ],
      mouseAxis: [],
      mouseButton: [],
      mouseWheel: [],
    },
    select: {
      gamepadAnalog: [],
      gamepadAxis: [],
      gamepadDigital: [
        8,
      ],
      keyboard: [],
      mouseAxis: [],
      mouseButton: [],
      mouseWheel: [],
    },
    space: {
      gamepadAnalog: [],
      gamepadAxis: [],
      gamepadDigital: [],
      keyboard: [
        'Space',
      ],
      mouseAxis: [],
      mouseButton: [],
      mouseWheel: [],
    },
    start: {
      gamepadAnalog: [],
      gamepadAxis: [],
      gamepadDigital: [
        9,
      ],
      keyboard: [],
      mouseAxis: [],
      mouseButton: [],
      mouseWheel: [],
    },
  },
}
