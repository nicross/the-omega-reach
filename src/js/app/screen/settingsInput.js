app.screen.settingsInput = app.screenManager.invent({
  // Attributes
  id: 'settingsInput',
  parentSelector: '.a-app--settingsInput',
  rootSelector: '.a-settingsInput',
  transitions: {
    back: function () {
      this.change('settings')
    },
  },
  // State
  useBasicFocusMemory: false,
  // Hooks
  onReady: function () {
    const root = this.rootElement

    // Buttons
    Object.entries({
      back: root.querySelector('.a-settingsInput--back'),
    }).forEach(([event, element]) => {
      element.addEventListener('click', () => app.screenManager.dispatch(event))
    })

    // Selects
    this.selects = [
      ['.a-settingsInput--inputPreference', app.settings.raw.inputPreference, app.settings.setInputPreference, [
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
      ['.a-settingsInput--gamepadDeadzone', app.settings.raw.gamepadDeadzone, app.settings.setGamepadDeadzone],
      ['.a-settingsInput--gamepadVibration', app.settings.raw.gamepadVibration, app.settings.setGamepadVibration],
    ].map(([selector, initialValue, setter]) => {
      const component = app.component.slider.hydrate(root.querySelector(selector), initialValue)
      component.on('change', () => setter(component.getValueAsFloat()))
      return component
    })

    // Toggles
    this.toggles = [
      ['.a-settingsInput--inputHold', app.settings.raw.inputHold, app.settings.setInputHold],
    ].map(([selector, initialValue, setter]) => {
      const component = app.component.toggle.hydrate(root.querySelector(selector), initialValue)
      component.on('change', () => setter(component.getValue()))
      return component
    })
  },
  onEnter: function (e) {
    this.selects[0].setValue(app.settings.raw.inputPreference)
    this.toggles[0].setValue(app.settings.raw.inputHold, true)
  },
  onExit: function () {},
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
