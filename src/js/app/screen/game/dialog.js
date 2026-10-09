/*
  app.screen.game.dialog.push({
    title: '',
    description: '',
    actions: [
      {
        label: '',
        callback: () => {},
      }
    ],
  })
*/

app.screen.game.dialog = (() => {
  const pubsub = engine.tool.pubsub.create(),
    queue = []

  const rootElement = document.querySelector('.a-game--dialog')

  const actionsElement = document.querySelector('.a-game--dialogActions'),
    descriptionElement = document.querySelector('.a-game--dialogDescription'),
    textElement = document.querySelector('.a-game--dialogText'),
    titleElement = document.querySelector('.a-game--dialogTitle')

  let current,
    isOpen,
    toClose = false

  rootElement.setAttribute('aria-hidden', 'true')
  app.utility.focus.trap(rootElement)

  function advance() {
    const next = queue.shift()

    // Enqueue close when no next
    if (!next) {
      if (isOpen) {
        enqueueClose()
      }
      return
    }

    // Skip tutorials
    if (next.tutorial && !app.settings.computed.tutorialOn) {
      if (next.before) {
        next.before()
      }

      advance()

      if (next.after) {
        next.after()
      }

      return
    }

    // Advance
    current = next
    toClose = false

    render(next)

    if (!isOpen) {
      open()
    } else {
      app.utility.focus.setWithin(rootElement)
    }

    pubsub.emit('advance')
  }

  function enqueueClose() {
    if (toClose) {
      return
    }

    toClose = true

    engine.loop.once('frame', () => {
      if (!toClose) {
        return
      }

      app.screen.game.rootElement.classList.remove('a-game-dialogOpen')
      document.querySelector('.a-game--info').removeAttribute('aria-hidden')
      document.querySelector('.a-game--nav').removeAttribute('aria-hidden')

      app.utility.focus.set(
        app.utility.focus.isFocusable(app.screen.game.infoElement)
          ? app.screen.game.infoElement
          : app.screen.game.rootElement
      )

      rootElement.setAttribute('aria-hidden', true)

      current = undefined
      isOpen = false
      toClose = false

      pubsub.emit('close')
    })
  }

  function render({
    actions = [],
    actionsBlock = false,
    after,
    before,
    description = '',
    title = '',
  } = {}) {
    if (before) {
      before()
    }

    actions = typeof actions == 'function' ? actions() : actions

    titleElement.innerHTML = typeof title == 'function' ? title() : title
    descriptionElement.innerHTML = typeof description == 'function' ? description() : description

    if (actionsBlock) {
      actionsElement.classList.add('a-game--dialogActions-block')
    } else {
      actionsElement.classList.remove('a-game--dialogActions-block')
    }

    actionsElement.innerHTML = '';

    for (const action of actions) {
      if ('filter' in action) {
        if (typeof action.filter == 'function' && !action.filter()) {
          continue
        } else if (action.filter === false) {
          continue
        }
      }

      const container = app.utility.dom.toElement(
        `<li><button class="c-menuButton" type="button">${action.label}</button></li>`
      )

      const button = container.querySelector('button')

      const clickHandler = () => {
        if (action.before) {
          action.before()
        }

        advance()

        if (action.after) {
          action.after()
        }

        if (after) {
          after()
        }
      }

      action.button = button

      container.querySelector('button').addEventListener('click', clickHandler)
      actionsElement.appendChild(container)
    }

    textElement.ariaDescription = `${actions.length} action${actions.length == 1 ? '' : 's'}`
  }

  function open() {
    rootElement.removeAttribute('aria-hidden')
    app.utility.focus.setWithin(rootElement)

    app.screen.game.rootElement.classList.add('a-game-dialogOpen')
    document.querySelector('.a-game--info').setAttribute('aria-hidden', true)
    document.querySelector('.a-game--nav').setAttribute('aria-hidden', true)

    isOpen = true
  }

  return pubsub.decorate({
    checkAdvance: function () {
      if (!isOpen || toClose) {
        advance()
      }

      return this
    },
    handleInput: function () {
      const focus = app.utility.focus.get(),
        ui = app.controls.ui()

      const focusables = app.utility.focus.selectFocusable(rootElement)

      const mappings = {
        dialogA: focusables[1],
        dialogB: focusables[focusables.length - 1],
      }

      for (const [key, target] of Object.entries(mappings)) {
        if (ui[key]) {
          if (focus === target) {
            target.click()
            return this
          } else if (!focus || focus === focusables[0]) {
            target.focus()
            return this
          }
        }
      }

      if (ui.confirm && focus) {
        focus.click()
      }

      if (ui.up || ui.left) {
        app.utility.focus.setPreviousFocusable(rootElement)
      }

      if (ui.down || ui.right) {
        app.utility.focus.setNextFocusable(rootElement)
      }

      return this
    },
    isOpen: () => isOpen,
    purgeQueue: function () {
      queue.length = 0

      return this
    },
    push: function (dialog) {
      queue.push(dialog)

      return this
    },
    queue: () => [...queue],
    reset: function () {
      current = undefined
      queue.length = 0

      document.querySelector('.a-game--info').removeAttribute('aria-hidden')
      document.querySelector('.a-game--nav').removeAttribute('aria-hidden')
      rootElement.setAttribute('aria-hidden', true)

      isOpen = false
      toClose = false

      return this
    },
  })
})()
