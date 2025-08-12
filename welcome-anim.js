// Welcome animation on page load
window.addEventListener('DOMContentLoaded', () => {
  const overlay = document.createElement('div');
  overlay.className = 'welcome-overlay';
  overlay.innerHTML = `
    <div class="welcome-anim">
      <div class="logo-anim">JT</div>
      <div class="welcome-title">Selamat Datang di <b>Joki Tugas</b></div>
    </div>
  `;
  document.body.appendChild(overlay);
  setTimeout(() => {
    overlay.classList.add('hide');
    setTimeout(() => overlay.remove(), 700);
  }, 1400);
});
