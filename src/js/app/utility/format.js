app.utility.format = {}

app.utility.format.currency = function (x) {
  const s = x == 1 ? '' : 's'
  return `${this.number(x)} <abbr aria-label="credit${s}" title="credit${s}">¤</abbr>`
}

app.utility.format.number = (() => {
  const numberFormat = Intl.NumberFormat('en-US', {
    maximumFractionDigits: 0,
  })

  return (...args) => numberFormat.format(...args)
})()
