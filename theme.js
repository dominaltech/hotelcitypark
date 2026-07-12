// theme.js - Shared Theme Logic for Hotel City Park

document.addEventListener("DOMContentLoaded", () => {
  const themeToggle = document.getElementById('themeToggle');
  const mobileThemeToggle = document.getElementById('mobileThemeToggle');
  const heroImage = document.getElementById('heroImage');

  function getTheme() {
    return document.documentElement.getAttribute('data-theme') || 'light';
  }

  function setTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
    updateToggleIcons(theme);
    updateHeroImage(theme);
  }

  function updateToggleIcons(theme) {
    const sunIcons = document.querySelectorAll('.sun-icon');
    const moonIcons = document.querySelectorAll('.moon-icon');

    if (theme === 'dark') {
      sunIcons.forEach(el => el.style.display = 'block');
      moonIcons.forEach(el => el.style.display = 'none');
    } else {
      sunIcons.forEach(el => el.style.display = 'none');
      moonIcons.forEach(el => el.style.display = 'block');
    }
  }

  function updateHeroImage(theme) {
    const heroImage = document.getElementById('heroImage');
    const heroMobileImage = document.getElementById('heroMobileImage');
    const imgSrc = theme === 'dark' ? 'cityparknight.png' : 'cityparkday.png';
    if (heroImage) {
      heroImage.src = imgSrc;
    }
    if (heroMobileImage) {
      heroMobileImage.src = imgSrc;
    }
  }

  // Bind toggle handlers
  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const newTheme = getTheme() === 'dark' ? 'light' : 'dark';
      setTheme(newTheme);
    });
  }

  if (mobileThemeToggle) {
    mobileThemeToggle.addEventListener('click', () => {
      const newTheme = getTheme() === 'dark' ? 'light' : 'dark';
      setTheme(newTheme);
    });
  }

  // Initial updates
  const activeTheme = getTheme();
  updateToggleIcons(activeTheme);
  updateHeroImage(activeTheme);
});
