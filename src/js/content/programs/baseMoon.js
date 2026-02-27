;(() => {
  const baseDefinition = {
    id: 'baseMoon',
    bumpiness: 6,
    onLoad: function () {
      content.sphereIndex.randomize()

      const alterParticle = this.alterParticle.bind(this),
        radiusFactor = engine.fn.lerp(0.4, 0.5, this.options.body.planet.radius)

      this.alterParticle = (particle) => {
        alterParticle(particle)

        if (content.scans.is(this.options.body.name)) {
          particle.target.x *= radiusFactor
          particle.target.y *= radiusFactor
          particle.target.z *= radiusFactor
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
