app.screen.splash = app.screenManager.invent({
  // Attributes
  id: 'splash',
  parentSelector: '.a-app--splash',
  rootSelector: '.a-splash',
  transitions: {
    interact: function () {
      app.screen.splash.setDefaultInput()

      this.change(
        app.isDemo() && !app.screen.splash.state.initial
          ? 'demo'
          : 'mainMenu'
      )

      app.screen.splash.state.initial = true
    },
  },
  // State
  state: {
    initial: false,
    input: undefined,
    touched: false,
  },
  useBasicFocusMemory: false,
  // Hooks
  onReady: function () {
    const root = this.rootElement

    root.addEventListener('click', () => {
      app.screenManager.dispatch('interact')
    })

    root.querySelector('.a-splash--version').innerHTML = `v${app.version()}`

    // Initialzie default input detection
    root.addEventListener('keydown', () => this.state.input = 'keyboard')
    root.addEventListener('touchstart', () => this.state.input = 'touch')
    root.addEventListener('touchend', () => this.state.touched = true)

    root.addEventListener('mousedown', () => {
      // Some browsers fire mouse events when touches register as clicks
      // Therefore, a touched flag is set on successful touchend, to prevent it from overriding here
      if (!this.state.touched) {
        this.state.input = 'mouse'
      }
    })
  },
  onEnter: function () {
    content.audio.reachDrone.reset()

    this.state.input = undefined
    this.state.touched = false
  },
  onFrame: function () {
    const ui = app.controls.ui()

    if (ui.confirm || ui.enter || ui.space || ui.start || ui.select || ui.focus === 0 || app.controls.midi.has()) {
      app.screenManager.dispatch('interact')
    }
  },
  setDefaultInput: function () {
    if (app.settings.has() || this.state.initial) {
      return
    }

    if (Object.keys(engine.input.gamepad.get().digital).length) {
      app.settings.setInputPreference('gamepad')
    } else if (app.controls.midi.has()) {
      app.settings.setInputPreference('midi')
    } else if (this.state.input) {
      app.settings.setInputPreference(this.state.input)
    }
  },
})
