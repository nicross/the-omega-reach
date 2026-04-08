app.tutorial.donationLoop = app.tutorial.invent({
  id: 'donationLoop',
  // State
  state: {
    tutorial: false,
    visitorWood: false,
    visitorWoodScore: 0,
  },
  // Lifecycle
  shouldActivate: () => content.donations.has(),
  onUpdate: function () {
    if (!content.location.is('lobby')) {
      return
    }

    if (!content.donations.has()) {
      return this.tryVisitorWood()
    }

    if (!this.state.tutorial) {
      [
        {
          title: `Perfect timing!`,
          description: `It appears you missed some visitors while you were busy with <strong>the reach</strong>. Beyond the usual indicators—like dust on the doormat or missing pencils—when left, their generous donations are the most enticing!`,
          actions: [
            {
              label: `Collect earnings`,
            }
          ],
        },
        {
          tutorial: true,
          title: `<span class="u-highlight">[Tutorial]</span> <span class="u-screenReader">for</span> The lobby:`,
          description: `Donations will accumulate in <strong>the lobby</strong> as you explore the universe. Return here to collect them often.`,
          actions: [
            {
              label: `Regain control`,
            }
          ],
          after: () => {
            this.state.tutorial = true
            this.earnCredits()
          },
        },
      ].forEach((x) => app.screen.game.dialog.push(x))
    } else {
      if (this.tryVisitorWood()) {
        return
      }

      this.earnCredits()
    }
  },
  earnCredits: function () {
    content.audio.interactSuccess.trigger({index: 2})

    const amount = content.donations.amount()

    content.donations.collect(amount)
    content.wallet.add(amount)

    app.screen.game.dialog.push({
      title: `Credits received!`,
      description: `You collect <strong>${app.utility.format.currency(amount)}</strong> in donations from <strong>the lobby</strong>.`,
      actions: [
        {
          label: `Cheers!`,
        }
      ],
    })
  },
  // Visitors
  tryVisitorWood: function () {
    if (!this.state.visitorWood && content.donations.collected() >= 300) {
      this.visitorWood()
      return true
    }

    return false
  },
  visitorWood: function () {
    let previousChoice = 0

    ;[
      {
        title: `<q>Hail, curator!</q>`,
        description: `It's a rare visitor in <strong>the lobby</strong>. <em>TK: describe and question</em>`,
        actions: [
          {
            label: `Forty-seven cycles ago…`,
            before: () => previousChoice = 1,
          },
          {
            label: `Where to begin…`,
            before: () => previousChoice = 0,
          },
          {
            label: `Before the dawn of time…`,
            before: () => previousChoice = -1,
          },
        ],
      },
      {
        before: () => this.state.visitorWoodScore = previousChoice,
        title: () => {
          if (this.state.visitorWoodScore == 1) {
            return `<q>Incredible…</q>`
          }
          if (this.state.visitorWoodScore == 0) {
            return `<q>Go on…</q>`
          }
          if (this.state.visitorWoodScore == -1) {
            return `<q>Tell me more…</q>`
          }
        },
        description: () => {
          if (previousChoice == 1) {
            return `You remember fondly the day you randomly reached <em>Earth</em> from here. You'd reached dozens of terran worlds before, but none had its perfect confluence of nature and culture—and cuisine—in that goldilocks zone of spacetime.`
          }
          if (previousChoice == 0) {
            return `You fumble unusually through your proven elevator pitch—whenever was the last <em>earthen elevator</em> you hitched? Your guest shows disinterest in the verbose astrophysics—the big words and the winding sentence structures with their specifics. How do you make the pieces fit?`
          }
          if (previousChoice == -1) {
            return `You tell the fantastical tale of <strong>the reach</strong>: its architects, its construction, and how it eventually found its residence in <strong>The Omega Conservatory</strong>. Yet, it's just the canon you've reconstructed and embellished since your last nap.`
          }
        },
        actions: [
          {
            label: `But I digress…`,
            before: () => previousChoice = 0,
          },
          {
            label: `And the earthlings…`,
            before: () => previousChoice = -1,
          },
          {
            label: `Yet the earthlings…`,
            before: () => previousChoice = 1,
          },
        ],
      },
      {
        before: () => this.state.visitorWoodScore += previousChoice,
        title: () => {
          if (this.state.visitorWoodScore == 2) {
            return `<q>Unbelievable…</q>`
          }
          if (Math.abs(this.state.visitorWoodScore) < 2) {
            return `<q>Mmhmm…</q>`
          }
          if (this.state.visitorWoodScore == -2) {
            return `<q>That checks out…</q>`
          }
        },
        description: () => {
          if (previousChoice == 1) {
            return `You may wax poetic of their music and everything deep-fried; yet, their legacy is like an <em>earthen onion</em>: so layered and mercurial that you'll inevitably cry. What horrors might happen when their final tree dies? In hindsight, was this a fool's predicament?`
          }
          if (previousChoice == 0) {
            return `You exhaust the merits of <em>earthen lumber</em>: its durability, safety, sustainability, and beauty. Specifically, you emphasize the visible knots and rings which marble the load-bearing material. Your guest drifts occasionally during your philosophical ramblings.`
          }
          if (previousChoice == -1) {
            return `You incorporate and extrapolate the pertinent details, but shouldn't it differ every cycle? At this nexus it was a pale blue dot, a producer of elixir and cheese, and an island sustaining trillions of trees. Perhaps <em>earthen unicorns</em> were where its evolution peaked?`
          }
        },
        actions: [
          {
            label: `So we agreed to a peaceful exchange…`,
            before: () => previousChoice = -1,
          },
          {
            label: `So we orchestrated an unprecedented heist…`,
            before: () => previousChoice = 1,
          },
          {
            label: `So you see…`,
            before: () => previousChoice = 0,
          },
        ],
      },
      {
        before: () => this.state.visitorWoodScore += previousChoice,
        title: () => {
          if (this.state.visitorWoodScore >= 2) {
            return `<q>That was fantastic!</q>`
          }
          if (Math.abs(this.state.visitorWoodScore) < 2) {
            return `<q>I truly doubt that.</q>`
          }
          if (this.state.visitorWoodScore <= -2) {
            return `<q>I had no idea!</q>`
          }
        },
        description: () => {
          if (previousChoice == 1) {
            return `<em>TK: stealing with the reach</em>`
          }
          if (previousChoice == 0) {
            return `<em>TK: is it theft in the grater context?</em>`
          }
          if (previousChoice == -1) {
            return `<em>TK: free food for life, with a price</em>`
          }
        },
        actions: [
          {
            label: `Shake their hand`,
          },
          {
            label: `Shake your head`,
          },
        ],
      },
      {
        before: () => {
          if (Math.abs(this.state.visitorWoodScore) >= 2) {
            content.donations.add(10)
          }
        },
        title: `<q>Thanks for the chat!</q>`,
        description: `They exit through the airlock without further explanation. You welcome how its smell has been unwelcome since before the dawn of time.`,
        actions: () => content.donations.has() ? [
          {
            label: `Check for donations`,
            before: () => this.earnCredits(),
          },
          {
            label: `Come back later`,
          },
        ] : [{
          label: `Back to work`,
        }],
      },
    ].forEach((x) => app.screen.game.dialog.push(x))
  },
})
