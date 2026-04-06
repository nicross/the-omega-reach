content.location = (() => {
  const pubsub = engine.tool.pubsub.create()

  let previous,
    room

  function load(id, state) {
    const next = content.rooms.get(id)

    if (!next) {
      return
    }

    room = next

    // Import state to prevent errors when first loading the room
    if (state) {
      room.import(state)
    }

    room.enter()
    pubsub.emit('enter', room)
  }

  function unload() {
    if (!room) {
      return
    }

    room.exit()
    pubsub.emit('exit', room)

    previous = room
    room = undefined
  }

  return pubsub.decorate({
    export: function () {
      return {
        id: room?.id,
      }
    },
    get: () => room,
    id: () => room?.id,
    import: function ({id} = {}, states = {}) {
      load(id, states[id])

      return this
    },
    is: function (id) {
      return id == room?.id
    },
    previous: () => previous,
    reset: function () {
      unload()
      previous = undefined

      return this
    },
    set: function (id) {
      unload()
      load(id)

      return this
    },
    was: function (id) {
      return id == previous?.id
    },
  })
})()

// XXX: Load location after all other modules
engine.ready(() => {
  engine.state.on('import', ({location, rooms}) => content.location.import(location, rooms))
  engine.state.on('export', (data) => data.location = content.location.export())
  engine.state.on('reset', () => content.location.reset())
})
