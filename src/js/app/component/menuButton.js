document.addEventListener('keydown', (e) => {
  if (e.target.matches('button, [role="button"]')) {
    if (['Enter','NumpadEnter','Space'].includes(e.code)) {
      e.preventDefault()
    }
  }
})
