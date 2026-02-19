app.tutorial.reachOff = app.tutorial.invent({
  id: 'reachOff',
  // State
  state: {},
  // Lifecycle
  shouldActivate: () => content.location.is('reach') && app.tutorial.reachOnline.complete && !content.rooms.reach.state.online,
  onUpdate: function () {
    if (!content.location.is('reach')) {
      return
    }

    [
      {
        title: `It's offline…`,
        description: `The device whines unhappily as it retracts back into the conservatory. You're uncertain of your motives, but you welcome this modicum of silence.`,
        actions: [
          {
            label: 'Shrug it off',
          }
        ],
      },
      {
        title: `[Tutorial] <span class="u-screenReader">for</span> The reach:`,
        description: `<strong>The horizon</strong> is inaccessible to you while <strong>the reach</strong> is in this state. Interact with it again when you're ready to explore more of the universe.`,
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
