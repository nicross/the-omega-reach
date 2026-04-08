app.tutorial.shopLoop = app.tutorial.invent({
  id: 'shopLoop',
  // State
  state: {
    tutorial: false,
    tutorialStockroom: false,
    visitorPineapple: false,
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

    const fromStockroom = content.location.was('stockroom'),
      hasStolen = content.cellar.stockroom.hasStolen(),
      stealingDetected = hasStolen && fromStockroom,
      stolenCount = content.cellar.stockroom.countStolen()

    if (this.state.tutorial && !this.state.visitorPineapple && !hasStolen && content.wallet.has(300)) {
      return this.visitorPineapple()
    }

    if (stealingDetected) {
      content.audio.interactComplete.trigger({duration: 1})

      ;[
        {
          title: `<q>Not so fast!</q>`,
          description: `You forfeit <strong>${stolenCount} instrument${stolenCount == 1 ? '' : 's'}</strong> from <strong>the stockroom</strong> this run.`,
          actions: [
            {
              label: `Relinquish ${stolenCount == 1 ? 'it' : 'them'}`,
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
              label: `Enjoy!`,
            },
          ],
        })
      }

      const cost = content.shop.getCost(),
        name = content.shop.generateUniqueName()

      ;[
        {
          title: `<q>I found this ${content.cellar.discovered.hasAny() ? 'before' : 'for'} you!</q>`,
          description: `You will get <strong>${name}</strong> for <strong>${app.utility.format.currency(cost)}</strong>.`,
          actions: [
            {
              label: 'Buy it',
              before: () => {
                this.state.bought = true

                content.instruments.add(name)
                content.wallet.subtract(cost)
                content.audio.interactSuccess.trigger({index: 2})

                // XXX: Prevent door open animation until next dialog
                content.cellar.health.reset()
              },
            },
            {
              label: 'No thanks',
              before: () => this.state.bought = false,
            },
          ],
        },
        {
          title: () => (
            this.state.bought
              ? `<q>Nice choice!</q>`
              : `<q>Makes sense!</q>`
          ),
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

    if (!this.state.tutorialStockroom && hasStolen) {
      app.screen.game.dialog.push({
        tutorial: true,
        title: `<span class="u-highlight">[Tutorial]</span> <span class="u-screenReader">for</span> Theft:`,
        description: `The shopkeeper becomes suspicious whenever they catch you passing through <strong>the stockroom</strong> door. Be quick to avoid their detection.`,
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
  // Other events
  visitorPineapple: function () {
    ;[
      {
        title: `<q>That's what I call music!</q>`,
        description: `You interrupt a lively conversation. The shopkeeper grins in the shadow of your presence, motioning toward your visitor <span lang="fr">du jour</span>: <q>This is Gerg. She visits us from Earth—and has just become my favorite customer!</q>`,
        actions: [
          {
            label: `It's my pleasure to meet an earthling in the flesh.`,
            before: () => this.state.visitorPineappleGreet = true,
          },
          {
            label: `And they're my favorite shopkeeper!`,
            before: () => this.state.visitorPineappleGreet = false,
          },
        ],
      },
      {
        title: () => (
          this.state.visitorPineappleGreet
            ? `<q>The pleasure is mine…</q>`
            : `<q>I'm your only shopkeeper!</q>`
        ),
        description: () => `She buries an infrasonic giggle into her polydactyl hand. Was it from ${this.state.visitorPineappleGreet ? 'your mediocre advance' : 'their natural comeback'}? Without a beat to read the scene, the shopkeeper entrenches you deeper: <q>Let's ask you my opening question: does <em>earthen pineapple</em> belong on pizza?</q>`,
        actions: [
          {
            label: `Absolutely!`,
          },
          {
            label: `Definitely not.`,
          },
          {
            label: `Only when paired with <em>earthen ham</em>.`,
          },
          {
            label: `Does it have barbeque sauce?`,
          },
        ],
      },
      {
        title: `<q>What a load of cosmic pain!</q>`,
        description: `Gerg turns as pink as the perfect <em>earthen steak</em> as the shopkeeper catches their hungry mistake. <q>Excuse my eruption—let's blame the <em>eathern anchovies</em> which spoiled my breakfast earlier. Now, back to our transaction…</q>`,
        actions: [
          {
            label: `Wave chummily`,
          },
          {
            label: `Laugh nervously`,
          },
          {
            label: `Shrug emotively`,
          },
          {
            label: `Exit silently`,
          },
        ],
        after: () => {
          this.state.visitorPineapple = true
          this.startCellarRun()
        },
      },
    ].forEach((x) => app.screen.game.dialog.push(x))
  },
})
