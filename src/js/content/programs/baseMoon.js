;(() => {
  const baseDefinition = {
    id: 'baseMoon',
    bumpiness: 8,
    onLoad: function () {
      content.sphereIndex.randomize()

      const alterParticle = this.alterParticle.bind(this)

      this.alterParticle = (particle) => {
        alterParticle(particle)

        if (content.scans.is(this.options.body.name)) {
          particle.target.x *= 0.5
          particle.target.y *= 0.5
          particle.target.z *= 0.5
        }
      }

      return this
    },
    getRotationRate: function () {return 0.2 * this.properties.rotationRate},
  }

  content.programs.baseMoon = content.programs.invent(baseDefinition, content.programs.basePlanet)

  // Dynamic subtypes prototype chain: subtype -> baseMoon -> parentPlanet -> basePlanet -> base
  for (const [parentId, id ] of Object.entries({
    acidPlanet: 'acidMoon',
    arcticPlanet: 'arcticMoon',
    desertPlanet: 'desertMoon',
    rockyPlanet: 'rockyMoon',
    terranPlanet: 'terranMoon',
  })) {
    content.programs[id] = content.programs.invent({id}, content.programs[parentId].extend(baseDefinition))
  }

})()
