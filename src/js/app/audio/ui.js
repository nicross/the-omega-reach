app.audio.ui = {
  hoverMemory : undefined,
}

// Clicking
document.addEventListener('click', (e) => {
  if (!e.target.matches('.c-menuButton, .c-menuButton *, .c-select *, .c-toggle, .c-toggle *, .a-game--menu, .a-game--interact[aria-disabled="true"]')) {
    return
  }

  if (e.target.matches('.c-toggle, .c-toggle *')) {
    const button = e.target.closest('.c-toggle').querySelector('.c-toggle--button')

    return content.audio.ui.value({
      enabled: button.getAttribute('aria-disabled') != 'true',
      strength: button.getAttribute('aria-checked') == 'true' ? 1 : 0,
    })
  }

  const button = e.target.closest('.c-menuButton') || e.target

  content.audio.ui.click({
    enabled: button.getAttribute('aria-disabled') != 'true',
    strength: button.hasAttribute('aria-disabled') ? 0 : 1,
  })
})

engine.ready(() => {
  app.screen.game.movement.on('disallowed', (e) => {
    content.audio.ui.click({
      enabled: 0,
      pan: ['left','right'].includes(e.direction) ? (e.direction == 'right' ? 1/2 : -1/2) : 0,
      strength: e.direction == 'down' ? -0.5 : (['left','right'].includes(e.direction) ? 0: 0.5),
    })
  })
})

// Focusing
document.addEventListener('focusin', (e) => {
  if (e.target.matches('.a-app--screen') || e.target.closest('.a-app--splash') || e.target.matches('[tabindex="0"]') || e.target.matches(':hover')) {
    return
  }

  content.audio.ui.focus({
    enabled: e.target.matches('.c-menuButton, .c-select, .c-select *, .c-slider, .c-slider *, .c-toggle, .c-toggle *, .a-game--nav button') && e.target.getAttribute('aria-disabled') != 'true',
    pan: e.target.matches('.a-game--left, .a-game--right') ? (e.target.matches('.a-game--right') ? 1/2 : -1/2) : 0,
    strength: e.target.matches('.c-menuButton, .a-game--interact, .a-game--menu') ? 1 : (
      e.target.matches('.a-game--down') ? -0.5 : (e.target.matches('.a-game--left, .a-game--right') ? 0 : 0.5)
    ),
  })
})

// Hovering
document.addEventListener('mouseover', (e) => {
  const target = e.target.closest('button,[role="button"]') || e.target

  if (target === app.audio.ui.hoverMemory) {
    return
  }

  if (target.matches('.a-app--screen') || target.closest('.a-app--splash') || target.matches('[tabindex="0"]')) {
    app.audio.ui.hoverMemory = target
    return
  }

  if (!app.utility.focus.isFocusable(target)) {
    app.audio.ui.hoverMemory = target
    return
  }

  app.audio.ui.hoverMemory = target

  // XXX: Copied via focusing
  content.audio.ui.focus({
    enabled: e.target.matches('.c-menuButton, .c-select, .c-select *, .c-slider, .c-slider *, .c-toggle, .c-toggle *, .a-game--nav button') && e.target.getAttribute('aria-disabled') != 'true',
    pan: e.target.matches('.a-game--left, .a-game--right') ? (e.target.matches('.a-game--right') ? 1/2 : -1/2) : 0,
    strength: e.target.matches('.c-menuButton, .a-game--interact, .a-game--menu') ? 1 : (
      e.target.matches('.a-game--down') ? -0.5 : (e.target.matches('.a-game--left, .a-game--right') ? 0 : 0.5)
    ),
  })
})

// Sliders
document.addEventListener('input', (e) => {
  if (!e.target.matches('.c-slider input')) {
    return
  }

  content.audio.ui.value({
    enabled: true,
    strength: engine.fn.scale(e.target.value, e.target.min, e.target.max, 0, 1),
  })
})
