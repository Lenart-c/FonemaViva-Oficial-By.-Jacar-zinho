document.addEventListener('DOMContentLoaded', () => {
  const storageKey = 'fonemaviva-configuracoes';
  const saved = JSON.parse(localStorage.getItem(storageKey) || '{}');
  const themeButtons = document.querySelectorAll('.theme-option');
  const switches = document.querySelectorAll('input[data-setting]');
  const idiomaSelect = document.getElementById('idioma');

  const applyTheme = (theme) => {
    document.body.setAttribute('data-theme', theme);
    themeButtons.forEach((btn) => btn.classList.toggle('active', btn.getAttribute('data-theme') === theme));
  };

  themeButtons.forEach((button) => {
    button.addEventListener('click', () => {
      const theme = button.getAttribute('data-theme');
      saved.theme = theme;
      localStorage.setItem(storageKey, JSON.stringify(saved));
      applyTheme(theme);
    });
  });

  switches.forEach((switchEl) => {
    const key = switchEl.getAttribute('data-setting');
    switchEl.checked = !!saved[key];
    switchEl.addEventListener('change', () => {
      saved[key] = switchEl.checked;
      localStorage.setItem(storageKey, JSON.stringify(saved));
    });
  });

  if (idiomaSelect) {
    idiomaSelect.value = saved.idioma || 'Português';
    idiomaSelect.addEventListener('change', () => {
      saved.idioma = idiomaSelect.value;
      localStorage.setItem(storageKey, JSON.stringify(saved));
    });
  }

  document.querySelector('.action-btn.secondary')?.addEventListener('click', () => {
    localStorage.removeItem(storageKey);
    location.reload();
  });

  document.querySelector('.action-btn')?.addEventListener('click', () => {
    localStorage.setItem(storageKey, JSON.stringify(saved));
    alert('Configurações salvas com sucesso!');
  });

  applyTheme(saved.theme || 'light');
});
