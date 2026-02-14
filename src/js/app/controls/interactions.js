app.controls.interactions = (() => {
  const mouseMemory = engine.tool.vector2d.create(),
    pointLimit = 8

  const gamepadMappings = {
    left: {
      analog: [6],
      digital: [4, 10],
      rotation: engine.tool.quaternion.fromEuler({yaw: engine.const.tau * 0.25}),
      xAxis: 1,
      yAxis: 0,
    },
    right: {
      analog: [7],
      digital: [5, 11],
      rotation: engine.tool.quaternion.fromEuler({yaw: engine.const.tau * -0.25}),
      xAxis: 3,
      yAxis: 2,
    },
  }

  const keyboardMappings = {
    Digit1: engine.tool.vector3d.create({...engine.tool.vector2d.unitX().rotate(engine.const.tau * (0.5 + -(0/12))), z: 0.666}).normalize(),
    Digit2: engine.tool.vector3d.create({...engine.tool.vector2d.unitX().rotate(engine.const.tau * (0.5 + -(1/12))), z: 0.666}).normalize(),
    Digit3: engine.tool.vector3d.create({...engine.tool.vector2d.unitX().rotate(engine.const.tau * (0.5 + -(2/12))), z: 0.666}).normalize(),
    Digit4: engine.tool.vector3d.create({...engine.tool.vector2d.unitX().rotate(engine.const.tau * (0.5 + -(3/12))), z: 0.666}).normalize(),
    Digit5: engine.tool.vector3d.create({...engine.tool.vector2d.unitX().rotate(engine.const.tau * (0.5 + -(4/12))), z: 0.666}).normalize(),
    Digit6: engine.tool.vector3d.create({...engine.tool.vector2d.unitX().rotate(engine.const.tau * (0.5 + -(5/12))), z: 0.666}).normalize(),
    Digit7: engine.tool.vector3d.create({...engine.tool.vector2d.unitX().rotate(engine.const.tau * (0.5 + -(6/12))), z: 0.666}).normalize(),
    Digit8: engine.tool.vector3d.create({...engine.tool.vector2d.unitX().rotate(engine.const.tau * (0.5 + -(7/12))), z: 0.666}).normalize(),
    Digit9: engine.tool.vector3d.create({...engine.tool.vector2d.unitX().rotate(engine.const.tau * (0.5 + -(8/12))), z: 0.666}).normalize(),
    Digit0: engine.tool.vector3d.create({...engine.tool.vector2d.unitX().rotate(engine.const.tau * (0.5 + -(9/12))), z: 0.666}).normalize(),
    Minus: engine.tool.vector3d.create({...engine.tool.vector2d.unitX().rotate(engine.const.tau * (0.5 + -(10/12))), z: 0.666}).normalize(),
    Equal: engine.tool.vector3d.create({...engine.tool.vector2d.unitX().rotate(engine.const.tau * (0.5 + -(11/12))), z: 0.666}).normalize(),
    // Tropic
    KeyQ: engine.tool.vector3d.create({...engine.tool.vector2d.unitX().rotate(engine.const.tau * (0.5 + -(0/12))), z: 0.333}).normalize(),
    KeyW: engine.tool.vector3d.create({...engine.tool.vector2d.unitX().rotate(engine.const.tau * (0.5 + -(1/12))), z: 0.333}).normalize(),
    KeyE: engine.tool.vector3d.create({...engine.tool.vector2d.unitX().rotate(engine.const.tau * (0.5 + -(2/12))), z: 0.333}).normalize(),
    KeyR: engine.tool.vector3d.create({...engine.tool.vector2d.unitX().rotate(engine.const.tau * (0.5 + -(3/12))), z: 0.333}).normalize(),
    KeyT: engine.tool.vector3d.create({...engine.tool.vector2d.unitX().rotate(engine.const.tau * (0.5 + -(4/12))), z: 0.333}).normalize(),
    KeyY: engine.tool.vector3d.create({...engine.tool.vector2d.unitX().rotate(engine.const.tau * (0.5 + -(5/12))), z: 0.333}).normalize(),
    KeyU: engine.tool.vector3d.create({...engine.tool.vector2d.unitX().rotate(engine.const.tau * (0.5 + -(6/12))), z: 0.333}).normalize(),
    KeyI: engine.tool.vector3d.create({...engine.tool.vector2d.unitX().rotate(engine.const.tau * (0.5 + -(7/12))), z: 0.333}).normalize(),
    KeyO: engine.tool.vector3d.create({...engine.tool.vector2d.unitX().rotate(engine.const.tau * (0.5 + -(8/12))), z: 0.333}).normalize(),
    KeyP: engine.tool.vector3d.create({...engine.tool.vector2d.unitX().rotate(engine.const.tau * (0.5 + -(9/12))), z: 0.333}).normalize(),
    BracketLeft: engine.tool.vector3d.create({...engine.tool.vector2d.unitX().rotate(engine.const.tau * (0.5 + -(10/12))), z: 0.333}).normalize(),
    BracketRight: engine.tool.vector3d.create({...engine.tool.vector2d.unitX().rotate(engine.const.tau * (0.5 + -(11/12))), z: 0.333}).normalize(),
    // Equator
    KeyA: engine.tool.vector3d.create({...engine.tool.vector2d.unitX().rotate(engine.const.tau * (0.5 + -(0/11))), z: -0.333}).normalize(),
    KeyS: engine.tool.vector3d.create({...engine.tool.vector2d.unitX().rotate(engine.const.tau * (0.5 + -(1/11))), z: -0.333}).normalize(),
    KeyD: engine.tool.vector3d.create({...engine.tool.vector2d.unitX().rotate(engine.const.tau * (0.5 + -(2/11))), z: -0.333}).normalize(),
    KeyF: engine.tool.vector3d.create({...engine.tool.vector2d.unitX().rotate(engine.const.tau * (0.5 + -(3/11))), z: -0.333}).normalize(),
    KeyG: engine.tool.vector3d.create({...engine.tool.vector2d.unitX().rotate(engine.const.tau * (0.5 + -(4/11))), z: -0.333}).normalize(),
    KeyH: engine.tool.vector3d.create({...engine.tool.vector2d.unitX().rotate(engine.const.tau * (0.5 + -(5/11))), z: -0.333}).normalize(),
    KeyJ: engine.tool.vector3d.create({...engine.tool.vector2d.unitX().rotate(engine.const.tau * (0.5 + -(6/11))), z: -0.333}).normalize(),
    KeyK: engine.tool.vector3d.create({...engine.tool.vector2d.unitX().rotate(engine.const.tau * (0.5 + -(7/11))), z: -0.333}).normalize(),
    KeyL: engine.tool.vector3d.create({...engine.tool.vector2d.unitX().rotate(engine.const.tau * (0.5 + -(8/11))), z: -0.333}).normalize(),
    Semicolon: engine.tool.vector3d.create({...engine.tool.vector2d.unitX().rotate(engine.const.tau * (0.5 + -(9/11))), z: -0.333}).normalize(),
    Quote: engine.tool.vector3d.create({...engine.tool.vector2d.unitX().rotate(engine.const.tau * (0.5 + -(10/11))), z: -0.333}).normalize(),
    // Tropic
    KeyZ: engine.tool.vector3d.create({...engine.tool.vector2d.unitX().rotate(engine.const.tau * (0.5 + -(0/10))), z: -0.666}).normalize(),
    KeyX: engine.tool.vector3d.create({...engine.tool.vector2d.unitX().rotate(engine.const.tau * (0.5 + -(1/10))), z: -0.666}).normalize(),
    KeyC: engine.tool.vector3d.create({...engine.tool.vector2d.unitX().rotate(engine.const.tau * (0.5 + -(2/10))), z: -0.666}).normalize(),
    KeyV: engine.tool.vector3d.create({...engine.tool.vector2d.unitX().rotate(engine.const.tau * (0.5 + -(3/10))), z: -0.666}).normalize(),
    KeyB: engine.tool.vector3d.create({...engine.tool.vector2d.unitX().rotate(engine.const.tau * (0.5 + -(4/10))), z: -0.666}).normalize(),
    KeyN: engine.tool.vector3d.create({...engine.tool.vector2d.unitX().rotate(engine.const.tau * (0.5 + -(5/10))), z: -0.666}).normalize(),
    KeyM: engine.tool.vector3d.create({...engine.tool.vector2d.unitX().rotate(engine.const.tau * (0.5 + -(6/10))), z: -0.666}).normalize(),
    Comma: engine.tool.vector3d.create({...engine.tool.vector2d.unitX().rotate(engine.const.tau * (0.5 + -(7/10))), z: -0.666}).normalize(),
    Period: engine.tool.vector3d.create({...engine.tool.vector2d.unitX().rotate(engine.const.tau * (0.5 + -(8/10))), z: -0.666}).normalize(),
    Slash: engine.tool.vector3d.create({...engine.tool.vector2d.unitX().rotate(engine.const.tau * (0.5 + -(9/10))), z: -0.666}).normalize(),
  }

  let gamepadLeftPoint,
    gamepadRightPoint,
    keyboardPoints,
    mousePoint,
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
      y: -engine.input.gamepad.getAxis(mappings.yAxis),
      z: engine.input.gamepad.getAxis(mappings.xAxis),
    })

    let magnitude = point.distance()

    if (magnitude > 1) {
      point.y /= magnitude
      point.z /= magnitude
      magnitude = 1
    }

    point.x = 1 - magnitude

    return point.rotateQuaternion(mappings.rotation).normalize()
  }

  function updateGamepad() {
    const left = getGamepadSide(gamepadMappings.left)

    if (left) {
      gamepadLeftPoint = gamepadLeftPoint || {}
      gamepadLeftPoint.x = left.x
      gamepadLeftPoint.y = left.y
      gamepadLeftPoint.z = left.z
    } else {
      gamepadLeftPoint = undefined
    }

    const right = getGamepadSide(gamepadMappings.right)

    if (right) {
      gamepadRightPoint = gamepadRightPoint || {}
      gamepadRightPoint.x = right.x
      gamepadRightPoint.y = right.y
      gamepadRightPoint.z = right.z
    } else {
      gamepadRightPoint = undefined
    }
  }

  function updateKeyboard() {
    keyboardPoints = []

    for (const [key, vector] of Object.entries(keyboardMappings)) {
      if (engine.input.keyboard.is(key)) {
        keyboardPoints.push(vector)
      }
    }
  }

  function updateMouse() {
    if (mouseAllowed && engine.input.mouse.isButton(0))  {
      mousePoint = mousePoint || {}
      mousePoint.x = 1 - mouseMemory.distance()
      mousePoint.y = -mouseMemory.x
      mousePoint.z = mouseMemory.y
    } else {
      mousePoint = undefined
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

      if (app.screenManager.is('game')) {
        updateGamepad()
        updateKeyboard()
        updateMouse()

        points.push(
          ...keyboardPoints, // If more than limit, prefer most recent keys and other inputs
          mousePoint,
          gamepadLeftPoint,
          gamepadRightPoint,
        )

        points = points.filter((x) => x)

        if (points.length > pointLimit) {
          points = points.slice(points.length - pointLimit - 1, points.length)
        }
      }

      return this
    },
  }
})()
