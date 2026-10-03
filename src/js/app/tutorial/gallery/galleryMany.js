app.tutorial.galleryMany = app.tutorial.invent({
  id: 'galleryMany',
  // Lifecycle
  shouldActivate: () => content.location.is('gallery') && content.instruments.count() > 1,
  onUpdate: function () {
    if (!content.location.is('gallery')) {
      return
    }

    [
      {
        tutorial: true,
        title: `<span class="u-highlight">[Tutorial]</span> <span class="u-screenReader">for</span> Instruments:`,
        description: () => `<strong>The gallery</strong> can hold many instruments. ` + ({
          gamepad: `Press <kbd>D-Pad Right</kbd> and <kbd>D-Pad Left</kbd>`,
          keyboard: `Press <kbd>Right Arrow</kbd> and <kbd>Left Arrow</kbd>`,
          mouse: `Click the <kbd>Arrow Buttons</kbd>`,
          touch: `Tap the <kbd>Arrow Buttons</kbd>`,
        }[app.tutorial.getInputPreference()]) + ` to navigate between the instruments you've collected.`,
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
