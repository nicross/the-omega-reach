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
    isOpen

  rootElement.setAttribute('aria-hidden', 'true')
  app.utility.focus.trap(rootElement)

  function advance() {
    const next = queue.shift()

    if (next) {
      if (next.tutorial && !app.settings.computed.tutorialOn) {
        if (next.finally) {
          next.finally()
        }

        return advance()
      }

      current = next
      render(next)

      if (!isOpen) {
        open()
      } else {
        app.utility.focus.setWithin(rootElement)
      }

      pubsub.emit('advance')
    } else if (isOpen) {
      close()
      current = undefined

      pubsub.emit('close')
    }
  }

  function close() {
    if (current?.finally) {
      current.finally()
    }

    document.querySelector('.a-game--info').removeAttribute('aria-hidden')
    document.querySelector('.a-game--nav').removeAttribute('aria-hidden')

    app.utility.focus.set(app.screen.game.infoElement)
    rootElement.setAttribute('aria-hidden', true)

    isOpen = false
  }

  function render({
    actions = [],
    description = '',
    title = '',
  } = {}) {
    titleElement.innerHTML = typeof title == 'function' ? title() : title
    descriptionElement.innerHTML = typeof description == 'function' ? description() : description

    actionsElement.innerHTML = '';

    for (const action of actions) {
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

    document.querySelector('.a-game--info').setAttribute('aria-hidden', true)
    document.querySelector('.a-game--nav').setAttribute('aria-hidden', true)

    isOpen = true
  }

  return pubsub.decorate({
    checkAdvance: function () {
      if (!isOpen) {
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
    push: function (dialog) {
      queue.push(dialog)

      return this
    },
  })
})()
