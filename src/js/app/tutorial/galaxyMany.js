app.tutorial.galaxyMany = app.tutorial.invent({
  id: 'galaxyMany',
  // State
  state: {},
  // Lifecycle
  shouldActivate: () => content.location.is('galaxy') && content.galaxies.count() > 1,
  onUpdate: function () {
    if (!content.location.is('galaxy')) {
      return
    }

    if (this.preventDouble()) {
      return
    }

    [
      {
        title: `[Tutorial] Galaxies:`,
        description: () => ({
          gamepad: `You can revisit any galaxy at any time. Press <kbd>D-Pad Right</kbd> and <kbd>D-Pad Left</kbd> to navigate between the galaxies you've reached.`,
          keyboard: `You can revisit any galaxy at any time. Press <kbd>Right Arrow</kbd> and <kbd>Left Arrow</kbd> to navigate between the galaxies you've reached.`,
          mouse: `You can revisit any galaxy at any time. Click the <kbd>Arrow Buttons</kbd> to navigate between the galaxies you've reached.`,
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
