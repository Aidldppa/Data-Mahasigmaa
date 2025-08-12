// js/login.js versi Firebase
import { db } from "./firebase-config.js";
import { ref, get, child } from "https://www.gstatic.com/firebasejs/10.12.3/firebase-database.js";

const AUTH_KEY = 'isLoggedIn_v1';
const form = document.getElementById('loginForm');
const msg = document.getElementById('loginMsg');
const roleSel = document.getElementById('loginRole');
const fieldsDiv = document.getElementById('loginFields');

const ADMIN_USER = 'admin';
const ADMIN_PASS = 'admin123';

function renderFields(role) {
  if (role === 'admin') {
    fieldsDiv.innerHTML = `
      <label for="username">Username Admin</label>
      <input id="username" type="text" required autocomplete="off" placeholder="admin">
      <label for="password">Password Admin</label>
      <input id="password" type="password" required autocomplete="off" placeholder="Password admin">
    `;
  } else {
    fieldsDiv.innerHTML = `
      <div class="input-group">
        <label for="email">Email</label>
        <div class="input-icon-wrap">
          <span class="input-icon">📧</span>
          <input id="email" type="email" required autocomplete="off" placeholder="email@domain.com">
        </div>
      </div>
      <div class="input-group">
        <label for="password">Password</label>
        <div class="input-icon-wrap">
          <span class="input-icon">🔒</span>
          <input id="password" type="password" required autocomplete="off" placeholder="Minimal 6 karakter">
        </div>
      </div>
    `;
  }
}

// Initial render
renderFields(roleSel.value);
roleSel.addEventListener('change', e => renderFields(e.target.value));

form.addEventListener('submit', async (ev) => {
  ev.preventDefault();
  const role = roleSel.value;
  msg.textContent = '';
  if (role === 'admin') {
    const u = document.getElementById('username').value.trim();
    const p = document.getElementById('password').value.trim();
    if (u === ADMIN_USER && p === ADMIN_PASS) {
      localStorage.setItem(AUTH_KEY, 'admin');
      window.location.href = 'dashboard.html';
    } else {
      msg.textContent = 'Username / password admin salah';
      msg.style.color = 'red';
    }
  } else {
    let email = document.getElementById('email').value.trim().toLowerCase();
    const password = document.getElementById('password').value;
    try {
      const snap = await get(child(ref(db), 'users/' + btoa(email)));
      if (snap.exists()) {
        const user = snap.val();
        if (user.password === password) {
          localStorage.setItem(AUTH_KEY, 'customer:' + email);
          window.location.href = 'index.html';
        } else {
          msg.textContent = 'Password salah.';
          msg.style.color = 'red';
        }
      } else {
        msg.textContent = 'Email belum terdaftar.';
        msg.style.color = 'red';
      }
    } catch (err) {
      msg.textContent = 'Gagal login. Coba lagi.';
      msg.style.color = 'red';
    }
  }
});
