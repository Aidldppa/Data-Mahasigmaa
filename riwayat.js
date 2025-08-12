// Firebase config
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.3/firebase-app.js";
import { getDatabase, ref, get, child } from "https://www.gstatic.com/firebasejs/10.12.3/firebase-database.js";

const firebaseConfig = {
  apiKey: "AIzaSyD_3amiAIRU4iGjSLcQtCcQnBUCZ8IiWQk",
  authDomain: "jokii-d7641.firebaseapp.com",
  databaseURL: "https://jokii-d7641-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "jokii-d7641",
  storageBucket: "jokii-d7641.firebasestorage.app",
  messagingSenderId: "449020905939",
  appId: "1:449020905939:web:04b9268f22911ebee0c726"
};

// Init Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

document.getElementById("btnCari").addEventListener("click", () => {
    const hp = document.getElementById("searchHP").value.trim();
    if (hp === "") {
        alert("Masukkan nomor HP terlebih dahulu!");
        return;
    }
    cariRiwayat(hp);
});

function cariRiwayat(hp) {
    const dbRef = ref(db);
    get(child(dbRef, "pesanan")).then((snapshot) => {
        if (snapshot.exists()) {
            let found = false;
            document.getElementById("riwayatList").innerHTML = "";

            snapshot.forEach(childSnap => {
                let data = childSnap.val();
                if (data.hp === hp) {
                    found = true;
                    document.getElementById("riwayatList").innerHTML += `
                        <div class="card">
                            <h3>${data.layanan}</h3>
                            <p><strong>Nama:</strong> ${data.nama}</p>
                            <p><strong>No HP:</strong> ${data.hp}</p>
                            <p><strong>Catatan:</strong> ${data.catatan}</p>
                            <p><strong>Status:</strong> ${data.status}</p>
                            <p><small>Dipesan pada: ${data.waktu_pesan}</small></p>
                        </div>
                    `;
                }
            });

            if (!found) {
                document.getElementById("riwayatList").innerHTML = "<p>Tidak ada pesanan ditemukan.</p>";
            }
        } else {
            document.getElementById("riwayatList").innerHTML = "<p>Belum ada data pesanan.</p>";
        }
    });
}
