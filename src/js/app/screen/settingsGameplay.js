app.screen.settingsGameplay = app.screenManager.invent({
  // Attributes
  id: 'settingsGameplay',
  parentSelector: '.a-app--settingsGameplay',
  rootSelector: '.a-settingsGameplay',
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
      back: root.querySelector('.a-settingsGameplay--back'),
    }).forEach(([event, element]) => {
      element.addEventListener('click', () => app.screenManager.dispatch(event))
    })

    // Toggles
    this.toggles = [
      ['.a-settingsGameplay--tutorialOn', app.settings.raw.tutorlaOn, app.settings.setTutorialOn],
    ].map(([selector, initialValue, setter]) => {
      const component = app.component.toggle.hydrate(root.querySelector(selector), initialValue)
      component.on('change', () => setter(component.getValue()))
      return component
    })
  },
  onEnter: function (e) {
    this.toggles[0].setValue(app.settings.raw.tutorialOn, true)
  },
  onExit: function () {},
  onFrame: function () {
    const ui = app.controls.ui()

    if (this.handleBasicInput()) {
      return
    }
  },
})
