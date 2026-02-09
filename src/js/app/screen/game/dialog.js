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

    if (actions.length == 1) {
      textElement.ariaDescription = actions[0].label
      textElement.role = 'button'
    } else {
      textElement.ariaDescription = `${actions.length} actions`
      textElement.removeAttribute('role')
    }
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

      if (ui.confirm) {
        if (current.actions.length == 1) {
          current.actions[0].button.click()
        } else if (focus) {
          focus.click()
        }
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
