app.screen.settingsAudioMixer = app.screenManager.invent({
  // Attributes
  id: 'settingsAudioMixer',
  parentSelector: '.a-app--settingsAudioMixer',
  rootSelector: '.a-settingsAudioMixer',
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
      back: root.querySelector('.a-settingsAudioMixer--back'),
    }).forEach(([event, element]) => {
      element.addEventListener('click', () => app.screenManager.dispatch(event))
    })

    // Sliders
    this.sliders = [
      ['.a-settingsAudioMixer--mainVolume', app.settings.raw.mainVolume, app.settings.setMainVolume],
      ['.a-settingsAudioMixer--musicVolume', app.settings.raw.musicVolume, app.settings.setMusicVolume],
      ['.a-settingsAudioMixer--reachVolume', app.settings.raw.reachVolume, app.settings.setReachVolume],
      ['.a-settingsAudioMixer--sfxVolume', app.settings.raw.sfxVolume, app.settings.setSfxVolume],
      ['.a-settingsAudioMixer--uiVolume', app.settings.raw.uiVolume, app.settings.setUiVolume],
    ].map(([selector, initialValue, setter]) => {
      const component = app.component.slider.hydrate(root.querySelector(selector), initialValue)
      component.on('change', () => setter(component.getValueAsFloat()))
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
