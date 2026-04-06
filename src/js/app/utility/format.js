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
  return `${this.number(x)} <i><i aria-hidden="true" role="presentation" title="credit${s}">¤</i><span class="u-screenReader"> credit${s}</span></i>`
}

app.utility.format.health = function (x) {
  return `${this.number(x)} <i><i aria-hidden="true" role="presentation" title="sanity">☥</i><span class="u-screenReader"> sanity</span></i>`
}

app.utility.format.list = function (items = []) {
  items = [...items]

  if (items.length == 0) {
    return ''
  }

  if (items.length == 1) {
    return list[0]
  }

  if (items.length == 2) {
    return items.join(' and ')
  }

  const last = items.pop()

  return `${items.join(', ')}, and ${last}`
}

app.utility.format.number = (() => {
  const numberFormat = Intl.NumberFormat('en-US', {
    maximumFractionDigits: 0,
  })

  return (...args) => numberFormat.format(...args)
})()
