app.tutorial.reachOffline = app.tutorial.invent({
  id: 'reachOffline',
  // State
  state: {},
  // Lifecycle
  shouldActivate: () => content.location.is('reach'),
  onUpdate: function () {
    if (!content.location.is('reach')) {
      return
    }

    [
      {
        title: `It's the Omega Reach.`,
        description: `It's capable of feats only a telescope dreams—and fabled for its breakings of fourth ceilings. You enter the enclosure for what can only be described as a retractable hand—one that has started—and ended—intergalactic wars.`,
        actions: [
          {
            label: 'Approach the device',
          }
        ],
      },
      {
        title: `[Select input device:]`,
        description: `You sit at the device. Upon its inert console rests…`,
        actions: [
          {
            label: 'two joysticks',
            before: () => app.settings.setInputPreference('gamepad'),
            after: () => app.settings.save(),
          },
          {
            label: 'a trackball',
            before: () => app.settings.setInputPreference('mouse'),
            after: () => app.settings.save(),
          },
          {
            label: 'an array of keys',
            before: () => app.settings.setInputPreference('keyboard'),
            after: () => app.settings.save(),
          },
        ],
      },
      {
        title: `[Select input preference:]`,
        description: `To confirm your choices at the console, you…`,
        actions: [
          {
            label: 'hold for a moment',
            before: () => app.settings.setInputHold(true),
            after: () => app.settings.save(),
          },
          {
            label: 'let go immediately',
            before: () => app.settings.setInputHold(false),
            after: () => app.settings.save(),
          },
        ],
      },
      {
        title: `Yet, it's offline.`,
        description: `You recall there being a specific sequence to make it stir. It's somewhere in that waking memory of yours. You reach toward the console, and…`,
        actions: [
          {
            label: 'Try something',
          }
        ],
      },
      {
        title: `[Tutorial] <span class="u-screenReader">for</span> Interacting:`,
        description: () => ({
          gamepad: `Hold one or both <kbd>Triggers</kbd> and move the <kbd>Analog Sticks</kbd> to interact. Locate the sweet spot using audio, visual, and haptic cues to proceed.`,
          keyboard: `Press one or more keys to interact. Each key points to a location. Locate the sweet spot using audio and visual cues to proceed.`,
          mouse: `Click to interact at that location. Locate the sweet spot using audio and visual cues to proceed.`,
        }[app.settings.computed.inputPreference]),
        actions: [
          {
            label: 'Next tutorial',
          }
        ],
      },
      {
        title: `[Tutorial] <span class="u-screenReader">for</span> Skipping:`,
        description: () => ({
          gamepad: `${app.settings.computed.inputHold ? 'Hold' : 'Press'} the <kbd>A</kbd> button to skip the current interaction. You will not be penalized for doing so.`,
          keyboard: `${app.settings.computed.inputHold ? 'Hold' : 'Press'} <kbd>Enter</kbd> or <kbd>Spacebar</kbd> to skip the current interaction. You will not be penalized for doing so.`,
          mouse: `${app.settings.computed.inputHold ? 'Click and hold' : 'Click'} the <kbd>Examine Button</kbd> to skip the current interaction. You will not be penalized for doing so.`,
        }[app.settings.computed.inputPreference]),
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
