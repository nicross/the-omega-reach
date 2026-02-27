app.tutorial.shopLoop = app.tutorial.invent({
  id: 'shopLoop',
  // State
  state: {
    tutorial: false,
  },
  // Lifecycle
  shouldActivate: () => content.shop.isOpen(),
  onUpdate: function () {
    if (!(content.location.is('shop') && content.shop.isOpen())) {
      return
    }

    if (!this.state.tutorial) {
      [
        {
          title: `[Tutorial] <span class="u-screenReader">for</span> The shop?`,
          description: `You enter <strong>the shop</strong>, but immediately—`,
          actions: [
            {
              label: 'Brace for it',
            },
          ],
        },
        {
          title: `<q>Question for you:</q>`,
          description: `<q>Is this <em>earthen hot dog</em> a sandwich?</q> They gesticulate with it forcefully in your direction. It's open-faced, of seed bread and mammal sausage, and rather long—except for the generous bite drawn from its end.`,
          actions: [
            {
              label: 'Definitely!',
            },
            {
              label: 'Absolutely not.',
            },
            {
              label: 'It depends…',
            },
          ],
        },
        {
          title: `<q>Are you reaching my wits?</q>`,
          description: `They gulp another bite and then sputter: <q>You should come with me and say that to their faces! But that's the least you'd need to justify to <em>the earthlings</em>—and you know where they stand about <strong>the reach</strong>.</q>`,
          actions: [
            {
              label: `It's for the thrill.`,
            },
            {
              label: `It's for the paycheck.`,
            },
            {
              label: `It's for the art.`,
            },
            {
              label: `It's for the future.`,
            },
            {
              label: `It's all meaningless anyway.`,
            },
          ],
        },
        {
          title: `<q>Let's just agree to disagree.</q>`,
          description: `They suck their teeth as they finish their treat. <q>It's a solid seven out of ten snack, but I could eat these all day! Anyway—you know me—I'm sorry for how hunger makes me speak. That reminds me! Just sixteen milli…</q>`,
          actions: [
            {
              label: `Wait patiently`,
            },
            {
              label: `Sigh exasperatedly`,
            },
          ],
        },
      ].forEach((x) => app.screen.game.dialog.push(x))
    }

    const cost = content.shop.getCost(),
      name = content.shop.generateUniqueName()

    ;[
      {
        title: `<q>I found this for you!</q>`,
        description: `You will get <strong>${name}</strong> for <strong>${app.utility.format.currency(cost)}</strong>.`,
        actions: [
          {
            label: 'Buy it',
            before: () => {
              content.instruments.add(name)

              content.wallet.subtract(cost)
              content.shop.resetTimer()

              content.audio.interactSuccess.trigger({index: 2})
            },
          },
          {
            label: 'No thanks',
            before: () => {},
          },
        ],
      },
      {
        title: `<q>Nice choice!</q>`,
        description: `The shopkeeper disappears once more through the cellar door for their mandated lunch break.`,
        actions: [
          {
            label: 'Back to work',
            before: () => {
              content.shop.resetTimer()
              app.screen.game.update()
            },
          },
        ],
      },
    ].forEach((x) => app.screen.game.dialog.push(x))

    if (!this.state.tutorial) {
      app.screen.game.dialog.push({
        title: `[Tutorial] <span class="u-screenReader">for</span> The shop:`,
        description: `The shopkeeper will periodically return with the fruits of their breaks. Visit <strong>the shop</strong> often to consider their offerings for your collection.`,
        actions: [
          {
            label: 'Regain control',
            before: () => this.state.tutorial = true,
          },
        ],
      })
    }
  },
})
