document.addEventListener('DOMContentLoaded', () => {
  const storageKey = 'fonemaviva-acessibilidade';
  const savedSettings = JSON.parse(localStorage.getItem(storageKey) || '{}');
  const toggles = document.querySelectorAll('input[data-setting]');

  const applySettings = () => {
    document.body.classList.toggle('high-contrast', !!savedSettings.altoContraste);
    document.body.classList.toggle('font-large', !!savedSettings.fonteMaior);
    document.body.classList.toggle('reduced-motion', !!savedSettings.movimentoReducido);
    document.body.classList.toggle('cursor-destacado', !!savedSettings.cursorDestacado);
  };

  toggles.forEach((toggle) => {
    const key = toggle.getAttribute('data-setting');
    toggle.checked = !!savedSettings[key];

    toggle.addEventListener('change', () => {
      savedSettings[key] = toggle.checked;
      localStorage.setItem(storageKey, JSON.stringify(savedSettings));
      applySettings();
    });
  });

  applySettings();
});
