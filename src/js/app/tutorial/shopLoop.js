app.tutorial.shopLoop = app.tutorial.invent({
  id: 'shopLoop',
  // State
  state: {
    tutorial: false,
    tutorialStockroom: false,
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
          title: app.settings.computed.tutorialOn ? `<span class="u-highlight">[Tutorial]</span> <span class="u-screenReader">for</span> The shop?` : `They're here.`,
          description: `You enter <strong>the shop</strong>, but immediately—`,
          actions: [
            {
              label: 'Brace for it',
              after: () => content.audio.reachSwitch.trigger(true, 0.25),
            },
          ],
        },
        {
          title: `<q>Question for you:</q>`,
          description: `<q>Is this <em>earthen hot dog</em> a sandwich?</q> They gesticulate with it forcefully in your direction. It's open-faced, of mammal sausage and seed bread, and rather oblong—except for the generous bite drawn from its end.`,
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
          description: `They suck their teeth as they finish their treat. <q>It's a solid seven out of ten snack, but I could eat these for eternity! Anyway—you know me—I'm sorry for how hunger makes me speak. That reminds me! Just sixteen milli…</q>`,
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

    const fromStockroom = content.location.was('stockroom'),
      hasStolen = content.cellar.stockroom.hasStolen(),
      stealingDetected = hasStolen && fromStockroom,
      stolenCount = content.cellar.stockroom.countStolen()

    if (stealingDetected) {
      content.audio.interactComplete.trigger({duration: 1})

      ;[
        {
          title: `<q>Not so fast!</q>`,
          description: `You forfeit <strong>${stolenCount} instrument${stolenCount == 1 ? '' : 's'}</strong> from <strong>the stockroom</strong> this run.`,
          actions: [
            {
              label: `Put ${stolenCount == 1 ? 'it' : 'them'} back`,
            },
          ],
        },
        {
          title: `<q>Now excuse me…</q>`,
          description: `The shopkeeper disappears once more through the cellar door for their mandated lunch break.`,
          actions: [
            {
              label: 'Back to work',
              before: () => this.startCellarRun(),
            },
          ],
        }
      ].forEach((x) => app.screen.game.dialog.push(x))
    } else {
      if (hasStolen) {
        content.audio.interactSuccess.trigger({index: 0})
        content.cellar.stockroom.keepStolen()

        app.screen.game.dialog.push({
          title: `Theft undetected!`,
          description: `You stole <strong>${stolenCount} instrument${stolenCount == 1 ? '' : 's'}</strong> from <strong>the stockroom</strong> this run.`,
          actions: [
            {
              label: `Cheers!`,
            },
          ],
        })
      }

      [
        {
          title: `<q>I found this ${content.cellar.discovered.hasAny() ? 'before' : 'for'} you!</q>`,
          description: `You will get <strong>${name}</strong> for <strong>${app.utility.format.currency(cost)}</strong>.`,
          actions: [
            {
              label: 'Buy it',
              before: () => {
                content.instruments.add(name)
                content.wallet.subtract(cost)
                content.audio.interactSuccess.trigger({index: 2})

                // XXX: Prevent door open animation until next dialog
                content.cellar.health.reset()
              },
            },
            {
              label: 'No thanks',
            },
          ],
        },
        {
          title: `<q>Nice choice!</q>`,
          description: `The shopkeeper disappears once more through the cellar door for their mandated lunch break.`,
          actions: [
            {
              label: 'Back to work',
              before: () => this.startCellarRun(),
            },
          ],
        },
      ].forEach((x) => app.screen.game.dialog.push(x))
    }

    if (!this.state.tutorial) {
      app.screen.game.dialog.push({
        tutorial: true,
        title: `<span class="u-highlight">[Tutorial]</span> <span class="u-screenReader">for</span> The shop:`,
        description: `The shopkeeper will periodically return with the fruits of their breaks. Visit <strong>the shop</strong> often to consider their offerings for your collection.`,
        actions: [
          {
            label: 'Regain control',
          },
        ],
        after: () => this.state.tutorial = true,
      })
    }

    if (!this.state.tutorialStockroom) {
      app.screen.game.dialog.push({
        tutorial: true,
        title: `<span class="u-highlight">[Tutorial]</span> <span class="u-screenReader">for</span> Theft:`,
        description: `The shopkeeper gets suspicious whenever they catch you passing through <strong>the stockroom</strong>. Browse their wares quickly to avoid their detection.`,
        actions: [
          {
            label: 'Regain control',
          },
        ],
        after: () => this.state.tutorialStockroom = true,
      })
    }
  },
  // Methods
  startCellarRun: function () {
    content.shop.resetTimer()
    content.cellar.startRun()
    content.audio.reachSwitch.trigger(false, 0.25)

    app.screen.game.update()
  },
})
