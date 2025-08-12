import { db } from "./firebase-config.js";
import { ref, set, get, child } from "https://www.gstatic.com/firebasejs/10.12.3/firebase-database.js";

document.getElementById('registerForm').addEventListener('submit', async function(e) {
  e.preventDefault();
  const nama = document.getElementById('regNama').value.trim();
  let email = document.getElementById('regEmail').value.trim().toLowerCase();
  const hp = document.getElementById('regHP').value.trim();
  const password = document.getElementById('regPassword').value;
  const msg = document.getElementById('registerMsg');

  if (!nama || !email || !hp || !password) {
    msg.textContent = 'Semua field wajib diisi!';
    msg.style.color = 'red';
    return;
  }
  try {
    // Cek apakah email sudah terdaftar di Firebase
    const snap = await get(child(ref(db), 'users/' + btoa(email)));
    if (snap.exists()) {
      msg.textContent = 'Email sudah terdaftar!';
      msg.style.color = 'red';
      return;
    }
    // Simpan user baru
    await set(ref(db, 'users/' + btoa(email)), { nama, email, hp, password });
    msg.textContent = 'Akun berhasil dibuat! Silakan login.';
    msg.style.color = 'green';
    this.reset();
  } catch (err) {
    msg.textContent = 'Gagal membuat akun. Coba lagi.';
    msg.style.color = 'red';
  }
});
