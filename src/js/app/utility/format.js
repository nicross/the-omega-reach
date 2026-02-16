app.utility.format = {}

app.utility.format.currency = function (x) {
  return `${this.number(x)} <abbr aria-label="credits">¤</abbr>`
}

app.utility.format.number = (() => {
  const numberFormat = Intl.NumberFormat('en-US', {
    maximumFractionDigits: 0,
  })

  return (...args) => numberFormat.format(...args)
})()
