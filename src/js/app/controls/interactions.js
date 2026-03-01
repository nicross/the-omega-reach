app.controls.interactions = (() => {
  const mouseMemory = engine.tool.vector2d.create(),
    pointLimit = 8

  const gamepadMappings = {
    left: {
      analog: [6],
      digital: [4, 10],
      rotation: engine.tool.quaternion.fromEuler({yaw: engine.const.tau * -0.25}),
      xAxis: 1,
      yAxis: 0,
    },
    right: {
      analog: [7],
      digital: [5, 11],
      rotation: engine.tool.quaternion.fromEuler({yaw: engine.const.tau * 0.25}),
      xAxis: 3,
      yAxis: 2,
    },
  }

  const keyboardMappings = {
    Digit1: engine.tool.vector3d.create({...engine.tool.vector2d.unitX().rotate(engine.const.tau * (0.5 + (0/12))), z: 0.666}).normalize(),
    Digit2: engine.tool.vector3d.create({...engine.tool.vector2d.unitX().rotate(engine.const.tau * (0.5 + (1/12))), z: 0.666}).normalize(),
    Digit3: engine.tool.vector3d.create({...engine.tool.vector2d.unitX().rotate(engine.const.tau * (0.5 + (2/12))), z: 0.666}).normalize(),
    Digit4: engine.tool.vector3d.create({...engine.tool.vector2d.unitX().rotate(engine.const.tau * (0.5 + (3/12))), z: 0.666}).normalize(),
    Digit5: engine.tool.vector3d.create({...engine.tool.vector2d.unitX().rotate(engine.const.tau * (0.5 + (4/12))), z: 0.666}).normalize(),
    Digit6: engine.tool.vector3d.create({...engine.tool.vector2d.unitX().rotate(engine.const.tau * (0.5 + (5/12))), z: 0.666}).normalize(),
    Digit7: engine.tool.vector3d.create({...engine.tool.vector2d.unitX().rotate(engine.const.tau * (0.5 + (6/12))), z: 0.666}).normalize(),
    Digit8: engine.tool.vector3d.create({...engine.tool.vector2d.unitX().rotate(engine.const.tau * (0.5 + (7/12))), z: 0.666}).normalize(),
    Digit9: engine.tool.vector3d.create({...engine.tool.vector2d.unitX().rotate(engine.const.tau * (0.5 + (8/12))), z: 0.666}).normalize(),
    Digit0: engine.tool.vector3d.create({...engine.tool.vector2d.unitX().rotate(engine.const.tau * (0.5 + (9/12))), z: 0.666}).normalize(),
    Minus: engine.tool.vector3d.create({...engine.tool.vector2d.unitX().rotate(engine.const.tau * (0.5 + (10/12))), z: 0.666}).normalize(),
    Equal: engine.tool.vector3d.create({...engine.tool.vector2d.unitX().rotate(engine.const.tau * (0.5 + (11/12))), z: 0.666}).normalize(),
    // Tropic
    KeyQ: engine.tool.vector3d.create({...engine.tool.vector2d.unitX().rotate(engine.const.tau * (0.5 + (0/12))), z: 0.333}).normalize(),
    KeyW: engine.tool.vector3d.create({...engine.tool.vector2d.unitX().rotate(engine.const.tau * (0.5 + (1/12))), z: 0.333}).normalize(),
    KeyE: engine.tool.vector3d.create({...engine.tool.vector2d.unitX().rotate(engine.const.tau * (0.5 + (2/12))), z: 0.333}).normalize(),
    KeyR: engine.tool.vector3d.create({...engine.tool.vector2d.unitX().rotate(engine.const.tau * (0.5 + (3/12))), z: 0.333}).normalize(),
    KeyT: engine.tool.vector3d.create({...engine.tool.vector2d.unitX().rotate(engine.const.tau * (0.5 + (4/12))), z: 0.333}).normalize(),
    KeyY: engine.tool.vector3d.create({...engine.tool.vector2d.unitX().rotate(engine.const.tau * (0.5 + (5/12))), z: 0.333}).normalize(),
    KeyU: engine.tool.vector3d.create({...engine.tool.vector2d.unitX().rotate(engine.const.tau * (0.5 + (6/12))), z: 0.333}).normalize(),
    KeyI: engine.tool.vector3d.create({...engine.tool.vector2d.unitX().rotate(engine.const.tau * (0.5 + (7/12))), z: 0.333}).normalize(),
    KeyO: engine.tool.vector3d.create({...engine.tool.vector2d.unitX().rotate(engine.const.tau * (0.5 + (8/12))), z: 0.333}).normalize(),
    KeyP: engine.tool.vector3d.create({...engine.tool.vector2d.unitX().rotate(engine.const.tau * (0.5 + (9/12))), z: 0.333}).normalize(),
    BracketLeft: engine.tool.vector3d.create({...engine.tool.vector2d.unitX().rotate(engine.const.tau * (0.5 + (10/12))), z: 0.333}).normalize(),
    BracketRight: engine.tool.vector3d.create({...engine.tool.vector2d.unitX().rotate(engine.const.tau * (0.5 + (11/12))), z: 0.333}).normalize(),
    // Equator
    KeyA: engine.tool.vector3d.create({...engine.tool.vector2d.unitX().rotate(engine.const.tau * (0.5 + (0/11))), z: -0.333}).normalize(),
    KeyS: engine.tool.vector3d.create({...engine.tool.vector2d.unitX().rotate(engine.const.tau * (0.5 + (1/11))), z: -0.333}).normalize(),
    KeyD: engine.tool.vector3d.create({...engine.tool.vector2d.unitX().rotate(engine.const.tau * (0.5 + (2/11))), z: -0.333}).normalize(),
    KeyF: engine.tool.vector3d.create({...engine.tool.vector2d.unitX().rotate(engine.const.tau * (0.5 + (3/11))), z: -0.333}).normalize(),
    KeyG: engine.tool.vector3d.create({...engine.tool.vector2d.unitX().rotate(engine.const.tau * (0.5 + (4/11))), z: -0.333}).normalize(),
    KeyH: engine.tool.vector3d.create({...engine.tool.vector2d.unitX().rotate(engine.const.tau * (0.5 + (5/11))), z: -0.333}).normalize(),
    KeyJ: engine.tool.vector3d.create({...engine.tool.vector2d.unitX().rotate(engine.const.tau * (0.5 + (6/11))), z: -0.333}).normalize(),
    KeyK: engine.tool.vector3d.create({...engine.tool.vector2d.unitX().rotate(engine.const.tau * (0.5 + (7/11))), z: -0.333}).normalize(),
    KeyL: engine.tool.vector3d.create({...engine.tool.vector2d.unitX().rotate(engine.const.tau * (0.5 + (8/11))), z: -0.333}).normalize(),
    Semicolon: engine.tool.vector3d.create({...engine.tool.vector2d.unitX().rotate(engine.const.tau * (0.5 + (9/11))), z: -0.333}).normalize(),
    Quote: engine.tool.vector3d.create({...engine.tool.vector2d.unitX().rotate(engine.const.tau * (0.5 + (10/11))), z: -0.333}).normalize(),
    // Tropic
    KeyZ: engine.tool.vector3d.create({...engine.tool.vector2d.unitX().rotate(engine.const.tau * (0.5 + (0/10))), z: -0.666}).normalize(),
    KeyX: engine.tool.vector3d.create({...engine.tool.vector2d.unitX().rotate(engine.const.tau * (0.5 + (1/10))), z: -0.666}).normalize(),
    KeyC: engine.tool.vector3d.create({...engine.tool.vector2d.unitX().rotate(engine.const.tau * (0.5 + (2/10))), z: -0.666}).normalize(),
    KeyV: engine.tool.vector3d.create({...engine.tool.vector2d.unitX().rotate(engine.const.tau * (0.5 + (3/10))), z: -0.666}).normalize(),
    KeyB: engine.tool.vector3d.create({...engine.tool.vector2d.unitX().rotate(engine.const.tau * (0.5 + (4/10))), z: -0.666}).normalize(),
    KeyN: engine.tool.vector3d.create({...engine.tool.vector2d.unitX().rotate(engine.const.tau * (0.5 + (5/10))), z: -0.666}).normalize(),
    KeyM: engine.tool.vector3d.create({...engine.tool.vector2d.unitX().rotate(engine.const.tau * (0.5 + (6/10))), z: -0.666}).normalize(),
    Comma: engine.tool.vector3d.create({...engine.tool.vector2d.unitX().rotate(engine.const.tau * (0.5 + (7/10))), z: -0.666}).normalize(),
    Period: engine.tool.vector3d.create({...engine.tool.vector2d.unitX().rotate(engine.const.tau * (0.5 + (8/10))), z: -0.666}).normalize(),
    Slash: engine.tool.vector3d.create({...engine.tool.vector2d.unitX().rotate(engine.const.tau * (0.5 + (9/10))), z: -0.666}).normalize(),
  }

  let gamepadLeftPoint,
    gamepadRightPoint,
    keyboardPoints,
    mousePrimaryPoint,
    mouseSecondaryPoint,
    points = []

  let mouseAllowed = false

  document.addEventListener('mousedown', (e) => mouseAllowed = !e.target.matches('button, button *'))
  document.addEventListener('mouseup', (e) => mouseAllowed = true)

  document.addEventListener('mousemove', (e) => {
    const dimension = Math.min(window.innerWidth, window.innerHeight)

    mouseMemory.x = engine.fn.clamp(
      engine.fn.scale(
        e.clientX,
        (window.innerWidth - dimension) * 0.5, window.innerWidth - ((window.innerWidth - dimension) * 0.5),
        -1, 1,
      ),
      -1, 1
    )

    mouseMemory.y = engine.fn.clamp(
      engine.fn.scale(
        e.clientY,
        (window.innerHeight - dimension) * 0.5, window.innerHeight - ((window.innerHeight - dimension) * 0.5),
        1, -1
      ),
      -1, 1
    )

    const magnitude = mouseMemory.distance()

    if (magnitude > 1) {
      mouseMemory.x /= magnitude
      mouseMemory.y /= magnitude
    }
  })

  function getGamepadSide(mappings) {
    const isPressed = mappings.analog.reduce((value, button) => value || engine.input.gamepad.getAnalog(button) > 0, false)
      || mappings.digital.reduce((value, button) => value || engine.input.gamepad.isDigital(button), false)

    if (!isPressed) {
      return
    }

    const point = engine.tool.vector3d.create({
      y: engine.input.gamepad.getAxis(mappings.yAxis),
      z: engine.input.gamepad.getAxis(mappings.xAxis),
    })

    point.x = Math.sqrt(1 - point.distance()) || 0

    const rotated = point.rotateQuaternion(mappings.rotation).normalize()

    rotated.depth = mappings.digital.reduce((value, button) => {
      return Math.max(value, engine.input.gamepad.isDigital(button) ? 1 : 0)
    }, 0) || mappings.analog.reduce((value, button) => {
      return Math.max(value, engine.input.gamepad.getAnalog(button))
    }, 0)

    return rotated
  }

  function updateGamepad() {
    const left = getGamepadSide(gamepadMappings.left)

    if (left) {
      gamepadLeftPoint = gamepadLeftPoint || {}
      gamepadLeftPoint.depth = left.depth
      gamepadLeftPoint.x = left.x
      gamepadLeftPoint.y = left.y
      gamepadLeftPoint.z = left.z
      gamepadLeftPoint.xPrime = gamepadLeftPoint.x
    } else {
      gamepadLeftPoint = undefined
    }

    const right = getGamepadSide(gamepadMappings.right)

    if (right) {
      gamepadRightPoint = gamepadRightPoint || {}
      gamepadRightPoint.depth = right.depth
      gamepadRightPoint.x = right.x
      gamepadRightPoint.y = right.y
      gamepadRightPoint.z = right.z
      gamepadRightPoint.xPrime = gamepadRightPoint.x
    } else {
      gamepadRightPoint = undefined
    }
  }

  function updateKeyboard() {
    keyboardPoints = []

    for (let [key, vector] of Object.entries(keyboardMappings)) {
      if (engine.input.keyboard.is(key)) {
        keyboardPoints.push(vector)
        vector.depth = engine.fn.accelerateValue(vector.depth || 0, 1, 24)
      } else {
        vector.depth = 0
      }
    }
  }

  function updateMouse() {
    const point = engine.tool.vector3d.create({
      x: Math.sqrt(1 - mouseMemory.distance()) || 0,
      y: mouseMemory.x,
      z: mouseMemory.y,
    }).normalize()

    if (mouseAllowed && engine.input.mouse.isButton(0)) {
      mousePrimaryPoint = mousePrimaryPoint || {}
      mousePrimaryPoint.depth = engine.fn.accelerateValue(mousePrimaryPoint.depth || 0, 1, 24)
      mousePrimaryPoint.x = point.x
      mousePrimaryPoint.y = point.y
      mousePrimaryPoint.z = point.z
      mousePrimaryPoint.xPrime = mousePrimaryPoint.x
    } else {
      mousePrimaryPoint = undefined
    }

    if (mouseAllowed && engine.input.mouse.isButton(2)) {
      mouseSecondaryPoint = mouseSecondaryPoint || {}
      mouseSecondaryPoint.depth = engine.fn.accelerateValue(mouseSecondaryPoint.depth || 0, 1, 24)
      mouseSecondaryPoint.x = -point.x
      mouseSecondaryPoint.y = -point.y
      mouseSecondaryPoint.z = -point.z
      mouseSecondaryPoint.xPrime = mouseSecondaryPoint.x
    } else {
      mouseSecondaryPoint = undefined
    }
  }

  return {
    keyboardMappings: () => ({...keyboardMappings}),
    points: () => [...points],
    reset: function () {
      points.length = 0

      return this
    },
    update: function () {
      points.length = 0

      if (app.screenManager.is('game') && !app.screen.game.dialog.isOpen() && (content.location.get()?.canInteract() || content.location.get()?.canInteractFreely())) {
        updateGamepad()
        updateKeyboard()
        updateMouse()

        points.push(
          ...keyboardPoints, // If more than limit, prefer most recent keys and other inputs
          mouseSecondaryPoint,
          mousePrimaryPoint,
          gamepadLeftPoint,
          gamepadRightPoint,
        )

        points = points.filter((x) => x)

        if (points.length > pointLimit) {
          points = points.slice(points.length - pointLimit - 1, points.length)
        }

        // Handle point inversion?
        const isInverted = content.programs.get()?.invertSynthX() ? -1 : 1

        for (const point of points) {
          if (!('xPrime' in point)) {
            point.xPrime = point.x
          }

          point.x = isInverted * point.xPrime
        }
      }

      return this
    },
  }
})()
