app.screen.game.movement = (() => {
  const downElement = document.querySelector('.a-game--down'),
    leftElement = document.querySelector('.a-game--left'),
    pubsub = engine.tool.pubsub.create(),
    rightElement = document.querySelector('.a-game--right'),
    upElement = document.querySelector('.a-game--up')

  let canDown = false,
    canLeft = false,
    canRight = false,
    canUp = false

  return pubsub.decorate({
    down: function () {
      const e = {
        direction: 'down',
        isFootstep: ['atrium','gallery','lobby','reach','shop'].includes(content.location.id()),
        isOut: ['horizon','galaxy','star','planet','moon'].includes(content.location.id()),
      }

      if (!canDown) {
        pubsub.emit('disallowed', e)
        return this
      }

      content.location.get().moveDown()
      app.screen.game.update()
      pubsub.emit('move', e)

      return this
    },
    left: function () {
      const e = {
        direction: 'left',
        isFootstep: ['atrium','lobby','reach','shop'].includes(content.location.id()),
        isPrevious: ['gallery','galaxy','star','planet','moon'].includes(content.location.id()),
      }

      if (!canLeft) {
        pubsub.emit('disallowed', e)
        return this
      }

      content.location.get().moveLeft()
      app.screen.game.update()
      pubsub.emit('move', e)

      return this
    },
    right: function () {
      const e = {
        direction: 'right',
        isFootstep: ['atrium','lobby','reach','shop'].includes(content.location.id()),
        isNext: ['gallery','galaxy','star','planet','moon'].includes(content.location.id()),
      }

      if (!canRight) {
        pubsub.emit('disallowed', e)
        return this
      }

      content.location.get().moveRight()
      app.screen.game.update()
      pubsub.emit('move', e)

      return this
    },
    up: function () {
      const e = {
        direction: 'up',
        isFootstep: ['atrium','gallery','lobby','shop'].includes(content.location.id()),
        isIn: ['reach','horizon','galaxy','star','planet','moon'].includes(content.location.id()),
      }

      if (!canUp) {
        pubsub.emit('disallowed', e)
        return this
      }

      content.location.get().moveUp()
      app.screen.game.update()
      pubsub.emit('move', e)

      return this
    },
    update: function () {
      const room = content.location.get()

      // Down
      canDown = room.canMoveDown()

      const downLabel = room.getMoveDownLabel()

      downElement.ariaLabel = downLabel
      downElement.title = downLabel

      if (canDown) {
        downElement.removeAttribute('aria-disabled')
      } else {
        downElement.setAttribute('aria-disabled', true)
      }

      // Left
      canLeft = room.canMoveLeft()

      const leftLabel = room.getMoveLeftLabel()

      leftElement.ariaLabel = leftLabel
      leftElement.title = leftLabel

      if (canLeft) {
        leftElement.removeAttribute('aria-disabled')
      } else {
        leftElement.setAttribute('aria-disabled', true)
      }

      // Right
      canRight = room.canMoveRight()

      const rightLabel = room.getMoveRightLabel()

      rightElement.ariaLabel = rightLabel
      rightElement.title = rightLabel

      if (canRight) {
        rightElement.removeAttribute('aria-disabled')
      } else {
        rightElement.setAttribute('aria-disabled', true)
      }

      // Up
      canUp = room.canMoveUp()

      const upLabel = room.getMoveUpLabel()

      upElement.ariaLabel = upLabel
      upElement.title = upLabel

      if (canUp) {
        upElement.removeAttribute('aria-disabled')
      } else {
        upElement.setAttribute('aria-disabled', true)
      }

      return this
    },
  })
})()
