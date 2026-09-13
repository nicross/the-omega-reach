app.tutorial.cellarVisitorLoop = app.tutorial.invent({
  id: 'cellarVisitorLoop',
  // Lifecycle
  shouldActivate: () => content.location.is('cellar') && app.tutorial.death.complete,
  onUpdate: function () {
    if (!content.location.is('cellar')) {
      return
    }

    // Start over with each run
    const run = content.cellar.run.count()

    if (this.state.run != run) {
      this.state = {
        count: (this.state.count || 0) + 1,
        done: false,
        found: false,
        history: {},
        perfect: false,
        run,
        score: 0,
        success: false,
      }
    }

    // Prevent repeat encounters in same run
    if (this.state.found) {
      return
    }

    // Keep track of visited tiles to prevent exploits
    const tile = content.cellar.tiles.current()

    if (this.inHistory(tile)) {
      return
    }

    this.addHistory(tile)

    // Only trigger on non-unique tiles
    if (tile.isUnique) {
      return
    }

    // Roll the dice
    const chance = engine.fn.scale(
      tile.z,
      0, content.cellar.lastFloor(),
      1/50, 1/10,
    )

    if (Math.random() > chance) {
      return
    }

    // Trigger the dialogue
    this.state.found = true

    const given = engine.tool.vector2d.create(),
      maxScore = 2,
      questions = this.generateAnswers(tile)

    ;[
      {
        ...engine.fn.choose([
          // TODO: More random entrances
          {
            title: `<q>Is anybody there?</q>`,
            description: `The shrieking cry multiplies and divides as it ricochets about the maze, diminishing and rejoining the sibilence of the background noise. Yet, its origin was nearby.`,
          },
        ], Math.random()),
        actions: [
          {
            label: `Investigate it`
          },
          {
            label: `Ignore it`,
            before: () => app.screen.game.dialog.purgeQueue(),
          },
        ],
      },
      {
        title: `It's… a visitor?`,
        description: `They must be lost. Calming your mind to help visualize, you retrace your steps to point them toward the exit.`,
        actions: questions[0].map((answer) => ({
          label: `Head ${Math.abs(answer.value)} step${Math.abs(answer.value) == 1 ? '' : 's'} ${{x: Math.sign(answer.value) > 0 ? 'east' : 'west', y: Math.sign(answer.value) > 0 ? 'north' : 'south'}[answer.dimension]}…`,
          before: () => {
            this.state.score += (answer.correct ? 1 : 0)
            given[answer.dimension] = answer.value
          },
        })),
      },
      {
        title: () => engine.fn.choose([
          `<q>Bonkers…</q>`,
          `<q>Come on…</q>`,
          `<q>Explains a lot…</q>`,
          `<q>Give me a break…</q>`,
          `<q>Huh…</q>`,
          `<q>Inconceivable…</q>`,
          `<q>Jeez…</q>`,
          `<q>My mistake…</q>`,
          `<q>No way…</q>`,
          `<q>Of course…</q>`,
          `<q>Please…</q>`,
          `<q>Strange…</q>`,
          `<q>That's odd…</q>`,
          `<q>Well I'll be…</q>`,
          `<q>You're kidding…</q>`,
        ], Math.random()),
        description: () => [
          // Incorrect choice
          [
            engine.fn.choose([
              `Their fears wax.`,
              `Their hopes wane.`,
              `Their optimism wanes.`,
              `Their pessimism waxes.`,
            ], Math.random()),
            engine.fn.choose([
              `No, that wasn't it.`,
              `That's nowhere near the exit.`,
              `You were confidently incorrect.`,
            ], Math.random()),
            engine.fn.choose([
              `Are you lost as well?`,
              `Can you get them halfway?`,
              `Does it matter anymore?`,
            ], Math.random()),
          ].filter((x) => x).join(' '),
          // Correct choice
          [
            engine.fn.choose([
              `Their fears wane.`,
              `Their hopes wax.`,
              `Their optimism waxes.`,
              `Their pessimism wanes.`,
            ], Math.random()),
            engine.fn.choose([
              `That's halfway to the exit.`,
              `Yes, that was it.`,
              `You were confidently correct.`,
            ], Math.random()),
            engine.fn.choose([
              `Are you fully situated?`,
              `Can you get them home?`,
              `Do you remember the rest?`,
            ], Math.random()),
          ].filter((x) => x).join(' '),
        ][this.state.score],
        actions: questions[1].map((answer) => ({
          label: answer.value ? `…then ${Math.abs(answer.value)} step${Math.abs(answer.value) == 1 ? '' : 's'} ${{x: Math.sign(answer.value) > 0 ? 'east' : 'west', y: Math.sign(answer.value) > 0 ? 'north' : 'south'}[answer.dimension]}` : `…and you've arrived.`,
          before: () => {
            this.state.score += (answer.correct ? 1 : 0)
            given[answer.dimension] = answer.value
          },
        })),
      },
      {
        title: engine.fn.choose([
          `<q>Appreciate it!</q>`,
          `<q>Earthen blessings!</q>`,
          `<q>Good grief!</q>`,
          `<q>Have a good one!</q>`,
          `<q>I'm going home!</q>`,
          `<q>It's my lucky day!</q>`,
          `<q>May you reach deeper!</q>`,
          `<q>Never again!</q>`,
          `<q>Praise the cycles!</q>`,
          `<q>See you there!</q>`,
          `<q>Thanks, boss!</q>`,
          `<q>You're the best!</q>`,
        ], Math.random()),
        description: () => engine.fn.choose([
          // TODO: More random exits
          `The lost guest disappears into the darkness of the wrong direction. Comically, their hurried steps skid and about-face as they belatedly process your instructions. You catch a muffled laugh as they cross your path again.`,
        ], Math.random()),
        actions: () => {
          const actions = []

          if (this.state.score == maxScore) {
            actions.push({label: 'Gesture affirmatively'})
          }

          actions.push(
            {label: 'Wave warmly'},
          )

          if (this.state.score == 0) {
            actions.push({label: 'Smile cynically'})
          }

          actions.push({label: 'Keep going'})

          return actions
        },
        before: () => content.audio.footsteps.trigger({
          count: 5,
          delay: 1/4,
          duration: 1/5,
          pan: given.normalize().x,
          velocity: 1,
        }),
        after: () => {
          // Mark complete for this run
          this.state.perfect = this.state.score == maxScore
          this.state.success = Math.random() <= [0.4, 0.6, 0.8][this.state.score]

          // Add donations when successful
          if (this.state.success) {
            content.donations.add(
              this.state.perfect
                ? engine.fn.randomInt(15, 25)
                : engine.fn.randomInt(5, 10)
            )
          }
        },
      },
    ].forEach((x) => app.screen.game.dialog.push(x))
  },
  // History
  addHistory: function ({x, y, z}) {
    if (!(x in this.state.history)) {
      this.state.history[x] = {}
    }

    if (!(y in this.state.history[x])) {
      this.state.history[x][y] = {}
    }

    this.state.history[x][y][z] = true

    return this
  },
  inHistory: function ({x, y, z}) {
    return x in this.state.history
      && y in this.state.history[x]
      && z in this.state.history[x][y]
  },
  // Answers
  generateAnswers: function ({x, y, z}) {
    const answers = []

    // Calculate correct answer
    const exit = engine.tool.vector2d.create()
    const correct = exit.subtract({x, y})

    // Determine which dimension goes first
    let dimensions = []

    if ((correct.x && correct.y) || (!correct.x && !correct.y)) {
      dimensions = engine.fn.shuffle(['x','y'])
    } else if (correct.x) {
      dimensions = ['x','y']
    } else if (correct.y) {
      dimensions = ['y','x']
    }

    // Generate random answers
    const max = Math.max(Math.abs(x), Math.abs(y), 3)

    for (const dimension of dimensions) {
      const values = new Set()

      values.add(correct[dimension])

      while (values.size < 4) {
        const value = engine.fn.randomInt(-max * 1.5, max * 1.5)

        // Don't add zero values to first question
        if (value || answers.length) {
          values.add(value)
        }
      }

      answers.push(
        engine.fn.shuffle([...values]).map((value) => ({
          correct: correct[dimension] == value,
          dimension,
          value,
        }))
      )
    }

    return answers
  },
  // Epilogues
  epilogueCellarDeath: function () {
    if (this.done || !this.state.found) {
      return false
    }

    if (this.state.success) {
      this.epilogueCellarDeathSuccess()
    } else {
      this.epilogueFailure(false)
    }

    this.done = true

    return true
  },
  epilogueCellarDeathSuccess: function () {
    app.screen.game.dialog.push({
      title: [
        engine.fn.choose([
          `<q>Thanks for nothing…</q>`,
          `<q>You nearly killed us both!</q>`,
        ], Math.random()),
        engine.fn.choose([
          `<q>I'm lucky to be alive…</q>`,
          `<q>You're lucky I'm alive!</q>`,
        ], Math.random()),
        engine.fn.choose([
          `<q>I've learned my lesson…</q>`,
          `<q>Returning the favor!</q>`,
        ], Math.random()),
      ][this.state.score],
      description: `It's the lost visitor from <strong>the cellar</strong>. ` + [
        `Your beguiling advice magnified their horrific predicament.`,
        `Your incomplete instructions included a wrong turn at <em>Earthen albuquerque</em>.`,
        `Your unfailing memory led them directly to the entrance with confidence.`,
      ][this.state.score],
      actions: [
        {label: this.state.perfect ? 'Gesture affirmatively' : 'Thank coldly'},
        {label: this.state.perfect ? 'Thank warmly' : 'Grimace stiffly'},
        {label: 'Back to work'},
      ],
    })
  },
  epilogueFailure: function (isShop = false) {
    app.screen.game.dialog.push({
      title: `Someone's missing.`,
      description: `Unfortunately, the wayward visitor who you discovered inside <strong>the cellar</strong> hasn't reached the entrance.`,
      actions: [
        {label: 'Grieve briefly'},
        {label: 'Shrug numbly'},
        {label: isShop ? 'Brace for it' : 'Back to work'},
      ],
    })
  },
  epilogueShopLoop: function () {
    if (this.done || !this.state.found) {
      return false
    }

    if (this.state.success) {
      this.epilogueShopLoopSuccess()
    } else {
      this.epilogueFailure(true)
    }

    this.done = true

    return true
  },
  epilogueShopLoopSuccess: function () {
    app.screen.game.dialog.push({
      title: [
        engine.fn.choose([
          `<q>That's them…</q>`,
          `<q>Speak of the fool…</q>`,
        ], Math.random()),
        engine.fn.choose([
          `<q>It was a team effort!</q>`,
          `<q>You make a great team!</q>`,
        ], Math.random()),
        engine.fn.choose([
          `<q>Our hero returns!</q>`,
          `<q>That's them!</q>`,
        ], Math.random()),
      ][this.state.score],
      description: [
        `Hushed complaints evaporate into the muted room.`,
        `Their debriefing ends with shaking hands.`,
        `Boisterous jubilance exudes from the room.`,
      ][this.state.score] + ` The lost visitor from <strong>the cellar</strong> swivels from the shopkeeper. They both ` + [
        `meet your gaze with a shared blame`,
        `acknowledge you with hurried waves`,
        `applaud your triumphant escape`,
      ][this.state.score] + ` before the visitor ` + [
        `scurries regretfully`,
        `strolls gratefully`,
        `skips gleefully`,
      ][this.state.score] + ` away.`,
      actions: [
        {label: this.state.perfect ? 'Gesture affirmatively' : 'Nod softly'},
        {label: this.state.perfect ? 'Wave warmly' : 'Smile wryly'},
        {label: 'Brace for it'},
      ],
    })
  },
})
