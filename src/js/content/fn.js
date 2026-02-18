content.fn = {}

content.fn.gain = (value, exponent) => {
  const a = 0.5 * Math.pow(2 * (value < 0.5 ? value : 1 - value), exponent)
  return (value < 0.5) ? a : 1 - a
}

content.fn.throttled = (fn, timeout = 0) => {
  let throttle = 0

  return (...args) => {
    const now = performance.now()

    if (throttle > now) {
      return
    }

    fn(...args)
    throttle = now + timeout
  }
}
