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
        description: `The device thrums back to life, returning vigorously to its preferred state! And lo, its console glows with the promise of your recurring fate.`,
        actions: [
          {
            label: 'Use the device',
          }
        ],
      },
      {
        title: `[Tutorial] The reach:`,
        description: () => ({
          gamepad: `Press <kbd>D-Pad Up</kbd> to extend <strong>the reach</strong> to its next zoom level. You may press <kbd>D-Pad Down</kbd> to zoom out from any level at any time. Zoom in to proceed.`,
          keyboard: `Press the <kbd>Up Arrow</kbd> to extend <strong>the reach</strong> to its next zoom level. You may press the <kbd>Down Arrow</kbd> to zoom out from any level at any time. Zoom in to proceed.`,
          mouse: `Click the <kbd>Up Button</kbd> to extend <strong>the reach</strong> to its next zoom level. You may click the <kbd>Down Button</kbd> to zoom out from any level at any time. Zoom in to proceed.`,
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
