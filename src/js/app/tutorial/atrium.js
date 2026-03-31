app.tutorial.atrium = app.tutorial.invent({
  id: 'atrium',
  // State
  state: {},
  // Lifecycle
  shouldActivate: () => true,
  onUpdate: function () {
    if (!content.location.is('atrium')) {
      return
    }

    [
      {
        title: `Wake up.`,
        description: `You stir from your nap at the center of time. A familiar warmth fills you as you flex your senses. Has it already been a quadrillion years?`,
        actions: [
          {
            label: 'Look around',
          }
        ],
      },
      {
        title: `You're in the atrium.`,
        description: `It connects the various rooms of <strong>The Omega Conservatory</strong>. From this vantage, everything seems to happen all at once through the above skylight. Perhaps you might dwell a bit longer to ponder its wonder?`,
        actions: [
          {
            label: 'Fall back to sleep',
          },
          {
            label: 'Snap out of it',
          }
        ],
      },
      {
        title: `No, you are the curator!`,
        description: `With the auction house cleared and the cycle soon ending, the gallery sits criminally empty. It would be best for you to preserve as much as you can by using <strong>the reach</strong>.`,
        actions: [
          {
            label: 'Get to work',
          }
        ],
      },
      {
        title: `<span class="u-highlight">[Select tutorial preference…]</span>`,
        description: `When you reach into the unknown, you prefer to…`,
        actions: [
          {
            label: 'have your hand held.',
            before: () => app.settings.setTutorialOn(true),
          },
          {
            label: 'reach your own conclusions.',
            before: () => app.settings.setTutorialOn(false),
          },
        ],
        after: () => {
          app.settings.save()
        },
      },
      {
        tutorial: true,
        title: `<span class="u-highlight">[Tutorial]</span> <span class="u-screenReader">for</span> Moving:`,
        description: () => ({
          gamepad: `Use the <kbd>Directional Pad</kbd> to navigate the conservatory. Find your way to <strong>the reach</strong> to fulfill your duties.`,
          keyboard: `Use the <kbd>Arrow Keys</kbd> to navigate the conservatory. Find your way to <strong>the reach</strong> to fulfill your duties.`,
          mouse: `Click the <kbd>Arrow Buttons</kbd> to navigate the conservatory. Find your way to <strong>the reach</strong> to fulfill your duties.`,
        }[app.settings.computed.inputPreference]),
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
