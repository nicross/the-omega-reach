content.programs.desertPlanet = content.programs.invent({
  id: 'desertPlanet',
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
