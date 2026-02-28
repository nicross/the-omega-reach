app.utility.format = {}

app.utility.format.coordinates = function ({x, y}) {
  const coordinates = []

  if (y) {
    const isNorth = y > 0
    coordinates.push(`${this.number(Math.abs(y))} ${isNorth ? 'North' : 'South'}`)
  }

  if (x) {
    const isEast = x > 0
    coordinates.push(`${this.number(Math.abs(x))} ${isEast ? 'East' : 'West'}`)
  }

  return coordinates.length
    ? coordinates.join(', ')
    : 'Origin'
}

app.utility.format.currency = function (x) {
  const s = x == 1 ? '' : 's'
  return `${this.number(x)} <abbr aria-label="credit${s}" title="credit${s}">¤</abbr>`
}

app.utility.format.health = function (x) {
  return `${this.number(x)} <abbr aria-label="sanity" title="sanity">☥</abbr>`
}

app.utility.format.number = (() => {
  const numberFormat = Intl.NumberFormat('en-US', {
    maximumFractionDigits: 0,
  })

  return (...args) => numberFormat.format(...args)
})()
