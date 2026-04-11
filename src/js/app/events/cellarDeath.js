content.location.on('cellar-death', () => {
  const penalty = Math.min(
    content.wallet.amount(),
    Math.ceil(content.shop.getCost() * 0.75),
  )

  const hasStolen = content.stockroom.hasStolen(),
    stolenCount = content.stockroom.stolenCount()

  content.cellar.deaths.increment()
  content.stockroom.reset()

  content.donations.add(Math.round(penalty * engine.fn.randomFloat(0.25, 0.75)))
  content.wallet.subtract(penalty)

  content.audio.interactComplete.trigger({duration: 2})
  content.rooms.reach.state.online = false

  content.location.set('atrium')
  app.screen.game.update()

  if (!app.tutorial.death.complete) {
    [
      {
        title: `<q>Wake up.</q>`,
        description: `<q>Let's just say I didn't see anything?</q> The shopkeeper posits between bites of fresh <em>earthen donuts</em>—with their restorative smell wafting in from the doorway upon which they smugly lean.`,
        actions: [
          {
            label: 'Thank them',
          },
          {
            label: 'Say nothing',
          }
        ],
      },
      {
        title: `<q>By the way…</q>`,
        description: `You brace for it again. <q>Check your wallet. My true expertise doesn't come cheap.</q> You confirm the <strong>${app.utility.format.currency(penalty)}</strong> now missing—and face its thief.`,
        actions: [
          {
            label: 'Grumble loudly',
          },
          {
            label: 'Say nothing',
          },
        ],
      },
    ].forEach((x) => app.screen.game.dialog.push(x))

    ;[
      {
        tutorial: true,
        title: `<span class="u-highlight">[Tutorial]</span> <span class="u-screenReader">for</span> Fainting:`,
        description: `You will wake in <strong>the atrium</strong> whenever you faint for whatever reason.`,
        actions: [
          {
            label: 'Regain control',
          }
        ],
        after: () => app.tutorial.death.markComplete(),
      },
    ].forEach((x) => app.screen.game.dialog.push(x))
  } else {
    if (hasStolen) {
      app.screen.game.dialog.push({
        title: `<q>I'll take ${stolenCount == 1 ? 'that' : 'those'}!</q>`,
        description: `You forfeit <strong>${stolenCount} instrument${stolenCount == 1 ? '' : 's'}</strong> from <strong>the stockroom</strong> this run.`,
        actions: [
          {
            label: 'Groan',
          },
        ],
      })
    }

    app.screen.game.dialog.push({
      title: `It's the atrium.`,
      description: `You lose <strong>${app.utility.format.currency(penalty)}</strong> to <strong>the cellar</strong> this run.`,
      actions: [
        {
          label: 'Wake up',
        },
      ],
    })
  }

})
