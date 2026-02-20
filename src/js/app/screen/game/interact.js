app.screen.game.interact = (() => {
  const labelElement = document.querySelector('.a-game--interactLabel'),
    progressElement = document.querySelector('.a-game--interactProgress'),
    pubsub = engine.tool.pubsub.create(),
    rootElement = document.querySelector('.a-game--interact')

  let canInteract,
    isCooldown = false,
    lastFrame = 0,
    proximity = 0,
    proximityAccelerated = 0,
    value = 0,
    valueAccelerated = 0

  rootElement.addEventListener('click', () => {
    if (!app.settings.computed.inputHold) {
      app.screen.game.interact.click()
    }
  })

  function trigger() {
    isCooldown = true
    proximityAccelerated = Math.max(0.75, proximityAccelerated)
    valueAccelerated = Math.max(0.75, valueAccelerated)

    rootElement.classList.remove('a-game--interact-active')

    const room = content.location.get()

    const action = room.getInteractLabel(),
      result = room.interact()

    pubsub.emit('trigger', {action, result, room})

    if (result) {
      app.screen.game.live.set(result)
    }

    app.screen.game.update()
  }

  return pubsub.decorate({
    accelerate: function () {
      proximityAccelerated = engine.fn.accelerateValue(proximityAccelerated, proximity, proximity ? 3 : 1)
      valueAccelerated = engine.fn.accelerateValue(valueAccelerated, value, value ? 3 : 1)

      return this
    },
    click: function () {
      if (isCooldown || !canInteract) {
        return this
      }

      trigger()

      return this
    },
    decrement: function () {
      value = app.settings.computed.inputHold
        ? engine.fn.accelerateValue(value, 0, 8)
        : 0

      rootElement.classList.remove('a-game--interact-active')
      progressElement.style.width = `${value * 100}%`

      return this
    },
    increment: function () {
      const frame = engine.loop.frame()

      if (isCooldown || !canInteract || frame == lastFrame) {
        return this
      }

      lastFrame = frame

      value = app.settings.computed.inputHold
        ? engine.fn.accelerateValue(value, 1, 1)
        : 0

      rootElement.classList.add('a-game--interact-active')
      progressElement.style.width = `${value * 100}%`

      if (value >= 1) {
        trigger()
      }

      return this
    },
    proximity: () => proximity,
    proximityAccelerated: () => proximityAccelerated,
    setCooldown: function (nextValue) {
      isCooldown = Boolean(nextValue)

      return this
    },
    setProximity: function (nextValue) {
      proximity = nextValue

      return this
    },
    update: function () {
      value = 0

      const room = content.location.get()

      canInteract = room.canInteract()

      labelElement.innerHTML = room.getInteractLabel()

      if (app.settings.computed.inputHold) {
        rootElement.classList.remove('a-game--interact-instant')
      } else {
        rootElement.classList.add('a-game--interact-instant')
      }

      if (canInteract) {
        rootElement.removeAttribute('aria-disabled')
      } else {
        rootElement.setAttribute('aria-disabled', true)
      }

      progressElement.style.width = `0%`

      return this
    },
    value: () => value,
    valueAccelerated: () => valueAccelerated,
  })
})()
