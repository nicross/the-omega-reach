app.tutorial.moonMany = app.tutorial.invent({
  id: 'moonMany',
  // State
  state: {},
  // Lifecycle
  shouldActivate: () => content.location.is('moon') && content.moons.namesForMoon(content.rooms.moon.getMoon()?.name).length > 1,
  onUpdate: function () {
    if (!content.location.is('moon')) {
      return
    }

    if (this.preventDouble()) {
      return
    }

    [
      {
        title: `[Tutorial] Moons:`,
        description: () => ({
          gamepad: `Some planets have multiple moons. Press <kbd>D-Pad Right</kbd> and <kbd>D-Pad Left</kbd> to navigate between the moons at this star.`,
          keyboard: `Some planets have multiple moons. Press <kbd>Right Arrow</kbd> and <kbd>Left Arrow</kbd> to navigate between the moons at this star.`,
          mouse: `Some planets have multiple moons. Click the <kbd>Arrow Buttons</kbd> to navigate between the moons at this star.`,
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
