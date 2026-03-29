app.screen.settings = app.screenManager.invent({
  // Attributes
  id: 'settings',
  parentSelector: '.a-app--settings',
  rootSelector: '.a-settings',
  transitions: {
    audio: function () {
      this.change('settingsAudio')
    },
    back: function () {
      this.change(app.gameState.isLoaded() ? 'gameMenu' : 'mainMenu')
      app.screen.settings.clearFocusMemory()
    },
    gameplay: function () {
      this.change('settingsGameplay')
    },
    input: function () {
      this.change('settingsInput')
    },
    video: function () {
      this.change('settingsVideo')
    },
  },
  // State
  useBasicFocusMemory: true,
  // Hooks
  onReady: function () {
    const root = this.rootElement

    // Buttons
    Object.entries({
      audio: root.querySelector('.a-settings--audio'),
      back: root.querySelector('.a-settings--back'),
      gameplay: root.querySelector('.a-settings--gameplay'),
      input: root.querySelector('.a-settings--input'),
      video: root.querySelector('.a-settings--video'),
    }).forEach(([event, element]) => {
      element.addEventListener('click', () => app.screenManager.dispatch(event))
    })
  },
  onEnter: function () {},
  onExit: function () {
    app.settings.save()
  },
  onFrame: function () {
    const ui = app.controls.ui()

    if (this.handleBasicInput()) {
      return
    }
  },
})
