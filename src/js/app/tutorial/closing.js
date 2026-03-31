app.tutorial.closing = app.tutorial.invent({
  id: 'closing',
  // State
  state: {},
  // Lifecycle
  shouldActivate: () => app.tutorial.galleryComplete.complete && !content.conservatory.isOpen(),
  onUpdate: function () {
    if (this.preventDouble()) {
      return
    }

    [
      {
        title: `<span class="u-highlight">[Tutorial]</span> <span class="u-screenReader">for</span> Closing:`,
        description: `<strong>The Omega Conservatory</strong> is now closed to visitors. <strong>The gallery</strong> must have an appraised instrument for it to reopen to the public.`,
        actions: [
          {
            label: 'Regain control',
          }
        ],
        after: () => this.markComplete(),
      },
    ].forEach((x) => app.screen.game.dialog.push(x))
  },
})
