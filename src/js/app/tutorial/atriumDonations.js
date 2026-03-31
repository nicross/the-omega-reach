app.tutorial.atriumDonations = app.tutorial.invent({
  id: 'atriumDonations',
  // State
  state: {},
  // Lifecycle
  shouldActivate: () => content.location.is('atrium') && content.donations.has(),
  onUpdate: function () {
    if (!content.location.is('atrium')) {
      return
    }

    [
      {
        title: `Something reeks!`,
        description: `That must be coming from <strong>the lobby</strong>. The airlock leaks its electrostatic smell as you brace for its typical company.`,
        actions: [
          {
            label: 'Check it out',
          }
        ],
        after: () => this.markComplete(),
      },
    ].forEach((x) => app.screen.game.dialog.push(x))
  },
})
