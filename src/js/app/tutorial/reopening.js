app.tutorial.reopening = app.tutorial.invent({
  id: 'reopening',
  // State
  state: {},
  // Lifecycle
  shouldActivate: () => app.tutorial.tutorialComplete.complete && !content.conservatory.isOpen() && content.instruments.count() > 0,
  onUpdate: function () {
    if (content.location.is('gallery')) {
      return
    }

    if (this.preventDouble()) {
      return
    }

    [
      {
        tutorial: true,
        title: `<span class="u-highlight">[Tutorial]</span> <span class="u-screenReader">for</span> Reopening:`,
        description: `Beware! <strong>The Omega Conservatory</strong> is still closed to visitors. <strong>The gallery</strong> must have an appraised instrument for it to reopen to the public.`,
        actions: [
          {
            label: 'Regain control',
          }
        ],
        finally: () => this.markComplete(),
      },
    ].forEach((x) => app.screen.game.dialog.push(x))
  },
})
