app.tutorial.cellarVisitorLoop = app.tutorial.invent({
  id: 'cellarVisitorLoop',
  // Lifecycle
  shouldActivate: () => content.location.is('cellar'),
  onUpdate: function () {
    if (!content.location.is('cellar')) {
      return
    }

    // Start over with each run
    const run = content.cellar.run.count()

    if (this.state.run != run) {
      this.state = {
        encountered: false,
        history: {},
        perfect: false,
        result: false,
        run,
        score: 0,
      }
    }

    // Prevent repeat encounters in same run
    if (this.state.encountered) {
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
      // TODO: uncomment, always runs
      //return
    }

    // Trigger the dialogue
    this.state.encountered = true

    const maxScore = 2,
      questions = this.generateAnswers(tile)

    ;[
      {
        title: `It's a… visitor?`,
        description: () => engine.fn.choose([
          `TK: Randomized placeholder text.`,
        ], Math.random()),
        actions: questions[0].map((answer) => ({
          label: `Head ${Math.abs(answer.value)} step${Math.abs(answer.value) == 1 ? '' : 's'} ${{x: Math.sign(answer.value) > 0 ? 'east' : 'west', y: Math.sign(answer.value) > 0 ? 'north' : 'south'}[answer.dimension]}…`,
          before: () => this.state.score += (answer.correct ? 1 : 0),
        })),
      },
      {
        title: () => engine.fn.choose([
          `<q>Bonkers…</q>`,
          `<q>Hmm…</q>`,
          `<q>Huh…</q>`,
          `<q>Incredible…</q>`,
          `<q>Jeez…</q>`,
          `<q>Mm-hmm…</q>`,
          `<q>No way…</q>`,
          `<q>Of course…</q>`,
          `<q>Strange…</q>`,
          `<q>Wow…</q>`,
        ], Math.random()),
        description: () => [
          `TK: Incorrect choice.`,
          `TK: Correct choice.`,
        ][this.state.score],
        actions: questions[1].map((answer) => ({
          label: answer.value ? `…then ${Math.abs(answer.value)} step${Math.abs(answer.value) == 1 ? '' : 's'} ${{x: Math.sign(answer.value) > 0 ? 'east' : 'west', y: Math.sign(answer.value) > 0 ? 'north' : 'south'}[answer.dimension]}` : `…and you've arrived.`,
          before: () => this.state.score += (answer.correct ? 1 : 0),
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
          `TK: Randomized placeholder text.`,
        ], Math.random()),
        actions: () => {
          const actions = []

          if (this.state.score == maxScore) {
            actions.push({label: 'Gesture positively'})
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
        after: () => {
          this.state.perfect = this.state.score == maxScore
          this.state.result = Math.random() <= [0.2, 0.4, 0.8][this.state.score]
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
})
