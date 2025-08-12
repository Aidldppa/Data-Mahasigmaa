// js/order.js
import { db } from "./firebase-config.js";
import { ref, push, set } from "https://www.gstatic.com/firebasejs/10.12.3/firebase-database.js";

const WA_ADMIN = "6281930093714"; // <-- Nomor admin sudah diupdate

const priceMap = {
  "Makalah": 10000,
  "Essay": 15000,
  "PowerPoint": 5000,
  "Desain Poster": 40000,
  "Skripsi (Bab)": 45000
};

const el = {
  form: document.getElementById('orderForm'),
  nama: document.getElementById('nama'),
  hp: document.getElementById('hp'),
  layanan: document.getElementById('layanan'),
  halaman: document.getElementById('halaman'),
  prioritas: document.getElementById('prioritas'),
  deadline: document.getElementById('deadline'),
  catatan: document.getElementById('catatan'),
  estPrice: document.getElementById('estPrice'),
  formMsg: document.getElementById('formMsg'),
  btnReset: document.getElementById('btnReset')
};

function calcPrice(){
  const layanan = el.layanan.value;
  const jumlah = Number(el.halaman.value) || 1;
  let base = priceMap[layanan] || 50000;
  // adjust by priority
  const pr = el.prioritas.value;
  if(pr === 'express') base *= 1.6;
  else if(pr === 'ekonomis') base *= 0.9;
  const total = Math.round(base * jumlah);
  el.estPrice.textContent = `Rp ${total.toLocaleString('id-ID')}`;
  return total;
}


// Estimasi harga otomatis update
el.layanan.addEventListener('change', calcPrice);
if(el.halaman) el.halaman.addEventListener('input', calcPrice);
el.prioritas.addEventListener('change', calcPrice);
el.form.addEventListener('input', calcPrice);

el.btnReset.addEventListener('click', ()=>{
  el.form.reset();
  el.estPrice.textContent = 'Rp 0';
  el.formMsg.textContent = '';
  setTimeout(calcPrice, 10); // pastikan estimasi harga update setelah reset
});

el.form.addEventListener('submit', async (ev)=>{
  ev.preventDefault();
  // basic validation
  const nama = el.nama.value.trim();
  const hp = el.hp.value.trim();
  if(!nama || !hp){ el.formMsg.textContent = 'Nama & nomor HP wajib diisi'; return; }
  const layanan = el.layanan.value || 'Lainnya';
  const halaman = el.halaman ? Number(el.halaman.value) || 1 : 1;
  const prioritas = el.prioritas.value;
  const deadline = el.deadline.value || '';
  const catatan = el.catatan.value.trim();
  const harga = calcPrice();
  const waktu = new Date().toISOString();

  const order = { nama, hp, layanan, halaman, prioritas, deadline, catatan, harga, status: 'pending', waktu };

  try {
    const newRef = push(ref(db, 'pesanan'));
    await set(newRef, order);
    el.formMsg.textContent = 'Pesanan terkirim. Mengarahkan ke WhatsApp...';

    // prepare WA message
    const text = encodeURIComponent(`Halo admin, saya ${nama} ingin memesan.\nLayanan: ${layanan}\nJumlah: ${halaman}\nPrioritas: ${prioritas}\nEstimasi harga: Rp ${harga.toLocaleString('id-ID')}\nInstruksi: ${catatan}\nNomor: ${hp}`);
    setTimeout(()=> {
      window.open(`https://wa.me/${WA_ADMIN}?text=${text}`, '_blank');
      el.form.reset();
      el.estPrice.textContent = 'Rp 0';
      el.formMsg.textContent = 'Pesanan tersimpan. Cek dashboard untuk status.';
    }, 700);

  } catch(err){
    console.error(err);
    el.formMsg.textContent = 'Gagal mengirim pesanan. Coba lagi.';
  }
});
