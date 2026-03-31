app.tutorial.donationLoop = app.tutorial.invent({
  id: 'donationLoop',
  // State
  state: {
    tutorial: false,
  },
  // Lifecycle
  shouldActivate: () => content.donations.has(),
  onUpdate: function () {
    if (!(content.location.is('lobby') && content.donations.has())) {
      return
    }

    if (!this.state.tutorial) {
      [
        {
          title: `Perfect timing!`,
          description: `It appears you missed some visitors while you were busy with <strong>the reach</strong>. Beyond the usual indicators—like dust on the doormat or missing pencils—when left, their generous donations are the most enticing!`,
          actions: [
            {
              label: 'Collect earnings',
            }
          ],
        },
        {
          tutorial: true,
          title: `<span class="u-highlight">[Tutorial]</span> <span class="u-screenReader">for</span> The lobby:`,
          description: `Donations will accumulate in <strong>the lobby</strong> as you explore the universe. Return here to collect them often.`,
          actions: [
            {
              label: 'Regain control',
            }
          ],
          after: () => {
            this.state.tutorial = true
            this.earnCredits()
          },
        },
      ].forEach((x) => app.screen.game.dialog.push(x))
    } else {
      this.earnCredits()
    }
  },
  earnCredits: function () {
    content.audio.interactSuccess.trigger({index: 2})

    const amount = content.donations.amount()

    content.donations.remove(amount)
    content.wallet.add(amount)

    app.screen.game.dialog.push({
      title: `Credits received!`,
      description: `You collect <strong>${app.utility.format.currency(amount)}</strong> in donations from <strong>the lobby</strong>.`,
      actions: [
        {
          label: 'Cheers!',
        }
      ],
    })
  },
})
