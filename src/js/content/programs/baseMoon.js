content.programs.baseMoon = content.programs.invent({
  id: 'baseMoon',
  onLoad: function () {
    content.sphereIndex.randomize()

    const alterParticleVertex = this.alterParticleVertex.bind(this)
    this.alterParticleVertex = (particle, point) => alterParticleVertex(particle, point) * 0.5

    return this
  },
}, content.programs.basePlanet)

// Dynamic types, e.g. terranPlanet -> terranMoon
for (const [id, parentId] of Object.entries({

})) {
  content.programs[id] = content.programs.invent({...content.programs[parentId], id}, content.programs.baseMoon)
}
