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
      // TODO: tutorial / introduction conversation
    }

    const cost = content.shop.getCost(),
      name = content.shop.generateUniqueName()

    app.screen.game.dialog.push({
      title: `<q>I found this for you!</q>`,
      description: `You will get <strong>${name}</strong> for <strong>${app.utility.format.currency(cost)}</strong>.`,
      actions: [
        {
          label: 'Buy it',
          before: () => {
            content.instruments.add(name)
            content.wallet.subtract(cost)
            content.shop.resetTimer()
            content.audio.interactComplete.trigger()
            content.audio.interactSuccess.trigger({
              index: 2,
            })
          },
        },
        {
          label: 'No thanks',
          before: () => {},
        },
      ],
    })

    app.screen.game.dialog.push({
      title: `<q>Nice choice!</q>`,
      description: `The shopkeeper disappears once more through the cellar door for their mandated lunch break.`,
      actions: [
        {
          label: 'Back to the reach',
          before: () => {
            content.shop.resetTimer()
            app.screen.game.update()
          },
        },
      ],
    })
  },
})
