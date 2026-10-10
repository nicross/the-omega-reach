app.controls.touch = (() => {
  const touches = new Map()

  engine.ready(() => {
    const target = document.querySelector('.a-game--touch')

    target.addEventListener('touchcancel', onCancel)
    target.addEventListener('touchend', onEnd)
    target.addEventListener('touchmove', onMove)
    target.addEventListener('touchstart', onStart)
  })

  function onCancel(e) {
    e.preventDefault()

    for (const {identifier} of e.changedTouches) {
      touches.delete(identifier)
    }
  }

  function onEnd(e) {
    e.preventDefault()

    for (const {identifier} of e.changedTouches) {
      touches.delete(identifier)
    }
  }

  function onStart(e) {
    e.preventDefault()

    for (const touch of e.changedTouches) {
      const vector = toVector(touch)

      vector.depth = 0
      vector.target = vector.clone()

      touches.set(touch.identifier, vector)
    }
  }

  function onMove(e) {
    e.preventDefault()

    for (const touch of e.changedTouches) {
      const vector = touches.get(touch.identifier)

      if (!vector) {
        continue
      }

      vector.target = toVector(touch)
    }
  }

  function toVector(touch) {
    // SEE: Mouse in app.controls.interactions
    const dimension = Math.min(window.innerWidth, window.innerHeight)

    // Convert from page space to square in center of screen
    const raw = engine.tool.vector2d.create({
      x: engine.fn.clamp(
        engine.fn.scale(
          touch.pageX,
          (window.innerWidth - dimension) * 0.5, window.innerWidth - ((window.innerWidth - dimension) * 0.5),
          -1, 1,
        ),
        -1, 1
      ),
      y: engine.fn.clamp(
        engine.fn.scale(
          touch.pageY,
          (window.innerHeight - dimension) * 0.5, window.innerHeight - ((window.innerHeight - dimension) * 0.5),
          1, -1
        ),
        -1, 1
      ),
    })

    // Normalize the raw input
    const magnitude = raw.distance()

    if (magnitude > 1) {
      raw.x /= magnitude
      raw.y /= magnitude
    }

    // Convert to sphere space
    return engine.tool.vector3d.create({
      x: Math.sqrt(1 - raw.distance()) || 0,
      y: raw.x,
      z: raw.y,
    }).normalize()
  }

  return {
    has: () => touches.size > 0,
    getPoints: () => {
      // Update depths
      for (const vector of touches.values()) {
        vector.depth = engine.fn.accelerateValue(vector.depth || 0, 1, 12)
      }

      // Return shallow copy
      return [...touches.values()]
    },
    reset: function () {
      touches.clear()

      return this
    },
  }
})()
