app.tutorial.reachOnline = app.tutorial.invent({
  id: 'reachOnline',
  // State
  state: {},
  // Lifecycle
  shouldActivate: () => content.rooms.reach.state.online,
  onUpdate: function () {
    if (!content.location.is('reach')) {
      return
    }

    [
      {
        title: `It's online!`,
        description: `The device thrums back to life, returning virogously to its preferred state! And lo, its console glows with the promise of your recurring fate.`,
        actions: [
          {
            label: 'Use the device',
          }
        ],
      },
      {
        title: `[Tutorial] The reach:`,
        description: () => ({
          gamepad: `Press <kbd>D-Pad Up</kbd> to extend <strong>the reach</strong> to its next zoom level.`,
          keyboard: `Press the <kbd>Up Arrow</kbd> to extend <strong>the reach</strong> to its next zoom level.`,
          mouse: `Click the <kbd>Up Button</kbd> to extend <strong>the reach</strong> to its next zoom level.`,
        }[app.settings.computed.inputPreference]),
        actions: [
          {
            label: 'Regain control',
            before: () => this.markComplete(),
            after: () => app.screen.game.interact.update(),
          }
        ],
      },
    ].forEach((x) => app.screen.game.dialog.push(x))
  },
})
