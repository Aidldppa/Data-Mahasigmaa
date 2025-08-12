// js/dashboard.js
import { db } from "./firebase-config.js";
import { ref, onValue, update, remove } from "https://www.gstatic.com/firebasejs/10.12.3/firebase-database.js";

const AUTH_KEY = 'isLoggedIn_v1';
const el = {
  table: document.getElementById('orderTable'),
  search: document.getElementById('searchAdmin'),
  btnLogout: document.getElementById('btnLogout'),
  btnExport: document.getElementById('btnExport'),
  btnRefresh: document.getElementById('btnRefresh')
};

// Hanya admin yang boleh akses dashboard
if(localStorage.getItem(AUTH_KEY) !== 'admin'){
  window.location.href = 'login.html';
}

function formatDate(iso){ const d = new Date(iso); return d.toLocaleString('id-ID'); }

const ordersRef = ref(db, 'pesanan');

// realtime listener
onValue(ordersRef, snapshot => {
  const list = [];
  snapshot.forEach(child => {
    const id = child.key;
    const data = child.val();
    list.push({ id, ...data });
  });
  render(list);
});

function render(list){
  const q = (el.search && el.search.value || '').toLowerCase();
  const filtered = list.filter(o=>{
    if(!q) return true;
    return (o.nama||'').toLowerCase().includes(q) || (o.hp||'').toLowerCase().includes(q) || (o.layanan||'').toLowerCase().includes(q);
  });
  el.table.innerHTML = '';
  filtered.sort((a,b)=> new Date(b.waktu) - new Date(a.waktu));
  filtered.forEach(o=>{
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${formatDate(o.waktu)}</td>
      <td>${escapeHtml(o.nama)}</td>
      <td>${escapeHtml(o.hp)}</td>
      <td>${escapeHtml(o.layanan)}</td>
      <td>${o.halaman}</td>
      <td>Rp ${Number(o.harga).toLocaleString('id-ID')}</td>
      <td>
        <select onchange="window.changeStatus && window.changeStatus('${o.id}', this.value)">
          <option value="pending" ${o.status==='pending'?'selected':''}>Pending</option>
          <option value="progress" ${o.status==='progress'?'selected':''}>In Progress</option>
          <option value="done" ${o.status==='done'?'selected':''}>Selesai</option>
          <option value="cancel" ${o.status==='cancel'?'selected':''}>Batal</option>
        </select>
      </td>
      <td>
        <button class="btn ghost small" onclick="window.deleteOrder && window.deleteOrder('${o.id}')">Hapus</button>
        <button class="btn ghost small" onclick="window.messageOrder && window.messageOrder('${o.id}')">WA</button>
      </td>
    `;
    el.table.appendChild(tr);
  });
}

// expose functions to window for inline handlers
window.changeStatus = async (id, status) => {
  try{
    await update(ref(db, `pesanan/${id}`), { status });
    alert('Status diperbarui');
  } catch(e){ console.error(e); alert('Gagal update status') }
};

window.deleteOrder = async (id) => {
  if(!confirm('Hapus pesanan ini?')) return;
  try{
    await remove(ref(db, `pesanan/${id}`));
    alert('Pesanan terhapus');
  } catch(e){ console.error(e); alert('Gagal menghapus') }
};

window.messageOrder = (id) => {
  // fetch single record from DB (quick workaround: read current table rows)
  // Simpler: prompt admin to copy nomor -> open WA
  const row = Array.from(document.querySelectorAll('#orderTable tr')).find(tr => tr.innerHTML.includes(id) === false);
  // fallback: open WA admin list - admin will contact user manually
  alert('Gunakan nomor yang tertera di baris untuk menghubungi pengguna via WhatsApp.');
};

el.search && el.search.addEventListener('input', ()=> {
  // re-render happens via onValue; this filters client-side automatically
  // We just trigger no-op
});

// logout
el.btnLogout && el.btnLogout.addEventListener('click', ()=>{
  localStorage.removeItem(AUTH_KEY);
  window.location.href = 'login.html';
});

// export JSON
el.btnExport && el.btnExport.addEventListener('click', ()=>{
  // get snapshot once and export
  onValue(ordersRef, snap => {
    const arr = [];
    snap.forEach(child => { arr.push({ id: child.key, ...child.val() }) });
    const blob = new Blob([JSON.stringify(arr, null, 2)], {type:'application/json'});
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = 'pesanan_export.json'; a.click(); URL.revokeObjectURL(url);
  }, { onlyOnce: true });
});

el.btnRefresh && el.btnRefresh.addEventListener('click', ()=> {
  // force nothing: realtime already updates, but show message
  alert('Data realtime telah diperbarui.');
});

/* small helper */
function escapeHtml(s){ return String(s||'').replace(/[&<>"]/g, c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c])) }
