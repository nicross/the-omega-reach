app.tutorial.galaxy = app.tutorial.invent({
  id: 'galaxy',
  // State
  state: {},
  // Lifecycle
  shouldActivate: () => content.location.is('galaxy'),
  onUpdate: function () {
    if (!content.location.is('galaxy')) {
      return
    }

    if (this.preventDouble()) {
      return
    }

    [
      {
        title: `Just keep zooming.`,
        description: `Zooming, zooming… You repeat this mantra like that <q>fish</q> from the <em>earthen picture</em>. Though not as aloof, this confluence of zooms might consume you as profusely.`,
        actions: [
          {
            label: 'Reach deeper',
          }
        ],
      },
      {
        tutorial: true,
        title: `<span class="u-highlight">[Tutorial]</span> <span class="u-screenReader">for</span> Galaxies:`,
        description: `Galaxies are hosts to countless stars. Interact to reach toward a random star within them. You will zoom in automagically to any new stars that you reach.`,
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
