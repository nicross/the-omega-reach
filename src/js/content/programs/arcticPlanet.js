content.programs.arcticPlanet = content.programs.invent({
  id: 'arcticPlanet',
  fieldDefinitions: {
    ...content.programs.basePlanet.fieldDefinitions,
  },
  propertyDefinitions: {
    ...content.programs.basePlanet.propertyDefinitions,
  },
  alterParticleColor: function (particle, point) {
    //return true
  },
  alterParticleVertex: function (particle, point) {
    //return true
  },
}, content.programs.basePlanet)
