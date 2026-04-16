app.tutorial.stockroomStolen = app.tutorial.invent({
  id: 'stockroomStolen',
  // State
  state: {},
  // Lifecycle
  shouldActivate: () => content.location.is('stockroom') && content.stockroom.hasStolen(),
  onUpdate: function () {
    if (!content.location.is('stockroom')) {
      return
    }

    [
      {
        title: `Is this truly you?`,
        description: `By your decisive fist, the ecstatic thrill fills you like commanding <strong>the reach</strong>. Yet, to what end could this ecstacy beseech? Do you sincerely doubt the shopkeeper and your tactical synergy?`,
        actions: [
          {
            label: `Consider putting it back`,
          },
        ],
      },
      {
        tutorial: true,
        title: `<span class="u-highlight">[Tutorial]</span> <span class="u-screenReader">for</span> Unstealing:`,
        description: `Interact again to put an instrument from your inventory back into <strong>the stockroom</strong>.`,
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
