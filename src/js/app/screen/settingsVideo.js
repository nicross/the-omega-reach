app.screen.settingsVideo = app.screenManager.invent({
  // Attributes
  id: 'settingsVideo',
  parentSelector: '.a-app--settingsVideo',
  rootSelector: '.a-settingsVideo',
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
      back: root.querySelector('.a-settingsVideo--back'),
    }).forEach(([event, element]) => {
      element.addEventListener('click', () => app.screenManager.dispatch(event))
    })

    // Sliders
    this.sliders = [
      ['.a-settingsVideo--particleLimit', app.settings.raw.particleLimit, app.settings.setParticleLimit],
      ['.a-settingsVideo--uiScale', app.settings.raw.uiScale, app.settings.setUiScale],
    ].map(([selector, initialValue, setter]) => {
      const component = app.component.slider.hydrate(root.querySelector(selector), initialValue)
      component.on('change', () => setter(component.getValueAsFloat()))
      return component
    })

    // Toggles
    this.toggles = [
      ['.a-settingsVideo--graphicsOn', app.settings.raw.graphicsOn, app.settings.setGraphicsOn],
    ].map(([selector, initialValue, setter]) => {
      const component = app.component.toggle.hydrate(root.querySelector(selector), initialValue)
      component.on('change', () => setter(component.getValue()))
      return component
    })
  },
  onEnter: function () {},
  onExit: function () {},
  onFrame: function () {
    const ui = app.controls.ui()

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
