app.tutorial.stockroomScanned = app.tutorial.invent({
  id: 'stockroomScanned',
  // State
  state: {},
  // Lifecycle
  shouldActivate: () => content.location.is('stockroom') && content.rooms.stockroom.isComplete(),
  onUpdate: function () {
    if (!content.location.is('stockroom')) {
      return
    }

    [
      {
        title: `It's exquisite!`,
        description: `Why might the shopkeeper be hiding this gem? You mire the logistics and whether to be generous. If they were simply following their duties, then you'd eventually be exchanging these with your credits.`,
        actions: [
          {
            label: `Consider taking it`,
          },
        ],
      },
      {
        tutorial: true,
        title: `<span class="u-highlight">[Tutorial]</span> <span class="u-screenReader">for</span> Stealing:`,
        description: `Interact to add an instrument from <strong>the stockroom</strong> into your inventory.`,
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
