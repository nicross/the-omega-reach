content.cellar.instruments = (() => {
  const adjectives = [
    'Adjective',
  ]

  const nouns = [
    'Noun',
  ]

  let previous = new Set()

  function generateUniqueName() {
    let name

    do {
      name = [
        engine.fn.choose(adjectives, Math.random()),
        engine.fn.choose(nouns, Math.random()).toLowerCase(),
      ].join(' ')
    } while (name && (previous.has(name) || content.instruments.has(name)))

    if (previous.size > adjectives.length * nouns.length * 0.5) {
      previous.clear()
    }

    previous.add(name)

    return name
  }

  return {
    export: () => ({
      previous: [...previous],
    }),
    generateUniqueName,
    import: function (data = {}) {
      previous = new Set(data.previous || [])

      return this
    },
    reset: function () {
      previous.clear()

      return this
    },
  }
})()
