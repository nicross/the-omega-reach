app.tutorial.galleryMany = app.tutorial.invent({
  id: 'galleryMany',
  // State
  state: {},
  // Lifecycle
  shouldActivate: () => content.location.is('gallery') && content.instruments.count() > 1,
  onUpdate: function () {
    if (!content.location.is('gallery')) {
      return
    }

    [
      {
        title: `[Tutorial] Instruments:`,
        description: () => ({
          gamepad: `<strong>The gallery</strong> can hold many instruments. Press <kbd>D-Pad Right</kbd> and <kbd>D-Pad Left</kbd> to navigate between the instruments you've collected.`,
          keyboard: `<strong>The gallery</strong> can hold many instruments. Press <kbd>Right Arrow</kbd> and <kbd>Left Arrow</kbd> to navigate between the instruments you've collected.`,
          mouse: `<strong>The gallery</strong> can hold many instruments. Click the <kbd>Arrow Buttons</kbd> to navigate between the instruments you've collected.`,
        }[app.settings.computed.inputPreference]),
        actions: [
          {
            label: 'Regain control',
            before: () => this.markComplete(),
          }
        ],
      },
    ].forEach((x) => app.screen.game.dialog.push(x))
  },
})
