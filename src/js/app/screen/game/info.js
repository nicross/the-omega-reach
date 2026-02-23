app.screen.game.info = (() => {
  const attributesElement = document.querySelector('.a-game--attributes'),
    descriptionElement = document.querySelector('.a-game--description'),
    nameElement = document.querySelector('.a-game--name')

  function getRoomInfo() {
    const room = content.location.get()

    return {
      attributes: room.getAttributeLabels(),
      description: room.getDescription(),
      descriptionModifier: room.getDescriptionModifier(),
      isComplete: room.isComplete(),
      isDiscovered: room.isDiscovered(),
      isIncomplete: room.isIncomplete(),
      name: room.getName(),
      nameShort: room.getNameShort(),
    }
  }

  return {
    describe: function () {
      const {
        attributes,
        description,
        isComplete,
        nameShort,
      } = getRoomInfo()

      const descriptors = [
        nameShort,
        description,
        isComplete ? 'Complete' : '',
        ...attributes.map(({label, labelPlain}) => labelPlain || label),
      ]

      return descriptors.filter((x) => x).join(', ')
    },
    update: function () {
      const {
        attributes,
        description,
        descriptionModifier,
        isComplete,
        isDiscovered,
        isIncomplete,
        name,
        nameShort,
      } = getRoomInfo()

      descriptionElement.innerHTML = description
      nameElement.ariaLabel = nameShort
      nameElement.innerHTML = name

      if (isIncomplete) {
        content.audio.incomplete.trigger()
      }

      attributesElement.innerHTML = (isComplete ? `<li class="a-game--attribute a-game--attribute-complete"><i aria-hidden="true">✓</i>Complete</li>` : '')
        + attributes.map(
            ({label, modifiers}) => `<li class="a-game--attribute${modifiers.map((modifier) => ` a-game--attribute-${modifier}`).join('')}">${label}</li>`
          ).join('')

      descriptionElement.className = 'a-game--description'

      if (descriptionModifier) {
        descriptionElement.classList.add(`a-game--description-${descriptionModifier}`)
      }

      if (!isDiscovered) {
        descriptionElement.classList.add('a-game--description-undiscovered')
      }

      return this
    },
  }
})()
