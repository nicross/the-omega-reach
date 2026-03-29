app.screen.settingsAudio = app.screenManager.invent({
  // Attributes
  id: 'settingsAudio',
  parentSelector: '.a-app--settingsAudio',
  rootSelector: '.a-settingsAudio',
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
      back: root.querySelector('.a-settingsAudio--back'),
    }).forEach(([event, element]) => {
      element.addEventListener('click', () => app.screenManager.dispatch(event))
    })

    // Sliders
    this.sliders = [
      ['.a-settingsAudio--mainVolume', app.settings.raw.mainVolume, app.settings.setMainVolume],
      ['.a-settingsAudio--musicVolume', app.settings.raw.musicVolume, app.settings.setMusicVolume],
      ['.a-settingsAudio--polyphony', app.settings.raw.polyphony, app.settings.setPolyphony],
    ].map(([selector, initialValue, setter]) => {
      const component = app.component.slider.hydrate(root.querySelector(selector), initialValue)
      component.on('change', () => setter(component.getValueAsFloat()))
      return component
    })

    // Toggles
    this.toggles = [
      ['.a-settingsAudio--reverbOn', app.settings.raw.reverbOn, app.settings.setReverbOn],
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
