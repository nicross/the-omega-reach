app.tutorial.cellarUnique = app.tutorial.invent({
  id: 'cellarUnique',
  // State
  defaultState: {},
  // Lifecycle
  shouldActivate: () => content.location.is('cellar'),
  onUpdate: function () {
    if (!content.location.is('cellar')) {
      return
    }

    // Only on incomplete unique tiles
    const tile = content.cellar.tiles.current()

    if (!tile.isUnique || this.state[tile.id]) {
      return
    }

    // Get dialogs, ignoring tiles without them (but don't mark complete)
    const dialogs = tile.getDialogs()

    // Prevent double
    if (this.preventDouble(tile.id)) {
      return
    }

    // First tutorial
    this.enqueueFirstTutorial(dialogs.length > 0)

    if (!dialogs.length) {
      return
    }

    // Add default actions
    for (const dialog of dialogs) {
      if (!dialog.actions?.length) {
        dialog.actions = [
          {
            label: dialog.tutorial ? 'Regain control' : 'Keep going',
          },
        ]
      }
    }

    // Mark complete after last dialog
    const after = dialogs[dialogs.length - 1].after

    dialogs[dialogs.length - 1].after = () => {
      this.state[tile.id] = true

      if (after) {
        after()
      }
    }

    // Enqueue them
    dialogs.forEach((x) => app.screen.game.dialog.push(x))
  },
  enqueueFirstTutorial: function (hasMoreDialogs) {
    if (this.state._first) {
      return
    }

    app.screen.game.dialog.push({
      tutorial: true,
      title: `<span class="u-highlight">[Tutorial]</span> <span class="u-screenReader">for</span> Radices of power:`,
      description: `<strong>The cellar</strong> is peppered with landmarks which alter your perspective. Exploit them to dive deeper.`,
      actions: [
        {
          label: hasMoreDialogs ? 'Next tutorial' : 'Regain control',
        }
      ],
      after: () => this.state._first = true,
    })
  },
})
