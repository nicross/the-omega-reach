app.tutorial.visitorJumpscare = app.tutorial.invent({
  id: 'visitorJumpscare',
  // State
  state: {},
  // Lifecycle
  shouldActivate: () => content.location.is('horizon') && content.donations.has(100),
  onUpdate: function () {
    if (!content.location.is('reach')) {
      return
    }

    if (this.preventDouble()) {
      return
    }

    [
      {
        title: `Tap tap tap…`,
        description: `Abruptly, the tapping upon your left shoulder interrupts your meditative focus. A medicinal smell hits you as it hisses: <q>Excuse me? I've been behind you all day.</q>`,
        actions: [
          {
            label: 'Jump from your seat',
            before: () => this.state.scared = true,
          },
          {
            label: 'Swivel stoically',
            before: () => this.state.scared = false,
          },
        ],
      },
      {
        title: () => (
          this.state.scared
            ? `It's a visitor!`
            : `It's just a visitor.`
        ),
        description: () => (
          this.state.scared
            ? `<q>It's just…</q> You return to base as you gesture for them to finish their sentence. <q>…I wanted to see how that game you're playing ends, but unfortunately I urgently need your water closet.</q>`
            : `You await their inquery with tranquility. Yet, their question suggests some distress: <q>I guess that game you're playing looks kinda slick, but where upon this world is your nearest water closet?</q>`
        ),
        actions: [
          {
            label: 'Get out!',
            before: () => {
              this.state.politeness = 0
              content.donations.remove(this.state.scared ? 5 : 10)
            },
          },
          {
            label: 'This area is off-limits.',
            before: () => {
              this.state.politeness = 1
            },
          },
          {
            label: `No worries, try that way.`,
            before: () => {
              this.state.politeness = 2
              content.donations.add(this.state.scared ? 15 : 10)
            },
          },
        ],
      },
      {
        title: () => [
          `<q>My bad!</q>`,
          `<q>Got it.</q>`,
          `<q>Thank you!</q>`,
        ][this.state.politeness],
        description: () => [
          `You feel their visible shock deeply within you. As the visitor recedes to the lobby and leaves in defeat, you debate the signposts and wayfinding within the conservatory.`,
          `Waves of disappointment and understanding pass through the visitor. Quickly, they exit and scurry toward the shop, who will be delighted to share this rare conversation.`,
          `You gesture toward <strong>the shop</strong>, sending your guest hurrying away. The shopkeeper is much kinder when explaining the ongoing restroom situation anyway.`,
        ][this.state.politeness],
        actions: [
          {
            label: 'Nod firmly',
          },
          {
            label: 'Swivel stoically',
          },
        ],
        after: () => this.markComplete(),
      },
    ].forEach((x) => app.screen.game.dialog.push(x))
  },
})
