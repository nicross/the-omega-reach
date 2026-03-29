app.screen.settings = app.screenManager.invent({
  // Attributes
  id: 'settings',
  parentSelector: '.a-app--settings',
  rootSelector: '.a-settings',
  transitions: {
    back: function () {
      this.change(app.screen.settings.state.previousState)
    },
  },
  // State
  state: {
    // Handles whether accessed by mainMenu or gameMenu
    previousState: undefined,
  },
  useBasicFocusMemory: false,
  // Hooks
  onReady: function () {
    const root = this.rootElement

    // Buttons
    Object.entries({
      back: root.querySelector('.a-settings--back'),
    }).forEach(([event, element]) => {
      element.addEventListener('click', () => app.screenManager.dispatch(event))
    })

    // Selects
    this.selects = [
      ['.a-settings--inputPreference', app.settings.raw.inputPreference, app.settings.setInputPreference, [
        {value: 'gamepad', label: 'Gamepad (full sphere)'},
        {value: 'mouse', label: 'Mouse (front hemisphere)'},
        {value: 'keyboard', label: 'Keyboard (fixed points)'},
      ]],
    ].map(([selector, initialValue, setter, options]) => {
      const component = app.component.select.hydrate(root.querySelector(selector), initialValue, options)
      component.on('change', () => setter(component.getValue()))
      return component
    })

    // Sliders
    this.sliders = [
      ['.a-settings--gamepadDeadzone', app.settings.raw.gamepadDeadzone, app.settings.setGamepadDeadzone],
      ['.a-settings--gamepadVibration', app.settings.raw.gamepadVibration, app.settings.setGamepadVibration],
      ['.a-settings--mainVolume', app.settings.raw.mainVolume, app.settings.setMainVolume],
      ['.a-settings--musicVolume', app.settings.raw.musicVolume, app.settings.setMusicVolume],
      ['.a-settings--particleLimit', app.settings.raw.particleLimit, app.settings.setParticleLimit],
      ['.a-settings--polyphony', app.settings.raw.polyphony, app.settings.setPolyphony],
      ['.a-settings--uiScale', app.settings.raw.uiScale, app.settings.setUiScale],
    ].map(([selector, initialValue, setter]) => {
      const component = app.component.slider.hydrate(root.querySelector(selector), initialValue)
      component.on('change', () => setter(component.getValueAsFloat()))
      return component
    })

    // Toggles
    this.toggles = [
      ['.a-settings--graphicsOn', app.settings.raw.graphicsOn, app.settings.setGraphicsOn],
      ['.a-settings--inputHold', app.settings.raw.inputHold, app.settings.setInputHold],
      ['.a-settings--reverbOn', app.settings.raw.reverbOn, app.settings.setReverbOn],
      ['.a-settings--tutorialOn', app.settings.raw.tutorialOn, app.settings.setTutorialOn],
    ].map(([selector, initialValue, setter]) => {
      const component = app.component.toggle.hydrate(root.querySelector(selector), initialValue)
      component.on('change', () => setter(component.getValue()))
      return component
    })
  },
  onEnter: function (e) {
    this.state.previousState = e.previousState

    this.selects[0].setValue(app.settings.raw.inputPreference)
    this.toggles[1].setValue(app.settings.raw.inputHold, true)
  },
  onExit: function () {
    app.settings.save()
  },
  onFrame: function () {
    const ui = app.controls.ui()

    for (const select of this.selects) {
      if (app.utility.focus.isWithin(select.rootElement)) {
        if (ui.up) {
          return app.utility.focus.setPreviousFocusable(this.rootElement, (element) => !app.utility.dom.contains(select.rootElement, element))
        } else if (ui.down) {
          return app.utility.focus.setNextFocusable(this.rootElement, (element) => !app.utility.dom.contains(select.rootElement, element))
        } else if (ui.right) {
          if (app.utility.focus.is(select.nextElement)) {
            select.nextElement.click()
          } else {
            select.nextElement.focus()
          }
          return
        } else if (ui.left) {
          if (app.utility.focus.is(select.previousElement)) {
            select.previousElement.click()
          } else {
            select.previousElement.focus()
          }
          return
        }
      }
    }

    if (this.handleBasicInput()) {
      return
    }

    if (ui.left) {
      for (const slider of this.sliders) {
        if (app.utility.focus.isWithin(slider.rootElement)) {
          return slider.decrement()
        }
      }
    }

    if (ui.right) {
      for (const slider of this.sliders) {
        if (app.utility.focus.isWithin(slider.rootElement)) {
          return slider.increment()
        }
      }
    }
  },
})
