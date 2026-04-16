app.tutorial.galleryMany = app.tutorial.invent({
  id: 'galleryMany',
  // State
  state: {},
  // Lifecycle
  shouldActivate: () => content.location.is('stockroom') && content.stockroom.countGenerated() > 1,
  onUpdate: function () {
    if (!content.location.is('stockroom')) {
      return
    }

    [
      {
        tutorial: true,
        title: `<span class="u-highlight">[Tutorial]</span> <span class="u-screenReader">for</span> Wares:`,
        description: () => ({
          gamepad: `<strong>The stockroom</strong> can hold many instruments. Press <kbd>D-Pad Right</kbd> and <kbd>D-Pad Left</kbd> to navigate between the shopkeeper's wares.`,
          keyboard: `<strong>The stockroom</strong> can hold many instruments. Press <kbd>Right Arrow</kbd> and <kbd>Left Arrow</kbd> to navigate between the shopkeeper's wares.`,
          mouse: `<strong>The stockroom</strong> can hold many instruments. Click the <kbd>Arrow Buttons</kbd> to navigate between the shopkeeper's wares.`,
        }[app.settings.computed.inputPreference]),
        actions: [
          {
            label: 'Regain control',
          }
        ],
        after: () => this.markComplete(),
      },
    ].forEach((x) => app.screen.game.dialog.push(x))
  },
})
