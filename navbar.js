// Hamburger Navbar Script
export function setupHamburgerNav() {
  const btn = document.querySelector('.hamburger-btn');
  const nav = document.querySelector('.hamburger-nav');
  if (!btn || !nav) return;
  btn.addEventListener('click', () => {
    nav.classList.toggle('open');
    btn.classList.toggle('open');
  });
  // Close nav on link click (mobile UX)
  nav.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      nav.classList.remove('open');
      btn.classList.remove('open');
    });
  });
}

document.addEventListener('DOMContentLoaded', setupHamburgerNav);
