app.tutorial.galleryComplete = app.tutorial.invent({
  id: 'galleryComplete',
  // State
  state: {},
  // Lifecycle
  shouldActivate: () => content.location.is('gallery') && content.rooms.gallery.isComplete(),
  onUpdate: function () {
    if (!(content.location.is('gallery') && content.rooms.gallery.isComplete())) {
      return
    }

    [
      {
        title: `<span class="u-highlight">[Tutorial]</span> <span class="u-screenReader">for</span> Performing:`,
        description: `Instruments can be freely played once they are fully appraised. Explore and enjoy their unique textures at your own pace!`,
        actions: [
          {
            label: 'Next tutorial',
          }
        ],
      },
      {
        title: `<span class="u-highlight">[Tutorial]</span> <span class="u-screenReader">for</span> Selling:`,
        description: () => ({
          gamepad: `Dislike anything? or just need credits for <strong>the shop</strong>? ${app.settings.computed.inputHold ? 'Hold' : 'Press'} the <kbd>A</kbd> button to sell any instrument. You will be prompted to confirm your choice.`,
          keyboard: `Dislike anything? or just need credits for <strong>the shop</strong>? ${app.settings.computed.inputHold ? 'Hold' : 'Press'} <kbd>Enter</kbd> or <kbd>Spacebar</kbd> to sell any instrument. You will be prompted to confirm your choice.`,
          mouse: `Dislike anything? or just need credits for <strong>the shop</strong>? ${app.settings.computed.inputHold ? 'Click and hold' : 'Click'} the <kbd>Sell Button</kbd> to sell any instrument. You will be prompted to confirm your choice.`,
        }[app.settings.computed.inputPreference]),
        actions: [
          {
            label: 'Next tutorial',
          }
        ],
      },
      {
        title: `<span class="u-highlight">[Tutorial]</span> <span class="u-screenReader">for</span> Visitors:`,
        description: `Congratulations! <strong>The Omega Conservatory</strong> is now open to visitors. <strong>The gallery</strong> must have an appraised instrument for it to remain open.`,
        actions: [
          {
            label: 'Regain control',
            before: () => {
              content.conservatory.setReady(true)
              this.markComplete()
            },
          }
        ],
      },
    ].forEach((x) => app.screen.game.dialog.push(x))
  },
})
