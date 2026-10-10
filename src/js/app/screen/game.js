app.screen.game = app.screenManager.invent({
  // Attributes
  id: 'game',
  parentSelector: '.a-app--game',
  rootSelector: '.a-game',
  transitions: {
    pause: function () {
      this.change('gameMenu')
    },
    sleep: function () {
      app.autosave.trigger()
      app.gameState.setLoaded(false)
      app.screen.mainMenu.clearFocusMemory()

      // XXX: Autosave trigger uses setTimeout, so enqueue a state reset to prevent progress loss.
      setTimeout(() => engine.state.reset(), 1)

      this.change('splash')
    },
  },
  // State
  state: {},
  // Hooks
  onReady: function () {
    this.dialogElement = this.rootElement.querySelector('.a-game--dialog')
    this.downElement = this.rootElement.querySelector('.a-game--down')
    this.fauxInfoElement = this.rootElement.querySelector('.a-game--fauxInfo')
    this.infoElement = this.rootElement.querySelector('.a-game--info')
    this.leftElement = this.rootElement.querySelector('.a-game--left')
    this.menuElement = this.rootElement.querySelector('.a-game--menu')
    this.navElement = this.rootElement.querySelector('.a-game--nav')
    this.rightElement = this.rootElement.querySelector('.a-game--right')
    this.interactElement = this.rootElement.querySelector('.a-game--interact')
    this.upElement = this.rootElement.querySelector('.a-game--up')

    this.downElement.addEventListener('click', () => this.movement.down())
    this.leftElement.addEventListener('click', () => this.movement.left())
    this.menuElement.addEventListener('click', () => app.screenManager.dispatch('pause'))
    this.rightElement.addEventListener('click', () => this.movement.right())
    this.upElement.addEventListener('click', () => this.movement.up())

    this.rootElement.addEventListener('contextmenu', (e) => {
      if (!app.utility.focus.isFocusable(e.target)) {
        e.preventDefault()
      }
    })
  },
  onEnter: function () {
    this.setBlanked(!app.settings.computed.graphicsOn)

    app.autosave.trigger()

    engine.loop.resume()

    this.update()
    this.dialog.checkAdvance()

    app.setPaused(false)
    engine.loop.once('frame', () => app.setRunning(true))
  },
  onExit: function () {
    app.autosave.trigger()

    engine.loop.pause()
    app.haptics.kill()

    app.controls.interactions.reset()
    content.programs.get()?.update()

    app.setPaused(true).setRunning(false)
  },
  onFrame: function () {
    this.interact.accelerate()

    // Handle input when dialog is open
    this.dialog.checkAdvance()

    if (this.dialog.isOpen()) {
      content.programs.get()?.update()
      return this.dialog.handleInput()
    }

    // Handle interactions
    const interactions = app.controls.interactions.points(),
      solution = content.solution.get()

    let closest = Infinity,
      interacted = false

    const threshold = 1/3 * app.settings.computed.puzzleDifficulty

    if (solution && content.location.get().canInteract()) {
      for (const interaction of interactions) {
        const distance = content.solution.isMirror()
          ? Math.min(
              engine.fn.distance(interaction, solution),
              engine.fn.distance(interaction, solution.inverse()),
            )
          : engine.fn.distance(interaction, solution)

        if (distance < closest) {
          closest = distance
        }

        if (distance < threshold && !interacted) {
          if (app.settings.computed.inputHold) {
            this.interact.increment()
          } else {
            this.interact.click()
          }

          interacted = true
        }
      }
    }

    this.interact.setProximity(
      isFinite(closest) ? engine.fn.clamp(engine.fn.scale(closest, threshold, 2, 1, 0), 0, 1) : 0
    )

    // Program
    content.programs.get()?.update({
      points: interactions,
    })

    // Handle UI controls
    const focus = app.utility.focus.get(),
      game = app.controls.game(),
      ui = app.controls.ui()

    // Pausing
    if (ui.pause) {
      return this.menuElement.click()
    }

    // Movement
    if (ui.moveDown) {
      return this.downElement.click()
    }

    if (ui.moveLeft) {
      return this.leftElement.click()
    }

    if (ui.moveRight) {
      return this.rightElement.click()
    }

    if (ui.moveUp) {
      return this.upElement.click()
    }

    // Scan
    if (ui.interact) {
      if (focus !== this.interactElement && focus?.matches('button,[role="button"]')) {
        return focus.click()
      } else if (!app.settings.computed.inputHold) {
        return this.interact.click()
      }
    }

    if (
      app.settings.computed.inputHold
      && (
           // Hold interact control
           (game.interact && (focus === this.interactElement || !focus?.matches('button,[role="button"]')))
           // Click and hold interact button
        || (focus === this.interactElement && engine.input.mouse.isButton(0))
           // Touch and hold interact button
        || (this.interact.isTouched())
      )
    ) {
      return this.interact.increment()
    }

    if (!interacted) {
      this.interact.decrement().setCooldown(false)
    }
  },
  // Methods
  getFocusWithinTarget: function () {
    return this.dialog.isOpen()
      ? this.dialogElement
      : (app.isImmersive() ? this.rootElement : this.infoElement)
  },
  setBlanked: function (value) {
    if (value) {
      this.rootElement.classList.add('a-game-blanked')
    } else {
      this.rootElement.classList.remove('a-game-blanked')
    }

    return this
  },
  // Movement
  update: async function () {
    // Move focus to prevent unnecessary speech from screen readers
    if (app.utility.focus.isWithin(app.screen.game.navElement)) {
      app.utility.focus.set(app.screen.game.fauxInfoElement)
      await engine.fn.promise(0)
    }

    this.info.update()
    this.movement.update()
    this.interact.update().setCooldown(true)

    return this
  },
})
