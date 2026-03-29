app.tutorial.atriumUnlocked = app.tutorial.invent({
  id: 'atriumUnlocked',
  // State
  state: {},
  // Lifecycle
  shouldActivate: () => content.location.is('atrium') && app.tutorial.firstInstrument.complete,
  onUpdate: function () {
    if (!content.location.is('atrium')) {
      return
    }

    [
      {
        title: `<span class="u-highlight">[Tutorial]</span> <span class="u-screenReader">for</span> The atrium:`,
        description: `You may now receive notifications about other rooms from <strong>the atrium</strong>. For instance, that instrument you recovered has just arrived in <strong>the gallery</strong>! Go there to proceed.`,
        actions: [
          {
            label: 'Regain control',
            before: () => this.markComplete(),
          }
        ],
      },
      ].forEach((x) => app.screen.game.dialog.push(x))
  },
})
