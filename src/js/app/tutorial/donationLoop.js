app.tutorial.donationLoop = app.tutorial.invent({
  id: 'donationLoop',
  // State
  state: {},
  // Lifecycle
  shouldActivate: () => app.tutorial.firstInstrument.complete,
  onUpdate: function () {
    if (!(content.location.is('lobby') && content.donations.has())) {
      return
    }

    if (!this.state.tutorial) {
      app.screen.game.dialog.push({
        title: `[Tutorial] The lobby`,
        description: `Donations will accumulate in <strong>the lobby</strong> as you explore the universe. Return here to collect them often.`,
        actions: [
          {
            label: 'Collect them',
            before: () => this.state.tutorial = true,
          }
        ],
      })
    }

    app.screen.game.dialog.push({
      title: `Credits received!`,
      description: `You collect <strong>${app.utility.format.currency(content.donations.amount())}</strong> from the donation box in the lobby.`,
      actions: [
        {
          label: 'Cheers!',
          before: () => {
            const amount = content.donations.amount()
            content.donations.remove(amount)
            content.wallet.add(amount)
          },
        }
      ],
    })
  },
})
