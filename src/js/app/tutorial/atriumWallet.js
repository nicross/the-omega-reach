app.tutorial.atriumWallet = app.tutorial.invent({
  id: 'atriumWallet',
  // State
  state: {},
  // Lifecycle
  shouldActivate: () => content.location.is('atrium') && content.wallet.has(),
  onUpdate: function () {
    if (!content.location.is('atrium')) {
      return
    }

    [
      {
        title: `[Tutorial] <span class="u-screenReader">for</span> Your wallet:`,
        description: `You may now check your credits from <strong>the atrium</strong>. These are needed to purchase instruments from <strong>the shop</strong>.`,
        actions: [
          {
            label: app.tutorial.tutorialComplete.complete ? 'Regain control' : 'Next tutorial',
            before: () => this.markComplete(),
          }
        ],
      },
      ].forEach((x) => app.screen.game.dialog.push(x))
  },
})
