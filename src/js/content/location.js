content.location = (() => {
  const pubsub = engine.tool.pubsub.create()

  let room

  function load(id, state) {
    room = content.rooms.get(id)

    if (!room) {
      return
    }

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
    reset: function () {
      unload()

      return this
    },
    set: function (id) {
      unload()
      load(id)

      return this
    }
  })
})()

engine.state.on('import', ({location, rooms}) => content.location.import(location, rooms))
engine.state.on('export', (data) => data.location = content.location.export())
engine.state.on('reset', () => content.location.reset())
