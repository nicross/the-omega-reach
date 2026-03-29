app.tutorial.starMany = app.tutorial.invent({
  id: 'starMany',
  // State
  state: {},
  // Lifecycle
  shouldActivate: () => content.location.is('star') && content.stars.countForStar(content.rooms.star.getStar()?.name) > 1,
  onUpdate: function () {
    if (!content.location.is('star')) {
      return
    }

    if (this.preventDouble()) {
      return
    }

    [
      {
        title: `<span class="u-highlight">[Tutorial]</span> <span class="u-screenReader">for</span> Stars:`,
        description: () => ({
          gamepad: `You can revisit any star at any time. Press <kbd>D-Pad Right</kbd> and <kbd>D-Pad Left</kbd> to navigate between the stars you've reached within this galaxy.`,
          keyboard: `You can revisit any star at any time. Press <kbd>Right Arrow</kbd> and <kbd>Left Arrow</kbd> to navigate between the stars you've reached within this galaxy.`,
          mouse: `You can revisit any star at any time. Click the <kbd>Arrow Buttons</kbd> to navigate between the stars you've reached within this galaxy.`,
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
