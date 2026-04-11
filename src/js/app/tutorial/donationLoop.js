app.tutorial.donationLoop = app.tutorial.invent({
  id: 'donationLoop',
  // State
  state: {
    tutorial: false,
    visitorWood: false,
    visitorWoodScore: 0,
    visitorWoodWeird: false,
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
    if (!this.state.visitorWood && content.donations.collected() >= 300 && content.conservatory.isOpen()) {
      this.visitorWood()
      return true
    }

    return false
  },
  visitorWood: function () {
    let previousChoice = 0

    ;[
      {
        title: `<q>Yo dawg!</q>`,
        description: `The elusive visitor hustles and arrives with an excited glimmer in their third eye. <q>Please, spill everything about this sick ceiling!</q> Seizing the opportunity to practice your pitch, you begin:`,
        actions: [
          {
            label: `Seventeen cycles ago…`,
            before: () => previousChoice = 1,
          },
          {
            label: `Well, it all started when…`,
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
            return `<q>Nuh-uh…</q>`
          }
          if (this.state.visitorWoodScore == 0) {
            return `<q>Huh…</q>`
          }
          if (this.state.visitorWoodScore == -1) {
            return `<q>Uh-huh…</q>`
          }
        },
        description: () => {
          if (previousChoice == 1) {
            return `You recalled fondly the day you randomly reached <em>Earth</em> from here. You'd encountered dozens of terran worlds, but none had its confluence of nature and culture—and cuisine so sublime—in that goldilocks zone of spacetime.`
          }
          if (previousChoice == 0) {
            return `You fumbled unusually through your proven pitch—whenever was the last <em>earthen elevator</em> you hitched? Your guest showed disinterest in the verbose astrophysics—the big words and the winding sentence structures with their specifics. How do you make the pieces fit?`
          }
          if (previousChoice == -1) {
            return `You shared the fantastical tale of <strong>the reach</strong>: its architects, its construction, and how it eventually found its residence in <strong>The Omega Conservatory</strong>. Yet, it was just the canon you've reconstructed and embellished since your last nap.`
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
            return `<q>Mm-mm…</q>`
          }
          if (Math.abs(this.state.visitorWoodScore) < 2) {
            return `<q>Hmm…</q>`
          }
          if (this.state.visitorWoodScore == -2) {
            return `<q>Mm-hmm…</q>`
          }
        },
        description: () => {
          if (previousChoice == 1) {
            return `You waxed poetic of their music and everything deep-fried; yet, their legacy is like an <em>earthen onion</em>: so layered and mercurial that everybody cries. What unspeakable horrors follow when the final tree dies? You summarized the worst outcomes and solutions that you'd devised.`
          }
          if (previousChoice == 0) {
            return `You exhausted the merits of <em>earthen lumber</em>: its durability, safety, sustainability, and beauty. Specifically, you emphasized the visible knots and rings which marble the ornate ceiling. Your guest drifted occasionally during your semi-scientific ramblings.`
          }
          if (previousChoice == -1) {
            return `You incorporated and extrapolated the pertinent details, but shouldn't it differ every cycle? At this nexus it was a pale blue dot, a producer of elixir and cheese, and an island sustaining trillions of trees. Perhaps <em>earthen unicorns</em> were where its evolution peaked?`
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
            return `<q>Far out!</q>`
          }
          if (Math.abs(this.state.visitorWoodScore) < 2) {
            return `<q>My dawg…</q>`
          }
          if (this.state.visitorWoodScore <= -2) {
            return `<q>Righteous!</q>`
          }
        },
        description: () => {
          if (previousChoice == 1) {
            return `You confided the truth. By their poor stewardship, the <em>earthen trees</em> were rapidly depleting. The few acres of forest that you reached had deepened the conservatory's meaning. Perhaps one cycle it might inspire or provide a second chance to succeed?`
          }
          if (previousChoice == 0) {
            return `You questioned everything. There is a callousness to the timelessness of <strong>the reach</strong>—whose nuance you've barely gleaned in your tenure which surely exceeds hundreds of quintillions of <em>earthen years</em>. Most visitors come to time travel, but you might stay to steal?`
          }
          if (previousChoice == -1) {
            return `You smiled and lied. The <em>earthen wood</em> was a generous gift for your accidental first encounter. Allegedly, a dignitary had overheard the shopkeeper extolling the <em>earthen sushi</em> that you had reached. Perhaps their new status had shown them what to cherish?`
          }
        },
        actions: [
          {
            label: `Shake your hand`,
            before: () => this.state.visitorWoodWeird = true,
          },
          {
            label: `Shake their head`,
            before: () => this.state.visitorWoodWeird = true,
          },
          {
            label: `Rest a beat`,
            before: () => this.state.visitorWoodWeird = false,
          },
        ],
      },
      {
        before: () => {
          if (Math.abs(this.state.visitorWoodScore) >= 2) {
            content.donations.add(
              engine.fn.randomInt(10, 20)
            )
          }
        },
        title: () => (
          this.state.visitorWoodWeird
            ? `<q>Gee, thanks!</q>`
            : `<q>Welp, smell ya later!</q>`
        ),
        description: `They exit through the airlock without further salutations. It seems you're growing desensitized to its trioxygenic scent.`,
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
