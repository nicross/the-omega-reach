app.tutorial.donationLoop = app.tutorial.invent({
  id: 'donationLoop',
  // State
  state: {},
  // Lifecycle
  shouldActivate: () => content.donations.has(),
  onUpdate: function () {
    if (!(content.location.is('lobby') && content.donations.has())) {
      return
    }

    if (!this.state.tutorial) {
      app.screen.game.dialog.push({
        title: `Perfect timing!`,
        description: `It appears you missed some visitors while you were busy with <strong>the reach</strong>. Beyond the usual indicators—like dust on the doormat or missing pens—when left, their generous donations are the most enticing!`,
        actions: [
          {
            label: 'Collect earnings',
          }
        ],
      })
      app.screen.game.dialog.push({
        title: `[Tutorial] <span class="u-screenReader">for</span> The lobby:`,
        description: `Donations will accumulate in <strong>the lobby</strong> as you explore the universe. Return here to collect them often.`,
        actions: [
          {
            label: 'Regain control',
            before: () => this.state.tutorial = true,
          }
        ],
      })
    }

    app.screen.game.dialog.push({
      title: `Credits received!`,
      description: `You collect <strong>${app.utility.format.currency(content.donations.amount())}</strong> in donations from <strong>the lobby</strong>.`,
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
