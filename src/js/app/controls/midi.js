app.controls.midi = (() => {
  const mappings = new Map(),
    notes = new Set(),
    sustained = new Set()

  let isSupported = false,
    modulation = 0.5,
    pitchBend = 0,
    sustainActive = false

  // Build mappings
  let mappingNote = 0

  for (let x = 0; x < 26; x += 1) {
    for (let y = 0; y < 5; y += 1) {
      if (!engine.fn.between(mappingNote, 0, 127)) {
        continue
      }

      const vector = engine.tool.vector3d.create({
        ...engine.tool.vector2d.unitX().rotate(
          engine.const.tau * (
            0.5 + (x / 25)
          )
        ),
        z: [-0.666, -0.333, 0, 0.333, 0.666][y],
      }).normalize()

      vector.depth = 0
      vector.depthPrime = 0
      vector.prime = vector.clone()
      vector.target = vector.clone()

      mappings.set(mappingNote, vector)
      mappingNote += 1
    }
  }

  // Handle MIDI permissions and events
  if ('requestMIDIAccess' in navigator) {
    engine.loop.once('frame', () => {
      navigator.requestMIDIAccess().then((midiAccess) => {
        isSupported = true

        midiAccess.onstatechange = onMidiConnectionEvent

        Array.from(midiAccess.inputs).forEach((midiInput) => {
          midiInput[1].onmidimessage = onMidiMessageEvent
        })
      }).catch(console.error)
    })
  }

  function handleNoteOff(note) {
    if (!notes.has(note)) {
      return
    }

    if (sustainActive) {
      sustained.add(note)
      return
    }

    notes.delete(note)
  }

  function handleModulation(value) {
    modulation = (value || 1) / 127
  }

  function handleNoteOn(note, velocity) {
    const mapping = mappings.get(note)

    if (!mapping) {
      return
    }

    mapping.depthPrime = velocity / 127
    notes.add(note)
  }

  function handlePitchBend(value) {
    pitchBend = engine.fn.scale(value, 0, 127, -1, 1)
  }

  function handleSustainOn() {
    sustainActive = true
  }

  function handleSustainOff() {
    sustainActive = false
    sustained.forEach((note) => notes.delete(note))
    sustained.clear()
  }

  function kill() {
    modulation = 0.5
    pitchBend = 0
    sustainActive = false

    notes.clear()
    sustained.clear()
  }

  function onMidiConnectionEvent(e) {
    if (!(e.port instanceof MIDIInput)) {
      return
    }

    if (e.port.state == 'disconnected') {
      return kill()
    }

    e.port.onmidimessage = onMidiMessageEvent
  }

  function onMidiMessageEvent(e) {
    switch (e.data[0]) {
      case 128:
        return handleNoteOff(e.data[1])

      case 144:
        return e.data[2] ? handleNoteOn(e.data[1], e.data[2]) : handleNoteOff(e.data[1])

      case 176:
        switch (e.data[1]) {
          case 1:
            return handleModulation(e.data[2])

          case 64:
            return e.data[2] ? handleSustainOn() : handleSustainOff()
        }
        return

      case 224:
        return handlePitchBend(e.data[2])
    }
  }

  return {
    getMappings: () => {
      const entries = {}

      for (const [key, value] of mappings.entries()) {
        entries[key] = value.prime.clone()
      }

      return entries
    },
    getPoints: () => notes.values().map((note) => {
      const mapping = mappings.get(note)

      mapping.depth = mapping.depthPrime ** engine.fn.lerpExp(3, 1/3, modulation, 0.416)

      mapping.target = mapping.prime.clone()
      mapping.target.z += pitchBend * 1/3
      mapping.target = mapping.target.normalize()

      return mapping
    }),
    has: () => notes.size > 0,
    isSupported: () => isSupported,
    reset: function () {
      kill()

      return this
    },
  }
})()
