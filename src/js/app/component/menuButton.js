document.querySelectorAll('button, [role="button"]').forEach((element) => {
  element.addEventListener('keydown', (e) => {
    if (['Enter','NumpadEnter','Space'].includes(e.code)) {
      e.preventDefault()
    }
  })
})
